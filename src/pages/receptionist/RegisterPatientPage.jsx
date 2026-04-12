import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert } from '../../components/common';
import { GENDER_OPTIONS } from '../../utils/constants';

export const RegisterPatientPage = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
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
      try {
        setErrorMessage('');
        
        const newErrors = {};
        if (!formValues.name) newErrors.name = 'Name is required';
        if (!formValues.phone) newErrors.phone = 'Phone is required';
        if (!formValues.age) newErrors.age = 'Age is required';
        if (!formValues.gender) newErrors.gender = 'Gender is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        await receptionistService.registerPatient({
          ...formValues,
          age: parseInt(formValues.age),
        });
        setSuccessMessage('Patient registered successfully!');
        resetForm();
        setTimeout(() => navigate('/receptionist'), 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to register patient');
      }
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register Patient</h1>
        <p className="text-gray-600 mt-2">Add a new patient to the system</p>
      </div>

      {errorMessage && (
        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name"
              type="text"
              name="name"
              placeholder="Enter patient name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              touched={touched.name}
              required
            />

            <FormInput
              label="Phone"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={values.phone}
              onChange={handleChange}
              error={errors.phone}
              touched={touched.phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Age"
              type="number"
              name="age"
              placeholder="Enter age"
              value={values.age}
              onChange={handleChange}
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
              error={errors.gender}
              touched={touched.gender}
              required
            />
          </div>

          <FormInput
            label="Address"
            type="text"
            name="address"
            placeholder="Enter address"
            value={values.address}
            onChange={handleChange}
          />

          <FormInput
            label="Blood Group"
            type="text"
            name="bloodGroup"
            placeholder="e.g., O+, A-, B+"
            value={values.bloodGroup}
            onChange={handleChange}
          />

          <FormInput
            label="Allergies"
            type="text"
            name="allergies"
            placeholder="Enter any known allergies"
            value={values.allergies}
            onChange={handleChange}
          />

          <FormInput
            label="Emergency Contact"
            type="tel"
            name="emergencyContact"
            placeholder="Enter emergency contact number"
            value={values.emergencyContact}
            onChange={handleChange}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Register Patient
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
