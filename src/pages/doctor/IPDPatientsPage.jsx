import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert, Loading, Card } from '../../components/common';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';



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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);

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
      setErrorMessage('Failed to load patients');
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
        setErrorMessage('');
        await doctorService.addDailyNotes(selectedPatient._id, {
          notes: formValues.notes,
          medicines: formValues.medicines.filter(med => med.name && med.dosage),
        });
        setSuccessMessage('Daily notes added successfully!');
        setShowNotesModal(false);
        notesForm.resetForm();
        fetchPatients();
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to add notes');
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
        setErrorMessage('');
        await doctorService.addCharges(selectedPatient._id, {
          ...formValues,
          amount: parseFloat(formValues.amount),
        });
        setSuccessMessage('Charge added successfully!');
        setShowChargesModal(false);
        chargesForm.resetForm();
        fetchPatients();
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to add charge');
      }
    }
  );

  const handleDischarge = async (patientId) => {
    if (!window.confirm('Are you sure you want to discharge this patient?')) return;

    try {
      setErrorMessage('');
      await doctorService.dischargePatient(patientId);
      setSuccessMessage('Patient discharged successfully!');
      fetchPatients();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to discharge patient');
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
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
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
          onClick={() => {
            setSelectedPatient(patient);
            setShowChargesModal(true);
          }}
        >
          Add Charges
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDischarge(patient._id)}
        >
          Discharge
        </Button>
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
      <Button
        size="sm"
        variant="primary"
        onClick={() => window.open(`/bill/${patient._id}`, '_blank')}
      >
        Print Bill
      </Button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">IPD Patients</h1>
        <p className="text-gray-600 mt-2">Manage admitted and discharged patients</p>
      </div>

      {errorMessage && (
        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

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
    </div>
  );
};