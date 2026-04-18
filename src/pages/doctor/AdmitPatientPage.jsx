import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert, Loading } from '../../components/common';

const WARD_TYPES = [
  { value: 'GENERAL', label: 'General Ward' },
  { value: 'PRIVATE', label: 'Private Ward' },
  { value: 'ICU', label: 'ICU' }
];

export const AdmitPatientPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [patientsRes, doctorsRes] = await Promise.all([
        receptionistService.getPatientList(),
        receptionistService.getDoctors(),
      ]);
      setPatients(patientsRes.data.patientlist || []);
      setDoctors(doctorsRes.data.doctors || []);
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
      wardType: '',
      diagnosis: '',
      notes: '',
      isInsured: 'NO',
      InsuranceNo: '',
      policyNo: '',
      complimentTo: '',
    },
    async (formValues) => {
      try {
        setErrorMessage('');

        const newErrors = {};
        if (!formValues.patientId) newErrors.patientId = 'Patient is required';
        if (!formValues.doctorId) newErrors.doctorId = 'Doctor is required';
        if (!formValues.wardType) newErrors.wardType = 'Ward type is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        // Filter out empty insurance fields if not insured
        const submitData = { ...formValues };
        if (formValues.isInsured === 'NO') {
          delete submitData.InsuranceNo;
          delete submitData.policyNo;
        }

        await doctorService.admitPatient(submitData);
        setSuccessMessage('Patient admitted to IPD successfully!');
        resetForm();
        setTimeout(() => navigate('/doctor/my-patients'), 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to admit patient');
      }
    }
  );

  if (loadingData) {
    return <Loading />;
  }

  const patientOptions = patients.map((pat) => ({
    value: pat._id,
    label: `${pat.name} (${pat.phone}) - ${pat.uhid}`,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admit Patient to IPD</h1>
        <p className="text-gray-600 mt-2">Admit a patient to inpatient department</p>
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
            options={doctors.map((doc) => ({
              value: doc._id,
              label: `Dr. ${doc.name} (${doc.profile?.specialization || 'General'})`,
            }))}
            value={values.doctorId}
            onChange={handleChange}
            error={errors.doctorId}
            touched={touched.doctorId}
            required
          />

          <FormSelect
            label="Ward Type"
            name="wardType"
            options={WARD_TYPES}
            value={values.wardType}
            onChange={handleChange}
            error={errors.wardType}
            touched={touched.wardType}
            required
          />

          <FormInput
            label="Diagnosis"
            type="text"
            name="diagnosis"
            placeholder="Enter diagnosis"
            value={values.diagnosis}
            onChange={handleChange}
          />

          <FormInput
            label="Notes"
            type="text"
            name="notes"
            placeholder="Enter admission notes"
            value={values.notes}
            onChange={handleChange}
          />

          <FormSelect
            label="Is Insured"
            name="isInsured"
            options={[
              { value: 'NO', label: 'No' },
              { value: 'YES', label: 'Yes' }
            ]}
            value={values.isInsured}
            onChange={handleChange}
          />

          {values.isInsured === 'YES' && (
            <>
              <FormInput
                label="Insurance Number"
                type="text"
                name="InsuranceNo"
                placeholder="Enter insurance number"
                value={values.InsuranceNo}
                onChange={handleChange}
              />

              <FormInput
                label="Policy Number"
                type="text"
                name="policyNo"
                placeholder="Enter policy number"
                value={values.policyNo}
                onChange={handleChange}
              />
            </>
          )}

          <FormInput
            label="Compliment To"
            type="text"
            name="complimentTo"
            placeholder="Enter compliment details if any"
            value={values.complimentTo}
            onChange={handleChange}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Admit Patient
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/doctor')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};