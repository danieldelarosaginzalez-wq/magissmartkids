import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BookOpen, Users, BarChart3, CheckSquare, Home, School, FileText, TrendingUp } from 'lucide-react';
import Logo from './Logo';
import { useAuthStore } from '../../stores/authStore';
import LogoutConfirmModal from './LogoutConfirmModal';
import { useLogout } from '../../hooks/useLogout';

interface HeaderProps {
  showMobileMenu?: boolean;
  onMenuToggle?: () => void;
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: string[];
  children?: NavigationItem[];
}

const Header: React.FC<HeaderProps> = ({
  showMobileMenu: externalShowMobileMenu,
  onMenuToggle: externalOnMenuToggle,
  className = ''
}) => {
  const [internalShowMobileMenu, setInternalShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();
  const { showLogoutModal, handleLogoutClick, handleLogoutConfirm, handleLogoutCancel } = useLogout();

  // Use external state if provided, otherwise use internal state
  const showMobileMenu = externalShowMobileMenu ?? internalShowMobileMenu;
  const onMenuToggle = externalOnMenuToggle ?? (() => setInternalShowMobileMenu(!internalShowMobileMenu));

  // Close mobile menu when route changes
  useEffect(() => {
    setInternalShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setInternalShowMobileMenu(false);
      }
      if (!target.closest('.user-menu') && !target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) return [];

    const baseItems: NavigationItem[] = [
      {
        label: 'Inicio',
        href: '/dashboard',
        icon: Home,
      }
    ];

    // Student Navigation
    if (user.role === 'student') {
      return [
        ...baseItems,
        {
          label: 'Tareas',
          href: '/tareas',
          icon: CheckSquare,
        },
        {
          label: 'Materias',
          href: '/materias',
          icon: BookOpen,
        },
        {
          label: 'Notas',
          href: '/notas',
          icon: BarChart3,
        },
      ];
    }

    // Teacher Navigation
    if (user.role === 'teacher') {
      return [
        {
          label: 'Inicio',
          href: '/dashboard',
          icon: Home,
        },
        {
          label: 'Mis Materias',
          href: '/profesor/materias',
          icon: BookOpen,
        },
        {
          label: 'Tareas',
          href: '/profesor/tareas',
          icon: CheckSquare,
        },
        {
          label: 'Calificaciones',
          href: '/profesor/calificaciones',
          icon: BarChart3,
        },
        {
          label: 'Predicciones IA',
          href: '/profesor/predicciones',
          icon: TrendingUp,
        },
      ];
    }

    // Coordinator Navigation
    if (user.role === 'coordinator') {
      return [
        {
          label: 'Inicio',
          href: '/dashboard',
          icon: Home,
        },
        {
          label: 'Grados',
          href: '/gestion-grados',
          icon: School,
        },
        {
          label: 'Usuarios',
          href: '/users',
          icon: Users,
        },
        {
          label: 'Reportes',
          href: '/reports',
          icon: FileText,
        },
      ];
    }

    // Super Admin Navigation
    if (user.role === 'super_admin') {
      return [
        ...baseItems,
        {
          label: 'Usuarios',
          href: '/users',
          icon: Users,
        },
        {
          label: 'Instituciones',
          href: '/admin',
          icon: School,
        },
        {
          label: 'Reportes',
          href: '/reports',
          icon: BarChart3,
        },
        {
          label: 'Configuración',
          href: '/settings',
          icon: Settings,
        },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogoutClickWithCleanup = () => {
    handleLogoutClick();
    setShowUserMenu(false);
    setInternalShowMobileMenu(false);
  };

  const isActiveRoute = (href: string) => {
    const currentPath = location.pathname;
    
    // Handle exact root path
    if (href === '/') {
      return currentPath === '/';
    }
    
    // Handle dashboard route
    if (href === '/dashboard') {
      // Dashboard is active when on /dashboard or when on main role dashboard
      if (currentPath === '/dashboard') return true;
      if (user?.role === 'teacher' && currentPath === '/profesor') return true;
      return false;
    }
    
    // For specific routes, check exact match or if it's a subroute
    if (currentPath === href) return true;
    
    // Check if current path starts with href followed by a slash (to avoid partial matches)
    if (currentPath.startsWith(href + '/')) return true;
    
    return false;
  };

  const filteredNavigationItems = navigationItems;

  return (
    <header className={`bg-white shadow-magic border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="magic-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo 
              size="md" 
              variant="full" 
              clickable={true}
              className="hover-magic"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-magic text-sm font-medium transition-all duration-200
                  ${isActiveRoute(item.href)
                    ? 'text-primary bg-primary-50 border border-primary-200'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-menu-button flex items-center space-x-2 p-2 rounded-magic hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-magic-gradient rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="user-menu absolute right-0 mt-2 w-48 bg-white rounded-magic-lg shadow-magic-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role.toLowerCase()}
                      </p>
                    </div>
                    <Link
                      to="/perfil"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Perfil</span>
                    </Link>
                    <button
                      onClick={handleLogoutClickWithCleanup}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-error-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-magic text-primary border border-primary hover:bg-primary-50"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="btn-magic-primary"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={onMenuToggle}
            className="hamburger-button md:hidden p-2 rounded-magic hover:bg-gray-50 transition-colors duration-200 touch-target-magic"
            aria-expanded={showMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onMenuToggle}
          />
        )}

        {/* Mobile Sidebar Menu */}
        <div className={`
          mobile-menu fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden
          ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Logo size="sm" variant="full" clickable={true} />
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {filteredNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onMenuToggle}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-target-magic
                      ${isActive
                        ? 'bg-primary-50 text-primary border-r-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section at Bottom */}
            {user ? (
              <div className="border-t border-gray-200 p-4">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 bg-magic-gradient rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Actions */}
                <div className="space-y-2">
                  <Link
                    to="/perfil"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg touch-target-magic"
                    onClick={onMenuToggle}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Perfil</span>
                  </Link>
                  <button
                    onClick={handleLogoutClickWithCleanup}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-error-50 rounded-lg touch-target-magic"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <Link
                  to="/login"
                  className="block w-full btn-magic text-center text-primary border border-primary hover:bg-primary-50"
                  onClick={onMenuToggle}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block w-full btn-magic-primary text-center"
                  onClick={onMenuToggle}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.firstName}
      />
    </header>
  );
};

export default Header;