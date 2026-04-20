import { useEffect, useState } from 'react';
import { receptionistService } from '../../services/apiServices';
import { Button, Loading, EmptyState } from '../../components/common';
import { Table } from '../../components/Table';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { Badge } from '../../components/common';
import { OPDBill } from '../../components/OPDBill';
import { toast } from 'react-toastify';
import { Printer } from 'lucide-react';

export const OPDListPage = () => {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [showBill, setShowBill] = useState(false);

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

  const columns = [
    { key: 'tokenNumber', label: 'Token', width: '8%' },
    {
      key: 'patientName',
      label: 'Patient',
      width: '18%',
      render: (row) => row.patientId?.name || 'N/A',
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      width: '18%',
      render: (row) => `Dr. ${row.doctorId?.name}` || 'N/A',
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      width: '18%',
      render: (row) => row.symptoms || 'N/A',
    },
    {
      key: 'amount',
      label: 'Amount',
      width: '12%',
      render: (row) => `₹${row.amount || 0}`,
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
      width: '14%',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handlePrintBill(row._id)}
          className="flex items-center gap-1"
        >
          <Printer className="w-4 h-4" />
          Bill
        </Button>
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
    </div>
  );
};
