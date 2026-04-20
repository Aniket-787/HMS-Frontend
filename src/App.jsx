import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { PrintableBill } from './components/PrintableBill';
import { PrintableDischargeSummary } from './components/PrintableDischargeSummary';
import { ROLES } from './utils/constants';

// Pages
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { AboutUsPage } from './pages/AboutUsPage';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { CreateHospitalPage } from './pages/superadmin/CreateHospitalPage';
import { HospitalListPage } from './pages/superadmin/HospitalListPage';
import { CreateAdminPage } from './pages/superadmin/CreateAdminPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateDoctorPage } from './pages/admin/CreateDoctorPage';
import { CreateReceptionistPage } from './pages/admin/CreateReceptionistPage';
import { StaffListPage } from './pages/admin/StaffListPage';
import { BedManagementPage } from './pages/admin/BedManagementPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';

// Receptionist Pages
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';
import { RegisterPatientPage } from './pages/receptionist/RegisterPatientPage';
import { SearchPatientPage } from './pages/receptionist/SearchPatientPage';
import { CreateOPDPage } from './pages/receptionist/CreateOPDPage';
import { OPDListPage } from './pages/receptionist/OPDListPage';
import { ReceptionistIPDPage } from './pages/receptionist/ReceptionistIPDPage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorQueuePage } from './pages/doctor/DoctorQueuePage';
import { PatientHistoryPage } from './pages/doctor/PatientHistoryPage';
import { CompletedPage } from './pages/doctor/CompletedPage';
import { MyPatientsPage } from './pages/doctor/MyPatientsPage';
import { AdmitPatientPage } from './pages/doctor/AdmitPatientPage';
import { IPDPatientsPage } from './pages/doctor/IPDPatientsPage';

const AppRoutes = () => {
  const { userRole } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/bill/:ipdId" element={<PrintableBill />} />
      <Route path="/discharge-summary/:ipdId" element={<PrintableDischargeSummary />} />

      {/* Super Admin Routes */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]}>
            <DashboardLayout>
              <SuperAdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/create-hospital"
        element={
          <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]}>
            <DashboardLayout>
              <CreateHospitalPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/hospitals"
        element={
          <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]}>
            <DashboardLayout>
              <HospitalListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/create-admin"
        element={
          <ProtectedRoute requiredRoles={[ROLES.SUPER_ADMIN]}>
            <DashboardLayout>
              <CreateAdminPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-doctor"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <CreateDoctorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-receptionist"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <CreateReceptionistPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <StaffListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bed-management"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <BedManagementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Receptionist Routes */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <ReceptionistDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/register-patient"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <RegisterPatientPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/search-patient"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <SearchPatientPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/create-opd"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <CreateOPDPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/opd-list"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <OPDListPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/ipd"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <ReceptionistIPDPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/analytics"
        element={
          <ProtectedRoute requiredRoles={[ROLES.RECEPTIONIST]}>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <DoctorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/queue"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <DoctorQueuePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/admit-patient"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <AdmitPatientPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/ipd-patients"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <IPDPatientsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patient/:patientId/history"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <PatientHistoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/completed"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <CompletedPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/my-patients"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <MyPatientsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />      <Route
        path="/doctor/analytics"
        element={
          <ProtectedRoute requiredRoles={[ROLES.DOCTOR]}>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Role-based Root Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              {userRole === ROLES.SUPER_ADMIN && <SuperAdminDashboard />}
              {userRole === ROLES.ADMIN && <AdminDashboard />}
              {userRole === ROLES.RECEPTIONIST && <ReceptionistDashboard />}
              {userRole === ROLES.DOCTOR && <DoctorDashboard />}
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
