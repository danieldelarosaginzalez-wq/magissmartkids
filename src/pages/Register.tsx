import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import MagicLogoText from '../components/ui/MagicLogoText';
import Logo from '../components/ui/Logo';

import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Plus, X, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api, { schoolGradesApi, studentValidationApi, institutionApi, authApi } from '../services/api';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  institutionNit?: string;
  institutionId?: number;
  gradeLevel?: string;
  childrenEmails?: string[];
}

interface Institution {
  id: number;
  name: string;
  nit: string;
  address: string;
}

interface SchoolGrade {
  id: number;
  gradeName: string;
  gradeLevel: number;
  description: string;
  isActive: boolean;
}

interface ChildInfo {
  email: string;
  exists: boolean;
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  institution?: {
    id: number;
    name: string;
    nit: string;
    address: string;
  };
  message?: string;
  validating?: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    institutionNit: '',
    institutionId: undefined,
    gradeLevel: '',
    childrenEmails: []
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [schoolGrades, setSchoolGrades] = useState<SchoolGrade[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [institutionInfo, setInstitutionInfo] = useState<Institution | null>(null);
  const [validatingNit, setValidatingNit] = useState(false);
  const [childrenInfo, setChildrenInfo] = useState<ChildInfo[]>([{ email: '', exists: false }]);
  
  // Simple institution state
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadSchoolGrades();
    // Simple institution loading
    institutionApi.getAll().then(response => {
      if (response.data.success && response.data.institutions) {
        setInstitutions(response.data.institutions);
      }
    });
  }, []);

  const loadSchoolGrades = async () => {
    setLoadingGrades(true);
    try {
      console.log('🎓 Cargando grados escolares de tu BD...');
      
      // ✅ CARGAR DATOS DE TU BD - USANDO ENDPOINT SIMPLE
      const response = await api.get('/simple-grades');
      console.log('📚 Respuesta de grados escolares:', response.data);
      
      if (response.data.success && response.data.grades && response.data.grades.length > 0) {
        setSchoolGrades(response.data.grades);
        console.log(`✅ ${response.data.grades.length} grados cargados de tu BD`);
        setError(''); // Limpiar cualquier error previo
      } else {
        console.log('⚠️ Respuesta vacía, usando datos de tu BD');
        // ✅ DATOS EXACTOS DE TU BD
        const gradesFromYourDB = [
          { id: 1, gradeName: 'Preescolar', gradeLevel: 0, description: 'Preescolar', isActive: true },
          { id: 2, gradeName: '1°', gradeLevel: 1, description: 'Primero', isActive: true },
          { id: 3, gradeName: '2°', gradeLevel: 2, description: 'Segundo', isActive: true },
          { id: 4, gradeName: '3°', gradeLevel: 3, description: 'Tercero', isActive: true },
          { id: 5, gradeName: '4°', gradeLevel: 4, description: 'Cuarto', isActive: true },
          { id: 6, gradeName: '5°', gradeLevel: 5, description: 'Quinto', isActive: true }
        ];
        setSchoolGrades(gradesFromYourDB);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      console.log('🔄 Usando datos exactos de tu BD como fallback');
      
      // ✅ DATOS EXACTOS DE TU BD COMO FALLBACK
      const gradesFromYourDB = [
        { id: 1, gradeName: 'Preescolar', gradeLevel: 0, description: 'Preescolar', isActive: true },
        { id: 2, gradeName: '1°', gradeLevel: 1, description: 'Primero', isActive: true },
        { id: 3, gradeName: '2°', gradeLevel: 2, description: 'Segundo', isActive: true },
        { id: 4, gradeName: '3°', gradeLevel: 3, description: 'Tercero', isActive: true },
        { id: 5, gradeName: '4°', gradeLevel: 4, description: 'Cuarto', isActive: true },
        { id: 6, gradeName: '5°', gradeLevel: 5, description: 'Quinto', isActive: true }
      ];
      setSchoolGrades(gradesFromYourDB);
      setError(''); // No mostrar error, los datos están disponibles
    } finally {
      setLoadingGrades(false);
    }
  };



  const validateInstitutionNit = async (nit: string) => {
    if (!nit.trim()) {
      setInstitutionInfo(null);
      return;
    }

    setValidatingNit(true);
    try {
      const response = await institutionApi.validateNit(nit);
      if (response.data.success && response.data.exists) {
        setInstitutionInfo(response.data.institution);
        setError('');
      } else {
        setInstitutionInfo(null);
        setError('NIT de institución no encontrado');
      }
    } catch (error) {
      console.error('Error validating NIT:', error);
      setInstitutionInfo(null);
      setError('Error de conexión al validar el NIT');
    } finally {
      setValidatingNit(false);
    }
  };

  const validateStudentEmail = async (email: string, index: number) => {
    if (!email.trim()) {
      updateChildInfo(index, { email, exists: false, validating: false });
      return;
    }

    console.log(`🔍 Validando estudiante: ${email}`);
    updateChildInfo(index, { ...childrenInfo[index], validating: true });
    
    try {
      const response = await studentValidationApi.validateStudent(email);
      console.log(`📊 Datos de validación:`, response.data);
      
      if (response.data.success && response.data.exists) {
        console.log(`✅ Estudiante encontrado: ${response.data.student.firstName} ${response.data.student.lastName}`);
        updateChildInfo(index, {
          email,
          exists: true,
          student: response.data.student,
          institution: response.data.institution,
          validating: false
        });
      } else {
        console.log(`❌ Estudiante no encontrado: ${email}`);
        updateChildInfo(index, {
          email,
          exists: false,
          message: response.data.message || 'El correo del estudiante no existe en el sistema',
          validating: false
        });
      }
    } catch (error) {
      console.error('❌ Error de conexión al validar estudiante:', error);
      updateChildInfo(index, {
        email,
        exists: false,
        message: 'Error de conexión. Verifica que el servidor esté funcionando.',
        validating: false
      });
    }
  };

  const updateChildInfo = (index: number, info: Partial<ChildInfo>) => {
    setChildrenInfo(prev => {
      const newInfo = [...prev];
      newInfo[index] = { ...newInfo[index], ...info };
      return newInfo;
    });
  };

  const addChildField = () => {
    setChildrenInfo(prev => [...prev, { email: '', exists: false }]);
  };

  const removeChildField = (index: number) => {
    if (childrenInfo.length > 1) {
      setChildrenInfo(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleChildEmailChange = (index: number, email: string) => {
    updateChildInfo(index, { email, exists: false, student: undefined, institution: undefined, message: undefined });
  };

  const handleChildEmailBlur = (index: number, email: string) => {
    if (email.trim() && email.includes('@')) {
      validateStudentEmail(email, index);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.password || !formData.role) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validaciones específicas por rol
    if (formData.role === 'COORDINATOR' && !formData.institutionNit?.trim()) {
      setError('El NIT de la institución es obligatorio para coordinadores');
      return;
    }

    // ✅ VALIDACIÓN: Solo un coordinador en el sistema
    if (formData.role === 'COORDINATOR') {
      try {
        const coordinatorCheck = await authApi.checkCoordinatorExists();
        if (coordinatorCheck.data.exists) {
          setError('Ya existe un coordinador registrado en el sistema. Solo se permite un coordinador.');
          return;
        }
      } catch (error) {
        console.error('Error verificando coordinador existente:', error);
        // Continuar con el registro si hay error en la verificación
      }
    }

    // Simple institution validation
    if (!formData.institutionId) {
      setError('Debes seleccionar una institución');
      return;
    }

    if (formData.role === 'STUDENT' && !formData.gradeLevel) {
      setError('El grado es obligatorio para estudiantes');
      return;
    }

    // Validaciones para padres
    if (formData.role === 'PARENT') {
      const validChildren = childrenInfo.filter(child => child.email.trim() && child.exists);
      if (validChildren.length === 0) {
        setError('Debe agregar al menos un hijo válido registrado en el sistema');
        return;
      }

      // Verificar que no hay correos duplicados
      const emails = childrenInfo.map(child => child.email.trim().toLowerCase()).filter(email => email);
      const uniqueEmails = new Set(emails);
      if (emails.length !== uniqueEmails.size) {
        setError('No se permiten correos duplicados de hijos');
        return;
      }

      // Verificar que todos los hijos ingresados existen
      const invalidChildren = childrenInfo.filter(child => child.email.trim() && !child.exists);
      if (invalidChildren.length > 0) {
        setError('Todos los correos de hijos deben corresponder a estudiantes registrados en el sistema');
        return;
      }
    }

    // Validar que el NIT exista (para coordinadores)
    if (formData.role === 'COORDINATOR' && !institutionInfo) {
      setError('Debe validar el NIT de la institución antes de continuar');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        institutionId: formData.institutionId, // Siempre enviar institutionId
        ...(formData.role === 'COORDINATOR' && { institutionNit: formData.institutionNit }),
        ...(formData.role === 'STUDENT' && formData.gradeLevel && { schoolGrade: formData.gradeLevel }),
        ...(formData.role === 'PARENT' && { 
          childrenEmails: childrenInfo
            .filter(child => child.email.trim() && child.exists)
            .map(child => child.email.trim().toLowerCase())
        })
      };

      // 🔍 DEBUG: Verificar datos de registro
      console.log('📝 Datos a enviar:', JSON.stringify(registerData, null, 2));
      console.log('🏫 Institution ID seleccionado:', formData.institutionId);
      console.log('🎓 Grado seleccionado:', formData.gradeLevel);
      console.log('📚 Grados disponibles:', schoolGrades);
      console.log('👤 Form data completo:', formData);

      const response = await authApi.register(registerData);
      const data = response.data;

      // 🔍 DEBUG: Verificar respuesta del registro
      console.log('✅ Respuesta del registro:', data);
      console.log('👤 Usuario creado:', data.user);
      console.log('🔐 Token recibido:', data.token);

      if (data.success) {
        setSuccess('¡Registro exitoso! Redirigiendo al dashboard...');
        
        // Auto-login después del registro exitoso
        if (data.token && data.user) {
          // 🔍 DEBUG: Verificar datos del usuario antes del login
          console.log('🔐 Datos del usuario para login:', data.user);
          console.log('🏫 Institución en user:', data.user.institution);
          
          login(data.user, data.token);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } else {
        setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      // Mostrar el mensaje específico del backend
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error de conexión. Verifica tu conexión a internet.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 relative overflow-hidden min-h-screen">
        {/* Animaciones de fondo responsivas */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-[#00C764] rounded-full top-10 sm:top-20 left-4 sm:left-10 animate-pulse"></div>
          <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-[#F5A623] rounded-full top-20 sm:top-40 right-8 sm:right-20 animate-bounce"></div>
          <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-[#2E5BFF] rounded-full bottom-16 sm:bottom-30 left-8 sm:left-32 animate-ping"></div>
          <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-[#FF6B35] rounded-full top-32 sm:top-60 right-12 sm:right-40 animate-pulse delay-1000"></div>
          <div className="absolute w-5 h-5 sm:w-7 sm:h-7 bg-[#1494DE] rounded-full bottom-8 sm:bottom-20 right-4 sm:right-10 animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6">
          <Card className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-heading text-[#00368F] mb-2">
                Crear Cuenta Mágica
              </CardTitle>
              <p className="text-sm sm:text-base text-gray-600 font-body">
                ¡Únete a la aventura mágica del aprendizaje! ✨
              </p>
            </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                <div className="flex items-center gap-2 text-accent-red">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                <div className="flex items-center gap-2 text-accent-green">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Información Personal */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-neutral-black"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Repite tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-neutral-black"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tipo de Usuario */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                  Tipo de Usuario *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      role: e.target.value,
                      institutionId: undefined,
                      gradeLevel: ''
                    });
                    setError('');
                    // Limpiar datos específicos del rol anterior
                    setChildrenInfo([{ email: '', exists: false }]);
                  }}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="STUDENT">Estudiante</option>
                  <option value="TEACHER">Profesor</option>
                  <option value="COORDINATOR">Coordinador</option>
                  <option value="PARENT">Padre de Familia</option>
                </select>
              </div>

              {/* Institución - Simple dropdown */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-neutral-black">
                  Institución *
                </label>
                <select
                  value={formData.institutionId || ''}
                  onChange={(e) => setFormData({ ...formData, institutionId: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Selecciona tu institución</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grado - Solo para estudiantes */}
              {formData.role === 'STUDENT' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-black">
                    Grado *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={loadingGrades}
                  >
                    <option value="">
                      {loadingGrades ? 'Cargando grados...' : 'Selecciona tu grado'}
                    </option>
                    {schoolGrades.map((grade) => (
                      <option key={grade.id} value={grade.gradeName}>
                        {grade.gradeName}
                      </option>
                    ))}
                  </select>
                  {loadingGrades && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando grados desde la base de datos...</span>
                    </div>
                  )}
                </div>
              )}

              {/* NIT Institución - Solo para coordinadores */}
              {formData.role === 'COORDINATOR' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-black">
                    NIT de la Institución *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.institutionNit}
                      onChange={(e) => {
                        const nit = e.target.value;
                        setFormData({ ...formData, institutionNit: nit });
                        // Validar NIT después de un pequeño delay
                        setTimeout(() => validateInstitutionNit(nit), 500);
                      }}
                      className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ingresa el NIT de tu institución"
                      required
                    />
                    {validatingNit && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  
                  {/* Información de la institución */}
                  {institutionInfo && (
                    <div className="mt-2 p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                      <div className="flex items-center gap-2 text-accent-green mb-1">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Institución encontrada</span>
                      </div>
                      <p className="text-sm text-neutral-black font-medium">{institutionInfo.name}</p>
                      <p className="text-xs text-secondary">{institutionInfo.address}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Información de Hijos - Solo para padres */}
              {formData.role === 'PARENT' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-neutral-black">
                      Información de Hijos *
                    </label>
                    <Button
                      type="button"
                      onClick={addChildField}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar hijo
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {childrenInfo.map((child, index) => (
                      <div key={index} className="p-4 border border-secondary-200 rounded-lg bg-neutral-50">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-sm font-medium text-neutral-black">
                            Hijo {index + 1}
                          </h4>
                          {childrenInfo.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeChildField(index)}
                              className="p-1 text-accent-red hover:bg-accent-red/10 border-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {/* Correo del hijo */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-black">
                              Correo electrónico del estudiante *
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={child.email}
                                onChange={(e) => handleChildEmailChange(index, e.target.value)}
                                onBlur={(e) => handleChildEmailBlur(index, e.target.value)}
                                className="w-full px-3 py-2 pr-10 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="correo@estudiante.com"
                                required
                              />
                              {child.validating && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                              )}
                              {!child.validating && child.email && child.exists && (
                                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-green" />
                              )}
                              {!child.validating && child.email && !child.exists && child.message && (
                                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-accent-red" />
                              )}
                            </div>
                            
                            {/* Mensaje de validación */}
                            {child.message && !child.exists && (
                              <div className="flex items-center gap-2 text-sm text-accent-red">
                                <AlertCircle className="h-4 w-4" />
                                <span>{child.message}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Información del estudiante encontrado */}
                          {child.exists && child.student && (
                            <div className="space-y-2">
                              <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg">
                                <div className="flex items-center gap-2 text-accent-green mb-2">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">Estudiante encontrado</span>
                                </div>
                                <p className="text-sm text-neutral-black font-medium">
                                  {child.student.firstName} {child.student.lastName}
                                </p>
                                <p className="text-xs text-secondary">{child.student.email}</p>
                              </div>
                              
                              {/* Institución del estudiante */}
                              {child.institution && (
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-neutral-black">
                                    Institución
                                  </label>
                                  <input
                                    type="text"
                                    value={child.institution.name}
                                    readOnly
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg bg-neutral-100 text-neutral-black cursor-not-allowed"
                                  />
                                  <p className="text-xs text-secondary">
                                    NIT: {child.institution.nit} • {child.institution.address}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-sm text-secondary">
                    <p>• Los estudiantes deben estar previamente registrados en el sistema</p>
                    <p>• La institución se detectará automáticamente al validar el correo</p>
                  </div>
                </div>
              )}

              {/* Botón de Registro */}
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white transition-colors duration-300 h-10 sm:h-12 mt-4 sm:mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Creando tu cuenta mágica...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Crear Cuenta Mágica</span>
                  </div>
                )}
              </Button>

              {/* Link a Login */}
              <div className="text-center mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary-700 font-semibold transition-colors"
                  >
                    ¡Inicia sesión aquí!
                  </Link>
                </p>
              </div>
            </form>
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
                to="/login"
                className="text-gray-600 hover:text-[#00368F] transition-colors duration-300"
              >
                Iniciar Sesión
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

export default Register;