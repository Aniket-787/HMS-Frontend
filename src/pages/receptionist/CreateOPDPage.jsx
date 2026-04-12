import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService, adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert, Loading } from '../../components/common';

export const CreateOPDPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [doctorsRes, patientsRes] = await Promise.all([
        receptionistService.getDoctors(),
        receptionistService.getPatientList(),
      ]);
      setDoctors(doctorsRes.data.doctors || []);
      setPatients(patientsRes.data.patientlist || []);
    } catch (error) {
      setErrorMessage('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
    {
      patientId: '',
      doctorId: '',
      symptoms: '',
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

        await receptionistService.createOPD(formValues);
        setSuccessMessage('OPD created successfully!');
        resetForm();
        setTimeout(() => navigate('/receptionist'), 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create OPD');
      }
    }
  );

  if (loadingData) {
    return <Loading />;
  }

  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: `Dr. ${doc.name} (${doc.profile?.specialization})`,
  }));

  const patientOptions = patients.map((pat) => ({
    value: pat._id,
    label: `${pat.name} (${pat.phone})`,
  }));

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
          <FormSelect
            label="Patient"
            name="patientId"
            options={patientOptions}
            value={values.patientId}
            onChange={handleChange}
            error={errors.patientId}
            touched={touched.patientId}
            required
          />

          <FormSelect
            label="Doctor"
            name="doctorId"
            options={doctorOptions}
            value={values.doctorId}
            onChange={handleChange}
            error={errors.doctorId}
            touched={touched.doctorId}
            required
          />

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
    </div>
  );
};
