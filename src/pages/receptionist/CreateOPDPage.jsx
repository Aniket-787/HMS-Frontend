import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService, adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert, Loading } from '../../components/common';
import { PatientSearch } from '../../components';

export const CreateOPDPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feeAmount, setFeeAmount] = useState(0);
  const [hospital, setHospital] = useState(null);
  const [createdBill, setCreatedBill] = useState(null);

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
      setErrorMessage('Failed to load doctors');
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

        setCreatedBill({
          ...createdOPD,
          patient: selectedPatient,
          doctor: selectedDoctor,
        });

        setSuccessMessage('OPD created successfully!');
        resetForm();
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setFeeAmount(0);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create OPD');
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create OPD</h1>
        <p className="text-gray-600 mt-2">Register a patient for OPD appointment</p>
      </div>

      {errorMessage && (
        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 🔍 Patient Search */}
          <PatientSearch
            onPatientSelect={handlePatientSelect}
            placeholder="Search patient by phone or UHID..."
          />

          {/* 👨‍⚕️ Doctor Select */}
          <FormSelect
            label="Doctor"
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

          {/* 💰 Fee Display */}
          {selectedDoctor && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Doctor Fees</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="ml-2 font-medium text-blue-700">
                    ₹{selectedDoctor.profile?.consultationFee || 0}
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Follow-up Fee:</span>
                  <span className="ml-2 font-medium text-blue-700">
                    ₹{selectedDoctor.profile?.followUpFee || 0}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-blue-200">
                <span className="text-gray-700 font-medium">Amount to be charged: </span>
                <span className="text-lg font-bold text-blue-800">₹{feeAmount}</span>
              </div>
            </div>
          )}

          {/* 🩺 Symptoms */}
          <FormInput
            label="Symptoms"
            type="text"
            name="symptoms"
            placeholder="Enter patient symptoms"
            value={values.symptoms}
            onChange={handleChange}
            error={errors.symptoms}
            touched={touched.symptoms}
            required
          />

          {/* 💳 Payment Status */}
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

          {/* 🔘 Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create OPD
            </Button>

            <Button type="button" variant="secondary" onClick={() => navigate('/receptionist')}>
              Cancel
            </Button>
          </div>

        </form>
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