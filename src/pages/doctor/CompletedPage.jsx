import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { Button, Card, Loading, EmptyState, ErrorAlert, Badge } from '../../components/common';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Eye } from 'lucide-react';

export const CompletedPage = () => {
  const navigate = useNavigate();
  const [completedPatients, setCompletedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletedPatients();
  }, []);

  const fetchCompletedPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorService.getCompletedPatients();
      setCompletedPatients(response.data.patients || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch completed consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (patientId) => {
    navigate(`/doctor/patient/${patientId}/history`);
  };

  return (
    <div>
      <button
        onClick={() => navigate('/doctor')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Completed Consultations</h1>
        <p className="text-gray-600 mt-2">View all your completed patient consultations</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loading />
      ) : completedPatients.length === 0 ? (
        <EmptyState message="No completed consultations yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedPatients.map((opd) => {
            const patient = opd.patientId || {};
            return (
            <Card key={opd._id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient.name || patient.patientName || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {patient.patientId || patient._id || 'N/A'}</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>

              <div className="space-y-2 border-y border-gray-200 py-3 mb-4">
                {patient.email && (
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">{patient.email}</p>
                  </div>
                )}

                {patient.phoneNumber && (
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">{patient.phoneNumber}</p>
                  </div>
                )}

                {patient.age && (
                  <div>
                    <p className="text-xs text-gray-600">Age</p>
                    <p className="text-sm text-gray-900">{patient.age} years</p>
                  </div>
                )}

                {opd.visitDate && (
                  <div>
                    <p className="text-xs text-gray-600">Last Visit</p>
                    <p className="text-sm text-gray-900">{formatDate(opd.visitDate)}</p>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleViewHistory(patient._id)}
              >
                <Eye className="w-4 h-4" />
                View History
              </Button>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
