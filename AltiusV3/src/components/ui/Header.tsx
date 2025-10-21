import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BookOpen, Users, BarChart3, CheckSquare, Home, Play } from 'lucide-react';
import Logo from './Logo';
import { useAuthStore } from '../../stores/authStore';

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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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
        {
          label: 'Actividades',
          href: '/actividades-interactivas',
          icon: Play,
        },
      ];
    }

    // Teacher Navigation
    if (user.role === 'teacher') {
      return [
        {
          label: 'Inicio',
          href: '/profesor',
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
      ];
    }

    // Admin/Coordinator Navigation
    if (user.role === 'admin' || user.role === 'coordinator') {
      return [
        ...baseItems,
        {
          label: 'Usuarios',
          href: '/users',
          icon: Users,
        },
        {
          label: 'Reportes',
          href: '/reports',
          icon: BarChart3,
        },
        {
          label: 'Actividades',
          href: '/actividades-interactivas',
          icon: Play,
        },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
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
                      onClick={handleLogout}
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

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="mobile-menu md:hidden border-t border-gray-200 bg-white">
            <nav className="py-4 space-y-2">
              {filteredNavigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 text-base font-medium transition-all duration-200 touch-target-magic
                    ${isActiveRoute(item.href)
                      ? 'text-primary bg-primary-50 border-r-4 border-primary'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setInternalShowMobileMenu(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile User Section */}
              {user ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-4 py-2 mb-2">
                    <div className="flex items-center space-x-3">
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
                  <Link
                    to="/perfil"
                    className="flex items-center space-x-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50 touch-target-magic"
                    onClick={() => setInternalShowMobileMenu(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Perfil</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-base text-error hover:bg-error-50 touch-target-magic"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 px-4 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full btn-magic text-center text-primary border border-primary hover:bg-primary-50"
                    onClick={() => setInternalShowMobileMenu(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full btn-magic-primary text-center"
                    onClick={() => setInternalShowMobileMenu(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;