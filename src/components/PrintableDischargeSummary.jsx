import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doctorService, adminService } from '../services/apiServices';
import { Button, Loading } from '../components/common';

export const PrintableDischargeSummary = () => {
  const { ipdId } = useParams();
  const [summaryData, setSummaryData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryData();
  }, [ipdId]);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      // Fetch discharge summary, patient data, and hospital data
      const [summaryRes, dischargedRes, hospitalRes] = await Promise.all([
        doctorService.getDischargeSummary(ipdId),
        doctorService.getDischargedPatients(),
        adminService.getHospital()
      ]);

      if (summaryRes.data.summary) {
        setSummaryData(summaryRes.data.summary);
      }

      const patient = dischargedRes.data.patients.find(p => p._id === ipdId);
      if (patient) {
        setPatientData(patient);
      }

      if (hospitalRes.data.hospital) {
        setHospitalData(hospitalRes.data.hospital);
      }
    } catch (error) {
      console.error('Failed to fetch discharge summary data:', error);
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

  if (!summaryData || !patientData) {
    return <div className="text-center py-8">Discharge summary not found</div>;
  }

  const admissionDate = new Date(patientData.admissionDate).toLocaleDateString();
  const dischargeDate = patientData.dischargeDate ? new Date(patientData.dischargeDate).toLocaleDateString() : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #summary, #summary * {
            visibility: visible;
          }
          #summary {
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
          Print Discharge Summary
        </Button>
      </div>

      {/* Discharge Summary Content */}
      <div id="summary" className="bg-white p-8 border-2 border-gray-300">
        {/* Hospital Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
          <div className="flex justify-center items-center mb-4">
            {hospitalData?.logo && (
              <img
                src={hospitalData.logo}
                alt="Hospital Logo"
                className="h-16 w-16 mr-4 object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hospitalData?.name || 'Hospital Management System'}</h1>
              <p className="text-gray-600 mt-1">{hospitalData?.address || 'Hospital Address'}</p>
            </div>
          </div>
          <p className="text-gray-600">Phone: {hospitalData?.phone || '+91-XXXXXXXXXX'} | Email: {hospitalData?.email || 'info@hospital.com'}</p>
        </div>

        {/* Document Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">DISCHARGE SUMMARY</h2>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>UHID:</strong> {patientData.uhid}</p>
              <p><strong>IPD Number:</strong> {patientData.ipdNumber}</p>
              <p><strong>Name:</strong> {patientData.patientId?.name}</p>
              <p><strong>Age:</strong> {patientData.patientId?.age} years</p>
            </div>
            <div>
              <p><strong>Gender:</strong> {patientData.patientId?.gender}</p>
              <p><strong>Phone:</strong> {patientData.patientId?.phone}</p>
              <p><strong>Address:</strong> {patientData.patientId?.address || 'N/A'}</p>
              <p><strong>Blood Group:</strong> {patientData.patientId?.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Admission Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Admission Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Admission Date:</strong> {admissionDate}</p>
              <p><strong>Discharge Date:</strong> {dischargeDate}</p>
            </div>
            <div>
              <p><strong>Doctor:</strong> {patientData.doctorId?.name}</p>
              <p><strong>Ward Type:</strong> {patientData.wardType}</p>
              <p><strong>Bed Number:</strong> {patientData.bedId?.bedNumber}</p>
            </div>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Clinical Summary</h3>

          <div className="space-y-3">
            <div>
              <strong>Reason for Admission:</strong>
              <p className="mt-1 text-gray-700">{summaryData.reasonForAdmission || 'N/A'}</p>
            </div>

            <div>
              <strong>Diagnosis:</strong>
              <p className="mt-1 text-gray-700">{summaryData.diagnosis || 'N/A'}</p>
            </div>

            <div>
              <strong>Significant Findings:</strong>
              <p className="mt-1 text-gray-700">{summaryData.significantFindings || 'N/A'}</p>
            </div>

            <div>
              <strong>Investigations:</strong>
              <p className="mt-1 text-gray-700">{summaryData.investigations || 'N/A'}</p>
            </div>

            <div>
              <strong>Procedures:</strong>
              <p className="mt-1 text-gray-700">{summaryData.procedures || 'N/A'}</p>
            </div>

            <div>
              <strong>Treatment Given:</strong>
              <p className="mt-1 text-gray-700">{summaryData.treatmentGiven || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Condition at Discharge */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Condition at Discharge</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong>Condition:</strong>
              <p className="mt-1 text-gray-700">{summaryData.conditionAtDischarge?.condition || 'N/A'}</p>
            </div>
            <div>
              <strong>Blood Pressure:</strong>
              <p className="mt-1 text-gray-700">{summaryData.conditionAtDischarge?.bp || 'N/A'}</p>
            </div>
            <div>
              <strong>SpO2:</strong>
              <p className="mt-1 text-gray-700">{summaryData.conditionAtDischarge?.spo2 || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Discharge Medicines */}
        {summaryData.medicines && summaryData.medicines.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Discharge Medicines</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Medicine Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Dose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Frequency</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{medicine.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{medicine.dose}</td>
                    <td className="border border-gray-300 px-4 py-2">{medicine.frequency}</td>
                    <td className="border border-gray-300 px-4 py-2">{medicine.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Instructions and Advice */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-300">Instructions & Follow-up</h3>

          <div className="space-y-3">
            <div>
              <strong>Instructions:</strong>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{summaryData.instructions || 'N/A'}</p>
            </div>

            <div>
              <strong>Follow-up Advice:</strong>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{summaryData.followUpAdvice || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Doctor Signature */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold">Doctor's Signature</p>
              <div className="mt-8 border-b border-gray-400 w-48"></div>
              <p className="text-sm text-gray-600 mt-2">Dr. {patientData.doctorId?.name}</p>
              <p className="text-sm text-gray-600">{patientData.doctorId?.profile?.specialization}</p>
            </div>
            <div>
              <p className="font-semibold">Date</p>
              <div className="mt-8 border-b border-gray-400 w-48"></div>
              <p className="text-sm text-gray-600 mt-2">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a computer generated discharge summary</p>
        </div>
      </div>
    </div>
  );
};