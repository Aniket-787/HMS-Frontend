import { Link } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { adminService } from '../services/apiServices';

export const Navbar = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    if (user?.hospitalId) {
      fetchHospitalData();
    } else {
      console.warn('No hospitalId in user:', user);
    }
  }, [user?.hospitalId]);

  const fetchHospitalData = async () => {
    try {
      const response = await adminService.getHospital();
      if (response.data && response.data.hospital) {
        setHospital(response.data.hospital);
      } else {
        console.error('Invalid hospital response:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch hospital data:', error.response?.data || error.message);
      setHospital(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Hospital Logo and Name */}
          {hospital && (
            <div className="flex items-center gap-3">
              {hospital.logo && (
                <img
                  src={hospital.logo}
                  alt="Hospital Logo"
                  className="h-10 w-10 object-contain rounded-lg border border-gray-200"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-lg font-bold text-gray-900">{hospital.name}</p>
                <p className="text-xs text-gray-500">{hospital.address}</p>
              </div>
              <div className="sm:hidden">
                <p className="text-base font-bold text-gray-900">{hospital.name}</p>
              </div>
            </div>
          )}
          
          {!hospital && (
            <Link to="/" className="text-2xl font-bold text-primary-600">
              HMS
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/about" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            About Us
          </Link>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-600">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
