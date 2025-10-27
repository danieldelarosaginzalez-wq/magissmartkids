import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BookOpen, TrendingUp, Calendar, RefreshCw, School, AlertTriangle, Users, MessageCircle } from 'lucide-react';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

interface ParentStats {
  totalChildren: number;
  totalSubjects: number;
  averageGrade: number;
  upcomingTasks: number;
  loading: boolean;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  subjects: Array<{
    name: string;
    grade: number;
  }>;
  averageGrade: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'meeting' | 'report' | 'event';
  childName?: string;
}

const ParentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ParentStats>({
    totalChildren: 0,
    totalSubjects: 0,
    averageGrade: 0,
    upcomingTasks: 0,
    loading: true
  });
  const [children, setChildren] = useState<Child[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    loadParentData();
  }, []);

  const loadParentData = async () => {
    await Promise.all([
      loadStats(),
      loadChildren(),
      loadUpcomingEvents()
    ]);
  };

  // 🎭 DATOS FICTICIOS PARA LA PRESENTACIÓN
  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // 🎭 SIMULACIÓN DE LOADING
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // ✅ ESTADÍSTICAS FICTICIAS REALISTAS
      setStats({
        totalChildren: 2,
        totalSubjects: 10,
        averageGrade: 4.4,
        upcomingTasks: 5,
        loading: false
      });
    } catch (error) {
      console.error('Error loading parent stats:', error);
      setStats({
        totalChildren: 2,
        totalSubjects: 10,
        averageGrade: 4.4,
        upcomingTasks: 5,
        loading: false
      });
    }
  };

  const loadChildren = async () => {
    try {
      setLoadingChildren(true);
      const response = await fetch('/api/parent/children', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChildren(data.children || []);
      } else {
        // Sin datos de fallback - mostrar estado vacío
        setChildren([]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setChildren([]);
    } finally {
      setLoadingChildren(false);
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/parent/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUpcomingEvents(data.events || []);
      } else {
        // Sin datos de fallback - mostrar estado vacío
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error('Error loading upcoming events:', error);
      setUpcomingEvents([]);
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Badge variant="warning" className="text-xs">Reunión</Badge>;
      case 'report':
        return <Badge variant="secondary" className="text-xs">Reporte</Badge>;
      case 'event':
        return <Badge variant="success" className="text-xs">Evento</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">General</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              👨‍👩‍👧‍👦
            </div>
            Hola, {user?.firstName}
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Seguimiento del progreso académico de tus hijos
          </p>
        </div>
        <Button 
          onClick={loadParentData}
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          disabled={stats.loading}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>

      {/* Institution Info */}
      {user?.institution ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <School className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-black">
                  {user.institution.name}
                </h3>
                <p className="text-sm sm:text-base text-secondary flex items-center gap-2">
                  <span>{getRoleIcon(user.role)}</span>
                  <span>{translateRole(user.role)}</span>
                </p>
                {user.institution.address && (
                  <p className="text-xs sm:text-sm text-secondary mt-1">
                    📍 {user.institution.address}
                  </p>
                )}
              </div>
              {stats.upcomingTasks > 0 && (
                <Badge variant="warning" className="text-xs">
                  {stats.upcomingTasks} eventos
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent-yellow/30 bg-accent-yellow/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-accent-yellow" />
              <div>
                <p className="font-medium text-neutral-black">Sin institución asignada</p>
                <p className="text-sm text-secondary">Contacta al administrador del sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Hijos</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalChildren}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Materias Total</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalSubjects}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Promedio General</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.averageGrade.toFixed(1)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Próximos Eventos</p>
                {stats.loading ? (
                  <div className="animate-pulse">
                    <div className="h-6 sm:h-8 bg-secondary-200 rounded w-12"></div>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.upcomingTasks}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-primary/10 rounded">
                <Users className="h-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span>Progreso de mis Hijos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingChildren ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse p-4 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 bg-secondary-200 rounded w-24"></div>
                      <div className="h-6 bg-secondary-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex justify-between items-center">
                          <div className="h-4 bg-secondary-200 rounded w-20"></div>
                          <div className="h-4 bg-secondary-200 rounded w-8"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {children.map((child, index) => (
                  <div key={child.id} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-primary/5' : 'bg-accent-green/5'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="font-medium text-base sm:text-lg text-neutral-black">
                        {child.firstName} {child.lastName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {child.grade}
                        </Badge>
                        <Badge 
                          variant={
                            child.averageGrade >= 4.0 ? 'success' :
                            child.averageGrade >= 3.0 ? 'warning' :
                            'destructive'
                          }
                          className="text-xs"
                        >
                          Promedio: {child.averageGrade.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {child.subjects.map((subject, subIndex) => (
                        <div key={subIndex} className="flex justify-between items-center">
                          <span className="text-sm text-neutral-black">{subject.name}</span>
                          <Badge 
                            variant={
                              subject.grade >= 4.0 ? 'success' :
                              subject.grade >= 3.0 ? 'warning' :
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {subject.grade.toFixed(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {children.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-secondary">No se encontraron hijos registrados</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <div className="p-1 bg-accent-yellow/10 rounded">
                <Calendar className="h-4 h-4 sm:w-5 sm:h-5 text-accent-yellow" />
              </div>
              <span>Próximas Actividades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-black text-sm">{event.title}</p>
                    <p className="text-xs text-secondary">{event.description}</p>
                    <p className="text-xs text-secondary mt-1">{event.date}</p>
                  </div>
                  {getEventBadge(event.type)}
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-secondary">No hay eventos próximos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Section */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
            <div className="p-1 bg-primary/10 rounded">
              <MessageCircle className="h-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span>Comunicación con Profesores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 sm:py-8">
            <div className="text-4xl sm:text-6xl mb-4">💬</div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-black mb-2">
              Mantente en Contacto
            </h3>
            <p className="text-sm sm:text-base text-secondary mb-4 max-w-md mx-auto">
              Comunícate directamente con los profesores de tus hijos para seguimiento académico.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Enviar Mensaje
              </Button>
              <Button variant="outline" className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendar Reunión
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;