import React from 'react';
import { useAuthStore } from '../stores/authStore';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import CoordinatorDashboard from './dashboards/CoordinatorDashboard';
// import ParentDashboard from './dashboards/ParentDashboard'; // Rol eliminado
import AdminDashboard from './dashboards/AdminDashboard';
import { Card, CardContent } from '../components/ui/Card';
import { AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  console.log('🎯 Dashboard cargado para usuario:', user);
  console.log('👤 Rol del usuario:', user?.role);

  // Verificar que el usuario esté autenticado
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

  // Normalizar el rol para comparación (convertir a minúsculas)
  const normalizedRole = user.role?.toLowerCase();
  
  console.log('🔄 Rol normalizado:', normalizedRole);

  // Redirigir según el rol del usuario
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

    case 'super_admin':
    case 'superadmin':
    case 'superadministrador':
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

export default Dashboard;