import { useNavigate } from 'react-router-dom';
import { Plus, Users, Stethoscope, Bed, Upload, Clock, DollarSign, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { superAdminService, adminService, doctorService } from '../../services/apiServices';
import { useEffect, useState } from 'react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([])
  const [receptionist, setReceptionist] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
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
    const revenue = appointments.reduce((total, appointment) => total + (appointment.amount || 0), 0);
    setTodayRevenue(revenue);
  };

  const quickActions = [
    {
      icon: Stethoscope,
      label: 'Create Doctor',
      description: 'Add a new doctor to your hospital',
      onClick: () => navigate('/admin/create-doctor'),
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Create Receptionist',
      description: 'Add a new receptionist',
      onClick: () => navigate('/admin/create-receptionist'),
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Bed,
      label: 'Bed Management',
      description: 'Manage hospital beds',
      onClick: () => navigate('/admin/bed-management'),
      color: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Upload,
      label: 'Upload Logo',
      description: 'Upload hospital branding',
      onClick: () => setShowLogoModal(true),
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
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
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your hospital overview</p>
          </div>
          {hospital && (
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              {hospital.logo && (
                <img src={hospital.logo} alt="Hospital" className="h-10 w-10 object-contain rounded" />
              )}
              <div>
                <p className="text-sm text-gray-600">Current Hospital</p>
                <p className="font-semibold text-gray-900">{hospital.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-200 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm">Total Patients</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{patients.length}</p>
          <p className="text-xs text-gray-600 mt-2">Active in system</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">Today's OPD</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{appointments.length}</p>
          <p className="text-xs text-gray-600 mt-2">Active appointments</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-200 rounded-lg">
              <Bed className="w-6 h-6 text-purple-600" />
            </div>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-gray-600 text-sm">Today's IPD</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {admittedPatients.filter(patient => {
              const admissionDate = new Date(patient.admissionDate).toDateString();
              const today = new Date().toDateString();
              return admissionDate === today;
            }).length}
          </p>
          <p className="text-xs text-gray-600 mt-2">Currently admitted</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-200 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-gray-600 text-sm">Today's Revenue</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{todayRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-2">From consultations</p>
        </Card>
      </div>

      {/* Staff Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Staff Overview</h3>
            <p className="text-sm text-gray-600">Total team members</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Doctors</span>
              <span className="text-2xl font-bold text-blue-600">{doctors.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Receptionists</span>
              <span className="text-2xl font-bold text-green-600">{receptionist.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Staff</span>
              <span className="text-2xl font-bold text-purple-600">{doctors.length + receptionist.length}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hospital Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Patient Satisfaction</p>
              <div className="flex items-end gap-1">
                <p className="text-2xl font-bold text-indigo-600">4.8</p>
                <p className="text-sm text-gray-600">/5.0</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-2">System Uptime</p>
              <div className="flex items-end gap-1">
                <p className="text-2xl font-bold text-green-600">99.9</p>
                <p className="text-sm text-gray-600">%</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Avg. Response Time</p>
              <p className="text-2xl font-bold text-orange-600">&lt;2s</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Active Beds</p>
              <p className="text-2xl font-bold text-blue-600">{admittedPatients.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.label} 
                className="bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
                onClick={action.onClick}
              >
                <div className={`${action.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  <span>Get Started</span>
                  <Plus className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* View All Staff Button */}
      <div className="flex justify-end mb-8">
        <Button
          variant="primary"
          onClick={() => navigate('/admin/staff')}
          size="lg"
        >
          View All Staff
        </Button>
      </div>

      {/* Logo Upload Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Hospital Logo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Logo Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    className="hidden"
                    id="logo-input"
                  />
                  <label htmlFor="logo-input" className="cursor-pointer">
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              </div>

              {logoFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    ✓ Selected: <span className="font-semibold">{logoFile.name}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowLogoModal(false);
                  setLogoFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleLogoUpload}
                loading={uploading}
                disabled={!logoFile}
                className="flex-1"
              >
                Upload Logo
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
