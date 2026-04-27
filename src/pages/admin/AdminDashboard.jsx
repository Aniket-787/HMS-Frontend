import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  Stethoscope,
  Bed,
  Upload,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import {
  superAdminService,
  adminService,
  doctorService
} from '../../services/apiServices';
import { useEffect, useState } from 'react';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [receptionist, setReceptionist] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    fetchReceptionist();
    fetchDoctors();
    fetchAppointments();
    fetchPatients();
    fetchAdmittedPatients();
    calculateTodayRevenue();
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const response = await adminService.getHospital();
      if (response.data.hospital) {
        setHospital(response.data.hospital);
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await adminService.getDoctors();
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReceptionist = async () => {
    try {
      const response = await adminService.getReceptionists();
      setReceptionist(response.data.receptionist || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await adminService.getAppointments();
      setAppointments(response.data.opd || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await adminService.getpatients();
      setPatients(response.data.patients || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmittedPatients = async () => {
    try {
      const response = await doctorService.getAdmittedPatients();
      setAdmittedPatients(response.data.patients || []);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTodayRevenue = () => {
    const revenue = appointments.reduce(
      (total, appointment) => total + (appointment.amount || 0),
      0
    );
    setTodayRevenue(revenue);
  };

  // 🔥 UPDATED QUICK ACTIONS WITH QR BUTTON
  const quickActions = [
    {
      icon: Stethoscope,
      label: 'Create Doctor',
      description: 'Add a new doctor to your hospital',
      onClick: () => navigate('/admin/create-doctor'),
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Create Receptionist',
      description: 'Add a new receptionist',
      onClick: () => navigate('/admin/create-receptionist'),
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Bed,
      label: 'Bed Management',
      description: 'Manage hospital beds',
      onClick: () => navigate('/admin/bed-management'),
      color: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: Upload,
      label: 'Upload Logo',
      description: 'Upload hospital branding',
      onClick: () => setShowLogoModal(true),
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: BarChart3,
      label: 'Hospital QR',
      description: 'Generate & download QR',
      onClick: () => navigate('/admin/hospital-qr'),
      color: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', logoFile);

      await superAdminService.uploadHospitalLogo(formData);
      setShowLogoModal(false);
      setLogoFile(null);
      fetchHospitalData();
    } catch (error) {
      console.error('Failed to upload logo:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* HEADER */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your hospital overview
          </p>
        </div>

        {hospital && (
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border shadow-sm">
            {hospital.logo && (
              <img
                src={hospital.logo}
                alt="Hospital"
                className="h-10 w-10 rounded"
              />
            )}
            <div>
              <p className="text-sm text-gray-600">Current Hospital</p>
              <p className="font-semibold">{hospital.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.label}
                onClick={action.onClick}
                className="cursor-pointer hover:shadow-lg transition group"
              >
                <div
                  className={`${action.color} w-14 h-14 rounded flex items-center justify-center mb-4`}
                >
                  <Icon className={`${action.iconColor} w-7 h-7`} />
                </div>

                <h3 className="font-semibold">{action.label}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>

                <div className="flex items-center text-blue-600 text-sm">
                  <span>Open</span>
                  <Plus className="w-4 h-4 ml-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* VIEW STAFF */}
      <div className="flex justify-end">
        <Button onClick={() => navigate('/admin/staff')}>
          View All Staff
        </Button>
      </div>

      {/* LOGO MODAL */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Upload Hospital Logo
            </h3>

            <input
              type="file"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />

            <div className="flex gap-2 mt-4">
              <Button onClick={handleLogoUpload} loading={uploading}>
                Upload
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowLogoModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};