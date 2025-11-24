import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BarChart3, TrendingUp, Award, Calendar, RefreshCw, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';

interface Grade {
  id: string;
  subject: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  date: string;
  isAfterReinforcement: boolean;
  previousGrade?: number;
  improvement?: number;
}

interface SubjectAverage {
  subject: string;
  currentAverage: number;
  previousAverage: number;
  improvement: number;
  color: string;
  totalAssignments: number;
}

const NotasPage: React.FC = () => {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjectAverages, setSubjectAverages] = useState<SubjectAverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'improved'>('all');
  const [studentInfo, setStudentInfo] = useState({
    name: 'Estudiante de Prueba',
    grade: '5° Primaria'
  });

  const loadStudentInfo = useCallback(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Estudiante de Prueba';
      const gradeName = user.schoolGrade?.gradeName || '5° Primaria';
      setStudentInfo({
        name: fullName,
        grade: gradeName
      });
    }
  }, [user]);

  useEffect(() => {
    loadStudentInfo();
    loadGrades();
  }, [loadStudentInfo]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      
      // Sistema de Refuerzo - Solo mostrar materias que el estudiante está reforzando
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const fakeGrades: Grade[] = [
        // NOTAS DESPUÉS DEL REFUERZO (más recientes)
        {
          id: '1',
          subject: 'Matemáticas',
          assignment: 'Examen de Fracciones',
          grade: 4.5,
          maxGrade: 5.0,
          date: '2025-10-20',
          isAfterReinforcement: true,
          previousGrade: 3.2,
          improvement: 1.3
        },
        {
          id: '2',
          subject: 'Español',
          assignment: 'Comprensión Lectora',
          grade: 4.2,
          maxGrade: 5.0,
          date: '2025-10-18',
          isAfterReinforcement: true,
          previousGrade: 3.5,
          improvement: 0.7
        },
        {
          id: '3',
          subject: 'Ciencias Naturales',
          assignment: 'Tarea sobre Plantas',
          grade: 4.2,
          maxGrade: 5.0,
          date: '2025-10-15',
          isAfterReinforcement: false
        },
        {
          id: '4',
          subject: 'Sociales',
          assignment: 'Dibujo de la Familia',
          grade: 4.6,
          maxGrade: 5.0,
          date: '2025-10-12',
          isAfterReinforcement: false
        },
        {
          id: '5',
          subject: 'Inglés',
          assignment: 'Colores en Inglés',
          grade: 4.0,
          maxGrade: 5.0,
          date: '2025-10-10',
          isAfterReinforcement: true,
          previousGrade: 2.8,
          improvement: 1.2
        },
        // NOTAS ANTES DEL REFUERZO (más antiguas)
        {
          id: '6',
          subject: 'Inglés',
          assignment: 'Colores en Inglés (Evaluación inicial)',
          grade: 2.8,
          maxGrade: 5.0,
          date: '2025-10-08',
          isAfterReinforcement: false
        },
        {
          id: '7',
          subject: 'Matemáticas',
          assignment: 'Examen de Fracciones (Evaluación inicial)',
          grade: 3.2,
          maxGrade: 5.0,
          date: '2025-10-05',
          isAfterReinforcement: false
        },
        {
          id: '8',
          subject: 'Español',
          assignment: 'Comprensión Lectora (Evaluación inicial)',
          grade: 3.5,
          maxGrade: 5.0,
          date: '2025-10-03',
          isAfterReinforcement: false
        },
        {
          id: '9',
          subject: 'Ciencias Naturales',
          assignment: 'Partes de las Plantas',
          grade: 4.0,
          maxGrade: 5.0,
          date: '2025-09-28',
          isAfterReinforcement: false
        },
        {
          id: '10',
          subject: 'Sociales',
          assignment: 'Mi Comunidad',
          grade: 4.3,
          maxGrade: 5.0,
          date: '2025-09-25',
          isAfterReinforcement: false
        }
      ];
      
      // Solo materias de refuerzo: Matemáticas y Ciencias Naturales
      const fakeSubjectAverages: SubjectAverage[] = [
        {
          subject: 'Matemáticas',
          currentAverage: 4.43,
          previousAverage: 3.5,
          improvement: 0.93,
          color: '#3B82F6',
          totalAssignments: 17
        },
        {
          subject: 'Ciencias Naturales',
          currentAverage: 4.43,
          previousAverage: 3.8,
          improvement: 0.63,
          color: '#10B981',
          totalAssignments: 17
        }
      ];
      
      setGrades(fakeGrades);
      setSubjectAverages(fakeSubjectAverages);
    } catch (error) {
      console.error('Error loading grades:', error);
      setGrades([]);
      setSubjectAverages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = grades.filter(grade => {
    switch (filter) {
      case 'recent':
        return new Date(grade.date) >= new Date('2025-10-01');
      case 'improved':
        return grade.isAfterReinforcement && grade.improvement && grade.improvement > 0;
      default:
        return true;
    }
  });

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'bg-green-100 text-green-800 border-green-200';
    if (grade >= 4.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade >= 3.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0.5) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (improvement > 0) return <ArrowUp className="h-4 w-4 text-blue-600" />;
    if (improvement < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const overallAverage = subjectAverages.reduce((acc, subject) => acc + subject.currentAverage, 0) / subjectAverages.length;
  const overallImprovement = subjectAverages.reduce((acc, subject) => acc + subject.improvement, 0) / subjectAverages.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Notas"
          description="Revisa tu progreso académico y mejoras"
          icon={BarChart3}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Notas"
        description="Revisa tu progreso académico y mejoras"
        icon={BarChart3}
        action={
          <Button 
            onClick={loadGrades}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{overallAverage.toFixed(2)}</p>
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
                <p className="text-sm font-medium text-gray-600">Mejora Promedio</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                  +{overallImprovement.toFixed(2)}
                  <ArrowUp className="h-5 w-5 text-green-600" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Materias en Refuerzo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjectAverages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promedios por Materia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progreso por Materia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAverages.map((subject) => (
              <div key={subject.subject} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getGradeColor(subject.currentAverage)}>
                      {subject.currentAverage.toFixed(2)}
                    </Badge>
                    {subject.improvement !== 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        {getImprovementIcon(subject.improvement)}
                        <span className={
                          subject.improvement > 0 ? 'text-green-600' : 
                          subject.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                        }>
                          {subject.improvement > 0 ? '+' : ''}{subject.improvement.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {subject.totalAssignments} evaluaciones • 
                  Promedio anterior: {subject.previousAverage.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="border-secondary-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Todas las Notas
            </Button>
            <Button
              variant={filter === 'recent' ? 'default' : 'outline'}
              onClick={() => setFilter('recent')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Recientes
            </Button>
            <Button
              variant={filter === 'improved' ? 'default' : 'outline'}
              onClick={() => setFilter('improved')}
              size="sm"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Con Mejoras
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Boletín Estudiantil */}
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              📋 BOLETÍN DE CALIFICACIONES - REFUERZO ACADÉMICO
            </CardTitle>
            <div className="text-sm text-gray-600">
              <p><strong>Estudiante:</strong> {studentInfo.name}</p>
              <p><strong>Grado:</strong> {studentInfo.grade}</p>
              <p><strong>Año Lectivo:</strong> 2025</p>
              <p><strong>Período:</strong> Tercer Período</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 border-r">Materia</th>
                  <th className="text-left p-4 font-semibold text-gray-900 border-r">Profesor</th>
                  <th className="text-center p-4 font-semibold text-gray-900 border-r">
                    Nota en Clase<br/>
                    <span className="text-xs font-normal text-gray-600">(Evaluación inicial)</span>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900 border-r">
                    Nota Reforzada<br/>
                    <span className="text-xs font-normal text-gray-600">(Promedio refuerzo)</span>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900 border-r">
                    Total Evaluaciones<br/>
                    <span className="text-xs font-normal text-gray-600">(Refuerzo)</span>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    Promedio Final
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-r">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      Matemáticas
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 border-r">Prof. Valeria Torres</td>
                  <td className="p-4 text-center border-r">
                    <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">3.5</Badge>
                    <p className="text-xs text-gray-500 mt-1">Evaluación inicial</p>
                  </td>
                  <td className="p-4 text-center border-r">
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">4.43</Badge>
                    <div className="flex items-center justify-center gap-1 text-green-600 text-xs mt-1">
                      <ArrowUp className="h-3 w-3" />
                      +0.93
                    </div>
                  </td>
                  <td className="p-4 text-center border-r">
                    <span className="font-semibold text-gray-700 text-lg">17</span>
                    <p className="text-xs text-gray-500 mt-1">tareas</p>
                  </td>
                  <td className="p-4 text-center">
                    <Badge className="bg-green-100 text-green-800 font-bold text-lg px-4 py-2">4.43</Badge>
                  </td>
                </tr>
                
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-r">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Ciencias Naturales
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 border-r">Prof. Valeria Torres</td>
                  <td className="p-4 text-center border-r">
                    <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">3.8</Badge>
                    <p className="text-xs text-gray-500 mt-1">Evaluación inicial</p>
                  </td>
                  <td className="p-4 text-center border-r">
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">4.43</Badge>
                    <div className="flex items-center justify-center gap-1 text-green-600 text-xs mt-1">
                      <ArrowUp className="h-3 w-3" />
                      +0.63
                    </div>
                  </td>
                  <td className="p-4 text-center border-r">
                    <span className="font-semibold text-gray-700 text-lg">17</span>
                    <p className="text-xs text-gray-500 mt-1">tareas</p>
                  </td>
                  <td className="p-4 text-center">
                    <Badge className="bg-green-100 text-green-800 font-bold text-lg px-4 py-2">4.43</Badge>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-blue-50 border-t-2">
                <tr>
                  <td colSpan={2} className="p-4 font-bold text-gray-900 text-right">
                    PROMEDIO GENERAL:
                  </td>
                  <td colSpan={2} className="p-4 text-center">
                    <span className="text-sm text-gray-600">Total Evaluaciones: 34</span>
                  </td>
                  <td colSpan={2} className="p-4 text-center">
                    <Badge className="bg-blue-600 text-white font-bold text-lg px-4 py-2">
                      4.43
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>




    </div>
  );
};

export default NotasPage;