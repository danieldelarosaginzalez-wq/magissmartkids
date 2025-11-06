// Utilidades para manejo de roles
import type { UserRole } from '../types';

/**
 * Normaliza un rol del backend al formato esperado por el frontend
 */
export const normalizeRole = (role: string): UserRole => {
  if (!role) return 'student';
  
  const normalizedRole = role.toLowerCase();
  
  // Mapeo de roles del backend al frontend
  switch (normalizedRole) {
    case 'student':
    case 'estudiante':
      return 'student';
    case 'teacher':
    case 'profesor':
      return 'teacher';
    case 'coordinator':
    case 'coordinador':
      return 'coordinator';

    case 'super_admin':
    case 'superadmin':
    case 'superadministrador':
      return 'super_admin';
    default:
      console.warn(`Rol no reconocido: ${role}, usando 'student' por defecto`);
      return 'student' as UserRole;
  }
};

/**
 * Obtiene el nombre en español del rol
 */
export const getRoleDisplayName = (role: string): string => {
  const normalizedRole = normalizeRole(role);
  
  switch (normalizedRole) {
    case 'student':
      return 'Estudiante';
    case 'teacher':
      return 'Profesor';
    case 'coordinator':
      return 'Coordinador';

    case 'super_admin':
      return 'Super Administrador';
    default:
      return 'Usuario';
  }
};