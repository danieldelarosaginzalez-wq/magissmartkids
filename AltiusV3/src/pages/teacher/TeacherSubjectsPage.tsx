import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Users, TrendingUp, RefreshCw, Plus, Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

interface TeacherSubject {
  id: string;
  nombre: string;
  grado: string;
  estudiantes: number;
  progresoPromedio: number;
  color: string;
}

const TeacherSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Materias"
          description="Gestiona tus materias y grados asignados"
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
        description="Gestiona tus materias y grados asignados"
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

      {subjects.length === 0 ? (
        <EmptyState
          icon="book"
          title="No hay materias asignadas"
          description="Contacta al coordinador para que te asigne materias y grados."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="border-secondary-200 hover:shadow-lg transition-all duration-200 hover:border-primary-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-neutral-black flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.nombre}
                    </CardTitle>
                    <p className="text-sm text-secondary mt-1">
                      Grado: {subject.grado}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Activa
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-black">
                      {subject.estudiantes}
                    </p>
                    <p className="text-xs text-secondary">Estudiantes</p>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-accent-green" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-black">
                      {subject.progresoPromedio.toFixed(1)}%
                    </p>
                    <p className="text-xs text-secondary">Progreso</p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Progreso General</span>
                    <span className="text-neutral-black font-medium">
                      {subject.progresoPromedio.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-accent-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${subject.progresoPromedio}%` }}
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Link 
                    to={`/profesor/calificaciones?materia=${subject.id}&grado=${encodeURIComponent(subject.grado)}`}
                    className="flex-1"
                  >
                    <Button 
                      className="w-full bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Estudiantes
                    </Button>
                  </Link>
                  <Link 
                    to={`/profesor/tareas?materia=${subject.id}&grado=${encodeURIComponent(subject.grado)}`}
                  >
                    <Button 
                      variant="outline"
                      className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Tarea
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectsPage;