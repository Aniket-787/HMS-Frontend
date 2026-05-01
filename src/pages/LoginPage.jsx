import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';
import { Button } from '../components/common';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } =
    useForm({ email: '', password: '' }, async (values) => {
      const newErrors = {};

      if (!values.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        newErrors.email = 'Invalid email format';

      if (!values.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) return;

      const result = await login(values.email, values.password);

      if (result.success) {
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    });

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative bg-white px-14 py-12 border-r border-slate-200 flex-col justify-between">
          {/* subtle shapes */}
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-50 blur-3xl" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Mediflix 24
                </h1>
                <p className="text-sm text-slate-500">
                  Hospital Management System
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mt-20 max-w-xl">
              <p className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
                Smart Healthcare Platform
              </p>

              <h2 className="mt-4 text-5xl font-bold leading-tight text-slate-900">
                Efficient Hospital Operations.
                <span className="text-blue-600"> Simplified.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Manage OPD, IPD, appointments, patient records and billing with
                a clean, secure and reliable system built for hospitals.
              </p>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Building2 className="h-6 w-6 text-blue-600 mb-3" />
              <p className="font-semibold text-slate-800">Multi Department</p>
              <p className="text-sm text-slate-500 mt-1">
                OPD, IPD and billing in one system.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-blue-600 mb-3" />
              <p className="font-semibold text-slate-800">Secure Access</p>
              <p className="text-sm text-slate-500 mt-1">
                Safe login for staff and admins.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-5 sm:px-10 bg-slate-50">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">JP Health Tech</h2>
                <p className="text-xs text-slate-500">Hospital System</p>
              </div>
            </div>

            {/* heading */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please sign in to access your dashboard
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-12 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>

                <Link
                  to="#"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* submit */}
              <Button
                type="submit"
                fullWidth
                loading={isSubmitting}
                className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 shadow-md"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* footer */}
            <p className="mt-8 text-center text-xs text-slate-400">
              © 2026 JP Health Tech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};