import { Clock, CheckCircle, Users } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doctorService } from '../../services/apiServices';

export const DoctorDashboard = () => {
  const [todayPatients, setTodayPatients] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState([])
  const [queue, setQueue] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
     fetchCompletedPatients(),
     fetchQueue(),
     fetchTotalPatients(),
     fetchtodayPatients()
  }, [])
  
    const fetchTotalPatients = async () => {
      try {
        const response = await doctorService.getTotalpatients();     
        setTotalPatients(response.data.patients || []);
      } catch (err) {
        console.error(err);
      }
    };

     const fetchCompletedPatients = async () => {
      try {
        const response = await doctorService.getCompletedPatients();
        setCompletedPatients(response.data.patients || []);
      } catch (err) {
        console.error(err);
      }
    };

     const fetchtodayPatients = async () => {
      try {
        const response = await doctorService.getTodayPatients();
        setTodayPatients(response.data.patients || []);
      } catch (err) {
        console.error(err);
      }
    };

     const fetchQueue = async () => {
      try {
        const response = await doctorService.getQueue();
        setQueue(response.data.opdList || []);
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage patient consultations and medical records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <p className="text-4xl font-bold text-orange-600">{queue.length}</p>
          <p className="text-gray-600 mt-2">Today's Queue</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-green-600">{completedPatients.length}</p>
          <p className="text-gray-600 mt-2">Completed</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-blue-600">{todayPatients.length}</p>
          <p className="text-gray-600 mt-2">today's patients</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-purple-600">{totalPatients.length}</p>
          <p className="text-gray-600 mt-2">Total Patients</p>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-start gap-4">
            <div className="flex-shrink-0 text-orange-600">
              <Clock className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Today's Queue</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage patient queue</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/doctor/queue')}
              className="flex-shrink-0"
            >
              Open
            </Button>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="flex-shrink-0 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Completed</h3>
              <p className="text-sm text-gray-600 mt-1">View completed consultations</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/doctor/completed')}
              className="flex-shrink-0"
            >
              View
            </Button>
          </Card>

          <Card className="flex items-start gap-4">
            <div className="flex-shrink-0 text-blue-600">
              <Users className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">My Patients</h3>
              <p className="text-sm text-gray-600 mt-1">View all your registered patients</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/doctor/my-patients')}
              className="flex-shrink-0"
            >
              View
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
