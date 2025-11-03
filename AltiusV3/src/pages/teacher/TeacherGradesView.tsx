import React, { useState } from 'react';
import { BarChart3, Search, Plus, Edit2, Filter, Calendar, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';

interface StudentGrade {
  id: string;
  studentName: string;
  grade: number;
  maxGrade: number;
  date: string;
  status: 'pending' | 'graded' | 'needs-review';
  feedback?: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  type: 'quiz' | 'exam' | 'homework' | 'project';
  totalStudents: number;
  gradedCount: number;
  averageGrade: number;
  grades: StudentGrade[];
}

const TeacherGradesView: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for teacher's assignments
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Evaluación de Operaciones Básicas',
      subject: 'Matemáticas',
      class: '3° A',
      dueDate: '2025-10-25',
      type: 'exam',
      totalStudents: 25,
      gradedCount: 23,
      averageGrade: 4.2,
      grades: [
        { id: '1-1', studentName: 'Ana García', grade: 4.5, maxGrade: 5, date: '2025-10-26', status: 'graded', feedback: 'Excelente trabajo en multiplicación' },
        { id: '1-2', studentName: 'Carlos Pérez', grade: 3.8, maxGrade: 5, date: '2025-10-26', status: 'needs-review', feedback: 'Revisar división' },
        // More students...
      ]
    },
    {
      id: '2',
      title: 'Proyecto de Lectura',
      subject: 'Español',
      class: '3° B',
      dueDate: '2025-10-28',
      type: 'project',
      totalStudents: 28,
      gradedCount: 15,
      averageGrade: 4.0,
      grades: [
        { id: '2-1', studentName: 'Laura Martínez', grade: 4.2, maxGrade: 5, date: '2025-10-28', status: 'graded', feedback: 'Buena comprensión lectora' },
        { id: '2-2', studentName: 'Diego Ruiz', status: 'pending', grade: 0, maxGrade: 5, date: '', feedback: '' },
        // More students...
      ]
    },
  ];

  const stats = {
    pendingGrades: 15,
    averageGrade: 4.1,
    totalAssignments: 8,
    needsReview: 3
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: StudentGrade['status']) => {
    switch (status) {
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'needs-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 4.0) return 'text-blue-600';
    if (grade >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calificaciones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y registra las calificaciones de tus estudiantes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Nueva Calificación</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingGrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGrade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tareas Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revisar</p>
                <p className="text-2xl font-bold text-gray-900">{stats.needsReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Input
                        placeholder="Buscar por nombre de estudiante o tarea..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <Search className="w-4 h-4" />
                    </span>
                </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="math">Matemáticas</SelectItem>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="science">Ciencias</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Actual</SelectItem>
                  <SelectItem value="previous">Anterior</SelectItem>
                  <SelectItem value="all">Todo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map(assignment => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                    <Badge>{assignment.type}</Badge>
                    <Badge variant="outline">{assignment.class}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Entrega: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <span>{assignment.subject}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Promedio</p>
                      <p className={`text-xl font-bold ${getGradeColor(assignment.averageGrade)}`}>
                        {assignment.averageGrade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Calificados</p>
                      <p className="text-xl font-bold text-gray-900">
                        {assignment.gradedCount}/{assignment.totalStudents}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Calificar</span>
                  </Button>
                </div>
              </div>

              {/* Student Grades */}
              <div className="mt-4">
                <div className="flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estudiante
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Calificación
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Fecha
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estado
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Observaciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {assignment.grades.map((grade) => (
                          <tr key={grade.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {grade.studentName}
                            </td>
                            <td className="px-4 py-3">
                              {grade.status === 'pending' ? (
                                <span className="text-gray-500">-</span>
                              ) : (
                                <span className={`text-sm font-medium ${getGradeColor(grade.grade)}`}>
                                  {grade.grade}/{grade.maxGrade}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(grade.date)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={getStatusColor(grade.status)}>
                                {grade.status === 'graded' && 'Calificado'}
                                {grade.status === 'pending' && 'Pendiente'}
                                {grade.status === 'needs-review' && 'Revisar'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {grade.feedback || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default TeacherGradesView;