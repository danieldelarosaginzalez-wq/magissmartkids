import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Play, 
  Calendar,
  MessageCircle,
  Settings
} from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const ContextualNavigation: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const getNavigationItems = (): NavigationItem[] => {
    switch (user.role) {
      case 'student':
        return [
          {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            description: 'Vista general de tu progreso académico'
          },
          {
            label: 'Tareas',
            href: '/tareas',
            icon: CheckSquare,
            description: 'Gestiona tus tareas y entregas'
          },
          {
            label: 'Materias',
            href: '/materias',
            icon: BookOpen,
            description: 'Explora tus materias y contenidos'
          },
          {
            label: 'Notas',
            href: '/notas',
            icon: BarChart3,
            description: 'Revisa tus calificaciones y progreso'
          },
          {
            label: 'Actividades',
            href: '/actividades-interactivas',
            icon: Play,
            description: 'Participa en actividades interactivas'
          }
        ];

      case 'teacher':
        return [
          {
            label: 'Dashboard',
            href: '/profesor',
            icon: Home,
            description: 'Panel de control del profesor'
          },
          {
            label: 'Mis Materias',
            href: '/profesor/materias',
            icon: BookOpen,
            description: 'Gestiona tus materias y contenidos'
          },
          {
            label: 'Tareas',
            href: '/profesor/tareas',
            icon: CheckSquare,
            description: 'Crea y gestiona tareas para estudiantes'
          },
          {
            label: 'Calificaciones',
            href: '/profesor/calificaciones',
            icon: BarChart3,
            description: 'Califica y evalúa a tus estudiantes'
          },
          {
            label: 'Actividades',
            href: '/actividades-interactivas',
            icon: Play,
            description: 'Crea actividades interactivas'
          }
        ];



      case 'coordinator':
      case 'admin':
        return [
          {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            description: 'Panel de administración'
          },
          {
            label: 'Usuarios',
            href: '/users',
            icon: Users,
            description: 'Gestiona usuarios del sistema'
          },
          {
            label: 'Reportes',
            href: '/reports',
            icon: BarChart3,
            description: 'Genera reportes institucionales'
          },
          {
            label: 'Actividades',
            href: '/actividades-interactivas',
            icon: Play,
            description: 'Supervisa actividades del sistema'
          },
          {
            label: 'Configuración',
            href: '/settings',
            icon: Settings,
            description: 'Configuración del sistema'
          }
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  
  const isActiveRoute = (href: string) => {
    if (href === '/dashboard' || href === '/profesor') {
      return location.pathname === href || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-primary hover:bg-primary-50'
                  }
                `}
                title={item.description}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default ContextualNavigation;