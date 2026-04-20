import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { Button, Card, Loading, EmptyState, ErrorAlert, Badge } from '../../components/common';
import { Modal } from '../../components/Modal';
import { FormInput, FormTextarea } from '../../components/common';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

export const DoctorQueuePage = () => {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOPD, setSelectedOPD] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({
    diagnosis: '',
    generalExamination: '',
    investigation: '',
    medicines: [],
    notes: '',
    followUpDate: '',
    status: 'IN_PROGRESS',
  });

  const [medicineInput, setMedicineInput] = useState({
    name: '',
    dosage: '',
    duration: '',
  });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await doctorService.getQueue();
      setQueue(res.data.opdList || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch queue');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (opd) => {
    setSelectedOPD(opd);

    setFormData({
      diagnosis: opd.diagnosis || '',
      generalExamination: opd.generalExamination || '',
      investigation: opd.investigation || '',
      medicines: opd.medicines || [],
      notes: opd.notes || '',
      followUpDate: opd.followUpDate
        ? new Date(opd.followUpDate).toISOString().split('T')[0]
        : '',
      status: opd.status || 'IN_PROGRESS',
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOPD(null);

    setFormData({
      diagnosis: '',
      generalExamination: '',
      investigation: '',
      medicines: [],
      notes: '',
      followUpDate: '',
      status: 'IN_PROGRESS',
    });
  };

  const handleAddMedicine = () => {
    if (!medicineInput.name || !medicineInput.dosage || !medicineInput.duration) {
      toast.error('Fill all medicine fields');
      return;
    }

    setFormData({
      ...formData,
      medicines: [...formData.medicines, medicineInput],
    });

    setMedicineInput({ name: '', dosage: '', duration: '' });
  };

  const handleRemoveMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index),
    });
  };

  const handleUpdateOPD = async () => {
    try {
      if (!formData.diagnosis) {
        toast.error('Diagnosis is required');
        return;
      }

      setUpdatingId(selectedOPD._id);

      await doctorService.updateOPD(selectedOPD._id, {
        ...formData,
        followUpDate: formData.followUpDate || null,
      });

      toast.success('OPD updated successfully!');
      handleCloseModal();
      fetchQueue();

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update OPD';
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'WAITING') return 'warning';
    if (status === 'COMPLETED') return 'success';
    return 'info';
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Doctor Queue</h1>
        <p className="text-gray-600">Manage patient consultations</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loading />
      ) : queue.length === 0 ? (
        <EmptyState message="No patients today" />
      ) : (
        <div className="space-y-4">
          {queue.map((opd) => (
            <Card key={opd._id}>
              <div className="flex justify-between items-center">

                <div>
                  <p className="font-semibold">{opd.patientId?.name}</p>
                  <p className="text-sm text-gray-600">{opd.patientId?.phone}</p>
                </div>

                <Badge variant={getStatusColor(opd.status)}>
                  {opd.status}
                </Badge>

                <Button onClick={() => handleOpenModal(opd)}>
                  Update
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Update OPD"
      >
        <div className="space-y-4">

          <FormTextarea
            label="Diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          />

          <FormTextarea
            label="General Examination"
            value={formData.generalExamination}
            onChange={(e) => setFormData({ ...formData, generalExamination: e.target.value })}
          />

          <FormTextarea
            label="Investigation"
            value={formData.investigation}
            onChange={(e) => setFormData({ ...formData, investigation: e.target.value })}
          />

          <FormTextarea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <FormInput
            label="Follow-up Date"
            type="date"
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />

          {/* Medicine */}
          <div className="flex gap-2">
            <FormInput
              placeholder="Name"
              value={medicineInput.name}
              onChange={(e) => setMedicineInput({ ...medicineInput, name: e.target.value })}
            />
            <FormInput
              placeholder="Dosage"
              value={medicineInput.dosage}
              onChange={(e) => setMedicineInput({ ...medicineInput, dosage: e.target.value })}
            />
            <FormInput
              placeholder="Duration"
              value={medicineInput.duration}
              onChange={(e) => setMedicineInput({ ...medicineInput, duration: e.target.value })}
            />
            <Button onClick={handleAddMedicine}>Add</Button>
          </div>

          {formData.medicines.map((m, i) => (
            <div key={i} className="flex justify-between">
              <span>{m.name}</span>
              <button onClick={() => handleRemoveMedicine(i)}>Remove</button>
            </div>
          ))}

          <Button
            onClick={handleUpdateOPD}
            loading={updatingId === selectedOPD?._id}
            disabled={updatingId === selectedOPD?._id}
          >
            Update OPD
          </Button>

        </div>
      </Modal>
    </div>
  );
};