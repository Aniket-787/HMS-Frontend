import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import { FormInput, Button, ErrorAlert } from '../components/common';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [generalError, setGeneralError] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } =
    useForm({ email: '', password: '' }, async (values) => {
      setGeneralError('');
      
      // Validation
      const newErrors = {};
      if (!values.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        newErrors.email = 'Invalid email format';
      if (!values.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        return;
      }

      const result = await login(values.email, values.password);
      if (result.success) {
        navigate('/');
      } else {
        setGeneralError(result.error);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">HMS</h1>
          <p className="text-gray-600">Hospital Management System</p>
        </div>

        {generalError && (
          <ErrorAlert
            message={generalError}
            onClose={() => setGeneralError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            touched={touched.email}
            required
          />

          <FormInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            touched={touched.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
