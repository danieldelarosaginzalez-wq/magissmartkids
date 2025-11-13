import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent } from './ui/Card';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Roles permitidos para acceder a esta ruta
  requireAuth?: boolean; // Si requiere autenticación (por defecto true)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, token, isAuthenticated } = useAuthStore();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute - Verificando acceso:', {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    requireAuth,
    path: location.pathname
  });

  // Si no requiere autenticación, permitir acceso
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Verificar si el usuario está autenticado
  if (!isAuthenticated || !user || !token) {
    console.log('❌ Usuario no autenticado, redirigiendo al inicio');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificar si hay roles específicos requeridos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('❌ Rol no autorizado:', user.role, 'Roles permitidos:', allowedRoles);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta sección.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-700">
                  Tu rol actual: <strong>{user.role}</strong>
                </span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Roles permitidos: {allowedRoles.join(', ')}
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Volver Atrás
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ Acceso permitido para usuario:', user.email, 'con rol:', user.role);
  
  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;