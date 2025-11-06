import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import InstitutionRegistration from './pages/InstitutionRegistration';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Calendar from './pages/Calendar';
import Users from './pages/Users';
import Institutions from './pages/Institutions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import QuizSolver from './pages/QuizSolver';
import TeacherTaskManager from './pages/TeacherTaskManager';
import StudentTaskView from './pages/StudentTaskView';
import InteractiveActivities from './pages/InteractiveActivities';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import StudentManagement from './pages/StudentManagement';
import TeachersManagement from './pages/TeachersManagement';

// Scroll to top hook
import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  const { user } = useAuthStore();
  
  // Auto scroll to top on route changes
  useScrollToTop();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/change-password" 
            element={
              <PublicRoute>
                <ChangePassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/institution-registration" 
            element={
              <PublicRoute>
                <InstitutionRegistration />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Academic Routes */}
          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Subjects />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/materias" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Subjects />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignments" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tareas" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Assignments />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/grades" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Grades />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notas" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Grades />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Management Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/institutions" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'coordinator']}>
                <Layout>
                  <Institutions />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Coordinator Management */}
          <Route 
            path="/students" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <Layout>
                  <StudentManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers" 
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <Layout>
                  <TeachersManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Alias en español */}
          <Route 
            path="/instituciones" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'coordinator']}>
                <Layout>
                  <Institutions />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Super Admin Dashboard */}
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Layout>
                  <SuperAdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Reports Routes */}
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['coordinator', 'super_admin']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Settings Routes */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Interactive Activities */}
          <Route 
            path="/actividades-interactivas" 
            element={
              <ProtectedRoute>
                <Layout>
                  <InteractiveActivities />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Quiz Solver */}
          <Route 
            path="/quiz/:activityId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <QuizSolver />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Teacher Task Manager */}
          <Route 
            path="/teacher-tasks" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <Layout>
                  <TeacherTaskManager />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Student Task View */}
          <Route 
            path="/student-tasks" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Layout>
                  <StudentTaskView />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;