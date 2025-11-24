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

interface TeacherWorkload {
  teacher: Teacher;
  subjectCount: number;
  subjects: any[];
}

export default function TeacherGradeManagement() {
  const { user } = useAuthStore();
  const [teacherGrades, setTeacherGrades] = useState<TeacherGrade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showWorkloadStats, setShowWorkloadStats] = useState(false);
  const [workloadStats, setWorkloadStats] = useState<TeacherWorkload[]>([]);
  const [showStudentAssignment, setShowStudentAssignment] = useState(false);
  const [studentsWithoutGrade, setStudentsWithoutGrade] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedGradeForStudents, setSelectedGradeForStudents] = useState<number>(0);
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

  useEffect(() => {
    if (showStudentAssignment) {
      loadStudentsWithoutGrade();
    }
  }, [showStudentAssignment]);

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

  const loadStudentsWithoutGrade = async () => {
    if (!user?.institution?.id) return;

    try {
      const institutionId = parseInt(user.institution.id);
      const response = await coordinatorApi.getStudentsWithoutGrade(institutionId);
      if (response.success) {
        setStudentsWithoutGrade(response.students || []);
      }
    } catch (error) {
      console.error('Error loading students without grade:', error);
    }
  };

  const handleAssignStudentsToGrade = async () => {
    if (selectedStudents.length === 0) {
      alert('Selecciona al menos un estudiante');
      return;
    }
    if (selectedGradeForStudents === 0) {
      alert('Selecciona un grado');
      return;
    }

    try {
      setLoading(true);
      await coordinatorApi.assignStudentsToGrade(selectedStudents, selectedGradeForStudents);
      alert(`✅ ${selectedStudents.length} estudiantes asignados exitosamente`);
      setSelectedStudents([]);
      setSelectedGradeForStudents(0);
      await loadStudentsWithoutGrade();
    } catch (error) {
      alert('Error al asignar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === studentsWithoutGrade.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsWithoutGrade.map(s => s.id));
    }
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

  const loadWorkloadStats = async () => {
    try {
      const institutionId = parseInt(user?.institution?.id || '0');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';

      const [subjectsRes, teachersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/subjects/institution/${institutionId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token : ''}` }
        }),
        coordinatorApi.getTeachers(institutionId, 100)
      ]);

      const subjectsData = await subjectsRes.json();
      const subjects = subjectsData.subjects || [];
      const teachers = teachersRes.data;

      const teacherSubjects = new Map<number, any[]>();
      subjects.forEach((subject: any) => {
        if (subject.teacher && subject.schoolGrade) {
          const key = subject.teacher.id;
          if (!teacherSubjects.has(key)) {
            teacherSubjects.set(key, []);
          }
          teacherSubjects.get(key)!.push(subject);
        }
      });

      const stats = teachers.map((teacher: Teacher) => ({
        teacher,
        subjectCount: (teacherSubjects.get(teacher.id) || []).length,
        subjects: teacherSubjects.get(teacher.id) || []
      })).sort((a: any, b: any) => b.subjectCount - a.subjectCount);

      setWorkloadStats(stats);
      setShowWorkloadStats(true);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Grados por Profesor</h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const institutionId = parseInt(user?.institution?.id || '0');
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';
                const authStorage = localStorage.getItem('auth-storage');
                const token = authStorage ? JSON.parse(authStorage).state?.token : '';

                // Obtener todas las materias
                const response = await fetch(`${API_BASE_URL}/subjects/institution/${institutionId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success) {
                  // Extraer nombres de grado únicos
                  const gradeNames = [...new Set(
                    data.subjects
                      .filter((s: any) => s.schoolGrade)
                      .map((s: any) => `${s.schoolGrade.gradeName} (nivel ${s.schoolGrade.gradeLevel})`)
                  )].sort();

                  console.log('🔍 NOMBRES DE GRADO EN BD:', gradeNames);
                  console.log('📊 Total materias:', data.subjects.length);

                  let message = '📚 Nombres de Grado en la Base de Datos:\n\n';
                  message += gradeNames.join('\n');
                  message += '\n\n📊 Total de materias: ' + data.subjects.length;
                  message += '\n\n💡 Ver consola (F12) para más detalles';
                  alert(message);
                } else {
                  alert('Error: ' + (data.message || 'Error desconocido'));
                }
              } catch (error: any) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
              }
            }}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
          >
            🔍 Ver Grados BD
          </button>
          <button
            onClick={async () => {
              if (!confirm('🤖 Distribución Automática Optimizada\n\n' +
                '✅ 38 profesores recibirán 4 materias\n' +
                '✅ 28 profesores recibirán 3 materias\n' +
                '📚 Las materias se asignan por grado\n\n' +
                '⚠️ Esto sobrescribirá las asignaciones actuales\n\n' +
                '¿Continuar?')) return;
              setLoading(true);
              try {
                const institutionId = parseInt(user?.institution?.id || '0');
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';

                const authStorage = localStorage.getItem('auth-storage');
                const token = authStorage ? JSON.parse(authStorage).state?.token : '';

                const response = await fetch(`${API_BASE_URL}/subjects/auto-distribute/${institutionId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();

                if (data.success) {
                  let message = '✅ Distribución Completada!\n\n';
                  message += `📊 Grados Procesados: ${data.totalGrades}\n`;
                  message += `👥 Total Profesores: ${data.totalTeachers}\n`;
                  message += `📚 Materias Asignadas: ${data.subjectsAssigned}\n\n`;
                  message += `✅ Profesores con 4 materias: ${data.teachersWith4Subjects}\n`;
                  message += `✅ Profesores con 3 materias: ${data.teachersWith3Subjects}\n`;
                  if (data.teachersWithOther > 0) {
                    message += `⚠️ Profesores con otra cantidad: ${data.teachersWithOther}\n`;
                  }

                  alert(message);
                  await loadData();
                  if (showWorkloadStats) {
                    await loadWorkloadStats();
                  }
                } else {
                  alert('❌ Error: ' + data.message);
                }
              } catch (error: any) {
                console.error('❌ Error completo:', error);
                alert('❌ Error: ' + error.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            🤖 Distribuir Materias (4-3)
          </button>
          <button
            onClick={loadWorkloadStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Ver Estadísticas
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Cancelar' : 'Asignar Profesor a Grado'}
          </button>
          <button
            onClick={() => setShowStudentAssignment(!showStudentAssignment)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {showStudentAssignment ? <X size={20} /> : <Plus size={20} />}
            {showStudentAssignment ? 'Cancelar' : 'Asignar Estudiantes a Grado'}
          </button>
        </div>
      </div>

      {showWorkloadStats && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Distribución de Carga de Trabajo</h3>
            <button
              onClick={() => setShowWorkloadStats(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Resumen de estadísticas */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{workloadStats.length}</p>
              <p className="text-xs text-blue-600">Total Profesores</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {workloadStats.filter(s => s.subjectCount === 4).length}
              </p>
              <p className="text-xs text-green-600">Con 4 Materias</p>
            </div>
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-teal-600">
                {workloadStats.filter(s => s.subjectCount === 3).length}
              </p>
              <p className="text-xs text-teal-600">Con 3 Materias</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">
                {workloadStats.filter(s => s.subjectCount === 0).length}
              </p>
              <p className="text-xs text-red-600">Sin Materias</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(workloadStats.reduce((sum, s) => sum + s.subjectCount, 0) / workloadStats.length * 10) / 10}
              </p>
              <p className="text-xs text-purple-600">Promedio</p>
            </div>
          </div>

          <div className="space-y-3">
            {workloadStats.map((stat) => {
              const maxSubjects = Math.max(...workloadStats.map(s => s.subjectCount));
              const percentage = maxSubjects > 0 ? (stat.subjectCount / maxSubjects) * 100 : 0;

              // Colores según cantidad de materias
              const color = stat.subjectCount === 0 ? 'bg-red-500' :
                stat.subjectCount === 3 ? 'bg-teal-500' :
                  stat.subjectCount === 4 ? 'bg-green-500' :
                    stat.subjectCount < 3 ? 'bg-yellow-500' : 'bg-orange-500';

              const isWithoutSubjects = stat.subjectCount === 0;
              const isPerfect = stat.subjectCount === 3 || stat.subjectCount === 4;
              const isOverloaded = stat.subjectCount > 4;

              return (
                <div
                  key={stat.teacher.id}
                  className={`space-y-1 p-3 rounded-lg transition-all ${isWithoutSubjects ? 'bg-red-50 border-2 border-red-300' :
                    isPerfect ? 'bg-green-50 border-2 border-green-300' :
                      isOverloaded ? 'bg-orange-50 border-2 border-orange-300' :
                        'bg-yellow-50 border-2 border-yellow-300'
                    }`}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium flex items-center gap-2">
                      {stat.teacher.firstName} {stat.teacher.lastName}
                      {isWithoutSubjects && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                          ⚠️ Sin materias
                        </span>
                      )}
                      {stat.subjectCount === 4 && (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                          ✅ 4 materias
                        </span>
                      )}
                      {stat.subjectCount === 3 && (
                        <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">
                          ✅ 3 materias
                        </span>
                      )}
                      {isOverloaded && (
                        <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full">
                          ⚡ Sobrecargado ({stat.subjectCount})
                        </span>
                      )}
                    </span>
                    <span className={`font-bold ${isWithoutSubjects ? 'text-red-600' :
                      isPerfect ? 'text-green-600' :
                        isOverloaded ? 'text-orange-600' :
                          'text-yellow-600'
                      }`}>
                      {stat.subjectCount} {stat.subjectCount === 1 ? 'materia' : 'materias'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {stat.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stat.subjects.map((subject: any) => (
                        <span
                          key={subject.id}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${subject.color}20`,
                            color: subject.color,
                            border: `1px solid ${subject.color}40`
                          }}
                        >
                          {subject.name} ({subject.schoolGrade?.gradeName})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-red-600 italic mt-1">
                      Este profesor necesita materias asignadas
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Sin materias (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pocas (1-2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span>✅ Óptimo (3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>✅ Óptimo (4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Sobrecargado (5+)</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {showStudentAssignment && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Asignar Estudiantes a Grado</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Grado
            </label>
            <select
              value={selectedGradeForStudents}
              onChange={(e) => setSelectedGradeForStudents(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Seleccione un grado</option>
              {Object.entries(groupedGrades).map(([level, grades]) => (
                grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {getGradeName(parseInt(level))} {grade.section}
                  </option>
                ))
              ))}
            </select>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Estudiantes sin Grado ({studentsWithoutGrade.length})
              </label>
              <button
                onClick={selectAllStudents}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedStudents.length === studentsWithoutGrade.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
              {studentsWithoutGrade.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No hay estudiantes sin grado asignado
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {studentsWithoutGrade.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {student.email}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowStudentAssignment(false);
                setSelectedStudents([]);
                setSelectedGradeForStudents(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAssignStudentsToGrade}
              disabled={loading || selectedStudents.length === 0 || selectedGradeForStudents === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Asignando...' : `Asignar ${selectedStudents.length} estudiante(s)`}
            </button>
          </div>
        </div>
      )}

      {loading && !showForm && !showStudentAssignment ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <div className="space-y-6">
          {/* Resumen rápido */}
          {Object.keys(groupedGrades).length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Grados</p>
                    <p className="text-2xl font-bold text-blue-600">{teacherGrades.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profesores Únicos</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {new Set(teacherGrades.map(tg => tg.teacherId)).size}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Niveles</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.keys(groupedGrades).length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Año Académico</p>
                  <p className="text-lg font-semibold text-gray-700">{new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          )}

          {Object.keys(groupedGrades).length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              No hay grados asignados. Comience asignando profesores a grados.
            </div>
          ) : (
            Object.entries(groupedGrades)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, grades]) => (
                <div key={level} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{getGradeName(parseInt(level))}</h3>
                    <span className="text-sm text-gray-500">
                      {grades.length} {grades.length === 1 ? 'sección' : 'secciones'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {grades
                      .sort((a, b) => a.section.localeCompare(b.section))
                      .map((grade) => (
                        <TeacherGradeCard
                          key={grade.id}
                          grade={grade}
                          onDelete={handleDelete}
                        />
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

// Componente separado para la tarjeta de profesor con materias
function TeacherGradeCard({ grade, onDelete }: { grade: TeacherGrade; onDelete: (id: number) => void }) {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadTeacherSubjects();
  }, [grade.teacherId, grade.id, refreshKey]); // Agregar refreshKey para forzar recarga

  const loadAvailableSubjects = async () => {
    setLoadingAvailable(true);
    try {
      const institutionId = grade.institutionId;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api'}/subjects/institution/${institutionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token : ''}`
        }
      });
      const data = await response.json();

      if (data.success) {
        const section = grade.fullGradeName.replace(/\d+/, '').trim();

        const gradeLevelNames: Record<number, string> = {
          0: 'Preescolar',
          1: 'Primero',
          2: 'Segundo',
          3: 'Tercero',
          4: 'Cuarto',
          5: 'Quinto'
        };

        const possibleNames = [
          grade.fullGradeName,
          `${gradeLevelNames[grade.gradeLevel]} ${section}`,
          `${grade.gradeLevel}${section}`
        ];

        // Filtrar materias del mismo grado - FILTRO MÁS FLEXIBLE
        console.log('🔍 Filtrando materias para:', {
          gradeLevel: grade.gradeLevel,
          section,
          possibleNames,
          totalSubjects: data.subjects.length
        });

        const available = data.subjects.filter((s: any) => {
          if (!s.schoolGrade) return false;

          // Mismo nivel de grado
          const sameGradeLevel = s.schoolGrade.gradeLevel === grade.gradeLevel;

          // No tiene profesor O tiene otro profesor
          const availableTeacher = !s.teacher || s.teacher.id !== grade.teacherId;

          // FILTRO SIMPLIFICADO: Solo verificar nivel de grado
          // Ignorar la sección para mostrar TODAS las materias del nivel

          console.log(`  📚 ${s.name}:`, {
            gradeLevel: s.schoolGrade.gradeLevel,
            gradeName: s.schoolGrade.gradeName,
            sameGradeLevel,
            availableTeacher,
            willInclude: sameGradeLevel && availableTeacher
          });

          // SOLO verificar nivel de grado y disponibilidad de profesor
          return sameGradeLevel && availableTeacher;
        });

        console.log(`✅ Materias disponibles encontradas: ${available.length}`);
        setAvailableSubjects(available);
      }
    } catch (error) {
      console.error('Error loading available subjects:', error);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleAssignSubject = async (subjectId: number) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api';
      const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/assign-teacher`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token : ''}`
        },
        body: JSON.stringify({ teacherId: grade.teacherId })
      });

      if (!response.ok) {
        throw new Error('Error al asignar materia');
      }

      // Forzar recarga incrementando el refreshKey
      setRefreshKey(prev => prev + 1);

      // Recargar materias inmediatamente
      await Promise.all([
        loadTeacherSubjects(),
        loadAvailableSubjects()
      ]);

      // Cerrar el modal
      setShowAssignModal(false);

      alert('✅ Materia asignada exitosamente');
    } catch (error) {
      console.error('Error asignando materia:', error);
      alert('❌ Error al asignar materia');
    }
  };

  const loadTeacherSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api'}/subjects/teacher/${grade.teacherId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token : ''}`
        }
      });
      const data = await response.json();
      if (data.success) {
        console.log('🔍 Buscando materias para:', {
          teacherId: grade.teacherId,
          teacherName: grade.teacherName,
          gradeLevel: grade.gradeLevel,
          fullGradeName: grade.fullGradeName,
          totalSubjects: data.subjects.length
        });

        // Mostrar los nombres de grado que vienen de la BD
        if (data.subjects.length > 0) {
          const gradeNames = [...new Set(data.subjects.map((s: any) => s.schoolGrade?.gradeName))].filter(Boolean);
          console.log('📚 Nombres de grado en BD:', gradeNames);
          console.log('🔍 Comparando:', {
            buscando: grade.fullGradeName,
            disponibles: gradeNames,
            coincide: gradeNames.includes(grade.fullGradeName)
          });
        }

        // Extraer la sección del fullGradeName (ej: "1C" -> "C" o "0A" -> "A")
        const section = grade.fullGradeName.replace(/\d+/, '').trim();

        // Posibles formatos de nombre de grado en la BD
        const gradeLevelNames: Record<number, string> = {
          0: 'Preescolar',
          1: 'Primero',
          2: 'Segundo',
          3: 'Tercero',
          4: 'Cuarto',
          5: 'Quinto'
        };

        const possibleNames = [
          grade.fullGradeName, // Formato corto: "1C"
          `${gradeLevelNames[grade.gradeLevel]} ${section}`, // Formato largo: "Primero C"
          `${grade.gradeLevel}${section}` // Formato sin espacio: "1C"
        ];

        console.log('🔍 Buscando materias con nombres posibles:', possibleNames);

        // Filtrar materias por nivel de grado (más flexible)
        // Acepta materias que:
        // 1. Coincidan exactamente con los nombres posibles
        // 2. Contengan la sección
        // 3. Solo tengan el nivel de grado sin sección (ej: "Primero" para "Primero B")
        const gradeSubjects = data.subjects.filter((s: any) => {
          if (!s.schoolGrade) return false;

          // Mismo nivel de grado es requisito mínimo
          if (s.schoolGrade.gradeLevel !== grade.gradeLevel) return false;

          const gradeName = s.schoolGrade.gradeName;

          // Coincidencia exacta con nombres posibles
          if (possibleNames.includes(gradeName)) return true;

          // Contiene la sección
          if (gradeName.includes(section)) return true;

          // Solo tiene el nombre del nivel sin sección (ej: "Primero" para cualquier sección de Primero)
          if (gradeName === gradeLevelNames[grade.gradeLevel]) return true;

          return false;
        });

        console.log('✅ Materias filtradas:', gradeSubjects.length);
        if (gradeSubjects.length > 0) {
          console.log('📚 Nombres de grado encontrados:',
            [...new Set(gradeSubjects.map((s: any) => s.schoolGrade.gradeName))]);
        }

        setSubjects(gradeSubjects);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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

          {/* Materias que enseña */}
          {loadingSubjects ? (
            <p className="text-xs text-gray-400 mt-2">Cargando materias...</p>
          ) : subjects.length > 0 ? (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Materias:</p>
              <div className="flex flex-wrap gap-1">
                {subjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${subject.color}20`,
                      color: subject.color,
                      border: `1px solid ${subject.color}40`
                    }}
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-xs text-red-600 font-medium mb-2">⚠️ Sin materias asignadas</p>
              <button
                onClick={() => {
                  setShowAssignModal(true);
                  loadAvailableSubjects();
                }}
                className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Asignar Materias
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(grade.id)}
          className="text-red-600 hover:text-red-800"
          title="Eliminar asignación"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Modal para asignar materias */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Asignar Materias a {grade.teacherName} - {grade.fullGradeName}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {loadingAvailable ? (
              <p className="text-center py-4">Cargando materias disponibles...</p>
            ) : availableSubjects.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No hay materias disponibles para este grado
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Selecciona las materias que deseas asignar a este profesor:
                </p>
                {availableSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        {subject.teacher && (
                          <p className="text-xs text-gray-500">
                            Actualmente: {subject.teacher.firstName} {subject.teacher.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignSubject(subject.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Asignar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
