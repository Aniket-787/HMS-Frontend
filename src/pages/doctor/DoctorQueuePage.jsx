import { useEffect, useState } from 'react';
import { doctorService } from '../../services/apiServices';
import { Button, Card, Loading, EmptyState, ErrorAlert, Badge } from '../../components/common';
import { Modal } from '../../components/Modal';
import { toast } from 'react-toastify';

const MEDICINE_TYPES = [
  "TAB","SYP","CRM","POW","INJ","CAP","DRP","SUS","LIQ","SAC",
  "EXP","OIN","GEN","LOT","GEL","GRA","SOAP","SOL","VAC","PAS","INH","OTH"
];

export const DoctorQueuePage = () => {

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
  chiefComplaint: '',
  onExamination: '',
  procedure: '',
  medicines: [],
  notes: '',
  followUpDate: '',
});

  const [medicineInput, setMedicineInput] = useState({
    type: "TAB",
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
      const res = await doctorService.getQueue();
      setQueue(res.data.opdList || []);
    } catch {
      setError('Failed to fetch queue');
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
      medicines: (opd.medicines || []).map(m => ({
        type: m.type || "TAB",
        name: m.name,
        dosage: m.dosage,
        duration: m.duration
      })),
      notes: opd.notes || '',
      followUpDate: opd.followUpDate
        ? new Date(opd.followUpDate).toISOString().split('T')[0]
        : '',
    });

    setIsModalOpen(true);
  };

  const handleAddMedicine = () => {
    if (!medicineInput.name || !medicineInput.duration) {
      toast.error("Enter medicine & duration");
      return;
    }

    setFormData({
      ...formData,
      medicines: [...formData.medicines, medicineInput]
    });

    setMedicineInput({
      type: "TAB",
      name: '',
      dosage: '',
      duration: '',
    });
  };

  const handleRemoveMedicine = (i) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, idx) => idx !== i)
    });
  };

  const handleUpdateOPD = async () => {
    try {
      setUpdatingId(selectedOPD._id);

      await doctorService.updateOPD(selectedOPD._id, formData);

      toast.success("Updated successfully");
      setIsModalOpen(false);
      fetchQueue();

    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-semibold mb-4">Doctor Queue</h1>

      {error && <ErrorAlert message={error} />}

      {loading ? <Loading /> : queue.length === 0 ? (
        <EmptyState message="No patients" />
      ) : (
        <div className="space-y-3">
          {queue.map(opd => (
            <Card key={opd._id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{opd.patientId?.name}</p>
                  <p className="text-xs text-gray-500">{opd.patientId?.phone}</p>
                </div>

                <Button size="sm" onClick={() => handleOpenModal(opd)}>
                  Open
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Prescription">

        <div className="space-y-4">

          {/* SECTION 1 */}
          <div className="grid grid-cols-2 gap-3">

  <textarea
    placeholder="Chief Complaint (C/C)"
    value={formData.chiefComplaint}
    onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

  <textarea
    placeholder="On Examination (O/E)"
    value={formData.onExamination}
    onChange={(e) => setFormData({ ...formData, onExamination: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

  <textarea
    placeholder="Diagnosis"
    value={formData.diagnosis}
    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

  <textarea
    placeholder="General Examination"
    value={formData.generalExamination}
    onChange={(e) => setFormData({ ...formData, generalExamination: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

  <textarea
    placeholder="Investigation"
    value={formData.investigation}
    onChange={(e) => setFormData({ ...formData, investigation: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

  <textarea
    placeholder="Procedure"
    value={formData.procedure}
    onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
    className="h-20 border rounded px-2 py-2 text-sm"
  />

</div>
          {/* MEDICINES */}
          <div className="border rounded p-3 bg-gray-50">

            <p className="text-sm font-medium mb-2">Medicines</p>

            <div className="grid grid-cols-6 gap-2">

              <select
                value={medicineInput.type}
                onChange={(e) =>
                  setMedicineInput({ ...medicineInput, type: e.target.value })
                }
                className="h-10 border rounded px-2 text-sm"
              >
                {MEDICINE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>

              <input
                placeholder="Medicine"
                value={medicineInput.name}
                onChange={(e) =>
                  setMedicineInput({ ...medicineInput, name: e.target.value })
                }
                className="h-10 border rounded px-2 text-sm col-span-2"
              />

              <input
                placeholder="Dosage"
                value={medicineInput.dosage}
                onChange={(e) =>
                  setMedicineInput({ ...medicineInput, dosage: e.target.value })
                }
                className="h-10 border rounded px-2 text-sm"
              />

              <input
                placeholder="Duration"
                value={medicineInput.duration}
                onChange={(e) =>
                  setMedicineInput({ ...medicineInput, duration: e.target.value })
                }
                className="h-10 border rounded px-2 text-sm"
              />

              <button
                onClick={handleAddMedicine}
                className="h-10 bg-blue-500 text-white rounded text-sm"
              >
                +
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {formData.medicines.map((m, i) => (
                <div key={i} className="flex justify-between bg-white border rounded px-2 py-1 text-sm">
                  <span>
                    <span className="text-blue-600 mr-1 font-medium">{m.type}</span>
                    {m.name} ({m.dosage}) {m.duration}
                  </span>

                  <button
                    onClick={() => handleRemoveMedicine(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER */}
          <div className="grid grid-cols-2 gap-3 items-center">

            <div>
              <label className="text-sm text-gray-600">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="h-10 border rounded px-2 text-sm w-full"
              />
            </div>

            <button
              onClick={handleUpdateOPD}
              className="h-10 bg-green-600 text-white rounded font-medium"
            >
              Save Prescription
            </button>

          </div>

        </div>

      </Modal>
    </div>
  );
};