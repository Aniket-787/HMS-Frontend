import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, Button } from '../../components/common';
import { toast } from 'react-toastify';

export const CreateReceptionistPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
    {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
    async (formValues) => {
      try {
        const newErrors = {};
        if (!formValues.name) newErrors.name = 'Name is required';
        if (!formValues.email) newErrors.email = 'Email is required';
        if (!formValues.password) newErrors.password = 'Password is required';
        if (!formValues.phone) newErrors.phone = 'Phone is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        await adminService.createReceptionist(formValues);
        toast.success('Receptionist created successfully!');
        resetForm();
        setTimeout(() => navigate('/admin'), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create receptionist');
      }
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Receptionist</h1>
        <p className="text-gray-600 mt-2">Add a new receptionist to your hospital</p>
      </div>

      

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Name"
            type="text"
            name="name"
            placeholder="Enter receptionist name"
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

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Receptionist
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
