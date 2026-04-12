import { useNavigate } from 'react-router-dom';
import { Plus, Users, Stethoscope } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { adminService } from '../../services/apiServices';
import { useEffect, useState } from 'react';
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([])
  const [receptionist, setReceptionist] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  useEffect(() => {
    // 
    fetchReceptionist();
    fetchDoctors();
    fetchAppointments();
    fetchPatients();
  }, []);
  
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

  const quickActions = [
    {
      icon: Stethoscope,
      label: 'Create Doctor',
      description: 'Add a new doctor to your hospital',
      onClick: () => navigate('/admin/create-doctor'),
      color: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Create Receptionist',
      description: 'Add a new receptionist to your hospital',
      onClick: () => navigate('/admin/create-receptionist'),
      color: 'text-green-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your hospital staff and operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-4xl font-bold text-blue-600">{doctors.length}</p>
          <p className="text-gray-600 mt-2">Total Doctors</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-green-600">{receptionist.length}</p>
          <p className="text-gray-600 mt-2">Total Receptionists</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-purple-600">{patients.length}</p>
          <p className="text-gray-600 mt-2">Total Patients</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-orange-600">{appointments.length}</p>
          <p className="text-gray-600 mt-2">Today's Appointments</p>
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
          onClick={() => navigate('/admin/staff')}
        >
          View All Staff
        </Button>
      </div>
    </div>
  );
};
