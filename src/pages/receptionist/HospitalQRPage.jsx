import { useEffect, useState } from "react";
import { adminService, receptionistService } from "../../services/apiServices";
import { Button } from "../../components/common";

export const HospitalQRPage = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQR();
  }, []);

  const fetchQR = async () => {
    try {
      const hospitalRes = await adminService.getHospital();
      const hospitalId = hospitalRes.data.hospital._id;

      const qrRes = await adminService.getHospitalQR(hospitalId);

      setQrData(qrRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrData.qrCode;
    link.download = "hospital-qr.png";
    link.click();
  };

  if (loading) {
    return <div className="p-6 text-center">Loading QR...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">

      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">

        {/* Hospital Name */}
        <h1 className="text-xl font-semibold mb-2">
          {qrData?.hospital?.name}
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          Scan to Book Appointment
        </p>

        {/* QR IMAGE */}
        <div className="flex justify-center mb-4">
          <img
            src={qrData.qrCode}
            alt="QR Code"
            className="w-64 h-64 border rounded"
          />
        </div>

        {/* URL */}
        <p className="text-xs text-gray-400 break-all mb-4">
          {qrData.url}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-2 justify-center">

          <Button onClick={handleDownload}>
            Download QR
          </Button>

          <Button onClick={() => window.print()} variant="secondary">
            Print
          </Button>

        </div>

      </div>

    </div>
  );
};