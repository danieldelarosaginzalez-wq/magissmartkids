import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useLogout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return {
    showLogoutModal,
    handleLogoutClick,
    handleLogoutConfirm,
    handleLogoutCancel,
  };
};