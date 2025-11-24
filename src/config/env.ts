// Configuración de variables de entorno
// Este archivo centraliza todas las variables de entorno de la aplicación

interface EnvConfig {
    apiUrl: string;
    isDevelopment: boolean;
    isProduction: boolean;
    appName: string;
    appVersion: string;
}

const getApiUrl = (): string => {
    // En producción, usar la variable de entorno VITE_API_URL
    // En desarrollo, usar localhost
    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl) {
        return apiUrl;
    }

    // Fallback para desarrollo
    if (import.meta.env.DEV) {
        return 'http://localhost:8090';
    }

    // En producción sin VITE_API_URL, usar la misma URL que el frontend
    return window.location.origin;
};

export const env: EnvConfig = {
    apiUrl: getApiUrl(),
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    appName: 'Altius Academy',
    appVersion: '1.0.0',
};

// Log de configuración en desarrollo
if (env.isDevelopment) {
    console.log('🔧 Environment Config:', {
        apiUrl: env.apiUrl,
        mode: import.meta.env.MODE,
    });
}

export default env;
