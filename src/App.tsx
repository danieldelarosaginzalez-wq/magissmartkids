
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useScrollToTop } from './hooks/useScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import ChangePassword from './pages/ChangePassword';
import InstitutionRegistration from './pages/InstitutionRegistration';
import DashboardRouter from './components/DashboardRouter';
import Subjects from './pages/Subjects';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Calendar from './pages/Calendar';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import QuizSolver from './pages/QuizSolver';
import TeacherTaskManager from './pages/TeacherTaskManager';
import StudentTaskView from './pages/StudentTaskView';
import InteractiveActivities from './pages/InteractiveActivities';
import TareasPage from './pages/TareasPage';
import MateriasPage from './pages/MateriasPage';
import NotasPage from './pages/NotasPage';
import PerfilPage from './pages/PerfilPage';

// Teacher Pages
import TeacherSubjectsPage from './pages/teacher/TeacherSubjectsPage';
import TeacherTasksPage from './pages/teacher/TeacherTasksPage';
import TeacherGradesPage from './pages/teacher/TeacherGradesPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import TeacherGradeManagementPage from './pages/TeacherGradeManagementPage';
import CoordinatorUsersPage from './pages/CoordinatorUsersPage';
import InitializationPage from './pages/InitializationPage';
import UserGeneratorPage from './pages/UserGeneratorPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ScrollToTopWrapper />
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
          path="/institution-register" 
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
                <DashboardRouter />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Student Navigation Routes */}
        <Route 
          path="/tareas" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <TareasPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/materias" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <MateriasPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notas" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <NotasPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Layout>
                <PerfilPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Subjects Routes */}
        <Route 
          path="/subjects" 
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'coordinator']}>
              <Layout>
                <Subjects />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Assignments Routes */}
        <Route 
          path="/assignments" 
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher']}>
              <Layout>
                <Assignments />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Grades Routes */}
        <Route 
          path="/grades" 
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'coordinator']}>
              <Layout>
                <Grades />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Calendar Routes */}
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'coordinator']}>
              <Layout>
                <Calendar />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Users Routes - Coordinador puede ver usuarios de su institución */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['coordinator', 'admin', 'super_admin']}>
              <CoordinatorUsersPage />
            </ProtectedRoute>
          } 
        />

        {/* Reports Routes */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['coordinator', 'admin']}>
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
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Dashboard */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Quiz Solver */}
        <Route 
          path="/quiz/:id" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <QuizSolver />
            </ProtectedRoute>
          } 
        />

        {/* Task Management Routes */}
        <Route 
          path="/teacher/tasks" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherTaskManager />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/tasks" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <StudentTaskView />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/profesor" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profesor/materias" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherSubjectsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profesor/tareas" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherTasksPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profesor/calificaciones" 
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Layout>
                <TeacherGradesPage />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Interactive Activities Routes - Módulo de actividades interactivas */}
        <Route 
          path="/actividades-interactivas" 
          element={
            <ProtectedRoute allowedRoles={['student', 'teacher', 'coordinator']}>
              <Layout>
                <InteractiveActivities />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Teacher Grade Management - Gestión de grados por profesor */}
        <Route 
          path="/gestion-grados" 
          element={
            <ProtectedRoute allowedRoles={['coordinator', 'admin', 'super_admin']}>
              <TeacherGradeManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Initialization Page - Solo para desarrollo */}
        <Route 
          path="/init" 
          element={<InitializationPage />} 
        />

        {/* User Generator Page - Generador de usuarios de prueba */}
        <Route 
          path="/generator" 
          element={<UserGeneratorPage />} 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

// Componente wrapper para el scroll automático
function ScrollToTopWrapper() {
  useScrollToTop();
  return null;
}

export default App;