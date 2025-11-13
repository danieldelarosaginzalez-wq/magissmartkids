import React from 'react';
import Logo from './Logo';

const LogoShowcase: React.FC = () => {
  return (
    <div className="p-8 bg-magic-gray-50 min-h-screen">
      <div className="magic-container">
        <h1 className="text-3xl font-magic-display font-bold text-center mb-8 text-magic-gradient">
          MagicSmartKids Logo Showcase
        </h1>
        
        {/* Size Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Size Variants (Full Logo)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-end">
            <div className="text-center">
              <Logo size="xs" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">XS</p>
            </div>
            <div className="text-center">
              <Logo size="sm" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">SM</p>
            </div>
            <div className="text-center">
              <Logo size="md" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">MD</p>
            </div>
            <div className="text-center">
              <Logo size="lg" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">LG</p>
            </div>
            <div className="text-center">
              <Logo size="xl" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">XL</p>
            </div>
            <div className="text-center">
              <Logo size="2xl" variant="full" />
              <p className="mt-2 text-sm text-magic-gray-600">2XL</p>
            </div>
          </div>
        </div>

        {/* Variant Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Logo Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-magic p-6 text-center">
              <Logo size="lg" variant="full" />
              <h3 className="mt-4 font-magic-display font-semibold text-magic-gray-800">
                Full Logo
              </h3>
              <p className="text-sm text-magic-gray-600 mt-2">
                Complete logo with text and tagline
              </p>
            </div>
            <div className="card-magic p-6 text-center">
              <Logo size="lg" variant="icon" />
              <h3 className="mt-4 font-magic-display font-semibold text-magic-gray-800">
                Icon Only
              </h3>
              <p className="text-sm text-magic-gray-600 mt-2">
                Just the magical hat and wand
              </p>
            </div>
            <div className="card-magic p-6 text-center">
              <Logo size="lg" variant="text" />
              <h3 className="mt-4 font-magic-display font-semibold text-magic-gray-800">
                Text Only
              </h3>
              <p className="text-sm text-magic-gray-600 mt-2">
                Brand name without icon
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Interactive Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Clickable Logo (navigates to home)
              </h3>
              <div className="flex items-center justify-center p-4 bg-magic-gray-100 rounded-magic">
                <Logo size="lg" variant="full" clickable={true} />
              </div>
              <p className="text-sm text-magic-gray-600 mt-2">
                Click to navigate to home page
              </p>
            </div>
            <div className="card-magic p-6">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-4">
                Non-clickable Logo
              </h3>
              <div className="flex items-center justify-center p-4 bg-magic-gray-100 rounded-magic">
                <Logo size="lg" variant="full" clickable={false} />
              </div>
              <p className="text-sm text-magic-gray-600 mt-2">
                Static logo without interaction
              </p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-magic-display font-semibold mb-6 text-primary">
            Usage Examples
          </h2>
          <div className="space-y-6">
            {/* Header Example */}
            <div className="card-magic p-4">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-3">
                Header Navigation
              </h3>
              <div className="flex items-center justify-between bg-white p-4 rounded-magic border">
                <Logo size="md" variant="full" />
                <div className="flex space-x-4">
                  <button className="btn-magic-primary">Login</button>
                  <button className="btn-magic-secondary">Register</button>
                </div>
              </div>
            </div>

            {/* Mobile Header Example */}
            <div className="card-magic p-4">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-3">
                Mobile Header
              </h3>
              <div className="flex items-center justify-between bg-white p-3 rounded-magic border max-w-sm">
                <Logo size="sm" variant="icon" />
                <span className="font-magic-display font-semibold text-primary">MagicSmartKids</span>
                <button className="p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer Example */}
            <div className="card-magic p-4">
              <h3 className="font-magic-display font-semibold text-magic-gray-800 mb-3">
                Footer
              </h3>
              <div className="bg-magic-gray-800 text-white p-6 rounded-magic">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <Logo size="md" variant="full" className="mb-4 md:mb-0" />
                  <div className="text-center md:text-right">
                    <p className="text-magic-gray-300">© 2024 MagicSmartKids</p>
                    <p className="text-magic-gray-400 text-sm">Aprender nunca fue tan mágico</p>
                  </div>
                </div>
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
                Proper alt text for screen readers
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keyboard navigation support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Focus indicators for interactive elements
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ARIA labels and roles
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-success mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                High contrast color ratios
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;