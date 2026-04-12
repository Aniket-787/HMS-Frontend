import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiServices';
import { Button, Card, Loading, EmptyState, ErrorAlert, Badge } from '../../components/common';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';

export const PatientHistoryPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [patientId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorService.getPatientHistory(patientId);
      setHistory(response.data.history || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patient history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/doctor')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Queue
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient History</h1>
        <p className="text-gray-600 mt-2">View patient's medical history and past appointments</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loading />
      ) : history.length === 0 ? (
        <EmptyState message="No history found for this patient" />
      ) : (
        <div className="space-y-6">
          {history.map((record) => (
            <Card key={record._id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Token #{record.tokenNumber}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(record.visitDate)}</p>
                </div>
                <Badge variant={record.status === 'COMPLETED' ? 'success' : 'warning'}>
                  {record.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                {record.symptoms && (
                  <div>
                    <p className="text-sm text-gray-600">Symptoms</p>
                    <p className="font-medium text-gray-900">{record.symptoms}</p>
                  </div>
                )}

                {record.diagnosis && (
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-medium text-gray-900">{record.diagnosis}</p>
                  </div>
                )}

                {record.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium text-gray-900">{record.notes}</p>
                  </div>
                )}

                {record.medicines?.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Medicines</p>
                    <div className="space-y-1">
                      {record.medicines.map((med, idx) => (
                        <p key={idx} className="text-sm text-gray-900">
                          • {med.name} - {med.dosage} ({med.duration})
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
