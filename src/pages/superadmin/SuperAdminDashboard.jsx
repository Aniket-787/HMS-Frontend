import { useNavigate } from 'react-router-dom';
import { Plus, Users, Building2, Upload } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useState, useEffect } from 'react';
import {superAdminService} from '../../services/apiServices'
export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
   const [hospitals, setHospitals] = useState([]);
   const [admins, setAdmins] = useState([]);
   const [staff, setStaff] = useState([]);
   const [patients, setPatients] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
   useEffect(() => {
  fetchHospitals();
  fetchAdmins();
  fetchStaff();
  fetchPatients();
}, []);

    const fetchAdmins = async () => {
  try {
    const response = await superAdminService.getAllAdmins();
    setAdmins(response.data.admins || []);
  } catch (err) {
    console.error(err);
  }
};

const fetchStaff = async () => {
  try {
    const response = await superAdminService.getAllStaff();
    setStaff(response.data.staff || []);
  } catch (err) {
    console.error(err);
  }
};

const fetchPatients = async () => {
  try {
    const response = await superAdminService.getAllpatients();
    
    setPatients(response.data.patients || []);
  } catch (err) {
    console.error(err);
  }
};
  
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await superAdminService.getAllHospitals(); 
        console.log(response);
           
       setHospitals(response.data.hospitals || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch hospitals');
      } finally {
        setLoading(false);
      }
    };

    

  const quickActions = [
    {
      icon: Building2,
      label: 'Create Hospital',
      description: 'Add a new hospital to the system',
      onClick: () => navigate('/superadmin/create-hospital'),
      color: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Create Admin',
      description: 'Add a new admin for a hospital',
      onClick: () => navigate('/superadmin/create-admin'),
      color: 'text-green-600',
    },
    {
      icon: Upload,
      label: 'Upload Logo',
      description: 'Upload or update hospital logo',
      onClick: () => setShowLogoModal(true),
      color: 'text-purple-600',
    },
  ];

  const handleLogoUpload = async () => {
    if (!selectedHospital || !logoFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', logoFile);
      formData.append('hospitalId', selectedHospital._id);

      await superAdminService.uploadHospitalLogo(formData);
      setShowLogoModal(false);
      setSelectedHospital(null);
      setLogoFile(null);
      // Refresh hospitals data
      fetchHospitals();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage hospitals and system administrators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-blue-600">{hospitals.length}</p>
          <p className="text-gray-600 mt-1">Total Hospitals</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-600">{admins.length}</p>
          <p className="text-gray-600 mt-1">Active Admins</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-purple-600">{staff.length-1}</p>
          <p className="text-gray-600 mt-1">Total Staff</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-orange-600">{patients.length}</p>
          <p className="text-gray-600 mt-1">Total Patients</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.label} className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${action.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={action.onClick}
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <Button
          variant="primary"
          onClick={() => window.location.href = '/superadmin/hospitals'}
        >
          View All Hospitals
        </Button>
      </div>

      {/* Logo Upload Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Hospital Logo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Hospital
                </label>
                <select
                  className="input-field"
                  value={selectedHospital?._id || ''}
                  onChange={(e) => {
                    const hospital = hospitals.find(h => h._id === e.target.value);
                    setSelectedHospital(hospital);
                  }}
                >
                  <option value="">Choose a hospital...</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="input-field"
                />
              </div>

              {logoFile && (
                <div className="text-sm text-gray-600">
                  Selected: {logoFile.name}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowLogoModal(false);
                  setSelectedHospital(null);
                  setLogoFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleLogoUpload}
                loading={uploading}
                disabled={!selectedHospital || !logoFile}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
