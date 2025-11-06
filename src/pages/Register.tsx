import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Building, GraduationCap } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Badge } from '../components/ui/Badge';
import CreateInstitutionModal from '../components/CreateInstitutionModal';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import { normalizeRole } from '../utils/roleUtils';



const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    institutionId: '',
    // Campos específicos por rol
    academicGrade: '', // Para estudiantes
    teachingGrades: [] as string[], // Para profesores
    institutionNit: '' // Para coordinadores
  });
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para validaciones en tiempo real
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [nitValidation, setNitValidation] = useState<{
    validating: boolean;
    valid: boolean;
    institutionName?: string;
    error?: string;
  }>({ validating: false, valid: false });

  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Cargar instituciones y grados al montar el componente
  useEffect(() => {
    fetchInstitutions();
    fetchAvailableGrades();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setInstitutionsLoading(true);
      console.log('🏛️ Cargando instituciones...');
      
      const response = await fetch('/api/institutions');
      
      console.log('📡 Status de respuesta:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📥 Respuesta instituciones:', data);
      
      if (data.success && data.institutions) {
        setInstitutions(data.institutions);
        console.log(`✅ ${data.institutions.length} instituciones cargadas`);
      } else {
        console.error('❌ Error en respuesta:', data);
        setInstitutions([]);
      }
    } catch (error) {
      console.error('❌ Error cargando instituciones:', error);
      setInstitutions([]);
    } finally {
      setInstitutionsLoading(false);
    }
  };

  const fetchAvailableGrades = async () => {
    try {
      const response = await fetch('/api/institutions/academic-grades');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.grades) {
          setAvailableGrades(data.grades);
        }
      }
    } catch (error) {
      console.error('❌ Error cargando grados:', error);
      setAvailableGrades(['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°']);
    }
  };

  const validateInstitutionNit = async (nit: string) => {
    if (!nit || nit.length < 5) {
      setNitValidation({ validating: false, valid: false });
      return;
    }

    setNitValidation({ validating: true, valid: false });

    try {
      const response = await fetch(`/api/institutions/validate-nit/${nit}`);
      const data = await response.json();

      if (data.success && data.exists) {
        setNitValidation({
          validating: false,
          valid: true,
          institutionName: data.institution.name
        });
      } else {
        setNitValidation({
          validating: false,
          valid: false,
          error: 'NIT no encontrado'
        });
      }
    } catch (error) {
      setNitValidation({
        validating: false,
        valid: false,
        error: 'Error validando NIT'
      });
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`📝 Campo ${name} cambiado a:`, value);
    
    // Si selecciona "crear nueva institución", abrir modal
    if (name === 'institutionId' && value === 'create-new') {
      setShowCreateModal(true);
      return;
    }

    // Limpiar campos específicos cuando cambia el rol
    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        academicGrade: '',
        teachingGrades: [],
        institutionNit: '',
        children: []
      }));
      setNitValidation({ validating: false, valid: false });
    } else if (name === 'institutionNit') {
      setFormData(prev => ({ ...prev, [name]: value }));
      validateInstitutionNit(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
  };

  const handleGradeToggle = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      teachingGrades: prev.teachingGrades.includes(grade)
        ? prev.teachingGrades.filter(g => g !== grade)
        : [...prev.teachingGrades, grade]
    }));
  };



  const handleInstitutionCreated = (newInstitution: any) => {
    console.log('🎉 Nueva institución creada:', newInstitution);
    
    // Agregar la nueva institución a la lista
    setInstitutions(prev => [...prev, newInstitution]);
    
    // Seleccionar automáticamente la nueva institución
    setFormData(prev => ({ ...prev, institutionId: newInstitution.id.toString() }));
    
    console.log('✅ Institución seleccionada automáticamente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('📝 Iniciando registro con formData:', formData);

    // Validaciones básicas
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      setError('Por favor completa todos los campos obligatorios.');
      setIsLoading(false);
      return;
    }

    // Validaciones específicas por rol
    if (formData.role === 'student' && !formData.academicGrade) {
      setError('Por favor selecciona tu grado académico.');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'teacher' && formData.teachingGrades.length === 0) {
      setError('Por favor selecciona al menos un grado para enseñar.');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'coordinator') {
      if (!formData.institutionNit) {
        setError('Por favor ingresa el NIT de tu institución.');
        setIsLoading(false);
        return;
      }
      if (!nitValidation.valid) {
        setError('El NIT ingresado no es válido o no existe.');
        setIsLoading(false);
        return;
      }
    }



    if ((formData.role === 'student' || formData.role === 'teacher') && (!formData.institutionId || formData.institutionId === 'create-new')) {
      setError('Por favor selecciona una institución válida.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      // Preparar datos para el backend
      const registerData: any = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role
      };

      // Agregar campos específicos por rol
      if (formData.role === 'student') {
        registerData.academicGrade = formData.academicGrade;
        registerData.institutionId = parseInt(formData.institutionId);
      } else if (formData.role === 'teacher') {
        registerData.teachingGrades = formData.teachingGrades;
        registerData.institutionId = parseInt(formData.institutionId);
      } else if (formData.role === 'coordinator') {
        registerData.institutionNit = formData.institutionNit;
      }

      console.log('📤 Enviando al backend:', registerData);
      console.log('🌐 URL: POST /api/auth/register');
      console.log('📋 Content-Type: application/json');
      
      // Llamada a la API
      const response = await authApi.register(registerData);
      
      console.log('📥 Respuesta del backend:', response.data);

      // Verificar que el registro fue exitoso
      if (response.data.success && response.data.token) {
        console.log('✅ Registro exitoso, creando sesión...');
        
        const userData = {
          id: response.data.userId.toString(),
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: normalizeRole(response.data.role || formData.role),
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        console.log('👤 Datos del usuario para el store:', userData);
        
        login(userData, response.data.token);
        navigate('/dashboard');
      } else {
        console.error('❌ Registro falló:', response.data);
        setError(response.data.message || 'Error en el registro.');
      }
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      console.error('📄 Error response:', error.response?.data);
      console.error('🔢 Status code:', error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Datos inválidos. Verifica la información.');
      } else if (error.response?.status === 409) {
        setError('El correo ya está registrado.');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('No se puede conectar al servidor.');
      } else {
        setError('Error inesperado durante el registro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold">Altius Academy</span>
          </Link>
          <p className="mt-2 text-blue-100">Crea tu cuenta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Registro de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombres */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Institución - Solo para estudiantes y profesores */}
              {(formData.role === 'student' || formData.role === 'teacher') && (
                <div>
                  <label htmlFor="institutionId" className="block text-sm font-medium text-gray-700 mb-1">
                    Institución *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      id="institutionId"
                      name="institutionId"
                      value={formData.institutionId}
                      onChange={handleChange}
                      className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                      disabled={institutionsLoading}
                    >
                      <option value="">
                        {institutionsLoading ? 'Cargando instituciones...' : 'Selecciona tu institución'}
                      </option>
                      {institutions.map((institution) => (
                        <option key={institution.id} value={institution.id}>
                          {institution.name} {institution.nit && `(NIT: ${institution.nit})`}
                        </option>
                      ))}
                      {!institutionsLoading && institutions.length > 0 && (
                        <option value="create-new" className="font-semibold text-primary">
                          ➕ Crear nueva institución
                        </option>
                      )}
                    </select>
                  </div>
                  
                  {/* Estados del campo institución */}
                  {institutionsLoading && (
                    <p className="mt-1 text-xs text-primary">
                      🔄 Cargando instituciones disponibles...
                    </p>
                  )}
                  
                  {!institutionsLoading && institutions.length === 0 && (
                    <div className="mt-2 p-2 bg-accent-yellow/10 border border-accent-yellow/30 rounded-md">
                      <p className="text-xs text-accent-yellow">
                        ⚠️ No hay instituciones disponibles.{' '}
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(true)}
                          className="text-primary hover:text-primary-600 underline font-medium"
                        >
                          Crea una nueva para continuar
                        </button>
                      </p>
                    </div>
                  )}
                  
                  {formData.institutionId && formData.institutionId !== 'create-new' && (
                    <p className="mt-1 text-xs text-accent-green">
                      ✓ Institución seleccionada
                    </p>
                  )}
                </div>
              )}

              {/* Tipo de Usuario */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="student">Estudiante</option>
                  <option value="teacher">Profesor</option>
                  <option value="coordinator">Coordinador</option>
                </select>
                {formData.role && (
                  <p className="mt-1 text-xs text-accent-green">
                    ✓ Seleccionado: {
                      formData.role === 'student' ? 'Estudiante' :
                      formData.role === 'teacher' ? 'Profesor' :
                      formData.role === 'coordinator' ? 'Coordinador' : formData.role
                    }
                  </p>
                )}
              </div>

              {/* Campos específicos por rol */}
              
              {/* ESTUDIANTE: Selección de grado */}
              {formData.role === 'student' && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-neutral-black">Información Académica</h3>
                  </div>
                  <div>
                    <label htmlFor="academicGrade" className="block text-sm font-medium text-gray-700 mb-1">
                      Grado Académico *
                    </label>
                    <select
                      id="academicGrade"
                      name="academicGrade"
                      value={formData.academicGrade}
                      onChange={handleChange}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Selecciona tu grado</option>
                      {availableGrades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    {formData.academicGrade && (
                      <p className="mt-1 text-xs text-accent-green">
                        ✓ Grado seleccionado: {formData.academicGrade}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* PROFESOR: Selección múltiple de grados */}
              {formData.role === 'teacher' && (
                <div className="p-4 bg-accent-green/5 border border-accent-green/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-accent-green" />
                    <h3 className="font-medium text-neutral-black">Grados que Enseñas</h3>
                  </div>
                  <p className="text-sm text-secondary mb-3">
                    Selecciona todos los grados en los que impartes clases:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableGrades.map(grade => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleGradeToggle(grade)}
                        className={`p-2 text-sm rounded-md border transition-all duration-200 ${
                          formData.teachingGrades.includes(grade)
                            ? 'bg-accent-green text-neutral-white border-accent-green'
                            : 'bg-neutral-white text-secondary border-secondary-300 hover:border-accent-green hover:bg-accent-green/10'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                  {formData.teachingGrades.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="text-xs text-secondary">Seleccionados:</span>
                      {formData.teachingGrades.map(grade => (
                        <Badge key={grade} variant="success" className="text-xs">
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COORDINADOR: Validación de NIT */}
              {formData.role === 'coordinator' && (
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-secondary" />
                    <h3 className="font-medium text-neutral-black">Información Institucional</h3>
                  </div>
                  <div>
                    <label htmlFor="institutionNit" className="block text-sm font-medium text-gray-700 mb-1">
                      NIT de la Institución *
                    </label>
                    <div className="relative">
                      <Input
                        id="institutionNit"
                        name="institutionNit"
                        value={formData.institutionNit}
                        onChange={handleChange}
                        placeholder="Ej: 123456789-1"
                        className="pr-10"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {nitValidation.validating && (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {!nitValidation.validating && nitValidation.valid && (
                          <Check className="w-4 h-4 text-accent-green" />
                        )}
                        {!nitValidation.validating && formData.institutionNit && !nitValidation.valid && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    {nitValidation.valid && nitValidation.institutionName && (
                      <p className="mt-1 text-xs text-accent-green">
                        ✓ Institución encontrada: {nitValidation.institutionName}
                      </p>
                    )}
                    {nitValidation.error && (
                      <p className="mt-1 text-xs text-red-600">
                        ❌ {nitValidation.error}
                      </p>
                    )}
                  </div>
                </div>
              )}



              {/* Contraseñas */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite la contraseña"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Términos */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    términos y condiciones
                  </Link>
                </label>
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modal para crear nueva institución */}
        <CreateInstitutionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onInstitutionCreated={handleInstitutionCreated}
        />
      </div>
    </div>
  );
};

export default Register;