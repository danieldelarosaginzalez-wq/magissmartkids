import { useState, useEffect } from 'react';
import { teacherGradesApi, coordinatorApi } from '../../services/api';
import { TeacherGrade, AssignTeacherGradeRequest } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { Plus, Trash2, X } from 'lucide-react';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TeacherGradeManagement() {
  const { user } = useAuthStore();
  const [teacherGrades, setTeacherGrades] = useState<TeacherGrade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AssignTeacherGradeRequest>({
    teacherId: 0,
    gradeLevel: 0, // Preescolar por defecto
    section: 'A',
    institutionId: user?.institution?.id ? parseInt(user.institution.id) : 0,
    academicYear: new Date().getFullYear().toString()
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.institution?.id) return;
    
    setLoading(true);
    try {
      const institutionId = parseInt(user.institution.id);
      const [gradesRes, teachersRes] = await Promise.all([
        teacherGradesApi.getGradesByInstitution(institutionId),
        coordinatorApi.getTeachers(institutionId, 100)
      ]);
      
      setTeacherGrades(gradesRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await teacherGradesApi.assignTeacherToGrade(formData);
      await loadData();
      setShowForm(false);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al asignar profesor al grado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta asignación?')) return;
    
    setLoading(true);
    try {
      await teacherGradesApi.removeTeacherFromGrade(id);
      await loadData();
    } catch (error) {
      alert('Error al eliminar la asignación');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: 0,
      gradeLevel: 0, // Preescolar por defecto
      section: 'A',
      institutionId: user?.institution?.id ? parseInt(user.institution.id) : 0,
      academicYear: new Date().getFullYear().toString()
    });
  };

  const sections = ['A', 'B', 'C', 'D'] as const;
  // Solo 6 grados: Preescolar (0), Primero (1), Segundo (2), Tercero (3), Cuarto (4), Quinto (5)
  const gradeLevels = [
    { value: 0, label: 'Preescolar' },
    { value: 1, label: 'Primero' },
    { value: 2, label: 'Segundo' },
    { value: 3, label: 'Tercero' },
    { value: 4, label: 'Cuarto' },
    { value: 5, label: 'Quinto' }
  ];

  // Función helper para obtener el nombre del grado
  const getGradeName = (level: number): string => {
    const grade = gradeLevels.find(g => g.value === level);
    return grade ? grade.label : `Grado ${level}`;
  };

  // Agrupar por nivel de grado
  const groupedGrades = teacherGrades.reduce((acc, grade) => {
    const level = grade.gradeLevel;
    if (!acc[level]) acc[level] = [];
    acc[level].push(grade);
    return acc;
  }, {} as Record<number, TeacherGrade[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Grados por Profesor</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Asignar Grado'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Asignar Profesor a Grado</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesor
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Seleccione un profesor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Grado
              </label>
              <select
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {gradeLevels.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sección
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    Sección {section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año Académico
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="2024"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Asignar Grado'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedGrades).length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              No hay grados asignados. Comience asignando profesores a grados.
            </div>
          ) : (
            Object.entries(groupedGrades)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, grades]) => (
                <div key={level} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">{getGradeName(parseInt(level))}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {grades
                      .sort((a, b) => a.section.localeCompare(b.section))
                      .map((grade) => (
                        <div
                          key={grade.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-blue-600">
                                {grade.fullGradeName}
                              </h4>
                              <p className="text-sm text-gray-600">{grade.teacherName}</p>
                              {grade.academicYear && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Año: {grade.academicYear}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDelete(grade.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar asignación"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
