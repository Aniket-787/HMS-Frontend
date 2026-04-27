import { useState, useEffect } from 'react';
import { FiFileText, FiDownload, FiCalendar, FiFilter, FiRefreshCw, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { reportsService } from '../services/apiServices';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('opd');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Quick filter presets
  const setQuickFilter = (filter) => {
    const today = new Date();
    let from, to;

    switch (filter) {
      case 'today':
        from = today;
        to = today;
        break;
      case 'week':
        from = new Date(today.setDate(today.getDate() - 7));
        to = new Date();
        break;
      case 'month':
        from = new Date(today.setMonth(today.getMonth() - 1));
        to = new Date();
        break;
      case 'year':
        from = new Date(today.setFullYear(today.getFullYear() - 1));
        to = new Date();
        break;
      default:
        return;
    }

    setFromDate(from.toISOString().split('T')[0]);
    setToDate(to.toISOString().split('T')[0]);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleExport = async (type) => {
    if (!fromDate || !toDate) {
      showToast('Please select date range', 'error');
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === 'opd' ? 'opd' : 'ipd';
      const response = await reportsService.exportData(endpoint, type, fromDate, toDate);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = type === 'excel' ? 'xlsx' : 'pdf';
      link.setAttribute('download', `${activeTab.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast(`${activeTab.toUpperCase()} ${type.toUpperCase()} exported successfully!`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast(error.response?.data?.message || `Failed to export ${type.toUpperCase()}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!fromDate || !toDate) {
      showToast('Please select date range', 'error');
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === 'opd' ? 'opd' : 'ipd';
      const response = await reportsService.getPreview(endpoint, fromDate, toDate);
      setPreviewData(response.data);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      showToast('Failed to load preview', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-down ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.type === 'success' ? <FiCheck size={18} /> : <FiX size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiFileText className="text-blue-600" size={32} />
          Reports & Exports
        </h1>
        <p className="text-gray-500 mt-2">Generate and export OPD/IPD reports for your hospital</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => { setActiveTab('opd'); setPreviewData(null); setShowPreview(false); }}
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === 'opd'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiFileText className="inline-block mr-2" />
            OPD Reports
          </button>
          <button
            onClick={() => { setActiveTab('ipd'); setPreviewData(null); setShowPreview(false); }}
            className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === 'ipd'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiFileText className="inline-block mr-2" />
            IPD Reports
          </button>
        </div>

        <div className="p-6">
          {/* Filters Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">Date Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">From Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">To Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'today', label: 'Today' },
                    { key: 'week', label: 'Last 7 Days' },
                    { key: 'month', label: 'This Month' },
                    { key: 'year', label: 'This Year' }
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setQuickFilter(filter.key)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Preview Button */}
            <button
              onClick={handlePreview}
              disabled={loading || !fromDate || !toDate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiEye />}
              Preview Data
            </button>

            {/* Export Excel */}
            <button
              onClick={() => handleExport('excel')}
              disabled={loading || !fromDate || !toDate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
              Export Excel
            </button>

            {/* Export PDF */}
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading || !fromDate || !toDate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
              Export PDF
            </button>
          </div>

          {/* No Date Selected Warning */}
          {(!fromDate || !toDate) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <FiCalendar className="text-amber-500" />
              <span className="text-amber-700">Please select a date range to enable export and preview features</span>
            </div>
          )}

          {/* Preview Modal */}
          {showPreview && previewData && (
            <div className="mt-6 animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-white font-semibold text-lg">
                    {activeTab.toUpperCase()} Report Preview
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
                  {activeTab === 'opd' ? (
                    <>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Records</p>
                        <p className="text-2xl font-bold text-blue-600">{previewData.summary?.totalRecords || 0}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(previewData.summary?.totalRevenue)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Paid</p>
                        <p className="text-2xl font-bold text-emerald-600">{previewData.summary?.paidCount || 0}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Unpaid</p>
                        <p className="text-2xl font-bold text-red-600">{previewData.summary?.unpaidCount || 0}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Records</p>
                        <p className="text-2xl font-bold text-blue-600">{previewData.summary?.totalRecords || 0}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Advance</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(previewData.summary?.totalAdvance)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Admitted</p>
                        <p className="text-2xl font-bold text-amber-600">{previewData.summary?.admittedCount || 0}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Discharged</p>
                        <p className="text-2xl font-bold text-purple-600">{previewData.summary?.dischargedCount || 0}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        {activeTab === 'opd' ? (
                          <>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Token</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Age</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fee</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Admit Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Discharge</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ward</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Bill</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {previewData.data?.length > 0 ? (
                        previewData.data.map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {activeTab === 'opd' ? (
                              <>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(record.date)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{record.tokenNo}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{record.patientName}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.age}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.gender}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.doctorName}</td>
                                <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(record.consultationFee)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    record.status === 'COMPLETED' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(record.admitDate)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(record.dischargeDate)}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{record.patientName}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.doctorName}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.ward}</td>
                                <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(record.totalBill)}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    record.status === 'DISCHARGED' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={activeTab === 'opd' ? 8 : 7} className="px-4 py-8 text-center text-gray-500">
                            No records found for the selected date range
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {previewData.data?.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
                    Showing {previewData.data.length} of {previewData.summary?.totalRecords} records
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Card */}
      <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h4 className="font-semibold text-blue-800 mb-2">💡 How to use</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Select a date range using the date pickers or quick filter buttons</li>
          <li>• Click "Preview Data" to see a summary and sample of records</li>
          <li>• Use "Export Excel" for spreadsheet format with full details</li>
          <li>• Use "Export PDF" for printable professional reports</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;