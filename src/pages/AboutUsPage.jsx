import { Heart, Users, Zap, Award, Phone, Mail, MapPin, Activity, Bed, Stethoscope, UserCheck } from 'lucide-react';
import { Card } from '../components/common';
import { useState, useEffect } from 'react';
import { adminService } from '../services/apiServices';
import { useAuth } from '../context/AuthContext';

export const AboutUsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getHospitalStats();
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      } else {
        console.error('Invalid stats response:', response.data);
        setStats(null);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error.response?.data || error.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Activity className="w-4 h-4" />
            Healthcare Management System
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            HealthHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforming healthcare management through innovative technology solutions that empower hospitals to deliver exceptional patient care.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Heart className="w-16 h-16 text-red-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To provide healthcare institutions with a comprehensive, user-friendly Hospital Management System that streamlines operations, improves patient care quality, and enhances operational efficiency through innovative technology.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Zap className="w-16 h-16 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To be the leading healthcare management platform, enabling hospitals worldwide to deliver exceptional patient care through intelligent, efficient, and secure digital solutions.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Features */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HealthHub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare management with advanced features designed for modern hospitals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-14 h-14 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Multi-Role System</h4>
              <p className="text-gray-600">
                Tailored interfaces for Admins, Doctors, Receptionists, and Super Admins with role-specific features and permissions.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Award className="w-14 h-14 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Management</h4>
              <p className="text-gray-600">
                Handle OPD, IPD, bed management, discharge summaries, patient records, and revenue tracking in one platform.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Zap className="w-14 h-14 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Analytics</h4>
              <p className="text-gray-600">
                Monitor hospital performance with live dashboards, revenue tracking, and patient statistics.
              </p>
            </Card>
          </div>
        </div>

        {/* Real-time Statistics */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hospital Statistics</h2>
            <p className="text-lg text-gray-600">Real-time data from your healthcare facility</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="p-6 text-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-blue-600 mb-2">{stats.totalPatients}</p>
                <p className="text-gray-600 text-sm">Total Patients</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
                <Stethoscope className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-green-600 mb-2">{stats.totalDoctors}</p>
                <p className="text-gray-600 text-sm">Doctors</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
                <UserCheck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-purple-600 mb-2">{stats.totalReceptionists}</p>
                <p className="text-gray-600 text-sm">Receptionists</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                <Activity className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-orange-600 mb-2">{stats.todayOPDVisits}</p>
                <p className="text-gray-600 text-sm">Today's OPD Visits</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100">
                <Bed className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-red-600 mb-2">{stats.currentIPDPatients}</p>
                <p className="text-gray-600 text-sm">Current IPD Patients</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-teal-50 to-teal-100">
                <Bed className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-teal-600 mb-2">{stats.totalBeds}</p>
                <p className="text-gray-600 text-sm">Total Beds</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-indigo-50 to-indigo-100">
                <Bed className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-indigo-600 mb-2">{stats.availableBeds}</p>
                <p className="text-gray-600 text-sm">Available Beds</p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-pink-50 to-pink-100">
                <Activity className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <p className="text-4xl font-bold text-pink-600 mb-2">{stats.bedOccupancyRate}%</p>
                <p className="text-gray-600 text-sm">Bed Occupancy</p>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Unable to load hospital statistics</p>
            </Card>
          )}
        </div>

        {/* Core Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Users, title: "Patient Registration & Search", desc: "Quickly register new patients and search existing records with advanced filtering" },
              { icon: Activity, title: "OPD Management", desc: "Create and manage outpatient department visits and appointments with token system" },
              { icon: Bed, title: "IPD Management", desc: "Handle patient admissions, bed assignments, and discharge processes seamlessly" },
              { icon: Stethoscope, title: "Prescription Management", desc: "Create detailed prescriptions with medicines and follow-up dates" },
              { icon: Award, title: "Discharge Summaries", desc: "Generate printable discharge summaries with patient history" },
              { icon: Zap, title: "Analytics Dashboard", desc: "Track revenue, patient metrics, and hospital performance in real-time" },
              { icon: UserCheck, title: "Staff Management", desc: "Create and manage doctors and receptionists with role-based access" },
              { icon: Bed, title: "Bed Management", desc: "Efficiently manage bed allocation and availability across wards" }
            ].map((feature, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">We're here to support your healthcare management needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
              <Phone className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
                <p className="text-gray-600 font-medium">+1 (800) 123-4567</p>
                <p className="text-gray-600 text-sm">Available 24/7 for urgent support</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
              <Mail className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                <p className="text-gray-600 font-medium">support@healthhub.com</p>
                <p className="text-gray-600 text-sm">We'll respond within 2 hours</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
              <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Headquarters</h4>
                <p className="text-gray-600 font-medium">123 Healthcare Blvd</p>
                <p className="text-gray-600 text-sm">Medical City, MC 12345</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Team */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-gray-700 text-lg mb-6 max-w-3xl mx-auto">
            HealthHub is built by a dedicated team of healthcare IT professionals and software engineers committed to improving hospital operations worldwide.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">50+ Years Combined Experience</span>
          </div>
        </Card>
      </div>
    </div>
  );
};