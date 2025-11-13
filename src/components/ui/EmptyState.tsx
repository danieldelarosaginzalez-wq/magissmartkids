import React from 'react';
import { Sparkles, BookOpen, Users, FileText } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: 'sparkles' | 'book' | 'users' | 'file' | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'magic';
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles',
  title,
  description,
  action,
  className = ''
}) => {
  const iconMap = {
    sparkles: Sparkles,
    book: BookOpen,
    users: Users,
    file: FileText
  };

  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="mx-auto w-24 h-24 bg-magic-gray-100 rounded-full flex items-center justify-center mb-6">
        <IconComponent className="w-12 h-12 text-magic-gray-400" />
      </div>
      
      <h3 className="text-xl font-magic-display font-semibold text-magic-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-magic-gray-600 max-w-md mx-auto mb-6">
        {description}
      </p>
      
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;