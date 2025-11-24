import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BookOpen, TrendingUp, Calendar, Award, RefreshCw } from 'lucide-react';
import api, { teacherApi } from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface Subject {
  id: string;
  name: string;
  teacher: string;
  progress: number;
  grade: number;
  color: string;
  totalTasks: number;
  completedTasks: number;
  teacherEmail?: string;
  nextTask?: string;
  nextTaskDate?: string;
}

const MateriasPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const { user } = useAuthStore.getState();

      // 🆕 Usar el NUEVO endpoint según el rol
      const response = user?.role === 'TEACHER'
        ? await teacherApi.getSubjects()
        : await api.get('/students/me/subjects'); // 🆕 NUEVO ENDPOINT

      console.log('📊 Materias recibidas del backend:', response.data);

      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

      // Mapear la respuesta del backend al formato esperado
      let mappedSubjects: Subject[] = [];

      // 🆕 El nuevo endpoint retorna { success: true, subjects: [...], total: X, grade: "..." }
      const dataArray = response.data.subjects || [];
      console.log('📊 Materias encontradas:', dataArray.length);

      if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
        mappedSubjects = dataArray.map((subject: any, index: number) => {
          console.log('📚 Mapeando materia:', subject.name);
          return {
            id: subject.id?.toString() || index.toString(),
            name: subject.name || 'Sin nombre',
            teacher: subject.teacher ? `${subject.teacher.name}` : 'Sin profesor',
            progress: 0, // TODO: Calcular progreso real
            grade: 0, // TODO: Calcular promedio real
            color: subject.color || colors[index % colors.length],
            totalTasks: 0, // TODO: Contar tareas reales
            completedTasks: 0,
            teacherEmail: subject.teacher?.email || '',
            nextTask: undefined,
            nextTaskDate: undefined
          };
        });
      }

      console.log('✅ Materias mapeadas:', mappedSubjects.length);
      setSubjects(mappedSubjects);
    } catch (error) {
      console.error('❌ Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'bg-green-100 text-green-800 border-green-200';
    if (grade >= 4.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade >= 3.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10B981'; // Verde
    if (progress >= 80) return '#3B82F6'; // Azul
    if (progress >= 70) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Materias"
          description="Revisa tu progreso en cada materia"
          icon={BookOpen}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Materias"
        description="Revisa tu progreso en cada materia"
        icon={BookOpen}
        action={
          <Button
            onClick={loadSubjects}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materias</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(subjects.reduce((acc, s) => acc + s.grade, 0) / subjects.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de materias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className="border-secondary-200 hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-neutral-black flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-secondary mt-1">
                    {subject.teacher}
                  </p>
                </div>
                <Badge className={getGradeColor(subject.grade)}>
                  {subject.grade.toFixed(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Progreso</span>
                  <span className="text-sm text-gray-500">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${subject.progress}%`,
                      backgroundColor: getProgressColor(subject.progress)
                    }}
                  ></div>
                </div>
              </div>

              {/* Estadísticas de tareas */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.completedTasks}</p>
                  <p className="text-xs text-gray-600">Completadas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.totalTasks - subject.completedTasks}</p>
                  <p className="text-xs text-gray-600">Pendientes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.totalTasks}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>

              {/* Información del profesor y promedio */}
              <div className="space-y-3">
                {/* Promedio */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Promedio</span>
                    <Badge className={getGradeColor(subject.grade)}>
                      {subject.grade.toFixed(2)}
                    </Badge>
                  </div>
                </div>

                {/* Información del profesor */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Información del Profesor</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-700">{subject.teacher}</p>
                    {subject.teacherEmail && (
                      <a
                        href={`mailto:${subject.teacherEmail}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>📧</span>
                        <span className="truncate">{subject.teacherEmail}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MateriasPage;