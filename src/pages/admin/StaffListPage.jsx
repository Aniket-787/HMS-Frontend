import { useEffect, useState } from 'react';
import { adminService } from '../../services/apiServices';
import { Button,  Loading, EmptyState, ErrorAlert } from '../../components/common';
import { Table } from '../../components/Table';
import { formatDate } from '../../utils/helpers';

export const StaffListPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getAllStaff();
      setStaff(response.data.staff || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', width: '25%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'phone', label: 'Phone', width: '20%' },
    {
      key: 'role',
      label: 'Role',
      width: '15%',
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {row.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      width: '15%',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff List</h1>
        <p className="text-gray-600 mt-2">View all doctors and receptionists</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="card">
        {loading ? (
          <Loading />
        ) : staff.length === 0 ? (
          <EmptyState message="No staff found" />
        ) : (
          <Table columns={columns} data={staff} />
        )}
      </div>
    </div>
  );
};
