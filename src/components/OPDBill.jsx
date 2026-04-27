import { useEffect, useState } from 'react';
import { adminService, receptionistService } from '../services/apiServices';
import { Button, Loading } from './common';
import { Printer } from 'lucide-react';
import { toast } from 'react-toastify';

export const OPDBill = ({ opdId, onClose }) => {
  const [opdData, setOpdData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchBillData();
  }, [opdId]);

  const fetchBillData = async () => {
    try {
      setLoading(true);

      const opdRes = await receptionistService.getOPDById(opdId);
      const hospitalRes = await adminService.getHospital();

      setOpdData(opdRes.data);
      setHospitalData(hospitalRes.data.hospital);

    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleMarkPaid = async () => {
    try {
      setPaying(true);
      await receptionistService.markAsPaid(opdId);

      toast.success("Marked as PAID");

      setOpdData((prev) => ({
        ...prev,
        opd: {
          ...prev.opd,
          paymentStatus: "PAID"
        }
      }));

    } catch {
      toast.error("Failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loading />;

  const opd = opdData.opd || opdData;
  const amount = opd.amount || 0;
  const paymentStatus = opd.paymentStatus || 'UNPAID';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #bill, #bill * { visibility: visible; }
          #bill { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none; }
        }
      `}</style>

      <div className="bg-white w-full max-w-2xl rounded shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b no-print">
          <h2 className="font-semibold">OPD Bill</h2>

          <div className="flex gap-2">
            <Button size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button size="sm" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* BILL */}
        <div id="bill" className="p-6 text-sm">

          {/* 🔥 HOSPITAL HEADER */}
          <div className="flex items-center gap-4 border-b pb-4 mb-6">
            {hospitalData?.logo && (
              <img
                src={hospitalData.logo}
                className="h-14 w-14 object-contain border rounded"
              />
            )}

            <div>
              <h1 className="text-lg font-bold">{hospitalData?.name}</h1>
              <p className="text-xs text-gray-500">{hospitalData?.address}</p>
            </div>
          </div>

          {/* PATIENT */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Patient Details</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <p>Name: {opd.patientId?.name}</p>
              <p>UHID: {opd.patientId?.uhid}</p>
              <p>Phone: {opd.patientId?.phone}</p>
              <p>Age/Gender: {opd.patientId?.age} / {opd.patientId?.gender}</p>
            </div>
          </div>

          {/* CONSULTATION */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Consultation</p>

            <div className="text-xs space-y-1">
              <p>Doctor: Dr. {opd.doctorId?.name}</p>
              <p>Specialization: {opd.doctorId?.profile?.specialization}</p>
              <p>Symptoms: {opd.symptoms || '-'}</p>
            </div>
          </div>

          {/* CHARGES */}
          <div className="mb-6 border rounded">

            <div className="flex justify-between px-4 py-2 bg-gray-100">
              <span>Consultation Fee</span>
              <span>₹{amount}</span>
            </div>

            <div className="flex justify-between px-4 py-2 font-bold border-t text-blue-600">
              <span>Total</span>
              <span>₹{amount}</span>
            </div>

          </div>

          {/* PAYMENT */}
          <div className="text-center mb-6 space-y-2">

            <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
              paymentStatus === 'PAID'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {paymentStatus}
            </span>

            {/* 🔥 MARK AS PAID */}
            {paymentStatus !== 'PAID' && (
              <div className="no-print">
                <Button
                  onClick={handleMarkPaid}
                  loading={paying}
                  size="sm"
                >
                  Mark as Paid
                </Button>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="text-center text-xs text-gray-400 border-t pt-4">
            Thank you for visiting
          </div>

        </div>

      </div>
    </div>
  );
};