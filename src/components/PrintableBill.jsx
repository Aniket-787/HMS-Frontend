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
      <div id="bill" className="bg-white p-8 border-2 border-gray-300">
        {/* Hospital Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{hospitalData?.name || 'Hospital Management System'}</h1>
          <p className="text-gray-600 mt-2">{hospitalData?.address || 'Hospital Address'}</p>
          <p className="text-gray-600">Phone: {hospitalData?.phone || '+91-XXXXXXXXXX'} | Email: {hospitalData?.email || 'info@hospital.com'}</p>
        </div>

        {/* Bill Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">FINAL BILL</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Bill No:</strong> {billData._id.slice(-8).toUpperCase()}</p>
              <p><strong>Bill Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>UHID:</strong> {billData.uhid}</p>
              <p><strong>Patient Name:</strong> {billData.patientId?.name}</p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Patient Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {billData.patientId?.name}</p>
              <p><strong>Phone:</strong> {billData.patientId?.phone}</p>
              <p><strong>Age:</strong> {billData.patientId?.age}</p>
              <p><strong>Gender:</strong> {billData.patientId?.gender}</p>
            </div>
            <div>
              <p><strong>Doctor:</strong> {billData.doctorId?.name}</p>
              <p><strong>Ward Type:</strong> {billData.wardType}</p>
              <p><strong>Bed Number:</strong> {billData.bedId?.bedNumber}</p>
              <p><strong>Insurance:</strong> {billData.isInsured === 'YES' ? 'Yes' : 'No'}</p>
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Charges Breakdown</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billData.charges.map((charge, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{charge.type}</td>
                  <td className="border border-gray-300 px-4 py-2">{charge.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹{charge.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan="2" className="border border-gray-300 px-4 py-2 text-right">Total Amount:</td>
                <td className="border border-gray-300 px-4 py-2 text-right">₹{billData.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Payment Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                billData.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {billData.paymentStatus}
              </span>
            </p>
            <p><strong>Total Amount:</strong> ₹{billData.totalAmount}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold">Patient Signature</p>
              <div className="mt-8 border-b border-gray-400 w-48"></div>
              <p className="text-sm text-gray-600 mt-2">Date: ___________</p>
            </div>
            <div>
              <p className="font-semibold">Authorized Signature</p>
              <div className="mt-8 border-b border-gray-400 w-48"></div>
              <p className="text-sm text-gray-600 mt-2">Hospital Authority</p>
            </div>
          </div>
        </div>

        {/* Print Notice */}
        <div className="mt-8 text-center text-sm text-gray-500 print:block hidden">
          <p>This is a computer generated bill. No signature required.</p>
        </div>
      </div>
    </div>
  );
};