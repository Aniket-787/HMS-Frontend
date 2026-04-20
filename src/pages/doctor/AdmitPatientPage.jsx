import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, FormTextarea, Button, Loading, Card, ErrorAlert } from '../../components/common';
import { PatientSearch } from '../../components/PatientSearch';
import { toast } from 'react-toastify';

const WARD_TYPES = [
  { value: 'GENERAL', label: 'General Ward' },
  { value: 'PRIVATE', label: 'Private Ward' },
  { value: 'ICU', label: 'ICU' }
];

export const AdmitPatientPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const doctorsRes = await receptionistService.getDoctors();
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const validate = (values, patient) => {
    const newErrors = {};
    if (!patient) newErrors.patientId = 'Select a patient to admit';
    if (!values.doctorId) newErrors.doctorId = 'Doctor selection is required';
    if (!values.wardType) newErrors.wardType = 'Ward type is required';
    if (!values.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (values.isInsured === 'YES') {
      if (!values.InsuranceNo.trim()) newErrors.InsuranceNo = 'Insurance number is required';
      if (!values.policyNo.trim()) newErrors.policyNo = 'Policy number is required';
    }
    return newErrors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
  } = useForm(
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
      const validationErrors = validate(formValues, selectedPatient);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      try {
        setSubmitError('');
        const submitData = {
          ...formValues,
          patientId: selectedPatient._id,
        };

        if (formValues.isInsured === 'NO') {
          delete submitData.InsuranceNo;
          delete submitData.policyNo;
        }

        await doctorService.admitPatient(submitData);
        toast.success('Patient admitted to IPD successfully!');
        resetForm();
        setSelectedPatient(null);
        setTimeout(() => navigate('/doctor/my-patients'), 2000);
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to admit patient';
        setSubmitError(message);
        toast.error(message);
      }
    }
  );

  const handleFieldBlur = (event) => {
    handleBlur(event);
    setErrors(validate({
      ...values,
      [event.target.name]: event.target.value,
    }, selectedPatient));
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    if (submitError) setSubmitError('');
    if (errors.patientId) {
      setErrors({ ...errors, patientId: '' });
    }
  };

  if (loadingData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900">Admit Patient to IPD</h1>
          <p className="text-slate-600 mt-2">Search an existing patient and complete the admission form.</p>
        </div>

        <Card className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <PatientSearch
                onPatientSelect={handlePatientSelect}
                placeholder="Search patient by phone number, UHID, or name..."
              />
              {errors.patientId && (
                <p className="text-sm text-red-600">{errors.patientId}</p>
              )}
            </div>

            {selectedPatient ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Selected Patient</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="text-base font-semibold text-slate-900">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-base font-semibold text-slate-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">UHID</p>
                    <p className="text-base font-semibold text-slate-900">{selectedPatient.uhid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Age / Gender</p>
                    <p className="text-base font-semibold text-slate-900">{selectedPatient.age || 'N/A'} · {selectedPatient.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-amber-50 border border-amber-200 p-4 text-amber-700">
                Please select a patient before submitting the admission form.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Doctor"
                name="doctorId"
                options={doctors.map((doc) => ({
                  value: doc._id,
                  label: `Dr. ${doc.name} (${doc.profile?.specialization || 'General'})`,
                }))}
                value={values.doctorId}
                onChange={handleChange}
                onBlur={handleFieldBlur}
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
                onBlur={handleFieldBlur}
                error={errors.wardType}
                touched={touched.wardType}
                required
              />
            </div>

            <FormTextarea
              label="Diagnosis"
              name="diagnosis"
              placeholder="Enter admission diagnosis"
              value={values.diagnosis}
              onChange={handleChange}
              onBlur={handleFieldBlur}
              error={errors.diagnosis}
              touched={touched.diagnosis}
              required
            />

            <FormTextarea
              label="Notes"
              name="notes"
              placeholder="Enter admission notes"
              value={values.notes}
              onChange={handleChange}
            />

            <FormSelect
              label="Insurance"
              name="isInsured"
              options={[
                { value: 'NO', label: 'No' },
                { value: 'YES', label: 'Yes' },
              ]}
              value={values.isInsured}
              onChange={handleChange}
            />

            {values.isInsured === 'YES' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Insurance Number"
                  type="text"
                  name="InsuranceNo"
                  placeholder="Enter insurance number"
                  value={values.InsuranceNo}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.InsuranceNo}
                  touched={touched.InsuranceNo}
                  required
                />
                <FormInput
                  label="Policy Number"
                  type="text"
                  name="policyNo"
                  placeholder="Enter policy number"
                  value={values.policyNo}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.policyNo}
                  touched={touched.policyNo}
                  required
                />
              </div>
            )}

            <FormInput
              label="Compliment To"
              type="text"
              name="complimentTo"
              placeholder="Enter compliment details if any"
              value={values.complimentTo}
              onChange={handleChange}
            />

            {submitError && <ErrorAlert message={submitError} onClose={() => setSubmitError('')} />}

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button type="button" variant="secondary" onClick={() => navigate('/doctor')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={!selectedPatient}
              >
                Admit Patient
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};