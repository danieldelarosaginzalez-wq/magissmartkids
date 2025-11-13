import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook que hace scroll al top automáticamente en cada cambio de ruta
 * Útil para asegurar que cada página nueva empiece desde arriba
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll al top inmediatamente cuando cambia la ruta
    // Usar múltiples métodos para asegurar que funcione
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // También forzar el scroll después de un pequeño delay
      // para asegurar que la página se haya renderizado
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 10);
      
      console.log(`📍 Auto-scroll to top for route: ${pathname}`);
    } catch (error) {
      console.warn('⚠️ Error in auto-scroll:', error);
    }
  }, [pathname]);
};