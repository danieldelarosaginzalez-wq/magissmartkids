import React from 'react';
import { ArrowUp, TestTube } from 'lucide-react';
import { Button } from './Button';
import { useNavigateHome } from '../../hooks/useNavigateHome';
import { scrollToTop, scrollToTopRobust, scrollToTopInstant } from '../../utils/scrollUtils';

interface ScrollTestButtonProps {
  className?: string;
}

/**
 * Componente de prueba para verificar que el scroll al inicio funciona correctamente
 * Se puede usar temporalmente para testing
 */
const ScrollTestButton: React.FC<ScrollTestButtonProps> = ({ className = '' }) => {
  const { navigateToHome, isAtHome } = useNavigateHome();

  const testDirectScroll = () => {
    console.log('🧪 Testing direct scroll');
    scrollToTopRobust(0);
  };

  const testInstantScroll = () => {
    console.log('⚡ Testing instant scroll');
    scrollToTopInstant();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button
        onClick={navigateToHome}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        title={isAtHome ? 'Scroll al inicio' : 'Ir al inicio'}
      >
        <ArrowUp className="w-4 h-4" />
        {isAtHome ? 'Hook Scroll' : 'Navigate Home'}
      </Button>
      
      {isAtHome && (
        <>
          <Button
            onClick={testDirectScroll}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-blue-50"
          >
            <TestTube className="w-4 h-4" />
            Test Robust
          </Button>
          
          <Button
            onClick={testInstantScroll}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-red-50"
          >
            <ArrowUp className="w-4 h-4" />
            Test Instant
          </Button>
        </>
      )}
    </div>
  );
};

export default ScrollTestButton;