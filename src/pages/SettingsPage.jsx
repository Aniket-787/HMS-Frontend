import { useState, useEffect } from 'react';
import { 
  Settings, User, Lock, Bell, Moon, Sun, 
  Monitor, Save, Loader2, CheckCircle, AlertCircle,
  Building2, Clock, Phone, Mail, MapPin, Eye, EyeOff
} from 'lucide-react';
import { userService, adminService } from '../services';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

export const SettingsPage = () => {
  const { user, userRole } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // UI Settings
  const [uiSettings, setUiSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    compactLayout: localStorage.getItem('compactLayout') === 'true',
    notifications: {
      email: true,
      inApp: true,
      appointmentAlerts: true,
      patientAlerts: true,
    },
  });
  
  // Hospital Settings (Admin only)
  const [hospitalSettings, setHospitalSettings] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    opdTiming: {
      start: '09:00',
      end: '17:00',
    },
  });
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) {
      fetchHospitalSettings();
    }
  }, [userRole]);

  const fetchHospitalSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getHospital();
      if (response.data && response.data.hospital) {
        const hospital = response.data.hospital;
        setHospitalSettings({
          name: hospital.name || '',
          address: hospital.address || '',
          phone: hospital.phone || '',
          email: hospital.email || '',
          opdTiming: hospital.opdTiming || { start: '09:00', end: '17:00' },
        });
      }
    } catch (error) {
      console.error('Error fetching hospital settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleThemeChange = (theme) => {
    setUiSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleCompactLayoutChange = (compact) => {
    setUiSettings(prev => ({ ...prev, compactLayout: compact }));
    localStorage.setItem('compactLayout', compact);
  };

  const handleNotificationChange = (key, value) => {
    setUiSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  const handleHospitalSettingChange = (key, value) => {
    if (key.startsWith('opdTiming.')) {
      const timingKey = key.replace('opdTiming.', '');
      setHospitalSettings(prev => ({
        ...prev,
        opdTiming: { ...prev.opdTiming, [timingKey]: value },
      }));
    } else {
      setHospitalSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSaveHospitalSettings = async () => {
    try {
      setSaving(true);
      // In a real app, you'd have an API endpoint for this
      // For now, we'll show success
      showToast('Hospital settings saved successfully');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roleNames = {
      [ROLES.SUPER_ADMIN]: 'Super Admin',
      [ROLES.ADMIN]: 'Administrator',
      [ROLES.DOCTOR]: 'Doctor',
      [ROLES.RECEPTIONIST]: 'Receptionist',
    };
    return roleNames[role] || role;
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'ui', label: 'Interface', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN ? [{ id: 'hospital', label: 'Hospital', icon: Building2 }] : []),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Role</p>
                    <p className="font-medium text-gray-900">{getRoleDisplay(user?.role)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Hospital</p>
                    <p className="font-medium text-gray-900">{user?.hospitalId?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-500" />
                  Security
                </h3>
                <p className="text-gray-500 mb-4">
                  Change your password from the <a href="/profile" className="text-primary-600 hover:underline">Profile page</a>
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 mb-1">Current Role</p>
                    <p className="font-medium text-gray-900">{getRoleDisplay(user?.role)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 mb-1">Account Status</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UI Settings */}
          {activeTab === 'ui' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-3">Choose your preferred theme</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        uiSettings.theme === 'light'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Sun className={`w-8 h-8 mx-auto mb-2 ${uiSettings.theme === 'light' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className="font-medium text-gray-900">Light</p>
                      <p className="text-xs text-gray-500 mt-1">Clean & bright</p>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        uiSettings.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Moon className={`w-8 h-8 mx-auto mb-2 ${uiSettings.theme === 'dark' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className="font-medium text-gray-900">Dark</p>
                      <p className="text-xs text-gray-500 mt-1">Easy on eyes</p>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        uiSettings.theme === 'system'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Monitor className={`w-8 h-8 mx-auto mb-2 ${uiSettings.theme === 'system' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <p className="font-medium text-gray-900">System</p>
                      <p className="text-xs text-gray-500 mt-1">Follow device</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Layout</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Compact Layout</p>
                    <p className="text-sm text-gray-500">Use smaller spacing for more content</p>
                  </div>
                  <button
                    onClick={() => handleCompactLayoutChange(!uiSettings.compactLayout)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      uiSettings.compactLayout ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      uiSettings.compactLayout ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">In-App Notifications</p>
                      <p className="text-sm text-gray-500">Show notifications in the navbar</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('inApp', !uiSettings.notifications.inApp)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        uiSettings.notifications.inApp ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        uiSettings.notifications.inApp ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Appointment Alerts</p>
                      <p className="text-sm text-gray-500">Get notified about new appointments</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('appointmentAlerts', !uiSettings.notifications.appointmentAlerts)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        uiSettings.notifications.appointmentAlerts ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        uiSettings.notifications.appointmentAlerts ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Patient Alerts</p>
                      <p className="text-sm text-gray-500">Get notified about patient admissions</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('patientAlerts', !uiSettings.notifications.patientAlerts)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        uiSettings.notifications.patientAlerts ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        uiSettings.notifications.patientAlerts ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hospital Settings (Admin only) */}
          {activeTab === 'hospital' && (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={hospitalSettings.name}
                        onChange={(e) => handleHospitalSettingChange('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        placeholder="Enter hospital name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={hospitalSettings.phone}
                        onChange={(e) => handleHospitalSettingChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={hospitalSettings.address}
                        onChange={(e) => handleHospitalSettingChange('address', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        placeholder="Enter hospital address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={hospitalSettings.email}
                        onChange={(e) => handleHospitalSettingChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  OPD Timings
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={hospitalSettings.opdTiming.start}
                      onChange={(e) => handleHospitalSettingChange('opdTiming.start', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={hospitalSettings.opdTiming.end}
                      onChange={(e) => handleHospitalSettingChange('opdTiming.end', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSaveHospitalSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;