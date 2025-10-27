import { useNavigate, useLocation } from 'react-router-dom';
import { scrollToTopRobust } from '../utils/scrollUtils';

/**
 * Hook personalizado para navegar al inicio con scroll automático
 * Detecta si ya estás en la página de inicio y hace scroll directo
 */
export const useNavigateHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToHome = () => {
    console.log('🏠 navigateToHome called, current path:', location.pathname);
    
    // Si ya estamos en la página de inicio, solo hacer scroll
    if (location.pathname === '/') {
      console.log('📍 Already at home, scrolling to top immediately');
      scrollToTopRobust(0); // Sin delay porque no hay navegación
    } else {
      console.log('🚀 Navigating to home');
      // Navegar a home - el scroll se manejará automáticamente por useScrollToTop
      navigate('/');
    }
  };

  return {
    navigateToHome,
    isAtHome: location.pathname === '/'
  };
};