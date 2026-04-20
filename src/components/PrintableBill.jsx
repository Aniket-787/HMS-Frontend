import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doctorService, adminService } from '../services/apiServices';
import { Button, Loading } from '../components/common';

export const PrintableBill = () => {
  const { ipdId } = useParams();
  const [billData, setBillData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillData();
  }, [ipdId]);

  const fetchBillData = async () => {
    try {
      setLoading(true);
      // Fetch both bill data and hospital data
      const [dischargedRes, hospitalRes] = await Promise.all([
        doctorService.getDischargedPatients(),
        adminService.getHospital()
      ]);

      const patient = dischargedRes.data.patients.find(p => p._id === ipdId);
      if (patient) {
        setBillData(patient);
      }

      if (hospitalRes.data.hospital) {
        setHospitalData(hospitalRes.data.hospital);
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

  if (!billData) {
    return <div className="text-center py-8">Bill not found</div>;
  }

  const admissionDate = new Date(billData.admissionDate).toLocaleDateString();
  const dischargeDate = billData.dischargeDate ? new Date(billData.dischargeDate).toLocaleDateString() : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #bill, #bill * {
            visibility: visible;
          }
          #bill {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Print Button - Hidden in print */}
      <div className="mb-6 no-print">
        <Button onClick={handlePrint} variant="primary">
          Print Bill
        </Button>
      </div>

      {/* Bill Content */}
      <div id="bill" className="bg-white p-8 border-2 border-gray-300 shadow-lg max-w-4xl mx-auto">
        {/* Hospital Header with Logo */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            {hospitalData?.logo && (
              <img
                src={hospitalData.logo}
                alt="Hospital Logo"
                className="h-16 w-16 object-contain rounded-lg border border-gray-200"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{hospitalData?.name || 'Hospital Management System'}</h1>
              <p className="text-gray-600 text-lg">{hospitalData?.address || 'Hospital Address'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm text-gray-600 mt-4">
            <div>
              <p><strong>Phone:</strong> {hospitalData?.phone || '+91-XXXXXXXXXX'}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {hospitalData?.email || 'info@hospital.com'}</p>
            </div>
          </div>
        </div>

        {/* Bill Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">FINAL BILL</h2>
            <p className="text-gray-600">OPD Consultation Receipt</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-500 font-medium">Bill No</p>
              <p className="text-gray-900 font-semibold">{billData._id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-500 font-medium">Bill Date</p>
              <p className="text-gray-900 font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-500 font-medium">UHID</p>
              <p className="text-gray-900 font-semibold">{billData.uhid}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-gray-500 font-medium">Patient Name</p>
              <p className="text-gray-900 font-semibold">{billData.patientId?.name}</p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Name</p>
              <p className="text-gray-900 font-semibold">{billData.patientId?.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Phone</p>
              <p className="text-gray-900 font-semibold">{billData.patientId?.phone}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Age</p>
              <p className="text-gray-900 font-semibold">{billData.patientId?.age}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Gender</p>
              <p className="text-gray-900 font-semibold">{billData.patientId?.gender}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Doctor</p>
              <p className="text-gray-900 font-semibold">Dr. {billData.doctorId?.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Consultation Date</p>
              <p className="text-gray-900 font-semibold">{new Date(billData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Admission Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Admission Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Admission Date:</strong> {admissionDate}</p>
            <p><strong>Discharge Date:</strong> {dischargeDate}</p>
          </div>
        </div>

        {/* Charges Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Charges Breakdown</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billData.charges.map((charge, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charge.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charge.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{charge.amount}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Total Amount</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{billData.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Payment Information</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Payment Status:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  billData.paymentStatus === 'PAID'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {billData.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">₹{billData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-2">Patient Signature</p>
              <div className="mt-8 border-b-2 border-gray-400 w-full max-w-xs mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Date: ___________</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-2">Authorized Signature</p>
              <div className="mt-8 border-b-2 border-gray-400 w-full max-w-xs mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Hospital Authority</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic">
              This is a computer generated bill. No signature required for validity.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Generated on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};