import { useNavigate } from 'react-router-dom';
import { Plus, Users, Building2 } from 'lucide-react';
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
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage hospitals and system administrators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-4xl font-bold text-primary-600">{hospitals.length}</p>
          <p className="text-gray-600 mt-2">Total Hospitals</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-green-600">{admins.length}</p>
          <p className="text-gray-600 mt-2">Active Admins</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-blue-600">{staff.length-1}</p>
          <p className="text-gray-600 mt-2">Total Staff</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-purple-600">{patients.length}</p>
          <p className="text-gray-600 mt-2">Total Patients</p>
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
    </div>
  );
};
