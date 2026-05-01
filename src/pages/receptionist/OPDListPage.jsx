import { useEffect, useState } from 'react';
import { receptionistService } from '../../services/apiServices';
import { Button, Loading, EmptyState, FormInput, FormSelect, FormTextarea } from '../../components/common';
import { Table } from '../../components/Table';
import { formatDate } from '../../utils/helpers';
import { Badge } from '../../components/common';
import { OPDBill } from '../../components/OPDBill';
import { toast } from 'react-toastify';
import { Printer, Edit } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const OPDListPage = () => {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedOpd, setSelectedOpd] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    symptoms: ''
  });

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    fetchOPDList();
  }, []);

  const fetchOPDList = async () => {
    try {
      setLoading(true);
      const response = await receptionistService.getOPDList();
      setOpdList(response.data.OPDList || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch OPD list');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBill = (opdId) => {
    setSelectedBillId(opdId);
    setShowBill(true);
  };

  const handleEditPatient = (row) => {
    setSelectedPatient(row.patientId);
    setSelectedOpd(row);
    setEditForm({
      name: row.patientId?.name || '',
      age: row.patientId?.age || '',
      gender: row.patientId?.gender || '',
      phone: row.patientId?.phone || '',
      address: row.patientId?.address || '',
      symptoms: row.symptoms || ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePatient = async () => {
    try {
      await receptionistService.updatePatient(selectedPatient._id, {
        name: editForm.name,
        age: editForm.age,
        gender: editForm.gender,
        phone: editForm.phone,
        address: editForm.address,
      });

      if (selectedOpd && editForm.symptoms !== selectedOpd.symptoms) {
        await receptionistService.updateOPD(selectedOpd._id, {
          symptoms: editForm.symptoms,
        });
      }

      toast.success('Patient updated successfully');
      setShowEditModal(false);
      setSelectedPatient(null);
      setSelectedOpd(null);
      fetchOPDList(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update patient');
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const columns = [
    {
      key: 'srNo',
      label: 'Sr. No',
      width: '8%',
      render: (row, index) => index + 1,
    },
    {
      key: 'uhid',
      label: 'UHID',
      width: '12%',
      render: (row) => row.patientId?.uhid || 'N/A',
    },
    {
      key: 'patientName',
      label: 'Patient Name',
      width: '18%',
      render: (row) => row.patientId?.name || 'N/A',
    },
    {
      key: 'doctorName',
      label: 'Doctor Name',
      width: '18%',
      render: (row) => `Dr. ${row.doctorId?.name}` || 'N/A',
    },
    {
      key: 'tokenNumber',
      label: 'Token Number',
      width: '10%',
      render: (row) => row.tokenNumber || 'N/A',
    },
    {
      key: 'date',
      label: 'Date',
      width: '12%',
      render: (row) => formatDate(row.visitDate) || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (row) => (
        <Badge variant={row.status === 'WAITING' ? 'warning' : 'success'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePrintBill(row._id)}
            className="flex items-center gap-1"
            title="Print Bill"
          >
            <Printer className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditPatient(row)}
            className="flex items-center gap-1"
            title="Edit Patient"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Today's OPD List</h1>
        <p className="text-gray-600 mt-2">View all registered OPD appointments and generate bills</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <Loading />
        ) : opdList.length === 0 ? (
          <EmptyState message="No OPD appointments found" />
        ) : (
          <Table columns={columns} data={opdList} />
        )}
      </div>

      {showBill && selectedBillId && (
        <OPDBill 
          opdId={selectedBillId} 
          onClose={() => {
            setShowBill(false);
            setSelectedBillId(null);
          }}
        />
      )}

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Patient Details"
        size="lg"
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdatePatient}>
              Update Patient
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              value={editForm.name}
              onChange={(e) => handleEditFormChange('name', e.target.value)}
              required
            />
            <FormInput
              label="Age"
              type="number"
              value={editForm.age}
              onChange={(e) => handleEditFormChange('age', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Gender"
              value={editForm.gender}
              onChange={(e) => handleEditFormChange('gender', e.target.value)}
              options={genderOptions}
              required
            />
            <FormInput
              label="Mobile Number"
              value={editForm.phone}
              onChange={(e) => handleEditFormChange('phone', e.target.value)}
              required
            />
          </div>
          <FormTextarea
            label="Address"
            value={editForm.address}
            onChange={(e) => handleEditFormChange('address', e.target.value)}
            rows={3}
          />
          <FormTextarea
            label="Symptoms"
            value={editForm.symptoms}
            onChange={(e) => handleEditFormChange('symptoms', e.target.value)}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
};
