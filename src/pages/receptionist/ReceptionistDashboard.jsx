import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Users, FileText, Bed, DollarSign, TrendingUp, Activity, BarChart3, Phone } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { receptionistService, doctorService } from '../../services/apiServices';
import { useEffect, useState } from 'react';

export const ReceptionistDashboard = () => {

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setpatients] = useState([]);
  const [opd, setOPD] = useState([])
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

  const navigate = useNavigate();

   useEffect(() => {
       fetchPendingAppointmnets();
       fetchDoctors();
       fetchOPD();
       fetchpatients();
       fetchAdmittedPatients();
       calculateTodayRevenue();
     
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

    const fetchAdmittedPatients = async () => {
      try {
        const response = await doctorService.getAdmittedPatients();
        setAdmittedPatients(response.data.patients || []);
      } catch (err) {
        console.error(err);
      }
    };

    const calculateTodayRevenue = () => {
      const revenue = opd.reduce((total, appointment) => total + (appointment.amount || 0), 0);
      setTodayRevenue(revenue);
    };



  const quickActions = [
    {
      icon: Users,
      label: 'Register Patient',
      description: 'Add a new patient to the system',
      onClick: () => navigate('/receptionist/register-patient'),
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Create OPD',
      description: 'Create an OPD appointment',
      onClick: () => navigate('/receptionist/create-opd'),
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: FileText,
      label: 'IPD Consent',
      description: 'Open IPD consent forms for admitted patients',
      onClick: () => navigate('/receptionist/ipd'),
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Phone,
      label: 'Search Patient',
      description: 'Find existing patient by phone',
      onClick: () => navigate('/receptionist/search-patient'),
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Receptionist Dashboard</h1>
        <p className="text-gray-600">Manage patients and OPD appointments efficiently</p>
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
          <p className="text-xs text-gray-600 mt-2">Registered in system</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm">Today's OPD</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{opd.length}</p>
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

      {/* Pending Appointments & Doctors Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="bg-white border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Pending Appointments</h3>
            <p className="text-sm text-gray-600">Waiting for consultation</p>
          </div>
          <div className="space-y-2">
            {appointments.slice(0, 5).map((apt) => (
              <div key={apt._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{apt.patientId?.name || 'Unknown Patient'}</span>
                  <span className="text-xs text-gray-500">UHID: {apt.patientId?.uhid || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary-600">Token #{apt.tokenNumber}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">No pending appointments</p>
            )}
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Available Doctors</h3>
            <p className="text-sm text-gray-600">Ready for consultations</p>
          </div>
          <div className="space-y-2">
            {doctors.slice(0, 5).map((doctor) => (
              <div key={doctor._id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Dr. {doctor.name}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
            ))}
            {doctors.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">No doctors available</p>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-indigo-600">~15 min</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Today's Efficiency</p>
              <p className="text-2xl font-bold text-green-600">94%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Patient Feedback</p>
              <p className="text-2xl font-bold text-blue-600">4.5/5 ⭐</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* View OPD List Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => navigate('/receptionist/opd-list')}
          size="lg"
        >
          View Today's OPD List
        </Button>
      </div>
    </div>
  );
};
