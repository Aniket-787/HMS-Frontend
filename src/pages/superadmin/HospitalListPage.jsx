import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/apiServices';
import { Button, Loading, EmptyState, ErrorAlert } from '../../components/common';
import { Table } from '../../components/Table';
import { Plus } from 'lucide-react';

export const HospitalListPage = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await superAdminService.getAllHospitals();    
      setHospitals(response.data.hospitals || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };
 
  const columns = [
    { key: 'name', label: 'Hospital Name', width: '25%' },
    { key: 'email', label: 'Email', width: '25%' },
    { key: 'phone', label: 'Phone', width: '20%' },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          row.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (row) => (
        <button
          onClick={() => navigate(`/superadmin/hospital/${row._id}`)}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospitals</h1>
          <p className="text-gray-600 mt-2">Manage all hospitals in the system</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/superadmin/create-hospital')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Hospital
        </Button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="card">
        {loading ? (
          <Loading />
        ) : hospitals.length === 0 ? (
          <EmptyState message="No hospitals found" />
        ) : (
          <Table columns={columns} data={hospitals} />
        )}
      </div>
    </div>
  );
};
