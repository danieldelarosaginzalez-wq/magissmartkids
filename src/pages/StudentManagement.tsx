import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateInstitutionModal from '../components/CreateInstitutionModal';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  institution: string;
}

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  institutionId: string;
}

interface Institution {
  id: number;
  name: string;
  address: string;
}

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    institutionId: ''
  });

  useEffect(() => {
    loadStudents();
    loadInstitutions();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/students/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStudents(data.students);
        setError('');
      } else {
        setError(data.message || 'Error al cargar estudiantes');
      }
    } catch (err) {
      setError('Error de conexión al cargar estudiantes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
    try {
      console.log('🏛️ Cargando instituciones para gestión de estudiantes...');
      const response = await fetch('/api/institutions');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.institutions) {
          setInstitutions(data.institutions);
          console.log(`✅ ${data.institutions.length} instituciones cargadas`);
        }
      }
    } catch (error) {
      console.error('Error cargando instituciones:', error);
      setError('Error cargando instituciones');
    }
  };

  const handleInstitutionCreated = (newInstitution: any) => {
    console.log('🎉 Nueva institución creada en StudentManagement:', newInstitution);
    
    // Agregar la nueva institución a la lista
    setInstitutions(prev => [...prev, newInstitution]);
    
    // Seleccionar automáticamente la nueva institución en el formulario
    setFormData(prev => ({ ...prev, institutionId: newInstitution.id.toString() }));
    
    setSuccess('Institución creada y seleccionada correctamente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = editingStudent 
        ? `/api/users/students/${editingStudent.id}`
        : '/api/users/students';
      
      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          institutionId: parseInt(formData.institutionId)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingStudent ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente');
        setShowForm(false);
        setEditingStudent(null);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', institutionId: '' });
        loadStudents();
      } else {
        setError(data.message || 'Error al guardar estudiante');
      }
    } catch (err) {
      setError('Error de conexión al guardar estudiante');
      console.error('Error:', err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      password: '',
      institutionId: student.institution?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Estudiante eliminado correctamente');
        loadStudents();
      } else {
        setError(data.message || 'Error al eliminar estudiante');
      }
    } catch (err) {
      setError('Error de conexión al eliminar estudiante');
      console.error('Error:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', institutionId: '' });
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
              <p className="text-gray-600 mt-1">Gestiona los estudiantes de tu institución</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Nuevo Estudiante
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Volver al Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución *
                </label>
                <select
                  value={formData.institutionId}
                  onChange={(e) => {
                    if (e.target.value === 'create-new') {
                      setShowCreateModal(true);
                      return;
                    }
                    setFormData({ ...formData, institutionId: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar institución</option>
                  {institutions.map((institution) => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                  {institutions.length > 0 && (
                    <option value="create-new" className="font-semibold text-blue-600">
                      ➕ Crear nueva institución
                    </option>
                  )}
                </select>
                
                {institutions.length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-700">
                      ⚠️ No hay instituciones disponibles.{' '}
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        Crea una nueva para continuar
                      </button>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña {editingStudent && '(dejar vacío para mantener la actual)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!editingStudent}
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingStudent ? 'Actualizar' : 'Crear'} Estudiante
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de estudiantes */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Estudiantes ({students.length})
            </h2>
          </div>
          
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay estudiantes registrados</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Crear el primer estudiante
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institución
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.institution}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear nueva institución */}
      <CreateInstitutionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInstitutionCreated={handleInstitutionCreated}
      />
    </div>
  );
};

export default StudentManagement;