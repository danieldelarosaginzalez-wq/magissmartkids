import React, { useState } from 'react';
import { Plus, BookOpen, Users, BarChart3, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuthStore } from '../stores/authStore';

const Subjects: React.FC = () => {
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const subjects = [
    {
      id: 1,
      name: 'Matemáticas',
      description: 'Operaciones básicas, fracciones y geometría',
      gradeLevel: '3°',
      teacher: 'Prof. Ana García',
      studentsCount: 28,
      assignmentsCount: 12,
      averageGrade: 4.2,
      color: '#3B82F6',
      isActive: true
    },
    {
      id: 2,
      name: 'Español',
      description: 'Lectura comprensiva, gramática y escritura',
      gradeLevel: '3°',
      teacher: 'Prof. Carlos Ruiz',
      studentsCount: 28,
      averageGrade: 4.0,
      assignmentsCount: 10,
      color: '#10B981',
      isActive: true
    },
    {
      id: 3,
      name: 'Ciencias Naturales',
      description: 'Exploración del mundo natural',
      gradeLevel: '3°',
      teacher: 'Prof. María López',
      studentsCount: 28,
      averageGrade: 3.8,
      assignmentsCount: 8,
      color: '#8B5CF6',
      isActive: true
    },
    {
      id: 4,
      name: 'Ciencias Sociales',
      description: 'Historia, geografía y civismo',
      gradeLevel: '3°',
      teacher: 'Prof. Pedro Martín',
      studentsCount: 28,
      averageGrade: 3.9,
      assignmentsCount: 6,
      color: '#F59E0B',
      isActive: true
    }
  ];

  const handleCreateSubject = () => {
    setIsCreateModalOpen(false);
    // Aquí iría la lógica para crear la materia
  };

  const canCreateSubjects = user?.role === 'teacher' || user?.role === 'coordinator' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Materias 📚</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'Tus materias y progreso académico'
              : 'Gestiona las materias del curso'
            }
          </p>
        </div>
        {canCreateSubjects && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nueva Materia</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Materia</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Materia
                  </label>
                  <Input placeholder="Ej: Matemáticas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Textarea placeholder="Descripción de la materia..." rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1° Primaria</SelectItem>
                      <SelectItem value="2">2° Primaria</SelectItem>
                      <SelectItem value="3">3° Primaria</SelectItem>
                      <SelectItem value="4">4° Primaria</SelectItem>
                      <SelectItem value="5">5° Primaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleCreateSubject}>
                    Crear Materia
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>
                <Badge variant="outline">{subject.gradeLevel}</Badge>
              </div>
              <p className="text-sm text-gray-600">{subject.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{subject.studentsCount} estudiantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>{subject.assignmentsCount} tareas</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Promedio:</span>
                  <Badge variant="secondary">{subject.averageGrade}</Badge>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Profesor: {subject.teacher}
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver Detalles
                </Button>
                {canCreateSubjects && (
                  <>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subject Details Modal */}
      {selectedSubject && (
        <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedSubject.color }}
                />
                <span>{selectedSubject.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">{selectedSubject.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Información General</h4>
                  <div className="text-sm space-y-1">
                    <p>Grado: {selectedSubject.gradeLevel}</p>
                    <p>Profesor: {selectedSubject.teacher}</p>
                    <p>Estudiantes: {selectedSubject.studentsCount}</p>
                    <p>Tareas: {selectedSubject.assignmentsCount}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Rendimiento</h4>
                  <div className="text-sm space-y-1">
                    <p>Promedio: {selectedSubject.averageGrade}</p>
                    <p>Estado: Activa</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Subjects;