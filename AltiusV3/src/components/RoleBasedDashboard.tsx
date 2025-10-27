import React from 'react';
import { useAuthStore } from '../stores/authStore';
import StudentDashboard from '../pages/dashboards/StudentDashboard';
import TeacherDashboard from '../pages/dashboards/TeacherDashboard';
import ParentDashboard from '../pages/dashboards/ParentDashboard';
import CoordinatorDashboard from '../pages/dashboards/CoordinatorDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import SecretaryDashboard from '../pages/dashboards/SecretaryDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso no autorizado
          </h2>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder al dashboard
          </p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    
    case 'teacher':
      return <TeacherDashboard />;
    
    case 'parent':
      return <ParentDashboard />;
    
    case 'coordinator':
      return <CoordinatorDashboard />;
    
    case 'admin':
    case 'super_admin':
      return <AdminDashboard />;
    
    case 'secretary':
      return <SecretaryDashboard />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Rol no reconocido
            </h2>
            <p className="text-gray-600">
              Tu rol ({user.role}) no tiene un dashboard asignado
            </p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;