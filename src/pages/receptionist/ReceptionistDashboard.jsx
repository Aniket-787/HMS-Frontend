import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Users, FileText } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { receptionistService } from '../../services/apiServices';
import { useEffect, useState } from 'react';

export const ReceptionistDashboard = () => {

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setpatients] = useState([]);
  const [opd, setOPD] = useState([])

  const navigate = useNavigate();

   useEffect(() => {
       fetchPendingAppointmnets();
       fetchDoctors();
       fetchOPD();
       fetchpatients();
     
    }, []);
    
      const fetchPendingAppointmnets = async () => {
      try {
        const response = await receptionistService.getPendingAppointments();  
        setAppointments(response.data.pending || []);
      } catch (err) {
        console.error(err);
      }
    };

      const fetchDoctors = async () => {
      try {
        const response = await receptionistService.getDoctors();  
        setDoctors(response.data.doctors || []);
      } catch (err) {
        console.error(err);
      }
    };

      const fetchpatients = async () => {
      try {
        const response = await receptionistService.getPatientList();  
        setpatients(response.data.patientlist || []);
      } catch (err) {
        console.error(err);
      }
    };

      const fetchOPD = async () => {
      try {
        const response = await receptionistService.getOPDList();  
        setOPD(response.data.OPDList || []);
      } catch (err) {
        console.error(err);
      }
    };



  const quickActions = [
    {
      icon: Users,
      label: 'Register Patient',
      description: 'Add a new patient to the system',
      onClick: () => navigate('/receptionist/register-patient'),
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Create OPD',
      description: 'Create an OPD appointment',
      onClick: () => navigate('/receptionist/create-opd'),
      color: 'text-green-600',
    },
    {
      icon: FileText,
      label: 'Search Patient',
      description: 'Find existing patient by phone',
      onClick: () => navigate('/receptionist/search-patient'),
      color: 'text-purple-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Receptionist Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage patients and OPD appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-4xl font-bold text-blue-600">{patients.length}</p>
          <p className="text-gray-600 mt-2">Total Patients</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-green-600">{opd.length}</p>
          <p className="text-gray-600 mt-2">Today's OPD</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-purple-600">{doctors.length}</p>
          <p className="text-gray-600 mt-2">Available Doctors</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-orange-600">{appointments.length}</p>
          <p className="text-gray-600 mt-2">Pending Appointments</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          onClick={() => navigate('/receptionist/opd-list')}
        >
          View Today's OPD List
        </Button>
      </div>
    </div>
  );
};
