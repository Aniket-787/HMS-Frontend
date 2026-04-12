import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, ErrorAlert, SuccessAlert } from '../../components/common';

export const CreateAdminPage = () => {
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Fetch hospitals on load
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await superAdminService.getAllHospitals();
      setHospitals(res.data.hospitals || []);
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
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
    setErrors // ⚠️ make sure your hook supports this
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      phone: '',
      hospitalId: '',
    },
    async (formValues) => {
      try {
        setErrorMessage('');
        setSuccessMessage('');

        const newErrors = {};

        if (!formValues.name) newErrors.name = 'Name is required';
        if (!formValues.email) newErrors.email = 'Email is required';
        if (!formValues.password) newErrors.password = 'Password is required';
        if (!formValues.phone) newErrors.phone = 'Phone is required';
        if (!formValues.hospitalId) newErrors.hospitalId = 'Hospital is required';

        // ✅ set errors properly
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }

        await superAdminService.createAdmin(formValues);

        setSuccessMessage('Admin created successfully!');
        resetForm();

        setTimeout(() => {
          navigate('/superadmin');
        }, 2000);

      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Failed to create admin');
      }
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Admin</h1>
        <p className="text-gray-600 mt-2">Add a new admin for a hospital</p>
      </div>

      {errorMessage && (
        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <FormInput
            label="Name"
            type="text"
            name="name"
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
            required
          />

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            touched={touched.email}
            required
          />

          {/* Password */}
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            touched={touched.password}
            required
          />

          {/* Phone */}
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

          {/* 🔥 Hospital Select (IMPORTANT FIX) */}
          <FormSelect
            label="Select Hospital"
            name="hospitalId"
            value={values.hospitalId}
            onChange={handleChange}
            options={hospitals.map((h) => ({
              label: h.name,
              value: h._id,
            }))}
            error={errors.hospitalId}
            touched={touched.hospitalId}
            required
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Admin
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/superadmin')}
            >
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};