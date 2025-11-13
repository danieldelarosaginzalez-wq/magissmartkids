import React, { useState } from 'react';
import { Button } from './Button';
import { 
  Heart, 
  Star, 
  Download, 
  Send, 
  Save, 
  Trash2, 
  Edit, 
  Plus,
  ArrowRight,
  Sparkles,
  Wand2
} from 'lucide-react';

const ButtonShowcase: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="p-8 bg-magic-gray-50 min-h-screen">
      <div className="magic-container">
        <h1 className="text-4xl font-magic-display font-bold text-center mb-8 text-magic-gradient">
          MagicSmartKids Button Showcase
        </h1>
        
        {/* Primary Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Primary Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="magic">Magic Gradient</Button>
          </div>
        </div>

        {/* Magic Gradient Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Magic Gradient Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="magic" leftIcon={<Sparkles className="w-4 h-4" />}>
              Magic Gradient
            </Button>
            <Button variant="magic-warm" leftIcon={<Wand2 className="w-4 h-4" />}>
              Warm Magic
            </Button>
            <Button variant="magic-cool" leftIcon={<Star className="w-4 h-4" />}>
              Cool Magic
            </Button>
          </div>
        </div>

        {/* Semantic Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Semantic Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="success" leftIcon={<Save className="w-4 h-4" />}>
              Success
            </Button>
            <Button variant="warning" leftIcon={<Edit className="w-4 h-4" />}>
              Warning
            </Button>
            <Button variant="error" leftIcon={<Trash2 className="w-4 h-4" />}>
              Error
            </Button>
            <Button variant="info" leftIcon={<Download className="w-4 h-4" />}>
              Info
            </Button>
          </div>
        </div>

        {/* Outline Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Outline Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button variant="outline">Outline</Button>
            <Button variant="outline-secondary">Secondary</Button>
            <Button variant="outline-success">Success</Button>
            <Button variant="outline-warning">Warning</Button>
            <Button variant="outline-error">Error</Button>
          </div>
        </div>

        {/* Ghost Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Ghost Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button variant="ghost">Ghost</Button>
            <Button variant="ghost-secondary">Secondary</Button>
            <Button variant="ghost-success">Success</Button>
            <Button variant="ghost-warning">Warning</Button>
            <Button variant="ghost-error">Error</Button>
          </div>
        </div>

        {/* Size Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Size Variants
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <Button variant="primary" size="xs">Extra Small</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="default">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="xl">Extra Large</Button>
          </div>
        </div>

        {/* Icon Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Icon Variants
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="icon-sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="icon">
              <Star className="w-5 h-5" />
            </Button>
            <Button variant="success" size="icon-lg">
              <Plus className="w-6 h-6" />
            </Button>
            <Button variant="magic" size="icon" animation="pulse">
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Animation Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Animation Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary" animation="bounce">
              Bounce
            </Button>
            <Button variant="secondary" animation="pulse">
              Pulse
            </Button>
            <Button variant="magic" animation="float">
              Float
            </Button>
            <Button variant="sparkle" animation="wiggle">
              Sparkle
            </Button>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Interactive Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading States */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Loading States
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  loading={loadingStates.loading1}
                  onClick={() => handleLoadingDemo('loading1')}
                  className="w-full"
                >
                  {loadingStates.loading1 ? 'Loading...' : 'Click to Load'}
                </Button>
                <Button 
                  variant="success" 
                  loading={loadingStates.loading2}
                  onClick={() => handleLoadingDemo('loading2')}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="w-full"
                >
                  {loadingStates.loading2 ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* With Icons */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                With Icons
              </h3>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  leftIcon={<Download className="w-4 h-4" />}
                  className="w-full"
                >
                  Download
                </Button>
                <Button 
                  variant="secondary" 
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full"
                >
                  Continue
                </Button>
                <Button 
                  variant="magic" 
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  rightIcon={<Wand2 className="w-4 h-4" />}
                  className="w-full"
                >
                  Cast Magic
                </Button>
              </div>
            </div>

            {/* Disabled States */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Disabled States
              </h3>
              <div className="space-y-3">
                <Button variant="primary" disabled className="w-full">
                  Disabled Primary
                </Button>
                <Button variant="outline" disabled className="w-full">
                  Disabled Outline
                </Button>
                <Button variant="ghost" disabled className="w-full">
                  Disabled Ghost
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Usage Examples
          </h2>
          <div className="space-y-6">
            {/* Form Actions */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Form Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
                <Button variant="ghost-error" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </Button>
              </div>
            </div>

            {/* Call to Action */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Call to Action
              </h3>
              <div className="text-center">
                <Button 
                  variant="magic" 
                  size="lg" 
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  animation="pulse"
                >
                  Start Learning Magic!
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Navigation
              </h3>
              <div className="flex justify-between">
                <Button variant="outline-secondary">
                  ← Previous
                </Button>
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Accessibility Features
          </h2>
          <div className="card-magic p-6">
            <ul className="space-y-3 text-magic-gray-700">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keyboard navigation support (Tab, Enter, Space)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Focus indicators with proper contrast
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ARIA attributes for screen readers
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Minimum 44px touch targets for mobile
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Loading states with proper feedback
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Color contrast ratios meet WCAG 2.1 AA standards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;