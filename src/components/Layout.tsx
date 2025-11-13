import React, { useState } from 'react';
import Header from './ui/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Magic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-magic-yellow-300 rounded-full opacity-20 animate-magic-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-magic-orange-400 rounded-full opacity-15 animate-magic-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-magic-green-400 rounded-full opacity-25 animate-magic-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-magic-blue-400 rounded-full opacity-20 animate-magic-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Use the Header component */}
      <Header 
        showMobileMenu={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Content */}
      <main className="relative z-10 magic-container py-6 lg:py-8">
        <div className="magic-content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;