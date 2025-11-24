import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { api, coordinatorApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import TeacherDetailModal from './TeacherDetailModal';
import StudentDetailModal from './StudentDetailModal';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserManagementPanelProps {
  institutionNit: string;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({ institutionNit }) => {
  const { user } = useAuthStore();
  // Datos de muestra para demostración
  const sampleUsers: User[] = [
    // Profesores
    {
      id: 1,
      firstName: 'María Elena',
      lastName: 'García Rodríguez',
      email: 'maria.garcia@colegio.edu.co',
      role: 'TEACHER',
      isActive: true,
      createdAt: '2024-01-15T08:30:00Z'
    },
    {
      id: 2,
      firstName: 'Carlos Alberto',
      lastName: 'Mendoza Silva',
      email: 'carlos.mendoza@colegio.edu.co',
      role: 'TEACHER',
      isActive: true,
      createdAt: '2024-02-10T09:15:00Z'
    },
    {
      id: 3,
      firstName: 'Ana Sofía',
      lastName: 'López Herrera',
      email: 'ana.lopez@colegio.edu.co',
      role: 'TEACHER',
      isActive: false,
      createdAt: '2024-01-20T10:45:00Z'
    },
    {
      id: 4,
      firstName: 'Roberto',
      lastName: 'Jiménez Castro',
      email: 'roberto.jimenez@colegio.edu.co',
      role: 'TEACHER',
      isActive: true,
      createdAt: '2024-03-05T14:20:00Z'
    },
    // Estudiantes
    {
      id: 5,
      firstName: 'Valentina',
      lastName: 'Morales Pérez',
      email: 'valentina.morales@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-01T08:00:00Z'
    },
    {
      id: 6,
      firstName: 'Santiago',
      lastName: 'Ramírez Gómez',
      email: 'santiago.ramirez@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-01T08:05:00Z'
    },
    {
      id: 7,
      firstName: 'Isabella',
      lastName: 'Torres Vargas',
      email: 'isabella.torres@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-02T08:10:00Z'
    },
    {
      id: 8,
      firstName: 'Mateo',
      lastName: 'Hernández Cruz',
      email: 'mateo.hernandez@estudiante.edu.co',
      role: 'STUDENT',
      isActive: false,
      createdAt: '2024-02-03T08:15:00Z'
    },
    {
      id: 9,
      firstName: 'Camila',
      lastName: 'Ruiz Martínez',
      email: 'camila.ruiz@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-05T08:20:00Z'
    },
    {
      id: 10,
      firstName: 'Alejandro',
      lastName: 'Vásquez Rojas',
      email: 'alejandro.vasquez@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-08T08:25:00Z'
    },
    {
      id: 11,
      firstName: 'Sofía',
      lastName: 'Castillo Díaz',
      email: 'sofia.castillo@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-10T08:30:00Z'
    },
    {
      id: 12,
      firstName: 'Daniel',
      lastName: 'Guerrero Sánchez',
      email: 'daniel.guerrero@estudiante.edu.co',
      role: 'STUDENT',
      isActive: true,
      createdAt: '2024-02-12T08:35:00Z'
    }
  ];

  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'teachers' | 'students'>('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showTeacherDetail, setShowTeacherDetail] = useState<{ id: number; name: string } | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, [selectedTab, institutionNit]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando usuarios reales del backend...');

      const institutionId = parseInt(user?.institution?.id || '1');

      // Cargar profesores y estudiantes del backend
      const [teachersRes, studentsRes] = await Promise.all([
        coordinatorApi.getTeachers(institutionId, 100),
        coordinatorApi.getStudents(institutionId, 100)
      ]);

      const teachers = teachersRes.data || [];
      const students = studentsRes.data || [];

      // Combinar todos los usuarios
      const allUsers = [...teachers, ...students];

      console.log(`✅ Usuarios cargados: ${teachers.length} profesores, ${students.length} estudiantes`);

      setUsers(allUsers);
    } catch (error) {
      console.error('❌ Error loading users:', error);
      // Si falla, usar datos de muestra
      setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios por tipo y término de búsqueda
  const filteredUsers = users
    .filter(user => {
      const isCorrectType = selectedTab === 'teachers'
        ? user.role === 'TEACHER'
        : user.role === 'STUDENT';
      return isCorrectType;
    })
    .filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowCreateForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
      if (selectedTab === 'teachers') {
        await coordinatorApi.deleteTeacher(userId);
      } else {
        await coordinatorApi.deleteStudent(userId);
      }
      alert('✅ Usuario eliminado exitosamente');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Error al eliminar usuario');
    }
  };

  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    try {
      const updateData = { isActive: !isActive };

      if (selectedTab === 'teachers') {
        await coordinatorApi.updateTeacher(userId, updateData);
      } else {
        await coordinatorApi.updateStudent(userId, updateData);
      }

      alert(`✅ Usuario ${!isActive ? 'activado' : 'desactivado'} exitosamente`);
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('❌ Error al actualizar estado del usuario');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  // Calcular estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const teachers = users.filter(u => u.role === 'TEACHER').length;
  const students = users.filter(u => u.role === 'STUDENT').length;
  const parents = 0; // Por ahora no hay padres en los datos de muestra

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios 👥</h2>
          <p className="text-gray-600">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
          Nuevo Usuario
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          <div className="text-sm text-gray-600">Activos</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
          <div className="text-sm text-gray-600">Inactivos</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{teachers}</div>
          <div className="text-sm text-gray-600">Profesores</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{students}</div>
          <div className="text-sm text-gray-600">Estudiantes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{parents}</div>
          <div className="text-sm text-gray-600">Padres</div>
        </Card>
      </div>

      {/* Role Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Selecciona tu rol:</span>
        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value as 'teachers' | 'students')}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="teachers">Profesores</option>
          <option value="students">Estudiantes</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('teachers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'teachers'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Profesores
          </button>
          <button
            onClick={() => setSelectedTab('students')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'students'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Estudiantes
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Users List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Usuarios ({filteredUsers.length})
          </h3>
        </div>
        {filteredUsers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No se encontraron usuarios"
              description={`No hay ${selectedTab === 'teachers' ? 'profesores' : 'estudiantes'} que coincidan con tu búsqueda`}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institución
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'TEACHER'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                        }`}>
                        {user.role === 'TEACHER' ? 'Profesor' : 'Estudiante'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Colegio San José
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        onClick={() => {
                          if (selectedTab === 'teachers') {
                            setShowTeacherDetail({
                              id: user.id,
                              name: `${user.firstName} ${user.lastName}`
                            });
                          } else {
                            setShowStudentDetail({
                              id: user.id,
                              name: `${user.firstName} ${user.lastName}`
                            });
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        onClick={() => handleEditUser(user)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        variant="outline"
                        size="sm"
                        className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {user.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <UserFormModal
          user={editingUser}
          userType={selectedTab}
          institutionNit={institutionNit}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadUsers();
          }}
        />
      )}

      {/* Teacher Detail Modal */}
      {showTeacherDetail && (
        <TeacherDetailModal
          teacherId={showTeacherDetail.id}
          teacherName={showTeacherDetail.name}
          onClose={() => setShowTeacherDetail(null)}
        />
      )}

      {/* Student Detail Modal */}
      {showStudentDetail && (
        <StudentDetailModal
          studentId={showStudentDetail.id}
          studentName={showStudentDetail.name}
          onClose={() => setShowStudentDetail(null)}
        />
      )}
    </div>
  );
};

interface UserFormModalProps {
  user: User | null;
  userType: 'teachers' | 'students';
  institutionNit: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  user,
  userType,
  institutionNit,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    isActive: user?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        isActive: formData.isActive,
        role: userType === 'teachers' ? 'TEACHER' : 'STUDENT',
        institutionNit
      };

      if (user) {
        // Actualizar usuario existente
        if (userType === 'teachers') {
          await coordinatorApi.updateTeacher(user.id, payload);
        } else {
          await coordinatorApi.updateStudent(user.id, payload);
        }
        alert('✅ Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        if (userType === 'teachers') {
          await coordinatorApi.createTeacher(payload);
        } else {
          await coordinatorApi.createStudent(payload);
        }
        alert('✅ Usuario creado exitosamente');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('❌ Error al guardar el usuario: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {user ? 'Editar' : 'Crear'} {userType === 'teachers' ? 'Profesor' : 'Estudiante'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {user ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </label>
            <input
              type="password"
              required={!user}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              required={!user || formData.password !== ''}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Usuario activo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};