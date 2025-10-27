import React from 'react';
import { useNavigateHome } from '../../hooks/useNavigateHome';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'text';
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  clickable = true,
  className = '',
  onClick
}) => {
  const { navigateToHome } = useNavigateHome();

  const sizeClasses = {
    xs: 'h-6 w-auto',
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
    '2xl': 'h-20 w-auto'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      navigateToHome();
    }
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''}
    ${className}
  `.trim();

  const logoSrc = {
    full: '/Logo.png',
    icon: '/Logo.png',
    text: '/Logo.png'
  };

  const altText = {
    full: 'MagicSmartKids - Aprender nunca fue tan mágico',
    icon: 'MagicSmartKids',
    text: 'MagicSmartKids'
  };

  // For icon variant on small sizes, use a simplified SVG
  if (variant === 'icon' && (size === 'xs' || size === 'sm')) {
    return (
      <div
        className={`${baseClasses} inline-flex items-center justify-center`}
        onClick={clickable ? handleClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
        aria-label={altText[variant]}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Wizard Hat */}
          <path
            d="M10 6 C10 6, 12 4, 16 5 C20 4, 22 6, 22 6 L20 18 L12 18 Z"
            fill="#1E40AF"
          />
          <ellipse cx="16" cy="18" rx="4" ry="1" fill="#FCD34D" />

          {/* Star on Hat */}
          <path
            d="M16 10 L16.5 12 L18 12 L17 13 L17.5 15 L16 14 L14.5 15 L15 13 L14 12 L15.5 12 Z"
            fill="white"
          />

          {/* Magic Wand */}
          <line x1="22" y1="15" x2="26" y2="11" stroke="#87CEEB" strokeWidth="1" />
          <circle cx="26" cy="11" r="1" fill="#FBBF24" />

          {/* Sparkles */}
          <circle cx="8" cy="9" r="0.5" fill="#10B981" />
          <circle cx="24" cy="8" r="0.5" fill="#87CEEB" />
          <circle cx="6" cy="15" r="0.5" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // For text-only variant, render inline text
  if (variant === 'text') {
    return (
      <div
        className={`${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-200' : ''} ${className}`}
        onClick={clickable ? handleClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
        aria-label={altText[variant]}
      >
        <span className="font-fun text-2xl font-normal">
          <span className="text-primary">Magic</span>
          <span className="text-secondary">Smart</span>
          <span className="text-magic-orange">Kids</span>
        </span>
      </div>
    );
  }

  // Default: render image logo
  return (
    <img
      src={logoSrc[variant]}
      alt={altText[variant]}
      className={baseClasses}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      loading="eager"
      decoding="async"
    />
  );
};

export default Logo;