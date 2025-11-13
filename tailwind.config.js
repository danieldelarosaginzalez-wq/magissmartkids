/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // COLORES GLOBALES DEFINITIVOS
        primary: {
          DEFAULT: '#00368F', // AZUL OSCURO
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b8ff',
          400: '#8b9aff',
          500: '#00368F',  // AZUL OSCURO
          600: '#002a6b',
          700: '#001f4f',
          800: '#001433',
          900: '#000a17',
        },
        secondary: {
          DEFAULT: '#00C764', // VERDE
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#00C764',  // VERDE
          500: '#00a855',
          600: '#008a46',
          700: '#006c37',
          800: '#004e28',
          900: '#003019',
        },
        magic: {
          // COLORES GLOBALES DEFINITIVOS
          'azul-oscuro': '#00368F',
          'azul': '#2E5BFF',
          'azul-celeste': '#1494DE',
          'amarillo': '#F5A623',
          'naranja': '#FF6B35',
          'verde': '#00C764',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          DEFAULT: '#FCD34D',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#FCD34D',
          600: '#F59E0B',
          700: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          DEFAULT: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#1E40AF',
          600: '#1E3A8A',
          700: '#1E3A8A',
        },
        // Legacy support (for gradual migration)
        accent: {
          yellow: '#FCD34D', // Magic Yellow
          green: '#10B981',  // Magic Green
        },
        neutral: {
          white: '#FFFFFF',
          black: '#111827',
        },
        // Magic Border Colors (CRÍTICO - FALTABAN)
        'magic-border': {
          light: '#E5E7EB',
          medium: '#D1D5DB',
          dark: '#9CA3AF',
        },
        // Magic Gray Colors (CRÍTICO - FALTABAN)
        'magic-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Magic Background Colors (CRÍTICO - FALTABAN)
        'magic-bg': {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
        },
        // Magic Text Colors (CRÍTICO - FALTABAN)
        'magic-text': {
          primary: '#111827',
          secondary: '#6B7280',
        },
        // Magic White (CRÍTICO - FALTABA)
        'magic-white': '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'logo': ['Baloo 2', 'sans-serif'],      // SOLO para el logo de la marca
        'heading': ['Poppins', 'sans-serif'],   // Títulos y elementos especiales
        'body': ['Inter', 'sans-serif'],        // Contenido legible
        'magic': ['Baloo 2', 'sans-serif'],     // Compatibilidad (alias para logo)
        'fun': ['Poppins', 'sans-serif'],       // Compatibilidad
      },
      fontSize: {
        'magic-xs': ['0.75rem', { lineHeight: '1rem' }],
        'magic-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'magic-base': ['1rem', { lineHeight: '1.5rem' }],
        'magic-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'magic-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'magic-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'magic-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'magic-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        'magic-xs': '0.25rem',
        'magic-sm': '0.5rem',
        'magic-md': '1rem',
        'magic-lg': '1.5rem',
        'magic-xl': '2rem',
        'magic-2xl': '3rem',
      },
      borderRadius: {
        'magic': '0.75rem',
        'magic-lg': '1rem',
        'magic-xl': '1.5rem',
      },
      boxShadow: {
        'magic': '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
        'magic-lg': '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
        'magic-glow': '0 0 20px rgba(30, 64, 175, 0.3)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'magic-sparkle': 'sparkle 2s ease-in-out infinite',
        'magic-bounce': 'bounce 1s infinite',
        'magic-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'magic-float': 'magicFloat 3s ease-in-out infinite',
        'magic-wiggle': 'magicWiggle 1s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        magicFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        magicWiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        }
      },
      backgroundImage: {
        'magic-gradient': 'linear-gradient(135deg, #1E40AF 0%, #10B981 100%)',
        'magic-gradient-warm': 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
        'magic-gradient-cool': 'linear-gradient(135deg, #1E40AF 0%, #87CEEB 100%)',
      }
    },
  },
  plugins: [],
};
