import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService, adminService, appointmentRequestService } from '../../services/apiServices';

import { Button, Card } from '../../components/common';
import { Modal } from '../../components/Modal';
import { toast } from 'react-toastify';
import { Check, X, Clock, User, Phone, Stethoscope } from 'lucide-react';

export const AppointmentRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchRequests = async () => {
  try {
    setLoading(true);

    // 🔥 STEP 1: Get hospitalId
    const hospitalRes = await adminService.getHospital();
    const hospitalId = hospitalRes.data?.hospital?._id;

    if (!hospitalId) {
      console.error("Hospital ID not found");
      toast.error("Hospital not found");
      return;
    }

    // 🔥 STEP 2: Fetch requests
    const response = await receptionistService.getAppointmentRequests(hospitalId);

    console.log('Fetched appointment requests:', response);
    setRequests(response.data.requests || []);

  } catch (error) {
    console.error('Error fetching requests:', error);
    toast.error('Failed to load appointment requests');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    try {
      const response = await receptionistService.approveAppointmentRequest(selectedRequest._id);
      
      toast.success(`Appointment approved! Token: ${response.data.tokenNumber}`);
      setShowApproveModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    try {
      await receptionistService.rejectAppointmentRequest(selectedRequest._id);
      
      toast.success('Appointment request rejected');
      setShowRejectModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    );
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const processedRequests = requests.filter(r => r.status !== 'PENDING');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Requests</h1>
          <p className="text-gray-600">Manage QR-based appointment requests from patients</p>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pendingRequests.length})
          </h2>
          
          {pendingRequests.length === 0 ? (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No pending appointment requests</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((request) => (
                <Card key={request._id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{request.name}</h3>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{request.phone}</span>
                      </div>
                      
                      {request.age && (
                        <div className="text-gray-600">
                          Age: {request.age} {request.gender && `• ${request.gender}`}
                        </div>
                      )}

                      {request.doctorId && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Stethoscope className="w-4 h-4" />
                          <span>Dr. {request.doctorId.name}</span>
                        </div>
                      )}

                      {request.symptoms && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-gray-600 text-xs">
                          <strong>Symptoms:</strong> {request.symptoms}
                        </div>
                      )}

                      <p>Date: {new Date(request.appointmentDate).toLocaleDateString()}</p>

                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(request.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                      >
                        <Check className="w-4 h-4 mr-1 inline" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        variant="secondary"
                        className="flex-1 text-sm py-2"
                      >
                        <X className="w-4 h-4 mr-1 inline" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Processed Requests ({processedRequests.length})
            </h2>
            <Card className="bg-white border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {processedRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{request.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{request.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {request.doctorId ? `Dr. ${request.doctorId.name}` : '-'}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedRequest(null);
        }}
        title="Approve Appointment Request"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Are you sure you want to approve this appointment request?
          </p>
          
          {selectedRequest && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p><strong>Patient:</strong> {selectedRequest.name}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              {selectedRequest.doctorId && (
                <p><strong>Doctor:</strong> Dr. {selectedRequest.doctorId.name}</p>
              )}
            </div>
          )}

          <p className="text-sm text-green-600 mb-4">
            This will create an OPD appointment and generate a token number.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {processing ? 'Processing...' : 'Yes, Approve'}
            </Button>
            <Button
              onClick={() => {
                setShowApproveModal(false);
                setSelectedRequest(null);
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRequest(null);
        }}
        title="Reject Appointment Request"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Are you sure you want to reject this appointment request?
          </p>

          {selectedRequest && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p><strong>Patient:</strong> {selectedRequest.name}</p>
              <p><strong>Phone:</strong> {selectedRequest.phone}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={processing}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Processing...' : 'Yes, Reject'}
            </Button>
            <Button
              onClick={() => {
                setShowRejectModal(false);
                setSelectedRequest(null);
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};