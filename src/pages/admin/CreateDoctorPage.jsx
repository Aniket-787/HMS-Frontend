import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, Button } from '../../components/common';
import { toast } from 'react-toastify';

export const CreateDoctorPage = () => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      experience: '',
      consultationFee: '',   // 🔥 NEW
      followUpFee: '',       // 🔥 NEW
    },
    async (formValues) => {
      try {
        const newErrors = {};
        if (!formValues.name) newErrors.name = 'Name is required';
        if (!formValues.email) newErrors.email = 'Email is required';
        if (!formValues.password) newErrors.password = 'Password is required';
        if (!formValues.phone) newErrors.phone = 'Phone is required';
        if (!formValues.specialization) newErrors.specialization = 'Specialization is required';
        if (!formValues.experience) newErrors.experience = 'Experience is required';
        if (!formValues.consultationFee || isNaN(parseFloat(formValues.consultationFee))) {
          newErrors.consultationFee = 'Consultation fee is required and must be numeric';
        }
        if (!formValues.followUpFee || isNaN(parseFloat(formValues.followUpFee))) {
          newErrors.followUpFee = 'Follow-up fee is required and must be numeric';
        }

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        await adminService.createDoctor({
          ...formValues,
          experience: parseInt(formValues.experience),
          consultationFee: parseFloat(formValues.consultationFee),
          followUpFee: parseFloat(formValues.followUpFee),
        });

        toast.success('Doctor created successfully!');
        resetForm();
        setTimeout(() => navigate('/admin'), 2000);

      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create doctor');
      }
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Doctor</h1>
        <p className="text-gray-600 mt-2">Add a new doctor to your hospital</p>
      </div>

      

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">

          <FormInput
            label="Name"
            type="text"
            name="name"
            placeholder="Enter doctor name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
            required
          />

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

          <FormInput
            label="Specialization"
            type="text"
            name="specialization"
            placeholder="e.g., Cardiology, Orthopedics"
            value={values.specialization}
            onChange={handleChange}
            error={errors.specialization}
            touched={touched.specialization}
            required
          />

          <FormInput
            label="Experience (Years)"
            type="number"
            name="experience"
            placeholder="Enter years of experience"
            value={values.experience}
            onChange={handleChange}
            error={errors.experience}
            touched={touched.experience}
            required
          />

          {/* 💰 CONSULTATION FEE */}
          <FormInput
            label="Consultation Fee (₹)"
            type="number"
            name="consultationFee"
            placeholder="Enter consultation fee"
            value={values.consultationFee}
            onChange={handleChange}
            error={errors.consultationFee}
            touched={touched.consultationFee}
            required
          />

          {/* 💰 FOLLOW-UP FEE */}
          <FormInput
            label="Follow-up Fee (₹)"
            type="number"
            name="followUpFee"
            placeholder="Enter follow-up fee"
            value={values.followUpFee}
            onChange={handleChange}
            error={errors.followUpFee}
            touched={touched.followUpFee}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Doctor
            </Button>

            <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};