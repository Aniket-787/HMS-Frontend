import { useEffect, useState } from 'react';
import { receptionistService } from '../../services/apiServices';
import { Button, Loading, EmptyState, ErrorAlert } from '../../components/common';
import { Table } from '../../components/Table';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { Badge } from '../../components/common';

export const OPDListPage = () => {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOPDList();
  }, []);

  const fetchOPDList = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await receptionistService.getOPDList();
      setOpdList(response.data.OPDList || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch OPD list');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'tokenNumber', label: 'Token', width: '10%' },
    {
      key: 'patientName',
      label: 'Patient',
      width: '20%',
      render: (row) => row.patientId?.name || 'N/A',
    },
    {
      key: 'doctorName',
      label: 'Doctor',
      width: '20%',
      render: (row) => `Dr. ${row.doctorId?.name}` || 'N/A',
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      width: '20%',
      render: (row) => row.symptoms || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (row) => (
        <Badge variant={row.status === 'WAITING' ? 'warning' : 'success'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'visitDate',
      label: 'Visit Date',
      width: '15%',
      render: (row) => formatDate(row.visitDate),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Today's OPD List</h1>
        <p className="text-gray-600 mt-2">View all registered OPD appointments</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="card">
        {loading ? (
          <Loading />
        ) : opdList.length === 0 ? (
          <EmptyState message="No OPD appointments found" />
        ) : (
          <Table columns={columns} data={opdList} />
        )}
      </div>
    </div>
  );
};
