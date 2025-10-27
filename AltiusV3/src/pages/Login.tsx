import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MagicLogoText from '../components/ui/MagicLogoText';
import Logo from '../components/ui/Logo';

import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { useFormValidation } from '../hooks/useFormValidation';

import { normalizeRole } from '../utils/roleUtils';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const { errors, validateField, validateAll } = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 6
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll(formData)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Iniciando login desde frontend:', {
        email: formData.email,
        password: '***' // No mostrar la contraseña en logs
      });

      // Llamada real a la API del backend
      const response = await authApi.login(formData.email, formData.password);
      
      console.log('✅ Respuesta del login:', response.data);

      // Verificar que el login fue exitoso
      if (response.data.success) {
        // Crear objeto de usuario con los datos del backend
        const userData = {
          id: response.data.userId.toString(),
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: normalizeRole(response.data.role), // Convertir rol del backend al frontend
          institutionId: response.data.institution?.id?.toString() || null,
          institution: response.data.institution ?? null, // INSTITUCIÓN (puede ser null)
          schoolGrade: response.data.schoolGrade ?? null, // GRADO ESCOLAR (puede ser null)
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        console.log('Datos del usuario para el store:', userData);

        // Guardar usuario y token en el store de autenticación
        login(userData, response.data.token);
        
        // Navegar al dashboard
        navigate(from, { replace: true });
      } else {
        setError(response.data.message || 'Error en el login');
      }
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Credenciales inválidas');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('No se puede conectar al servidor. Verifica tu conexión.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función convertBackendRoleToFrontend removida - ahora usamos normalizeRole



  return (
    <div className="min-h-screen bg-white">
      {/* Navbar responsivo */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Logo 
                size="lg" 
                clickable={true}
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
              <MagicLogoText size="sm" layout="inline" showHoverEffects={false} className="hidden sm:block" />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Volver al Inicio</span>
                  <span className="sm:hidden">Inicio</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido del formulario - Responsivo */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 relative overflow-hidden min-h-screen flex items-center">
        {/* Animaciones de fondo responsivas */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-[#00C764] rounded-full top-10 sm:top-20 left-4 sm:left-10 animate-pulse"></div>
          <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-[#F5A623] rounded-full top-20 sm:top-40 right-8 sm:right-20 animate-bounce"></div>
          <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-[#2E5BFF] rounded-full bottom-16 sm:bottom-30 left-8 sm:left-32 animate-ping"></div>
          <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-[#FF6B35] rounded-full top-32 sm:top-60 right-12 sm:right-40 animate-pulse delay-1000"></div>
          <div className="absolute w-5 h-5 sm:w-7 sm:h-7 bg-[#1494DE] rounded-full bottom-8 sm:bottom-20 right-4 sm:right-10 animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
          <Card className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-heading text-[#00368F] mb-2">
                Iniciar Sesión
              </CardTitle>
              <p className="text-sm sm:text-base text-gray-600 font-body">
                Accede a tu mundo de aprendizaje mágico
              </p>
            </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@magicsmartkids.com"
                    className="input-magic pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base bg-white border-2 border-gray-200 focus:border-[#00368F] focus:ring-2 focus:ring-[#00368F]/20 transition-all duration-200"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                  <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                    {showPassword ? '(visible)' : '(oculta por seguridad)'}
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña mágica"
                    className="input-magic pl-10 sm:pl-12 pr-10 sm:pr-12 h-10 sm:h-12 text-sm sm:text-base bg-white border-2 border-gray-200 focus:border-[#00368F] focus:ring-2 focus:ring-[#00368F]/20 transition-all duration-200"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00368F] transition-colors touch-target-magic p-1 rounded-full hover:bg-gray-100"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {formData.password && !showPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Contraseña ingresada ({formData.password.length} caracteres)
                  </p>
                )}
                {errors.password && (
                  <p className="mt-2 text-xs sm:text-sm text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#00368F] shadow-sm focus:border-[#00368F] focus:ring focus:ring-[#00368F]/20 focus:ring-opacity-50"
                  />
                  <span className="ml-3 text-xs sm:text-sm text-gray-600">Recordarme</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-[#00368F] hover:text-[#2E5BFF] font-medium transition-colors text-center sm:text-right"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white transition-colors duration-300 h-10 sm:h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Iniciar Sesión Mágica</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-[#00368F] hover:text-[#2E5BFF] font-semibold transition-colors"
                >
                  ¡Únete a la magia!
                </Link>
              </p>
            </div>


          </CardContent>
        </Card>
        </div>
      </section>

      {/* Footer responsivo */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Logo 
                size="sm" 
                clickable={true}
                className="h-6 sm:h-8 w-auto"
              />
              <MagicLogoText size="sm" layout="inline" showHoverEffects={false} className="sm:hidden" />
              <MagicLogoText size="md" layout="inline" showHoverEffects={false} className="hidden sm:block" />
            </div>
            <p className="text-gray-600 mb-3 sm:mb-4 font-body text-sm sm:text-base">
              Plataforma educativa mágica para niños inteligentes
            </p>
            
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm mb-3 sm:mb-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-[#00368F] transition-colors duration-300"
              >
                Inicio
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:text-[#00368F] transition-colors duration-300"
              >
                Registrarse
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <p className="text-gray-500 text-xs sm:text-sm font-body">
                © 2025 MagicSmartKids. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;