import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button } from '../../components/common';
import { SUBSCRIPTION_PLANS, HOSPITAL_STATUS } from '../../utils/constants';
import { toast } from 'react-toastify';

export const CreateHospitalPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
    {
      name: '',
      address: '',
      phone: '',
      email: '',
      subscriptionPlan: 'FREE',
      status: 'ACTIVE',
    },
    async (formValues) => {
      try {
        
        
        // Validation
        const newErrors = {};
        if (!formValues.name) newErrors.name = 'Hospital name is required';
        if (!formValues.address) newErrors.address = 'Address is required';
        if (!formValues.phone) newErrors.phone = 'Phone is required';
        if (!formValues.email) newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        await superAdminService.createHospital(formValues);
        toast.success('Hospital created successfully!');
        resetForm();
        setTimeout(() => navigate('/superadmin/hospitals'), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create hospital');
      }
    }
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Hospital</h1>
        <p className="text-gray-600 mt-2">Add a new hospital to the system</p>
      </div>

      

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Hospital Name"
            type="text"
            name="name"
            placeholder="Enter hospital name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            touched={touched.name}
            required
          />

          <FormInput
            label="Address"
            type="text"
            name="address"
            placeholder="Enter hospital address"
            value={values.address}
            onChange={handleChange}
            error={errors.address}
            touched={touched.address}
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

          <FormSelect
            label="Subscription Plan"
            name="subscriptionPlan"
            options={SUBSCRIPTION_PLANS}
            value={values.subscriptionPlan}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Status"
            name="status"
            options={HOSPITAL_STATUS}
            value={values.status}
            onChange={handleChange}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create Hospital
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/superadmin')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
