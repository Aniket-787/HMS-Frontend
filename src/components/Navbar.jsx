import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search, X, User, Phone, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { adminService, receptionistService } from '../services/apiServices';
import { ROLES } from '../utils/constants';

export const Navbar = ({ onSidebarToggle }) => {
  const { user, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  
  // Global patient search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  // Show search for receptionist and doctor roles
  const showSearch = userRole === ROLES.RECEPTIONIST || userRole === ROLES.DOCTOR;

  useEffect(() => {
    if (user?.hospitalId) {
      fetchHospitalData();
    } else {
      console.warn('No hospitalId in user:', user);
    }
  }, [user?.hospitalId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3 && searchOpen) {
        searchPatients(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const searchPatients = async (query) => {
    try {
      setSearching(true);
      
      // Try searching by phone first
      try {
        const response = await receptionistService.searchPatient(query);
        if (response.data.patient) {
          setSearchResults([response.data.patient]);
          setSearching(false);
          return;
        }
      } catch (phoneSearchError) {
        // Continue to patient list search
      }

      // If not found by phone, try searching in patient list
      try {
        const allPatientsResponse = await receptionistService.getPatientList();
        const patients = allPatientsResponse.data.patientlist || [];
        const filteredPatients = patients.filter(patient =>
          patient.uhid.toLowerCase().includes(query.toLowerCase()) ||
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.phone.includes(query)
        );
        setSearchResults(filteredPatients.slice(0, 5));
      } catch (listSearchError) {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    
    // Navigate to create visit with patient data
    navigate('/receptionist/create-visit', { state: { patient } });
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

        <div className="flex items-center gap-4">
          {/* Global Patient Search */}
          {showSearch && (
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient..."
                  className="pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40 focus:w-56 transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>

              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Search Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute z-50 top-full right-0 w-72 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto mt-1">
                  {searchResults.map((patient) => (
                    <div
                      key={patient._id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{patient.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {patient.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {patient.uhid}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchOpen && searchResults.length === 0 && !searching && searchTerm.length >= 3 && (
                <div className="absolute z-50 top-full right-0 w-72 bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                  <div className="px-4 py-3 text-gray-500 text-sm text-center">
                    No patients found
                  </div>
                </div>
              )}
            </div>
          )}

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
