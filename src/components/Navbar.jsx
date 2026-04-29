import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search, X, User, Phone, Hash, Bell, Settings, HelpCircle, Building2, ChevronDown, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { adminService, receptionistService, notificationService } from '../services/apiServices';
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

  // User dropdown state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show search for receptionist and doctor roles
  const showSearch = userRole === ROLES.RECEPTIONIST || userRole === ROLES.DOCTOR;

  useEffect(() => {
    if (user?.hospitalId) {
      fetchHospitalData();
    } else {
      console.warn('No hospitalId in user:', user);
    }
  }, [user?.hospitalId]);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
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

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 10 });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // Navigate to action link if available
    if (notification.actionLink) {
      navigate(notification.actionLink);
    }
    
    setNotificationsOpen(false);
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

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    const roleNames = {
      [ROLES.SUPER_ADMIN]: 'Super Admin',
      [ROLES.ADMIN]: 'Administrator',
      [ROLES.DOCTOR]: 'Doctor',
      [ROLES.RECEPTIONIST]: 'Receptionist',
    };
    return roleNames[role] || role;
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      APPOINTMENT_REQUEST: '📅',
      OPD_CREATED: '🩺',
      IPD_ADMITTED: '🏥',
      FEEDBACK_SUBMITTED: '💬',
      PATIENT_ASSIGNED: '👤',
      APPROVED: '✅',
      SYSTEM: '⚙️',
      PAYMENT: '💰',
    };
    return icons[type] || '🔔';
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Top decorative line */}
      <div className="h-0.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Menu + Branding */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={onSidebarToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Hospital Logo and Name */}
            {hospital && (
              <div className="flex items-center gap-3">
                {hospital.logo ? (
                  <div className="relative group">
                    <img
                      src={hospital.logo}
                      alt="Hospital Logo"
                      className="h-10 w-10 object-contain rounded-xl border-2 border-gray-100 shadow-sm group-hover:border-primary-200 group-hover:shadow-md transition-all duration-200"
                    />
                    <div className="absolute inset-0 rounded-xl bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors duration-200"></div>
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-base font-bold text-gray-900 leading-tight">{hospital.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{hospital.address}</p>
                </div>
                <div className="sm:hidden">
                  <p className="text-sm font-bold text-gray-900">{hospital.name}</p>
                </div>
              </div>
            )}
            
            {!hospital && (
              <Link to="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  HMS
                </span>
              </Link>
            )}
          </div>

          {/* Center Section: Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8" ref={searchRef}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name, phone, or UHID..."
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
                {searchTerm ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                ) : (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
                      ⌘K
                    </kbd>
                  </div>
                )}

                {searching && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search Results
                    </p>
                    {searchResults.map((patient) => (
                      <div
                        key={patient._id}
                        className="px-3 py-3 hover:bg-primary-50 cursor-pointer rounded-lg transition-colors group"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0 group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{patient.name}</div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
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
                </div>
              )}

              {searchOpen && searchResults.length === 0 && !searching && searchTerm.length >= 3 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                  <div className="text-center text-gray-500 text-sm">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No patients found</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching with a different term</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Section: Actions + User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            {showSearch && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-primary-50 transition-colors ${
                              !notification.isRead ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                        <Link 
                          to="/notifications" 
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <Link 
                to="/settings"
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
              </Link>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-gray-200"></div>

            {/* About Us & Support Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/about" 
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                About Us
              </Link>
              <Link 
                to="/support" 
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                Support
              </Link>
            </div>

            {/* Mobile: About & Support in dropdown */}
            <div className="md:hidden relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <Link 
                    to="/about" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/support" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Support
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                {/* User Avatar */}
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-sm font-bold text-white">
                    {getUserInitials(user?.name)}
                  </span>
                </div>
                
                {/* User Info - Hidden on small screens */}
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                  <p className="text-xs text-gray-500">{getRoleDisplay(user?.role)}</p>
                </div>
                
                {/* Chevron */}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} hidden lg:block`} />
              </button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      {getRoleDisplay(user?.role)}
                    </span>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && mobileMenuOpen && (
          <div className="md:hidden pb-4" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchOpen && searchResults.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient._id}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      handlePatientClick(patient);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{patient.name}</div>
                        <div className="text-xs text-gray-500">{patient.phone} • {patient.uhid}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
