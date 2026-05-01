import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doctorService, receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { Table } from '../../components/Table';
import { Card, Loading, FormInput, FormSelect, FormTextarea, Button, Badge } from '../../components/common';
import { Eye, Activity, UserPlus, Printer, FileText } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { toast } from 'react-toastify';
import { PrintableDischargeSummary } from '../../components/PrintableDischargeSummary';
import { PatientSearch } from '../../components/PatientSearch';

const WARD_TYPES = [
  { value: 'GENERAL', label: 'General Ward' },
  { value: 'PRIVATE', label: 'Private Ward' },
  { value: 'ICU', label: 'ICU' },
];

export const ReceptionistIPDPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('admitted');
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [dischargedPatients, setDischargedPatients] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showDischargeSummaryModal, setShowDischargeSummaryModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAdmitPatient, setSelectedAdmitPatient] = useState(null);

  const navigate = useNavigate();

  const handleOpenConsentForm = (patient) => {
    if (!patient?._id) return;
    navigate(`/ipd/${patient._id}/consent-form`);
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useForm(
    {
      patientId: '',
      doctorId: '',
      wardType: 'GENERAL',
      diagnosis: '',
      notes: '',
      isInsured: 'NO',
      InsuranceNo: '',
      policyNo: '',
      complimentTo: '',
    },
    async (formValues) => {
      try {
        const newErrors = {};
        if (!selectedAdmitPatient) newErrors.patientId = 'Patient is required';
        if (!formValues.doctorId) newErrors.doctorId = 'Doctor is required';
        if (!formValues.wardType) newErrors.wardType = 'Ward type is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        const submitData = { 
          ...formValues, 
          patientId: selectedAdmitPatient._id 
        };
        if (formValues.isInsured === 'NO') {
          delete submitData.InsuranceNo;
          delete submitData.policyNo;
        }

        await doctorService.admitPatient(submitData);
        toast.success('Patient admitted successfully');
        setShowAdmitModal(false);
        resetForm();
        setSelectedAdmitPatient(null);
        fetchPatients();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to admit patient');
      }
    }
  );

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const initialPatient = location.state?.patient;
    if (initialPatient) {
      setSelectedAdmitPatient(initialPatient);
      setShowAdmitModal(true);
    }
  }, [location.state]);

  const fetchPatients = async () => {
    try {
      setLoadingData(true);
      const [admittedRes, dischargedRes, patientsRes, doctorsRes] = await Promise.all([
        doctorService.getAdmittedPatients(),
        doctorService.getDischargedPatients(),
        receptionistService.getPatientList(),
        receptionistService.getDoctors(),
      ]);
      setAdmittedPatients(admittedRes.data.patients || []);
      setDischargedPatients(dischargedRes.data.patients || []);
      setPatients(patientsRes.data.patientlist || []);
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      toast.error('Failed to load IPD patients');
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };

  const handleAdmitPatient = () => {
    setShowAdmitModal(true);
  };

  const handlePrintDischargeSummary = (patient) => {
    setSelectedPatient(patient);
    setShowDischargeSummaryModal(true);
  };

  const getAdmittedColumns = () => [
    {
      key: 'srNo',
      label: 'Sr. No',
      width: '8%',
      render: (_, index) => index + 1,
    },
    {
      key: 'ipdNumber',
      label: 'IPD Number',
      width: '14%',
      render: (row) => row?.ipdNumber || 'N/A',
    },
    {
      key: 'uhid',
      label: 'UHID',
      width: '14%',
      render: (row) => row?.uhid || row?.patientId?.uhid || 'N/A',
    },
    {
      key: 'name',
      label: 'Patient Name',
      width: '18%',
      render: (row) => row?.patientId?.name || 'N/A',
    },
    {
      key: 'diagnosis',
      label: 'Diagnosis',
      width: '18%',
      render: (row) => row?.diagnosis || 'N/A',
    },
    {
      key: 'admissionDate',
      label: 'Admission Date',
      width: '14%',
      render: (row) =>
        row?.admissionDate
          ? new Date(row.admissionDate).toLocaleDateString()
          : 'N/A',
    },
    {
      key: 'roomBed',
      label: 'Room / Bed',
      width: '14%',
      render: (row) => row?.bedNumber || row?.bedId?.bedNumber || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (row) => (
        <Badge variant={row.status === 'ADMITTED' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenConsentForm(row)}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            title="Open Consent Form"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePrintDischargeSummary(row)}
            className="text-green-600 hover:text-green-800 font-medium text-sm"
            title="Print Discharge Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

const getDischargedColumns = () => [
  {
    key: 'srNo',
    label: 'Sr. No',
    width: '8%',
    render: (_, index) => index + 1,
  },
  {
    key: 'ipdNumber',
    label: 'IPD Number',
    width: '14%',
    render: (row) => row?.ipdNumber || 'N/A',
  },
  {
    key: 'uhid',
    label: 'UHID',
    width: '14%',
    render: (row) => row?.uhid || row?.patientId?.uhid || 'N/A',
  },
  {
    key: 'name',
    label: 'Patient Name',
    width: '18%',
    render: (row) => row?.patientId?.name || 'N/A',
  },
  {
    key: 'diagnosis',
    label: 'Diagnosis',
    width: '18%',
    render: (row) => row?.diagnosis || 'N/A',
  },
  {
    key: 'admissionDate',
    label: 'Admission Date',
    width: '14%',
    render: (row) =>
      row?.admissionDate
        ? new Date(row.admissionDate).toLocaleDateString()
        : 'N/A',
  },
  {
    key: 'roomBed',
    label: 'Room / Bed',
    width: '14%',
    render: (row) => row?.bedNumber || row?.bedId?.bedNumber || 'N/A',
  },
  {
    key: 'status',
    label: 'Status',
    width: '12%',
    render: (row) => (
      <Badge variant={row.status === 'ADMITTED' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleOpenConsentForm(row)}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          title="Open Consent Form"
        >
          <FileText className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.open(`/discharge-summary/${row._id}`, '_blank')}
          className="text-green-600 hover:text-green-800 font-medium text-sm"
          title="Print Discharge Summary"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
  if (loadingData) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IPD Management</h1>
            <p className="text-gray-600 mt-2">View inpatient department records and manage patient admissions</p>
          </div>
          <button
            onClick={handleAdmitPatient}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Admit Patient
          </button>
        </div>
      </div>

      

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <Activity className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold text-blue-600">{admittedPatients.length}</p>
          <p className="text-gray-600 mt-1">Currently Admitted</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <Activity className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-3xl font-bold text-green-600">{dischargedPatients.length}</p>
          <p className="text-gray-600 mt-1">Recently Discharged</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <Activity className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-3xl font-bold text-purple-600">{admittedPatients.length + dischargedPatients.length}</p>
          <p className="text-gray-600 mt-1">Total Records</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('admitted')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'admitted'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Currently Admitted ({admittedPatients.length})
        </button>
        <button
          onClick={() => setActiveTab('discharged')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'discharged'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recently Discharged ({dischargedPatients.length})
        </button>
      </div>

      {/* Table */}
      {activeTab === 'admitted' && admittedPatients.length > 0 && (
        <Table 
          columns={getAdmittedColumns()}
          data={admittedPatients}
        />
      )}
      
      {activeTab === 'admitted' && admittedPatients.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-500">No admitted patients at the moment</p>
        </Card>
      )}

      {activeTab === 'discharged' && dischargedPatients.length > 0 && (
        <Table 
          columns={getDischargedColumns()}
          data={dischargedPatients}
        />
      )}
      
      {activeTab === 'discharged' && dischargedPatients.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-500">No recently discharged patients</p>
        </Card>
      )}

      {/* Patient Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Patient Details"
      >
        {selectedPatient && (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">

      <div>
        <p className="text-sm text-gray-600">Patient Name</p>
        <p className="font-semibold">
          {selectedPatient?.patientId?.name || 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">UHID</p>
        <p className="font-semibold">
          {selectedPatient?.uhid || 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Phone</p>
        <p className="font-semibold">
          {selectedPatient?.patientId?.phone || 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Age</p>
        <p className="font-semibold">
          {selectedPatient?.patientId?.age || 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Gender</p>
        <p className="font-semibold">
          {selectedPatient?.patientId?.gender || 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Admission Date</p>
        <p className="font-semibold">
          {selectedPatient?.admissionDate
            ? new Date(selectedPatient.admissionDate).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Bed Number</p>
        <p className="font-semibold">
          {selectedPatient?.bedId?.bedNumber || 'N/A'}
        </p>
      </div>

      {selectedPatient?.dischargeDate && (
        <div>
          <p className="text-sm text-gray-600">Discharge Date</p>
          <p className="font-semibold">
            {new Date(selectedPatient.dischargeDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>

    {selectedPatient?.notes && (
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600 mb-2">Medical Notes</p>
        <p>{selectedPatient.notes}</p>
      </div>
    )}

    <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
      <Button
        variant="primary"
        onClick={() => handleOpenConsentForm(selectedPatient)}
      >
        Open Consent Form
      </Button>
    </div>
  </div>
)}
      </Modal>

      <Modal
        isOpen={showAdmitModal}
        onClose={() => {
          setShowAdmitModal(false);
          resetForm();
          setSelectedAdmitPatient(null);
        }}
        title="Admit Patient to IPD"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientSearch
            onPatientSelect={(patient) => setSelectedAdmitPatient(patient)}
            placeholder="Search patient by phone number or UHID..."
          />
          {selectedAdmitPatient && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Selected Patient:</p>
              <p className="text-sm text-blue-700">
                {selectedAdmitPatient.name} - {selectedAdmitPatient.phone} ({selectedAdmitPatient.uhid})
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Doctor"
              name="doctorId"
              options={doctors.map((doctor) => ({
                value: doctor._id,
                label: `Dr. ${doctor.name} (${doctor.profile?.specialization || 'General'})`,
              }))}
              value={values.doctorId}
              onChange={handleChange}
              error={errors.doctorId}
              touched={touched.doctorId}
              required
            />

            <FormSelect
              label="Ward Type"
              name="wardType"
              options={WARD_TYPES}
              value={values.wardType}
              onChange={handleChange}
              error={errors.wardType}
              touched={touched.wardType}
              required
            />

            <FormSelect
              label="Insurance Status"
              name="isInsured"
              options={[
                { value: 'NO', label: 'No' },
                { value: 'YES', label: 'Yes' },
              ]}
              value={values.isInsured}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Diagnosis"
            type="text"
            name="diagnosis"
            placeholder="Enter diagnosis"
            value={values.diagnosis}
            onChange={handleChange}
          />

          <FormTextarea
            label="Notes"
            name="notes"
            placeholder="Enter admission notes"
            value={values.notes}
            onChange={handleChange}
          />

          {values.isInsured === 'YES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Insurance Number"
                type="text"
                name="InsuranceNo"
                placeholder="Enter insurance number"
                value={values.InsuranceNo}
                onChange={handleChange}
              />
              <FormInput
                label="Policy Number"
                type="text"
                name="policyNo"
                placeholder="Enter policy number"
                value={values.policyNo}
                onChange={handleChange}
              />
            </div>
          )}

          <FormInput
            label="Compliment To"
            type="text"
            name="complimentTo"
            placeholder="Enter compliment details if any"
            value={values.complimentTo}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAdmitModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Admit Patient
            </Button>
          </div>
        </form>
      </Modal>

      {/* Discharge Summary Modal */}
      <Modal
        isOpen={showDischargeSummaryModal}
        onClose={() => setShowDischargeSummaryModal(false)}
        title="Discharge Summary"
        size="large"
      >
        {selectedPatient && (
          <PrintableDischargeSummary ipdId={selectedPatient._id} />
        )}
      </Modal>
    </div>
  );
};