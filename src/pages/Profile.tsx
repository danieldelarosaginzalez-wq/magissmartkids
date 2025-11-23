import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Shield, Save, X, Camera, Lock, School, BookOpen, Calendar } from 'lucide-react';
import { usersApi, teacherApi } from '../services/api';
import { translateRole, getRoleIcon } from '../utils/roleTranslations';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user && user.role.toString() === 'TEACHER') {
      loadTeacherSubjects();
    }
  }, [user]);

  const loadTeacherSubjects = async () => {
    try {
      const response = await teacherApi.getSubjects();
      const cuartoCSubjects = (response.data.subjects || []).filter((s: any) => s.grade === 'Cuarto C');
      setSubjects(cuartoCSubjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccess('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Actualizando perfil del usuario:', user.id);
      console.log('📝 Datos a actualizar:', formData);

      // Llamar a la API para actualizar el usuario
      const response = await usersApi.updateProfile(formData);
      
      console.log('✅ Perfil actualizado:', response.data);

      if (response.data.success) {
        // Actualizar el store local
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName
        });

        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Error al actualizar el perfil');
      }
    } catch (error: any) {
      console.error('❌ Error actualizando perfil:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 403) {
        setError('No tienes permisos para actualizar este perfil');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else {
        setError('Error al actualizar el perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Función removida - ahora usamos translateRole centralizada

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No se encontró información del usuario.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Información personal y académica
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Información Personal</span>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  Editar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      {getRoleIcon(user.role)} {translateRole(user.role)}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres
                  </label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tus nombres"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.firstName}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tus apellidos"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.lastName}</span>
                    </div>
                  )}
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    El email no se puede modificar
                  </p>
                </div>



                {/* Role (Read Only) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol en el Sistema
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {getRoleIcon(user.role)} {translateRole(user.role)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo los coordinadores pueden cambiar roles
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Guardando...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información Académica - Solo para profesores */}
        {user.role.toString() === 'TEACHER' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <School className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{user.institution?.name || 'No asignada'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grados Asignados
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">Cuarto C</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Ingreso
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materias Asignadas
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{subjects.length} materias</span>
                  </div>
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mis Materias
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subjects.map((subject: unknown, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-gray-900">{subject.name || subject.subjectName}</p>
                        <p className="text-sm text-gray-600">{subject.totalStudents || 0} estudiantes</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Acciones Rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Actualizar Información
              </Button>
              <Button
                onClick={() => alert('Funcionalidad de cambio de foto próximamente')}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Cambiar Foto
              </Button>
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Cambio de Contraseña */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Cambiar Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setError('');
                    }}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;