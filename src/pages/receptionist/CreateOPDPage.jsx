import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService, adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, Loading, Card } from '../../components/common';
import { PatientSearch } from '../../components';
import { toast } from 'react-toastify';
import { Stethoscope, DollarSign, Clock } from 'lucide-react';

export const CreateOPDPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feeAmount, setFeeAmount] = useState(0);
  const [hospital, setHospital] = useState(null);
  const [createdBill, setCreatedBill] = useState(null);
 const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    fetchDoctors();
    fetchHospital();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingData(true);
      const doctorsRes = await receptionistService.getDoctors();
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchHospital = async () => {
    try {
      const hospitalRes = await adminService.getHospital();
      setHospital(hospitalRes.data.hospital || null);
    } catch (error) {
      // keep the page working even if hospital fetch fails
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useForm(
    {
      patientId: '',
      doctorId: '',
      symptoms: '',
      paymentStatus: 'UNPAID',
    },
    async (formValues) => {
      try {
        setErrorMessage('');

        const newErrors = {};
        if (!formValues.patientId) newErrors.patientId = 'Patient is required';
        if (!formValues.doctorId) newErrors.doctorId = 'Doctor is required';
        if (!formValues.symptoms) newErrors.symptoms = 'Symptoms are required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        const response = await receptionistService.createOPD(formValues);
        const createdOPD = response.data.OPD;
        console.log(response)
        setCreatedBill({
          ...createdOPD,
          patient: selectedPatient,
          doctor: selectedDoctor,
        });

        toast.success('OPD created successfully!');
        resetForm();
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setFeeAmount(0);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to create OPD';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    }
  );

  // 🔥 FIXED: Properly update form value
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);

    handleChange({
      target: {
        name: 'patientId',
        value: patient ? patient._id : '',
      },
    });
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;

    handleChange(e);

    const doctor = doctors.find((d) => d._id === doctorId);
    setSelectedDoctor(doctor);

    // 🔥 Fee logic
    if (doctor) {
      setFeeAmount(doctor.profile?.consultationFee || 0);
    } else {
      setFeeAmount(0);
    }
  };

  if (loadingData) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create OPD Appointment</h1>
        <p className="text-gray-600 mt-2">Register a new outpatient department appointment</p>
      </div>

      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Patient Information
                </h3>
                <PatientSearch
                  onPatientSelect={handlePatientSelect}
                  placeholder="Search patient by phone or UHID..."
                />
                {selectedPatient && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">✓ Patient Selected</p>
                    <p className="text-sm text-gray-700 mt-1"><strong>{selectedPatient.name}</strong> ({selectedPatient.uhid})</p>
                  </div>
                )}
              </div>

              {/* Doctor Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  Doctor Assignment
                </h3>
                <FormSelect
                  label="Select Doctor"
                  name="doctorId"
                  options={doctors.map((doc) => ({
                    value: doc._id,
                    label: `Dr. ${doc.name} (${doc.profile?.specialization || 'General'})`,
                  }))}
                  value={values.doctorId}
                  onChange={handleDoctorChange}
                  error={errors.doctorId}
                  touched={touched.doctorId}
                  required
                />
              </div>

              {/* Symptoms & Payment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Medical Details</h3>
                <FormInput
                  label="Symptoms"
                  type="text"
                  name="symptoms"
                  placeholder="e.g., Fever, Cough, Headache"
                  value={values.symptoms}
                  onChange={handleChange}
                  error={errors.symptoms}
                  touched={touched.symptoms}
                  required
                />
                <FormSelect
                  label="Payment Status"
                  name="paymentStatus"
                  options={[
                    { value: 'PAID', label: 'Paid' },
                    { value: 'UNPAID', label: 'Unpaid' },
                  ]}
                  value={values.paymentStatus}
                  onChange={handleChange}
                  error={errors.paymentStatus}
                  touched={touched.paymentStatus}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
                  Create OPD Appointment
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/receptionist')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Fee Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Fee Summary
            </h3>
            
            {selectedDoctor ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="font-semibold text-gray-900">Dr. {selectedDoctor.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedDoctor.profile?.specialization || 'General'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-semibold text-gray-900">₹{selectedDoctor.profile?.consultationFee || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Follow-up Fee:</span>
                    <span className="font-semibold text-gray-900">₹{selectedDoctor.profile?.followUpFee || 0}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-blue-500">
                  <p className="text-xs text-gray-600 mb-1">Amount to Charge</p>
                  <p className="text-2xl font-bold text-blue-600">₹{feeAmount}</p>
                </div>

                <div className={`p-3 rounded-lg text-sm font-medium ${
                  values.paymentStatus === 'PAID' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Payment: {values.paymentStatus === 'PAID' ? '✓ Paid' : '⏳ Unpaid'}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Select a doctor to view fee details</p>
              </div>
            )}
          </Card>

          {/* Quick Info */}
          <Card className="bg-amber-50 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-3">Important Notes</h4>
            <ul className="text-sm text-amber-800 space-y-2">
              <li className="flex gap-2">
                <span>•</span>
                <span>Ensure patient details are verified before creating OPD</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Consultation fee will be charged based on doctor's profile</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>A bill will be generated after successful creation</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {createdBill && (
        <div className="card mt-6">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #bill, #bill * {
                visibility: visible;
              }
              #bill {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 no-print">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OPD Bill</h2>
              <p className="text-sm text-gray-500">Review and print the generated bill</p>
            </div>
            <Button type="button" variant="primary" onClick={() => window.print()}>
              Print Bill
            </Button>
          </div>

          <div id="bill" className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{hospital?.name || 'Hospital Management System'}</h1>
              {hospital?.address && <p className="text-sm text-gray-600">{hospital.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <div>
                <p className="font-semibold text-gray-900">Patient Name</p>
                <p>{createdBill.patient?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">UHID</p>
                <p>{createdBill.patient?.uhid || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Doctor</p>
                <p>{createdBill.doctor?.name ? `Dr. ${createdBill.doctor.name}` : 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Date</p>
                <p>{new Date(createdBill.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-semibold text-gray-900">Symptoms</p>
              <p className="text-sm text-gray-700">{createdBill.symptoms}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">Amount</p>
                <p className="mt-2 text-lg font-bold text-gray-900">₹{createdBill.amount || 0}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">Payment Status</p>
                <span className={`inline-flex items-center rounded-full px-3 py-1 mt-2 text-sm font-semibold ${createdBill.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {createdBill.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};