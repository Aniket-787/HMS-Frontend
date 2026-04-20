import { useState, useEffect } from 'react';
import { analyticsService, doctorService, receptionistService } from '../../services/apiServices';
import { Card } from '../../components/common';
import { Users, Clock, Bed, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AnalyticsPage = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [last30DaysRevenue, setLast30DaysRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [todayPatients, setTodayPatients] = useState(0);
  const [todayOPD, setTodayOPD] = useState(0);
  const [todayIPD, setTodayIPD] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch revenue data
      const [todayRevRes, last30Res, dailyRes] = await Promise.all([
        analyticsService.getTodayRevenue(),
        analyticsService.getLast30DaysRevenue(),
        analyticsService.getDailyRevenue()
      ]);

      setTodayRevenue(todayRevRes.data.total || 0);
      setLast30DaysRevenue(last30Res.data.total || 0);
      setDailyRevenue(dailyRes.data.data || []);

      // Fetch patient data
      const [opdRes, ipdRes] = await Promise.all([
        receptionistService.getOPDList(),
        doctorService.getAdmittedPatients()
      ]);

      setTodayOPD(opdRes.data.OPDList?.length || 0);
      const todayIPDCount = ipdRes.data.patients?.filter(patient => {
        const admissionDate = new Date(patient.admissionDate).toDateString();
        const today = new Date().toDateString();
        return admissionDate === today;
      }).length || 0;
      setTodayIPD(todayIPDCount);
      setTodayPatients((opdRes.data.OPDList?.length || 0) + todayIPDCount);

    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = dailyRevenue.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.total
  }));

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your hospital's performance and revenue</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-blue-600">{todayPatients}</p>
          <p className="text-gray-600 mt-1">Today Patients</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-600">{todayOPD}</p>
          <p className="text-gray-600 mt-1">Today OPD</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <Bed className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-purple-600">{todayIPD}</p>
          <p className="text-gray-600 mt-1">Today IPD</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-orange-600">₹{todayRevenue}</p>
          <p className="text-gray-600 mt-1">Today Revenue</p>
        </Card>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Revenue Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-700">Today Revenue</span>
              <span className="text-2xl font-bold text-green-600">₹{todayRevenue}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-700">Last 30 Days Revenue</span>
              <span className="text-2xl font-bold text-blue-600">₹{last30DaysRevenue}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Patient Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-700">Total Patients Today</span>
              <span className="text-2xl font-bold text-blue-600">{todayPatients}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-700">OPD Visits Today</span>
              <span className="text-2xl font-bold text-green-600">{todayOPD}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <span className="font-medium text-gray-700">IPD Admissions Today</span>
              <span className="text-2xl font-bold text-purple-600">{todayIPD}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Daily Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-7)}> {/* Last 7 days */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};