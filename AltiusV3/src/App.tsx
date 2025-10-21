
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

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
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
                <Dashboard />
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
            <ProtectedRoute allowedRoles={['student', 'teacher', 'coordinator', 'parent']}>
              <Layout>
                <Calendar />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Users Routes */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Users />
              </Layout>
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
                <Dashboard />
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

export default App;