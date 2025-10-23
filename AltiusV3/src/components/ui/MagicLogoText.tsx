import React from 'react';

/**
 * MagicLogoText Component
 * 
 * Renderiza el nombre de la marca "MagicSmartKids" con:
 * - Tipografía Baloo 2 (font-weight: 700)
 * - Colores específicos por letra
 * - Capitalización correcta: MagicSmartKids
 * - Efectos hover opcionales
 * 
 * Ejemplos de uso:
 * <MagicLogoText size="xl" />                    // Logo principal
 * <MagicLogoText size="sm" layout="inline" />    // Navbar
 * <MagicLogoText variant="light" />              // Fondo oscuro
 */

interface MagicLogoTextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  layout?: 'stacked' | 'inline';
  showHoverEffects?: boolean;
  variant?: 'default' | 'light'; // Para fondos oscuros
}

const MagicLogoText: React.FC<MagicLogoTextProps> = ({
  size = 'lg',
  className = '',
  layout = 'stacked',
  showHoverEffects = true,
  variant = 'default'
}) => {
  // DISTRIBUCIÓN EXACTA DE COLORES - USAR STYLE DIRECTAMENTE
  const getLetterStyle = (position: number): React.CSSProperties => {
    const colorSequence = [
      '#00368F', '#F5A623', '#2E5BFF', '#FF6B35', '#00C764', // Magic
      '#1494DE', '#00C764', '#F5A623', '#F5A623', '#00368F', // Smart
      '#00C764', '#F5A623', '#00368F', '#00C764'               // Kids
    ];

    const color = colorSequence[position] || '#2E5BFF';

    if (variant === 'light') {
      const lightColorMap: { [key: string]: string } = {
        '#1830CC': '#1830CC', '#F5A623': '#F2D21F', '#2E5BFF': '#2E5BFF',
        '#00C764': '#00C764', '#1494DE': '#2E5BFF',
      };
      return { color: lightColorMap[color] || color };
    }

    return { color };
  };

  const sizeClasses = {
    xs: 'text-lg', sm: 'text-xl', md: 'text-2xl',
    lg: 'text-3xl', xl: 'text-4xl', '2xl': 'text-5xl'
  };

  const renderLetter = (letter: string, index: number) => (
    <span
      key={`${letter}-${index}`}
      style={{
        ...getLetterStyle(index),
        textShadow: showHoverEffects ? '0 2px 4px rgba(0,0,0,0.1)' : undefined,
        fontFamily: '"Baloo 2", sans-serif',
        fontOpticalSizing: 'auto',
        fontWeight: 700,
        fontStyle: 'normal'
      }}
      className={`
        inline-block font-logo
        ${showHoverEffects ? 'transition-all duration-300 hover:scale-110 hover:rotate-3 hover:drop-shadow-lg cursor-default' : ''}
        ${sizeClasses[size]}
      `}
    >
      {letter}
    </span>
  );

  // Texto con capitalización correcta: MagicSmartKids
  const brandText = 'MagicSmartKids';

  if (layout === 'inline') {
    return (
      <div className={`tracking-normal ${className}`}>
        <span className="inline-flex items-center space-x-0.5">
          {brandText.split('').map((letter, index) => renderLetter(letter, index))}
        </span>
      </div>
    );
  }

  // Layout stacked (por defecto) - dividir en 3 líneas
  return (
    <div className={`tracking-normal ${className}`}>
      <div className="flex justify-center items-center">
        {'Magic'.split('').map((letter, index) => renderLetter(letter, index))}
      </div>
      <div className="flex justify-center items-center">
        {'Smart'.split('').map((letter, index) => renderLetter(letter, index + 5))}
      </div>
      <div className="flex justify-center items-center">
        {'Kids'.split('').map((letter, index) => renderLetter(letter, index + 10))}
      </div>
    </div>
  );
};

export default MagicLogoText;