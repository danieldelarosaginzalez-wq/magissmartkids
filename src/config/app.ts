// MagicSmartKids Application Configuration
export const APP_CONFIG = {
  // Application Info
  name: 'MagicSmartKids',
  tagline: 'Aprender nunca fue tan mágico',
  description: 'Plataforma educativa interactiva que transforma el aprendizaje en una experiencia mágica y divertida para niños',
  version: '1.0.0',
  
  // Contact Information
  contact: {
    email: 'info@magicsmartkids.com',
    support: 'support@magicsmartkids.com',
    phone: '+57 (1) 234-5678',
    address: 'Bogotá, Colombia',
    website: 'https://magicsmartkids.com'
  },
  
  // Social Media
  social: {
    facebook: 'https://facebook.com/MagicSmartKids',
    twitter: 'https://twitter.com/MagicSmartKids',
    instagram: 'https://instagram.com/MagicSmartKids',
    youtube: 'https://youtube.com/@MagicSmartKids'
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api',
    timeout: 10000,
    retries: 3
  },
  
  // Feature Flags
  features: {
    interactiveActivities: true,

    teacherReports: true,
    gamification: true,
    notifications: true,
    darkMode: false // Coming soon
  },
  
  // UI Configuration
  ui: {
    defaultTheme: 'light',
    animationsEnabled: true,
    soundEnabled: true,
    autoSave: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
  
  // Educational Configuration
  education: {
    supportedGrades: ['Preescolar', '1°', '2°', '3°', '4°', '5°'],
    supportedSubjects: [
      'Matemáticas',
      'Español',
      'Ciencias Naturales',
      'Ciencias Sociales',
      'Inglés',
      'Educación Física',
      'Artes'
    ],
    maxStudentsPerClass: 30,
    maxActivitiesPerDay: 10
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg']
  },
  
  // Security Configuration
  security: {
    passwordMinLength: 8,
    sessionStorageKey: 'magicsmartkids_session',
    csrfTokenKey: 'magicsmartkids_csrf',
    encryptionEnabled: true
  },
  
  // Analytics Configuration
  analytics: {
    enabled: import.meta.env.PROD,
    trackingId: import.meta.env.VITE_GA_TRACKING_ID,
    trackUserInteractions: true,
    trackPerformance: true
  },
  
  // Notification Configuration
  notifications: {
    position: 'top-right' as const,
    duration: 5000,
    maxVisible: 3,
    showProgress: true
  },
  
  // Accessibility Configuration
  accessibility: {
    highContrastMode: false,
    reducedMotion: false,
    screenReaderOptimized: true,
    keyboardNavigationEnabled: true
  },
  
  // Development Configuration
  development: {
    debugMode: import.meta.env.DEV,
    showPerformanceMetrics: import.meta.env.DEV,
    enableHotReload: import.meta.env.DEV,
    mockApiEnabled: false
  }
} as const;

// Environment-specific overrides
if (import.meta.env.PROD) {
  // Production overrides
  APP_CONFIG.api.baseUrl = 'https://api.magicsmartkids.com/api';
  APP_CONFIG.development.debugMode = false;
}

// Type definitions for better TypeScript support
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof APP_CONFIG.features;
export type UIConfig = typeof APP_CONFIG.ui;

// Helper functions
export const getAppName = () => APP_CONFIG.name;
export const getAppVersion = () => APP_CONFIG.version;
export const getApiBaseUrl = () => APP_CONFIG.api.baseUrl;
export const isFeatureEnabled = (feature: keyof FeatureFlags) => APP_CONFIG.features[feature];
export const getContactEmail = () => APP_CONFIG.contact.email;
export const getSupportEmail = () => APP_CONFIG.contact.support;