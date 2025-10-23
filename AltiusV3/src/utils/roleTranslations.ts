// Utilidad para traducir roles del inglés al español
// Soporta tanto roles en mayúsculas (STUDENT) como minúsculas (student)

export const roleTranslations: Record<string, string> = {
  // Roles en mayúsculas (formato backend anterior)
  'STUDENT': 'Estudiante',
  'TEACHER': 'Profesor',
  'COORDINATOR': 'Coordinador',
  'PARENT': 'Padre de Familia',
  'SECRETARY': 'Secretario',
  'ADMIN': 'Administrador',
  'SUPER_ADMIN': 'Super Administrador',
  
  // Roles en minúsculas (formato backend actual)
  'student': 'Estudiante',
  'teacher': 'Profesor',
  'coordinator': 'Coordinador',
  'parent': 'Padre de Familia',
  'secretary': 'Secretario',
  'admin': 'Administrador',
  'super_admin': 'Super Administrador',
  'visitor': 'Visitante'
};

export const translateRole = (role: string): string => {
  if (!role) return 'Sin rol';
  
  // Intentar traducción directa
  if (roleTranslations[role]) {
    return roleTranslations[role];
  }
  
  // Intentar con mayúsculas
  const upperRole = role.toUpperCase();
  if (roleTranslations[upperRole]) {
    return roleTranslations[upperRole];
  }
  
  // Intentar con minúsculas
  const lowerRole = role.toLowerCase();
  if (roleTranslations[lowerRole]) {
    return roleTranslations[lowerRole];
  }
  
  // Si no encuentra traducción, devolver el rol original capitalizado
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

export const getRoleIcon = (role: string): string => {
  if (!role) return '👤';
  
  const normalizedRole = role.toUpperCase();
  const icons: Record<string, string> = {
    'STUDENT': '👨‍🎓',
    'TEACHER': '👩‍🏫',
    'COORDINATOR': '👨‍💼',
    'PARENT': '👨‍👩‍👧‍👦',
    'SECRETARY': '📋',
    'ADMIN': '🔧',
    'SUPER_ADMIN': '👑',
    'VISITOR': '👁️'
  };
  return icons[normalizedRole] || '👤';
};

export const getRoleColor = (role: string): string => {
  if (!role) return 'bg-gray-100 text-gray-800';
  
  const normalizedRole = role.toUpperCase();
  const colors: Record<string, string> = {
    'STUDENT': 'bg-blue-100 text-blue-800',
    'TEACHER': 'bg-green-100 text-green-800',
    'COORDINATOR': 'bg-purple-100 text-purple-800',
    'PARENT': 'bg-yellow-100 text-yellow-800',
    'SECRETARY': 'bg-gray-100 text-gray-800',
    'ADMIN': 'bg-red-100 text-red-800',
    'SUPER_ADMIN': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    'VISITOR': 'bg-orange-100 text-orange-800'
  };
  return colors[normalizedRole] || 'bg-gray-100 text-gray-800';
};