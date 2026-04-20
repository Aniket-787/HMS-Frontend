import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import { FormInput, Button } from '../components/common';
import { Heart, Activity, Users, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } =
    useForm({ email: '', password: '' }, async (values) => {
      
      
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
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    });

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-12 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-10 h-10 fill-current" />
              <h1 className="text-4xl font-bold">HealthHub</h1>
            </div>
            <p className="text-blue-100 text-lg">Hospital Management System</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Patient Management</h3>
                <p className="text-blue-100">Efficiently manage patient records and medical history</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Stethoscope className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Doctor Dashboard</h3>
                <p className="text-blue-100">Comprehensive tools for OPD and IPD patient care</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Multi-Role Access</h3>
                <p className="text-blue-100">Role-based access for Admin, Doctor, and Receptionist</p>
              </div>
            </div>
          </div>

          <p className="text-blue-100 text-sm">© 2026 HealthHub. All rights reserved. <Link to="/about" className="text-blue-200 hover:text-white underline">About Us</Link></p>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-8 h-8 text-blue-600 fill-current" />
                <h1 className="text-3xl font-bold text-gray-900">HealthHub</h1>
              </div>
              <p className="text-gray-600">Hospital Management System</p>
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <FormInput
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  touched={touched.email}
                  required
                />
              </div>

              <div>
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
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                className="w-full py-3 mt-6"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-semibold mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-600 mb-1"><span className="font-medium">Admin:</span> admin@hospital.com / password</p>
              <p className="text-xs text-gray-600 mb-1"><span className="font-medium">Doctor:</span> doctor@hospital.com / password</p>
              <p className="text-xs text-gray-600"><span className="font-medium">Receptionist:</span> receptionist@hospital.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
