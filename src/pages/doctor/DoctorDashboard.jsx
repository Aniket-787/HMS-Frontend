import { Clock, CheckCircle, Users, Bed, FileText, TrendingUp, Activity, BarChart3, Plus, Stethoscope } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doctorService } from '../../services/apiServices';

export const DoctorDashboard = () => {
  const [todayPatients, setTodayPatients] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState([])
  const [queue, setQueue] = useState([])
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
     fetchCompletedPatients(),
     fetchQueue(),
     fetchTotalPatients(),
     fetchtodayPatients(),
     fetchAdmittedPatients(),
     calculateTodayRevenue()
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

    const fetchAdmittedPatients = async () => {
      try {
        const response = await doctorService.getAdmittedPatients();
        setAdmittedPatients(response.data.patients || []);
      } catch (err) {
        console.error(err);
      }
    };

    const calculateTodayRevenue = async () => {
      try {
        const response = await doctorService.getTodayPatients();
        const patients = response.data.patients || [];
        const revenue = patients.reduce((total, patient) => total + (patient.amount || 0), 0);
        setTodayRevenue(revenue);
      } catch (err) {
        console.error(err);
      }
    };

  const quickActions = [
    {
      icon: Clock,
      label: "Today's Queue",
      description: 'View and manage patient queue',
      onClick: () => navigate('/doctor/queue'),
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      description: 'View completed consultations',
      onClick: () => navigate('/doctor/completed'),
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Users,
      label: 'My Patients',
      description: 'View all your registered patients',
      onClick: () => navigate('/doctor/my-patients'),
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Bed,
      label: 'Admit Patient',
      description: 'Admit patient to IPD',
      onClick: () => navigate('/doctor/admit-patient'),
      color: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Stethoscope,
      label: 'IPD Patients',
      description: 'Manage admitted patients',
      onClick: () => navigate('/doctor/ipd-patients'),
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage patient consultations and medical records</p>
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
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalPatients.length}</p>
          <p className="text-xs text-gray-600 mt-2">Under your care</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-200 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-gray-600 text-sm">Today's Queue</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{queue.length}</p>
          <p className="text-xs text-gray-600 mt-2">Waiting patients</p>
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

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">Completed Today</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedPatients.length}</p>
          <p className="text-xs text-gray-600 mt-2">Finished consultations</p>
        </Card>
      </div>

      {/* Revenue & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Today's Revenue</h3>
            <p className="text-sm text-gray-600">From consultations</p>
          </div>
          <p className="text-4xl font-bold text-indigo-600 mb-4">₹{todayRevenue.toLocaleString()}</p>
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            +12% from last week
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Patient Engagement</h3>
            <p className="text-sm text-gray-600">Weekly activity</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">OPD Consultations</span>
              <span className="text-lg font-bold text-blue-600">{queue.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">IPD Patients</span>
              <span className="text-lg font-bold text-purple-600">{admittedPatients.filter(p => {
                const admDate = new Date(p.admissionDate).toDateString();
                const today = new Date().toDateString();
                return admDate === today;
              }).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Follow-ups Pending</span>
              <span className="text-lg font-bold text-orange-600">5</span>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm text-gray-700">Avg. Consultation Time</span>
              <span className="text-sm font-semibold text-blue-600">15 min</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Patient Satisfaction</span>
              <span className="text-sm font-semibold text-green-600">4.7/5 ⭐</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="text-sm text-gray-700">Treatment Success</span>
              <span className="text-sm font-semibold text-purple-600">96%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.label}</h3>
                <p className="text-xs text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
                  <span>Open</span>
                  <Plus className="w-3 h-3" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Patient History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <Button
          variant="primary"
          onClick={() => navigate('/doctor/patient-history')}
          size="lg"
        >
          View Patient History
        </Button>
      </div>
    </div>
  );
};
