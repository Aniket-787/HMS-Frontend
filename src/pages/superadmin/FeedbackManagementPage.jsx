import { useState, useEffect } from 'react';
import { supportService } from '../../services/apiServices';
import { formatDate, formatTime } from '../../utils/helpers';

const STATUS_COLORS = {
  NEW: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
  SEEN: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Seen' },
  RESOLVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
};

const TYPE_COLORS = {
  SUGGESTION: { bg: 'bg-purple-100', text: 'text-purple-800' },
  COMPLAINT: { bg: 'bg-red-100', text: 'text-red-800' },
  TECHNICAL_ISSUE: { bg: 'bg-orange-100', text: 'text-orange-800' },
  BILLING_ISSUE: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  GENERAL_FEEDBACK: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const FeedbackManagementPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        feedbackType: typeFilter !== 'ALL' ? typeFilter : undefined,
        search: searchQuery || undefined,
      };
      
      const response = await supportService.getAllFeedbacks(params);
      if (response.data.success) {
        setFeedbacks(response.data.data);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await supportService.getFeedbackStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [pagination.page, statusFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchFeedbacks();
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      setUpdating(true);
      const response = await supportService.updateFeedbackStatus(feedbackId, { status: newStatus });
      if (response.data.success) {
        setFeedbacks(prev => 
          prev.map(f => f._id === feedbackId ? response.data.data : f)
        );
        fetchStats();
        if (selectedFeedback?._id === feedbackId) {
          setSelectedFeedback(response.data.data);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const response = await supportService.deleteFeedback(feedbackId);
      if (response.data.success) {
        setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
        fetchStats();
        if (selectedFeedback?._id === feedbackId) {
          setShowModal(false);
          setSelectedFeedback(null);
        }
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  const openDetailModal = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
    // Mark as seen if new
    if (feedback.status === 'NEW') {
      handleStatusChange(feedback._id, 'SEEN');
    }
  };

  const getStatusBadge = (status) => {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.NEW;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {colors.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const colors = TYPE_COLORS[type] || TYPE_COLORS.GENERAL_FEEDBACK;
    const labels = {
      SUGGESTION: 'Suggestion',
      COMPLAINT: 'Complaint',
      TECHNICAL_ISSUE: 'Technical',
      BILLING_ISSUE: 'Billing',
      GENERAL_FEEDBACK: 'General',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-gray-600 mt-2">View and manage user feedback, complaints, and suggestions.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Feedback</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-gray-500">New</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">{stats.seen}</div>
            <div className="text-sm text-gray-500">Seen</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-500">Resolved</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital, name, subject..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="SEEN">Seen</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="TECHNICAL_ISSUE">Technical Issue</option>
            <option value="BILLING_ISSUE">Billing Issue</option>
            <option value="GENERAL_FEEDBACK">General Feedback</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-lg font-medium">No feedback found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{formatDate(feedback.createdAt)}</div>
                      <div className="text-xs text-gray-400">{formatTime(feedback.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{feedback.hospitalName}</div>
                      {feedback.hospitalAddress && (
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{feedback.hospitalAddress}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{feedback.senderName}</div>
                      <div className="text-xs text-gray-500">{feedback.role}</div>
                      {feedback.mobile && (
                        <div className="text-xs text-gray-400">{feedback.mobile}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(feedback.feedbackType)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-[200px] truncate">
                        {feedback.subject || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(feedback.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openDetailModal(feedback)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Feedback Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Feedback Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {getTypeBadge(selectedFeedback.feedbackType)}
                  {getStatusBadge(selectedFeedback.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Hospital</label>
                    <p className="font-medium text-gray-900">{selectedFeedback.hospitalName}</p>
                    {selectedFeedback.hospitalAddress && (
                      <p className="text-sm text-gray-500">{selectedFeedback.hospitalAddress}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Submitted</label>
                    <p className="font-medium text-gray-900">{formatDate(selectedFeedback.createdAt)}</p>
                    <p className="text-sm text-gray-500">{formatTime(selectedFeedback.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Sender</label>
                    <p className="font-medium text-gray-900">{selectedFeedback.senderName}</p>
                    <p className="text-sm text-gray-500">{selectedFeedback.role}</p>
                    {selectedFeedback.mobile && (
                      <p className="text-sm text-gray-500">{selectedFeedback.mobile}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Subject</label>
                    <p className="font-medium text-gray-900">{selectedFeedback.subject || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </div>
                </div>

                {selectedFeedback.adminNotes && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">Admin Notes</label>
                    <div className="mt-1 p-4 bg-blue-50 rounded-lg text-gray-700">
                      {selectedFeedback.adminNotes}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                {selectedFeedback.status !== 'SEEN' && (
                  <button
                    onClick={() => handleStatusChange(selectedFeedback._id, 'SEEN')}
                    disabled={updating}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Mark as Seen
                  </button>
                )}
                {selectedFeedback.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleStatusChange(selectedFeedback._id, 'RESOLVED')}
                    disabled={updating}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedFeedback._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagementPage;