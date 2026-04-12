import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { Button, Card, Loading, EmptyState, ErrorAlert, Badge } from '../../components/common';
import { Modal } from '../../components/Modal';
import { FormInput, FormTextarea } from '../../components/common';
import { formatDate } from '../../utils/helpers';

export const DoctorQueuePage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOPD, setSelectedOPD] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    medicines: [],
    notes: '',
    status: 'IN_PROGRESS',
  });
  const [medicineInput, setMedicineInput] = useState({ name: '', dosage: '', duration: '' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorService.getQueue();    
      setQueue(response.data.opdList || []);
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
      medicines: opd.medicines || [],
      notes: opd.notes || '',
      status: opd.status || 'IN_PROGRESS',
    });
    setIsModalOpen(true);
  };

  const handleAddMedicine = () => {
    if (medicineInput.name && medicineInput.dosage && medicineInput.duration) {
      setFormData({
        ...formData,
        medicines: [...formData.medicines, medicineInput],
      });
      setMedicineInput({ name: '', dosage: '', duration: '' });
    }
  };

  const handleRemoveMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index),
    });
  };

  const handleUpdateOPD = async () => {
    try {
      setUpdatingId(selectedOPD._id);
      await doctorService.updateOPD(selectedOPD._id, {
        diagnosis: formData.diagnosis,
        medicines: formData.medicines,
        notes: formData.notes,
        status: formData.status,
      });
      setIsModalOpen(false);
      fetchQueue();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update OPD');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewHistory = (patientId) => {
    navigate(`/doctor/patient/${patientId}/history`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING':
        return 'badge-warning';
      case 'IN_PROGRESS':
        return 'badge-info';
      case 'COMPLETED':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Today's Queue</h1>
        <p className="text-gray-600 mt-2">Manage patient appointments and consultations</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loading />
      ) : queue.length === 0 ? (
        <EmptyState message="No appointments for today" />
      ) : (
        <div className="space-y-4">
          {queue.map((opd, idx) => (
            <Card key={opd._id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                      <span className="text-xl font-bold text-primary-600">
                        {opd.tokenNumber}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {opd.patientId?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {opd.patientId?.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant={getStatusColor(opd.status)}>
                    {opd.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(opd.visitDate)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewHistory(opd.patientId._id)}
                  >
                    History
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenModal(opd)}
                  >
                    Update
                  </Button>
                </div>
              </div>

              {opd.symptoms && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Symptoms:</span> {opd.symptoms}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Update OPD Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update OPD"
        size="lg"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateOPD}
              loading={updatingId === selectedOPD?._id}
            >
              Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Diagnosis"
            type="text"
            placeholder="Enter diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Medicines
            </label>
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-3 gap-2">
                <FormInput
                  type="text"
                  placeholder="Medicine name"
                  value={medicineInput.name}
                  onChange={(e) => setMedicineInput({ ...medicineInput, name: e.target.value })}
                />
                <FormInput
                  type="text"
                  placeholder="Dosage"
                  value={medicineInput.dosage}
                  onChange={(e) => setMedicineInput({ ...medicineInput, dosage: e.target.value })}
                />
                <FormInput
                  type="text"
                  placeholder="Duration"
                  value={medicineInput.duration}
                  onChange={(e) => setMedicineInput({ ...medicineInput, duration: e.target.value })}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddMedicine}
              >
                Add Medicine
              </Button>
            </div>

            {formData.medicines.length > 0 && (
              <div className="space-y-2">
                {formData.medicines.map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <p className="text-sm text-gray-700">
                      {med.name} - {med.dosage} - {med.duration}
                    </p>
                    <button
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormTextarea
            label="Notes"
            placeholder="Enter additional notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
