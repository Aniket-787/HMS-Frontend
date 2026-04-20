import { useEffect, useState } from 'react';
import { adminService, receptionistService } from '../services/apiServices';
import { Button, Loading } from './common';
import { Printer } from 'lucide-react';

export const OPDBill = ({ opdId, onClose }) => {
  const [opdData, setOpdData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillData();
  }, [opdId]);

  const fetchBillData = async () => {
    try {
      setLoading(true);
      // Get OPD data
      const opdResponse = await receptionistService.getOPDById(opdId);
      setOpdData(opdResponse.data);

      // Get hospital data
      const hospitalResponse = await adminService.getHospital();
      if (hospitalResponse.data.hospital) {
        setHospitalData(hospitalResponse.data.hospital);
      }
    } catch (error) {
      console.error('Failed to fetch bill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading />;
  }

  if (!opdData) {
    return <div className="text-center py-8 text-gray-500">Bill data not found</div>;
  }

  const opd = opdData.opd || opdData;
  const visitDate = new Date(opd.visitDate).toLocaleDateString();
  const consultationFee = opd.amount || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #opd-bill, #opd-bill * {
            visibility: visible;
          }
          #opd-bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Print Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 no-print sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">OPD Bill</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="primary" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={onClose} variant="secondary" size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Bill Content */}
        <div id="opd-bill" className="p-8">
          {/* Hospital Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
            <div className="flex justify-center items-center gap-3 mb-4">
              {hospitalData?.logo && (
                <img
                  src={hospitalData.logo}
                  alt="Hospital Logo"
                  className="h-14 w-14 object-contain rounded border border-gray-300 shadow-sm"
                />
              )}
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">{hospitalData?.name || 'HealthHub'}</h1>
                <p className="text-sm text-gray-600">{hospitalData?.address || ''}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              📞 {hospitalData?.phone || 'N/A'} | 📧 {hospitalData?.email || 'N/A'}
            </p>
          </div>

          {/* Bill Header Info */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            <div>
              <p className="text-gray-600 font-medium">Bill Date</p>
              <p className="text-gray-900 font-semibold">{visitDate}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Bill Number</p>
              <p className="text-gray-900 font-semibold">OPD-{opd._id?.slice(-6).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Token Number</p>
              <p className="text-gray-900 font-semibold">{opd.tokenNumber}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-semibold text-gray-900">{opd.patientId?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">UHID:</span>
                <p className="font-semibold text-gray-900">{opd.uhid || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-semibold text-gray-900">{opd.patientId?.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Age/Gender:</span>
                <p className="font-semibold text-gray-900">
                  {opd.patientId?.age || 'N/A'} / {opd.patientId?.gender || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor & Consultation Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Doctor:</span>
                <p className="font-semibold text-gray-900">Dr. {opd.doctorId?.name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Specialization:</span>
                <p className="font-semibold text-gray-900">{opd.doctorId?.profile?.specialization || 'General'}</p>
              </div>
              <div>
                <span className="text-gray-600">Symptoms:</span>
                <p className="font-semibold text-gray-900">{opd.symptoms || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-semibold text-gray-900">{opd.status || 'WAITING'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          {opd.diagnosis || opd.notes && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Information</h3>
              {opd.diagnosis && (
                <div className="mb-3">
                  <span className="text-gray-600 text-sm">Diagnosis:</span>
                  <p className="text-gray-900">{opd.diagnosis}</p>
                </div>
              )}
              {opd.notes && (
                <div>
                  <span className="text-gray-600 text-sm">Notes:</span>
                  <p className="text-gray-900">{opd.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Charges Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Charges Summary</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold">Description</th>
                    <th className="px-4 py-3 text-right text-gray-700 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-900">Consultation Fee</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">₹{consultationFee}</td>
                  </tr>
                  <tr className="bg-blue-50 font-bold">
                    <td className="px-4 py-3 text-gray-900">Total Amount</td>
                    <td className="px-4 py-3 text-right text-blue-600">₹{consultationFee}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Status */}
          <div className={`rounded-lg p-4 mb-8 text-center ${
            opd.feePaid === 'PAID' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
            <p className={`text-lg font-bold ${
              opd.feePaid === 'PAID' 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              {opd.feePaid === 'PAID' ? '✓ PAID' : '⚠ UNPAID'}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6 text-center text-xs text-gray-600">
            <p>Thank you for choosing {hospitalData?.name || 'HealthHub'}</p>
            <p className="mt-2">This is a computer-generated bill. No signature is required.</p>
            <p className="mt-4 text-gray-500">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
