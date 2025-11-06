import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Calendar, Award, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuthStore } from '../stores/authStore';

const Grades: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const isStudent = user?.role === 'student';

  const grades = [
    {
      id: 1,
      subject: 'Matemáticas',
      assignment: 'Operaciones Básicas',
      grade: 4.5,
      maxGrade: 5.0,
      date: '2025-01-10',
      type: 'quiz',
      improvement: '+1.2',
      beforeGrade: 3.3,
      feedback: 'Excelente progreso en operaciones básicas'
    },
    {
      id: 2,
      subject: 'Español',
      assignment: 'Lectura Comprensiva',
      grade: 4.2,
      maxGrade: 5.0,
      date: '2025-01-08',
      type: 'assignment',
      improvement: '+0.8',
      beforeGrade: 3.4,
      feedback: 'Muy buena comprensión del texto'
    },
    {
      id: 3,
      subject: 'Ciencias',
      assignment: 'Sistema Solar',
      grade: 3.9,
      maxGrade: 5.0,
      date: '2025-01-05',
      type: 'quiz',
      improvement: '+1.1',
      beforeGrade: 2.8,
      feedback: 'Buen conocimiento de los planetas'
    },
    {
      id: 4,
      subject: 'Sociales',
      assignment: 'Regiones de Colombia',
      grade: 4.0,
      maxGrade: 5.0,
      date: '2025-01-03',
      type: 'quiz',
      improvement: '+0.6',
      beforeGrade: 3.4,
      feedback: 'Identifica bien las regiones'
    }
  ];

  const subjectAverages = [
    {
      subject: 'Matemáticas',
      currentAverage: 4.2,
      previousAverage: 3.1,
      improvement: '+1.1',
      totalAssignments: 8,
      color: '#3B82F6'
    },
    {
      subject: 'Español',
      currentAverage: 4.0,
      previousAverage: 3.3,
      improvement: '+0.7',
      totalAssignments: 6,
      color: '#10B981'
    },
    {
      subject: 'Ciencias',
      currentAverage: 3.8,
      previousAverage: 2.9,
      improvement: '+0.9',
      totalAssignments: 5,
      color: '#8B5CF6'
    },
    {
      subject: 'Sociales',
      currentAverage: 3.9,
      previousAverage: 3.2,
      improvement: '+0.7',
      totalAssignments: 4,
      color: '#F59E0B'
    }
  ];

  const overallStats = {
    currentAverage: 4.0,
    previousAverage: 3.1,
    improvement: '+0.9',
    totalAssignments: 23,
    completedAssignments: 23,
    rank: 5,
    totalStudents: 28
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 4.0) return 'text-blue-600';
    if (grade >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementColor = (improvement: string) => {
    const value = parseFloat(improvement.replace('+', ''));
    if (value >= 1.0) return 'text-green-600';
    if (value >= 0.5) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isStudent ? 'Mis Notas 📊' : 'Calificaciones 📊'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isStudent 
              ? 'Revisa tu progreso académico y mejoras'
              : 'Gestiona las calificaciones de los estudiantes'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Período Actual</SelectItem>
              <SelectItem value="previous">Período Anterior</SelectItem>
              <SelectItem value="all">Todo el Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Actual</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.currentAverage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mejora Total</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.improvement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.completedAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Posición</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.rank}°/{overallStats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Promedio por Materia</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectAverages.map((subject, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="font-medium text-gray-900">{subject.subject}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {subject.currentAverage}
                    </Badge>
                    <p className={`text-sm font-medium ${getImprovementColor(subject.improvement)}`}>
                      {subject.improvement}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Anterior: {subject.previousAverage}</span>
                    <span>{subject.totalAssignments} tareas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: subject.color,
                        width: `${(subject.currentAverage / 5) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Grades */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Notas Recientes</TabsTrigger>
          <TabsTrigger value="by-subject">Por Materia</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-4">
            {grades.map(grade => (
              <Card key={grade.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                        <Badge variant="outline">{grade.subject}</Badge>
                        <Badge variant="secondary">{grade.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{grade.feedback}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(grade.date)}</span>
                        </div>
                        <span>Antes: {grade.beforeGrade}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                        <span className="text-gray-500">/ {grade.maxGrade}</span>
                      </div>
                      <div className={`text-sm font-medium ${getImprovementColor(grade.improvement)}`}>
                        {grade.improvement}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-subject" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectAverages.map((subject, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span>{subject.subject}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Promedio Actual</span>
                      <Badge variant="secondary" className="text-lg">
                        {subject.currentAverage}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Promedio Anterior</span>
                      <span className="text-gray-500">{subject.previousAverage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mejora</span>
                      <span className={`font-medium ${getImprovementColor(subject.improvement)}`}>
                        {subject.improvement}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tareas Completadas</span>
                      <span className="text-gray-900">{subject.totalAssignments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Refuerzo Académico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjectAverages.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{subject.subject}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {subject.previousAverage} → {subject.currentAverage}
                        </span>
                        <Badge variant="success">{subject.improvement}</Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: subject.color,
                            width: `${(subject.currentAverage / 5) * 100}%` 
                          }}
                        />
                      </div>
                      <div 
                        className="absolute top-0 h-3 w-1 bg-gray-400 rounded-full"
                        style={{ left: `${(subject.previousAverage / 5) * 100}%` }}
                        title={`Promedio anterior: ${subject.previousAverage}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Grades;