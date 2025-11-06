import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Users, Calendar, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuthStore } from '../stores/authStore';

const Assignments: React.FC = () => {
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const assignments = [
    {
      id: 1,
      title: 'Operaciones Básicas',
      description: 'Suma, resta, multiplicación y división con números de dos cifras',
      subject: 'Matemáticas',
      type: 'quiz',
      dueDate: '2025-01-15',
      totalPoints: 100,
      questions: 10,
      timeLimit: 30,
      status: 'active',
      submitted: 18,
      total: 28,
      averageGrade: 4.2,
      createdBy: 'Prof. Ana García'
    },
    {
      id: 2,
      title: 'Lectura Comprensiva',
      description: 'Análisis de texto narrativo y preguntas de comprensión',
      subject: 'Español',
      type: 'assignment',
      dueDate: '2025-01-17',
      totalPoints: 50,
      status: 'active',
      submitted: 22,
      total: 28,
      averageGrade: 4.0,
      createdBy: 'Prof. Carlos Ruiz'
    },
    {
      id: 3,
      title: 'Sistema Solar',
      description: 'Cuestionario sobre planetas y características del sistema solar',
      subject: 'Ciencias',
      type: 'quiz',
      dueDate: '2025-01-20',
      totalPoints: 80,
      questions: 15,
      timeLimit: 25,
      status: 'draft',
      submitted: 0,
      total: 28,
      createdBy: 'Prof. María López'
    },
    {
      id: 4,
      title: 'Regiones de Colombia',
      description: 'Identificación de regiones y sus características principales',
      subject: 'Sociales',
      type: 'quiz',
      dueDate: '2025-01-12',
      totalPoints: 60,
      questions: 12,
      timeLimit: 20,
      status: 'completed',
      submitted: 28,
      total: 28,
      averageGrade: 3.8,
      createdBy: 'Prof. Pedro Martín'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'warning';
      case 'draft': return 'secondary';
      default: return 'destructive';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const canCreateAssignments = user?.role === 'teacher' || user?.role === 'coordinator' || user?.role === 'super_admin';
  const isStudent = user?.role === 'student';

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const draftAssignments = assignments.filter(a => a.status === 'draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isStudent ? 'Mis Tareas 📝' : 'Gestión de Tareas 📝'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isStudent 
              ? 'Completa tus tareas y mejora tu rendimiento académico'
              : 'Crea y gestiona las tareas para tus estudiantes'
            }
          </p>
        </div>
        {canCreateAssignments && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título de la Tarea
                    </label>
                    <Input placeholder="Ej: Operaciones Básicas" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materia
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona materia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematicas">Matemáticas</SelectItem>
                        <SelectItem value="espanol">Español</SelectItem>
                        <SelectItem value="ciencias">Ciencias</SelectItem>
                        <SelectItem value="sociales">Sociales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Textarea placeholder="Describe la tarea..." rows={3} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Tarea
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Cuestionario</SelectItem>
                        <SelectItem value="assignment">Tarea Escrita</SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Límite
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntos Totales
                    </label>
                    <Input type="number" placeholder="100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Preguntas
                    </label>
                    <Input type="number" placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo Límite (minutos)
                    </label>
                    <Input type="number" placeholder="30" />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Guardar Borrador
                  </Button>
                  <Button className="flex-1">
                    Crear y Publicar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Assignments Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Activas ({activeAssignments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Completadas ({completedAssignments.length})</span>
          </TabsTrigger>
          {canCreateAssignments && (
            <TabsTrigger value="drafts" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Borradores ({draftAssignments.length})</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Todas ({assignments.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} isStudent={isStudent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} isStudent={isStudent} />
            ))}
          </div>
        </TabsContent>

        {canCreateAssignments && (
          <TabsContent value="drafts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} isStudent={isStudent} />
              ))}
            </div>
          </TabsContent>
        )}

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} isStudent={isStudent} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AssignmentCard: React.FC<{ assignment: any; isStudent: boolean }> = ({ assignment, isStudent }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'warning';
      case 'draft': return 'secondary';
      default: return 'destructive';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(assignment.status)}
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
          </div>
          <Badge variant={getStatusColor(assignment.status)}>
            {assignment.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{assignment.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-blue-600">{assignment.subject}</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(assignment.dueDate)}</span>
          </div>
        </div>

        {assignment.type === 'quiz' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Preguntas:</span>
              <span className="ml-1 font-medium">{assignment.questions}</span>
            </div>
            <div>
              <span className="text-gray-500">Tiempo:</span>
              <span className="ml-1 font-medium">{assignment.timeLimit}min</span>
            </div>
          </div>
        )}

        <div className="text-sm">
          <span className="text-gray-500">Puntos:</span>
          <span className="ml-1 font-medium">{assignment.totalPoints}</span>
        </div>

        {!isStudent && assignment.status !== 'draft' && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{assignment.submitted}/{assignment.total} entregadas</span>
            </div>
            {assignment.averageGrade && (
              <Badge variant="secondary">
                Promedio: {assignment.averageGrade}
              </Badge>
            )}
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          {isStudent ? (
            assignment.status === 'active' ? (
              <Button className="flex-1">
                <Play className="w-4 h-4 mr-1" />
                Resolver Tarea
              </Button>
            ) : (
              <Button variant="outline" className="flex-1">
                Ver Resultados
              </Button>
            )
          ) : (
            <>
              <Button size="sm" className="flex-1">
                Ver Detalles
              </Button>
              {assignment.status === 'draft' && (
                <Button size="sm" variant="outline">
                  Publicar
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Assignments;