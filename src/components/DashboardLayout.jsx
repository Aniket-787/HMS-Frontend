import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import {
  LayoutDashboard,
  Building2,
  Users,
  Stethoscope,
  Clock,
  Plus,
  FileText,
  Search,
  List,
} from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole } = useAuth();

  const getMenuItems = () => {
    const baseMenu = [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ];

    const roleMenus = {
      [ROLES.SUPER_ADMIN]: [
        ...baseMenu,
        { path: '/superadmin/create-hospital', label: 'Create Hospital', icon: Building2 },
        { path: '/superadmin/hospitals', label: 'View Hospitals', icon: List },
        { path: '/superadmin/create-admin', label: 'Create Admin', icon: Plus },
      ],
      [ROLES.ADMIN]: [
        ...baseMenu,
        { path: '/admin/create-doctor', label: 'Create Doctor', icon: Stethoscope },
        { path: '/admin/create-receptionist', label: 'Create Receptionist', icon: Users },
        { path: '/admin/staff', label: 'View Staff', icon: List },
      ],
      [ROLES.RECEPTIONIST]: [
        ...baseMenu,
        { path: '/receptionist/register-patient', label: 'Register Patient', icon: Users },
        { path: '/receptionist/search-patient', label: 'Search Patient', icon: Search },
        { path: '/receptionist/create-opd', label: 'Create OPD', icon: Clock },
        { path: '/receptionist/opd-list', label: "Today's OPD", icon: List },
      ],
      [ROLES.DOCTOR]: [
        ...baseMenu,
        { path: '/doctor/queue', label: "Today's Queue", icon: Clock },
      ],
    };

    return roleMenus[userRole] || baseMenu;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={getMenuItems()}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="container-wrapper">
            <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};
