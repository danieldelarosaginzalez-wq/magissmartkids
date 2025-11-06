import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Settings,
  BookOpen,
  Users,
  BarChart3,
  Calendar,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/Button';
import { getInitials } from '../lib/utils';
import { translateRole } from '../utils/roleTranslations';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { path: '/actividades-interactivas', label: 'Actividades Interactivas', icon: BookOpen },
          { path: '/subjects', label: 'Materias', icon: BookOpen },
          { path: '/grades', label: 'Notas', icon: BarChart3 },
          { path: '/calendar', label: 'Calendario', icon: Calendar },
        ];

      case 'teacher':
        return [
          ...baseItems,
          { path: '/actividades-interactivas', label: 'Actividades Interactivas', icon: BookOpen },
          { path: '/subjects', label: 'Materias', icon: BookOpen },
          { path: '/students', label: 'Estudiantes', icon: Users },
          { path: '/grades', label: 'Calificaciones', icon: BarChart3 },
        ];

      case 'coordinator':
        return [
          ...baseItems,
          { path: '/reports', label: 'Reportes', icon: BarChart3 },
          { path: '/teachers', label: 'Profesores', icon: Users },
          { path: '/students', label: 'Estudiantes', icon: Users },
        ];



      case 'super_admin':
        return [
          ...baseItems,
          { path: '/super-admin', label: 'Super Admin', icon: BarChart3 },
          { path: '/users', label: 'Usuarios', icon: Users },
          { path: '/institutions', label: 'Instituciones', icon: BookOpen },
          { path: '/settings', label: 'Configuración', icon: Settings },
        ];

      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-neutral-white">
      {/* Header */}
      <header className="bg-neutral-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-neutral-black hidden xs:block">
                Altius Academy
              </span>
              <span className="text-lg font-bold text-neutral-black xs:hidden">
                Altius
              </span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex space-x-1 xl:space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                      ? 'bg-primary text-neutral-white shadow-md'
                      : 'text-neutral-black hover:bg-primary hover:text-neutral-white hover:shadow-md'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-neutral-black" />
                ) : (
                  <Menu className="h-6 w-6 text-neutral-black" />
                )}
              </Button>
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-neutral-white">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-neutral-black">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-secondary">
                      {translateRole(user.role)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 border-secondary-300 text-secondary hover:bg-secondary-50 hover:border-secondary-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed top-0 right-0 h-full w-80 max-w-sm bg-neutral-white shadow-2xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-neutral-white" />
                </div>
                <span className="text-lg font-bold text-neutral-black">Altius Academy</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-6 w-6 text-neutral-black" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                      ? 'bg-primary text-neutral-white shadow-md'
                      : 'text-neutral-black hover:bg-primary hover:text-neutral-white hover:shadow-md'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* User Info in Mobile Menu */}
              {user && (
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-secondary-50 rounded-lg mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-neutral-white">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-black">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-secondary">
                        {translateRole(user.role)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 border-secondary-300 text-secondary hover:bg-secondary-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;