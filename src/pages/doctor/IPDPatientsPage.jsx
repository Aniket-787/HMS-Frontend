import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, Loading, Card } from '../../components/common';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { FormTextarea } from '../../components/common';
import { toast } from 'react-toastify';


const CHARGE_TYPES = [
  { value: 'MEDICINE', label: 'Medicine' },
  { value: 'TEST', label: 'Test' },
  { value: 'OTHER', label: 'Other' }
];

export const IPDPatientsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admitted');
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [dischargedPatients, setDischargedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [showDischargeSummaryModal, setShowDischargeSummaryModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoadingData(true);
      const [admittedRes, dischargedRes] = await Promise.all([
        doctorService.getAdmittedPatients(),
        doctorService.getDischargedPatients()
      ]);
      setAdmittedPatients(admittedRes.data.patients || []);
      setDischargedPatients(dischargedRes.data.patients || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoadingData(false);
    }
  };

  const notesForm = useForm(
  {
    notes: '',
    medicines: [{ name: '', dosage: '' }],
  },
  async (formValues) => {
    try {
      if (!selectedPatient?._id) {
        toast.error('No patient selected');
        return;
      }

      setErrorMessage('');

      await doctorService.addDailyNotes(selectedPatient._id, {
        notes: formValues.notes,
        medicines: formValues.medicines.filter(
          (med) => med.name && med.dosage
        ),
      });

      toast.success('Daily notes added successfully!');
      setShowNotesModal(false);
      notesForm.resetForm();
      fetchPatients();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to add notes';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  }
);
  const chargesForm = useForm(
  {
    type: '',
    description: '',
    amount: '',
  },
  async (formValues) => {
    try {
      if (!selectedPatient?._id) {
        toast.error('No patient selected');
        return;
      }

      setErrorMessage('');

      await doctorService.addCharges(selectedPatient._id, {
        ...formValues,
        amount: parseFloat(formValues.amount),
      });

      toast.success('Charge added successfully!');
      setShowChargesModal(false);
      chargesForm.resetForm();
      fetchPatients();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Failed to add charge';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  }
);
  const dischargeSummaryForm = useForm(
  {
    reasonForAdmission: '',
    diagnosis: '',
    significantFindings: '',
    investigations: '',
    procedures: '',
    treatmentGiven: '',
    conditionAtDischarge: {
      condition: '',
      bp: '',
      spo2: '',
    },
    medicines: [{ name: '', dose: '', frequency: '', duration: '' }],
    instructions: '',
    followUpAdvice: '',
  },
  async (formValues) => {
    try {
      if (!selectedPatient?._id) {
        toast.error('No patient selected');
        return;
      }

      setErrorMessage('');

      await doctorService.createDischargeSummary({
        ipdId: selectedPatient._id,
        ...formValues,
      });

      await doctorService.dischargePatient(selectedPatient._id);

      toast.success('Patient discharged successfully!');
      setShowDischargeSummaryModal(false);
      dischargeSummaryForm.resetForm();
      fetchPatients();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        'Failed to discharge patient';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  }
);
  const handleDischarge = async (patientId) => {
  if (!window.confirm('Are you sure you want to discharge this patient?'))
    return;

  try {
    setErrorMessage('');

    await doctorService.dischargePatient(patientId);

    toast.success('Patient discharged successfully!');
    fetchPatients();
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || 'Failed to discharge patient';
    setErrorMessage(errorMsg);
    toast.error(errorMsg);
  }
};
  const addMedicineField = () => {
    notesForm.setValues(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '' }]
    }));
  };

  const updateMedicine = (index, field, value) => {
    notesForm.setValues(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedicine = (index) => {
    notesForm.setValues(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const addDischargeMedicineField = () => {
    dischargeSummaryForm.setValues(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dose: '', frequency: '', duration: '' }]
    }));
  };

  const updateDischargeMedicine = (index, field, value) => {
    dischargeSummaryForm.setValues(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeDischargeMedicine = (index) => {
    dischargeSummaryForm.setValues(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const updateConditionAtDischarge = (field, value) => {
    dischargeSummaryForm.setValues(prev => ({
      ...prev,
      conditionAtDischarge: {
        ...prev.conditionAtDischarge,
        [field]: value
      }
    }));
  };

  if (loadingData) {
    return <Loading />;
  }

  const admittedPatientColumns = [
    { key: 'uhid', header: 'UHID', render: (patient) => patient.uhid },
    { key: 'name', header: 'Patient Name', render: (patient) => patient.patientId?.name },
    { key: 'phone', header: 'Phone', render: (patient) => patient.patientId?.phone },
    { key: 'bed', header: 'Bed', render: (patient) => patient.bedId?.bedNumber },
    { key: 'ward', header: 'Ward', render: (patient) => patient.wardType },
    { key: 'admissionDate', header: 'Admission Date', render: (patient) =>
      new Date(patient.admissionDate).toLocaleDateString()
    },
    { key: 'totalAmount', header: 'Total Amount', render: (patient) => `₹${patient.totalAmount}` },
    { key: 'actions', header: 'Actions', render: (patient) => (
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Patient Name</p>
            <p className="font-semibold text-gray-900">{patient.patientId?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Bed Number</p>
            <p className="font-semibold text-gray-900">{patient.bedId?.bedNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Ward</p>
            <p className="font-semibold text-gray-900">{patient.wardType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Bill Amount</p>
            <p className="font-semibold text-emerald-600">₹{patient.totalAmount}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSelectedPatient(patient);
              setShowNotesModal(true);
            }}
          >
            Add Notes
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSelectedPatient(patient);
              setShowChargesModal(true);
            }}
          >
            Add Charges
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => navigate(`/ipd/${patient._id}/consent-form`)}
          >
            Print Consent
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="w-full"
            onClick={() => {
              setSelectedPatient(patient);
              setShowDischargeSummaryModal(true);
            }}
          >
            Discharge
          </Button>
        </div>
      </div>
    )},
  ];

  const dischargedPatientColumns = [
    { key: 'uhid', header: 'UHID', render: (patient) => patient.uhid },
    { key: 'name', header: 'Patient Name', render: (patient) => patient.patientId?.name },
    { key: 'phone', header: 'Phone', render: (patient) => patient.patientId?.phone },
    { key: 'bed', header: 'Bed', render: (patient) => patient.bedId?.bedNumber },
    { key: 'ward', header: 'Ward', render: (patient) => patient.wardType },
    { key: 'admissionDate', header: 'Admission Date', render: (patient) =>
      new Date(patient.admissionDate).toLocaleDateString()
    },
    { key: 'dischargeDate', header: 'Discharge Date', render: (patient) =>
      patient.dischargeDate ? new Date(patient.dischargeDate).toLocaleDateString() : 'N/A'
    },
    { key: 'totalAmount', header: 'Total Amount', render: (patient) => `₹${patient.totalAmount}` },
    { key: 'actions', header: 'Actions', render: (patient) => (
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Patient Name</p>
            <p className="font-semibold text-gray-900">{patient.patientId?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Bed Number</p>
            <p className="font-semibold text-gray-900">{patient.bedId?.bedNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Ward</p>
            <p className="font-semibold text-gray-900">{patient.wardType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Bill Amount</p>
            <p className="font-semibold text-emerald-600">₹{patient.totalAmount}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => window.open(`/bill/${patient._id}`, '_blank')}
          >
            Print Bill
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => window.open(`/discharge-summary/${patient._id}`, '_blank')}
          >
            Print Summary
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => navigate(`/ipd/${patient._id}/consent-form`)}
          >
            Print Consent
          </Button>
        </div>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">IPD Patients</h1>
        <p className="text-gray-600 mt-2">Manage admitted and discharged patients</p>
      </div>

      

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('admitted')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'admitted'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Admitted Patients ({admittedPatients.length})
          </button>
          <button
            onClick={() => setActiveTab('discharged')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'discharged'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Discharged Patients ({dischargedPatients.length})
          </button>
        </nav>
      </div>

      {/* Patients Table */}
      <div className="card">
        {activeTab === 'admitted' ? (
          <Table
            columns={admittedPatientColumns}
            data={admittedPatients}
            emptyMessage="No admitted patients found"
          />
        ) : (
          <Table
            columns={dischargedPatientColumns}
            data={dischargedPatients}
            emptyMessage="No discharged patients found"
          />
        )}
      </div>

      {/* Daily Notes Modal */}
      <Modal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title="Add Daily Notes"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedPatient.patientId?.name}</h3>
              <p className="text-sm text-gray-600">UHID: {selectedPatient.uhid}</p>
              <p className="text-sm text-gray-600">Bed: {selectedPatient.bedId?.bedNumber}</p>
            </div>

            <form onSubmit={notesForm.handleSubmit} className="space-y-4">
              <FormInput
                label="Notes"
                type="text"
                name="notes"
                placeholder="Enter daily notes"
                value={notesForm.values.notes}
                onChange={notesForm.handleChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                {notesForm.values.medicines.map((medicine, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <FormInput
                      placeholder="Medicine name"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                    />
                    <FormInput
                      placeholder="Dosage"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeMedicine(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addMedicineField}
                >
                  Add Medicine
                </Button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" loading={notesForm.isSubmitting}>
                  Add Notes
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowNotesModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Add Charges Modal */}
      <Modal
        isOpen={showChargesModal}
        onClose={() => setShowChargesModal(false)}
        title="Add Charges"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedPatient.patientId?.name}</h3>
              <p className="text-sm text-gray-600">UHID: {selectedPatient.uhid}</p>
              <p className="text-sm text-gray-600">Current Total: ₹{selectedPatient.totalAmount}</p>
            </div>

            <form onSubmit={chargesForm.handleSubmit} className="space-y-4">
              <FormSelect
                label="Charge Type"
                name="type"
                options={CHARGE_TYPES}
                value={chargesForm.values.type}
                onChange={chargesForm.handleChange}
                error={chargesForm.errors.type}
                touched={chargesForm.touched.type}
                required
              />

              <FormInput
                label="Description"
                type="text"
                name="description"
                placeholder="Enter charge description"
                value={chargesForm.values.description}
                onChange={chargesForm.handleChange}
                error={chargesForm.errors.description}
                touched={chargesForm.touched.description}
                required
              />

              <FormInput
                label="Amount"
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={chargesForm.values.amount}
                onChange={chargesForm.handleChange}
                error={chargesForm.errors.amount}
                touched={chargesForm.touched.amount}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" loading={chargesForm.isSubmitting}>
                  Add Charge
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowChargesModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Discharge Summary Modal */}
      <Modal
        isOpen={showDischargeSummaryModal}
        onClose={() => setShowDischargeSummaryModal(false)}
        title="Discharge Summary"
        size="xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Info Header */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {selectedPatient.patientId?.name}
                </div>
                <div>
                  <span className="font-medium">UHID:</span> {selectedPatient.uhid}
                </div>
                <div>
                  <span className="font-medium">IPD No:</span> {selectedPatient.ipdNumber}
                </div>
                <div>
                  <span className="font-medium">Bed:</span> {selectedPatient.bedId?.bedNumber}
                </div>
                <div>
                  <span className="font-medium">Admission:</span> {new Date(selectedPatient.admissionDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Ward:</span> {selectedPatient.wardType}
                </div>
                <div>
                  <span className="font-medium">Age:</span> {selectedPatient.patientId?.age}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {selectedPatient.patientId?.gender}
                </div>
              </div>
            </div>

            <form onSubmit={dischargeSummaryForm.handleSubmit} className="space-y-6">
              {/* Admission Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Admission Details</h4>
                <FormInput
                  label="Reason for Admission"
                  type="text"
                  name="reasonForAdmission"
                  placeholder="Enter reason for admission"
                  value={dischargeSummaryForm.values.reasonForAdmission}
                  onChange={dischargeSummaryForm.handleChange}
                  required
                />
              </div>

              {/* Clinical Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Clinical Summary</h4>
                <FormTextarea
                  label="Diagnosis"
                  name="diagnosis"
                  placeholder="Enter diagnosis"
                  value={dischargeSummaryForm.values.diagnosis}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={2}
                  required
                />
                <FormTextarea
                  label="Significant Findings"
                  name="significantFindings"
                  placeholder="Enter significant findings"
                  value={dischargeSummaryForm.values.significantFindings}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
                <FormTextarea
                  label="Investigations"
                  name="investigations"
                  placeholder="Enter investigations performed"
                  value={dischargeSummaryForm.values.investigations}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
                <FormTextarea
                  label="Procedures"
                  name="procedures"
                  placeholder="Enter procedures performed"
                  value={dischargeSummaryForm.values.procedures}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
                <FormTextarea
                  label="Treatment Given"
                  name="treatmentGiven"
                  placeholder="Enter treatment given during hospitalization"
                  value={dischargeSummaryForm.values.treatmentGiven}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
              </div>

              {/* Condition at Discharge */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Condition at Discharge</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Condition"
                    type="text"
                    placeholder="e.g., Stable, Improved"
                    value={dischargeSummaryForm.values.conditionAtDischarge.condition}
                    onChange={(e) => updateConditionAtDischarge('condition', e.target.value)}
                    required
                  />
                  <FormInput
                    label="Blood Pressure"
                    type="text"
                    placeholder="e.g., 120/80 mmHg"
                    value={dischargeSummaryForm.values.conditionAtDischarge.bp}
                    onChange={(e) => updateConditionAtDischarge('bp', e.target.value)}
                  />
                  <FormInput
                    label="SpO2"
                    type="text"
                    placeholder="e.g., 98%"
                    value={dischargeSummaryForm.values.conditionAtDischarge.spo2}
                    onChange={(e) => updateConditionAtDischarge('spo2', e.target.value)}
                  />
                </div>
              </div>

              {/* Medicines */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Discharge Medicines</h4>
                <div className="space-y-3">
                  {dischargeSummaryForm.values.medicines.map((medicine, index) => (
                    <div key={index} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <FormInput
                          placeholder="Medicine name"
                          value={medicine.name}
                          onChange={(e) => updateDischargeMedicine(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          placeholder="Dose (e.g., 1 tablet)"
                          value={medicine.dose}
                          onChange={(e) => updateDischargeMedicine(index, 'dose', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          placeholder="Frequency (e.g., twice daily)"
                          value={medicine.frequency}
                          onChange={(e) => updateDischargeMedicine(index, 'frequency', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <FormInput
                          placeholder="Duration (e.g., 5 days)"
                          value={medicine.duration}
                          onChange={(e) => updateDischargeMedicine(index, 'duration', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeDischargeMedicine(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addDischargeMedicineField}
                  >
                    Add Medicine
                  </Button>
                </div>
              </div>

              {/* Instructions and Advice */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">Instructions & Follow-up</h4>
                <FormTextarea
                  label="Instructions"
                  name="instructions"
                  placeholder="Enter discharge instructions and dietary advice"
                  value={dischargeSummaryForm.values.instructions}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
                <FormTextarea
                  label="Follow-up Advice"
                  name="followUpAdvice"
                  placeholder="Enter follow-up advice and when to return"
                  value={dischargeSummaryForm.values.followUpAdvice}
                  onChange={dischargeSummaryForm.handleChange}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <Button type="submit" variant="primary" loading={dischargeSummaryForm.isSubmitting}>
                  Discharge Patient
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowDischargeSummaryModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};