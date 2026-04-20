import { useNavigate } from 'react-router-dom';
import { receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, FormTextarea, Button } from '../../components/common';
import { GENDER_OPTIONS } from '../../utils/constants';
import { toast } from 'react-toastify';

const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const RegisterPatientPage = () => {
  const navigate = useNavigate();

  const validate = (formValues) => {
    const newErrors = {};

    if (!formValues.name.trim()) newErrors.name = 'Patient name is required';
    if (!formValues.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formValues.phone.replace(/\D/g, '')) ) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!formValues.age) {
      newErrors.age = 'Age is required';
    } else if (Number(formValues.age) <= 0) {
      newErrors.age = 'Age must be greater than zero';
    }
    if (!formValues.gender) newErrors.gender = 'Gender is required';
    if (!formValues.address.trim()) newErrors.address = 'Address is required';

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
      name: '',
      phone: '',
      age: '',
      gender: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      emergencyContact: '',
    },
    async (formValues) => {
      const newErrors = validate(formValues);
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      try {
        await receptionistService.registerPatient({
          ...formValues,
          age: parseInt(formValues.age, 10),
        });

        toast.success('Patient registered successfully!');
        resetForm();
        setTimeout(() => navigate('/receptionist'), 1400);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to register patient');
      }
    }
  );

  const handleFieldBlur = (event) => {
    handleBlur(event);
    setErrors(validate({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-10 px-4">
      <div className="max-w-5xl mx-auto mb-8">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Register Patient</h1>
          <p className="text-slate-600 mt-2 text-lg">Capture patient details quickly and keep hospital records up to date.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Enter patient full name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.name}
                  touched={touched.name}
                  required
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="Enter patient phone number"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.phone}
                  touched={touched.phone}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Age"
                  type="number"
                  name="age"
                  min="0"
                  placeholder="Enter age"
                  value={values.age}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.age}
                  touched={touched.age}
                  required
                />
                <FormSelect
                  label="Gender"
                  name="gender"
                  options={GENDER_OPTIONS}
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.gender}
                  touched={touched.gender}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700">Medical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Blood Group"
                  name="bloodGroup"
                  options={BLOOD_GROUP_OPTIONS}
                  value={values.bloodGroup}
                  onChange={handleChange}
                />
                <FormInput
                  label="Allergies"
                  type="text"
                  name="allergies"
                  placeholder="e.g. penicillin, dust"
                  value={values.allergies}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700">Contact Details</h2>
              <div className="grid grid-cols-1 gap-6">
                <FormTextarea
                  label="Address"
                  name="address"
                  placeholder="Enter address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleFieldBlur}
                  error={errors.address}
                  touched={touched.address}
                  required
                />
                <FormInput
                  label="Emergency Contact"
                  type="tel"
                  name="emergencyContact"
                  placeholder="Emergency phone number"
                  value={values.emergencyContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/receptionist')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 text-lg shadow-lg hover:scale-105 transition-transform"
            >
              Register Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
