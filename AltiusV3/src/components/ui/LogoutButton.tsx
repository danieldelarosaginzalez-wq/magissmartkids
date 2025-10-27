import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../../stores/authStore';
import { useLogout } from '../../hooks/useLogout';
import LogoutConfirmModal from './LogoutConfirmModal';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'xs' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true,
  children
}) => {
  const { user } = useAuthStore();
  const { showLogoutModal, handleLogoutClick, handleLogoutConfirm, handleLogoutCancel } = useLogout();

  return (
    <>
      <Button
        onClick={handleLogoutClick}
        variant={variant}
        size={size}
        className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ${className}`}
      >
        {showIcon && <LogOut className="w-4 h-4 mr-2" />}
        {children || 'Cerrar Sesión'}
      </Button>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.firstName}
      />
    </>
  );
};

export default LogoutButton;