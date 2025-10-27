/**
 * Utilidades para manejo de scroll
 */

/**
 * Hace scroll hasta arriba de la página de forma suave
 * @param delay - Retraso en milisegundos antes de hacer scroll (default: 100)
 */
export const scrollToTop = (delay: number = 100) => {
  console.log(`⬆️ scrollToTop called with delay: ${delay}ms, current scrollY: ${window.scrollY}`);
  
  const performScroll = () => {
    console.log(`🎯 Performing scroll, current scrollY: ${window.scrollY}`);
    try {
      // Intentar scroll suave primero
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      console.log('✅ Smooth scroll initiated');
    } catch (error) {
      // Fallback a scroll instantáneo si hay problemas
      console.warn('❌ Smooth scroll failed, using instant scroll:', error);
      window.scrollTo(0, 0);
    }
  };

  if (delay > 0) {
    setTimeout(performScroll, delay);
  } else {
    performScroll();
  }
};

/**
 * Hace scroll hasta arriba de forma inmediata (sin animación)
 * Útil para casos donde se necesita scroll instantáneo
 */
export const scrollToTopInstant = () => {
  console.log('⚡ Instant scroll to top');
  window.scrollTo(0, 0);
};

/**
 * Scroll robusto que intenta múltiples métodos
 * @param delay - Retraso antes del scroll
 */
export const scrollToTopRobust = (delay: number = 100) => {
  console.log(`🔧 Robust scroll called with delay: ${delay}ms`);
  
  const performRobustScroll = () => {
    const currentScroll = window.scrollY;
    console.log(`📊 Current scroll position: ${currentScroll}`);
    
    if (currentScroll === 0) {
      console.log('✅ Already at top');
      return;
    }
    
    // Método 1: Scroll suave moderno
    try {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
      console.log('✅ Method 1: Modern smooth scroll attempted');
      
      // Verificar después de un tiempo si funcionó
      setTimeout(() => {
        const newScroll = window.scrollY;
        console.log(`📊 After smooth scroll check, position: ${newScroll}`);
        if (newScroll > 50) {
          console.log('⚠️ Smooth scroll may have failed, trying instant scroll');
          // Método 2: Scroll instantáneo como fallback
          window.scrollTo(0, 0);
          
          // Verificación final
          setTimeout(() => {
            const finalScroll = window.scrollY;
            console.log(`📊 Final scroll position: ${finalScroll}`);
            if (finalScroll > 10) {
              console.log('⚠️ Instant scroll also failed, trying direct DOM manipulation');
              // Método 3: Manipular directamente el DOM
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }
          }, 100);
        } else {
          console.log('✅ Smooth scroll successful');
        }
      }, 1000);
      
    } catch (error) {
      console.warn('❌ Method 1 failed:', error);
      
      // Método 2: Scroll instantáneo
      try {
        window.scrollTo(0, 0);
        console.log('✅ Method 2: Instant scroll used');
      } catch (error2) {
        console.error('❌ Method 2 failed:', error2);
        
        // Método 3: Manipular directamente el body
        try {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          console.log('✅ Method 3: Direct body scroll used');
        } catch (error3) {
          console.error('❌ Even direct scroll failed:', error3);
        }
      }
    }
  };

  if (delay > 0) {
    setTimeout(performRobustScroll, delay);
  } else {
    performRobustScroll();
  }
};

/**
 * Hace scroll hasta un elemento específico
 * @param elementId - ID del elemento al que hacer scroll
 * @param offset - Offset adicional en píxeles (default: 0)
 * @param delay - Retraso en milisegundos antes de hacer scroll (default: 100)
 */
export const scrollToElement = (elementId: string, offset: number = 0, delay: number = 100) => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, delay);
};

/**
 * Verifica si el usuario está cerca del top de la página
 * @param threshold - Umbral en píxeles para considerar "cerca del top" (default: 100)
 */
export const isNearTop = (threshold: number = 100): boolean => {
  return window.scrollY <= threshold;
};

/**
 * Hook para detectar cuando el usuario hace scroll
 * @param callback - Función a ejecutar cuando se detecta scroll
 */
export const onScroll = (callback: (scrollY: number) => void) => {
  const handleScroll = () => {
    callback(window.scrollY);
  };

  window.addEventListener('scroll', handleScroll);
  
  // Retorna función de cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};