import React from 'react';
import { useAuthStore } from '../stores/authStore';
import StudentDashboard from '../pages/dashboards/StudentDashboard';
import TeacherDashboard from '../pages/dashboards/TeacherDashboard';
import CoordinatorDashboard from '../pages/dashboards/CoordinatorDashboard';
import ParentDashboard from '../pages/dashboards/ParentDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import SecretaryDashboard from '../pages/dashboards/SecretaryDashboard';
import { Card, CardContent } from './ui/Card';
import { AlertCircle } from 'lucide-react';

const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600">
              No se encontró información del usuario. Por favor inicia sesión nuevamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const normalizedRole = user.role?.toLowerCase();

  switch (normalizedRole) {
    case 'student':
    case 'estudiante':
      return <StudentDashboard />;
    case 'teacher':
    case 'profesor':
      return <TeacherDashboard />;
    case 'coordinator':
    case 'coordinador':
      return <CoordinatorDashboard />;
    case 'parent':
    case 'padre':
      return <ParentDashboard />;
    case 'secretary':
    case 'secretaria':
      return <SecretaryDashboard />;
    case 'admin':
    case 'administrador':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rol No Reconocido
              </h2>
              <p className="text-gray-600 mb-4">
                El rol "{user.role}" no tiene un dashboard asignado.
              </p>
              <div className="text-sm text-gray-500">
                <p>Usuario: {user.firstName} {user.lastName}</p>
                <p>Email: {user.email}</p>
                <p>Rol: {user.role}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }
};

export default DashboardRouter;