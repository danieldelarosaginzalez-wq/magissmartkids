import React from 'react';
import { cn } from '../../lib/utils';
import Container from './Container';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'gray' | 'primary' | 'secondary' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  background = 'white',
  padding = 'lg',
  containerSize = 'lg',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  id
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-magic-gray-50',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    gradient: 'bg-magic-gradient text-white'
  };

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  const textColorClasses = {
    white: 'text-magic-gray-900',
    gray: 'text-magic-gray-900',
    primary: 'text-white',
    secondary: 'text-white',
    gradient: 'text-white'
  };

  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl font-magic-display font-bold mb-4',
                  textColorClasses[background],
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  'text-lg md:text-xl max-w-3xl mx-auto',
                  background === 'white' || background === 'gray'
                    ? 'text-magic-gray-600'
                    : 'text-white/90',
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
};

export default Section;