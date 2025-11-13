import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, BookOpen, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { useAuthStore } from '../stores/authStore';

const Calendar: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = [
    {
      id: 1,
      title: 'Entrega Matemáticas - Operaciones Básicas',
      description: 'Fecha límite para entregar la tarea de operaciones básicas',
      date: '2025-01-15',
      time: '23:59',
      type: 'assignment',
      subject: 'Matemáticas',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Examen de Español',
      description: 'Evaluación de lectura comprensiva y gramática',
      date: '2025-01-17',
      time: '08:00',
      type: 'exam',
      subject: 'Español',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Reunión de Padres',
      description: 'Reunión trimestral con padres de familia',
      date: '2025-01-20',
      time: '14:00',
      type: 'meeting',
      subject: 'General',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Proyecto Ciencias - Sistema Solar',
      description: 'Presentación del proyecto sobre el sistema solar',
      date: '2025-01-22',
      time: '10:00',
      type: 'project',
      subject: 'Ciencias',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Taller de Lectura',
      description: 'Taller especial de comprensión lectora',
      date: '2025-01-25',
      time: '15:00',
      type: 'workshop',
      subject: 'Español',
      priority: 'low',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Evaluación Sociales',
      description: 'Quiz sobre regiones de Colombia',
      date: '2025-01-12',
      time: '09:00',
      type: 'exam',
      subject: 'Sociales',
      priority: 'high',
      status: 'completed'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      case 'exam':
        return <AlertCircle className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'project':
        return <BookOpen className="w-4 h-4" />;
      case 'workshop':
        return <Users className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-700 border-red-200';
      case 'meeting': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'project': return 'bg-green-100 text-green-700 border-green-200';
      case 'workshop': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const isUpcoming = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return eventDate > today;
  };

  const canCreateEvents = user?.role === 'teacher' || user?.role === 'coordinator' || user?.role === 'admin';

  const upcomingEvents = events.filter(event => isUpcoming(event.date) && event.status === 'pending');
  const todayEvents = events.filter(event => isToday(event.date));
  const completedEvents = events.filter(event => event.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario Académico 📅</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus eventos, entregas y evaluaciones
          </p>
        </div>
        {canCreateEvents && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nuevo Evento</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Evento
                  </label>
                  <Input placeholder="Ej: Examen de Matemáticas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Textarea placeholder="Descripción del evento..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Tarea</SelectItem>
                        <SelectItem value="exam">Examen</SelectItem>
                        <SelectItem value="meeting">Reunión</SelectItem>
                        <SelectItem value="project">Proyecto</SelectItem>
                        <SelectItem value="workshop">Taller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materia
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Materia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="matematicas">Matemáticas</SelectItem>
                        <SelectItem value="espanol">Español</SelectItem>
                        <SelectItem value="ciencias">Ciencias</SelectItem>
                        <SelectItem value="sociales">Sociales</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1">
                    Crear Evento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <CalendarIcon className="w-5 h-5" />
              <span>Eventos de Hoy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.subject} • {formatTime(event.time)}</p>
                  </div>
                </div>
                <Badge variant={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>Próximos Eventos ({upcomingEvents.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.subject}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(event.date)} • {formatTime(event.time)}
                    </p>
                  </div>
                </div>
                <Badge variant={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
              </div>
            ))}
            {upcomingEvents.length > 5 && (
              <Button variant="outline" className="w-full">
                Ver Todos los Eventos
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Completed Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Eventos Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedEvents.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-75">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.subject}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(event.date)} • {formatTime(event.time)}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <span>Vista de Calendario</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(2025, 0, i - 6); // Enero 2025, ajustado para mostrar calendario completo
              const dayEvents = events.filter(event => 
                new Date(event.date).toDateString() === date.toDateString()
              );
              
              return (
                <div key={i} className="min-h-[80px] p-1 border border-gray-200 rounded">
                  <div className="text-sm text-gray-600 mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div 
                        key={event.id} 
                        className={`text-xs p-1 rounded truncate ${getEventColor(event.type)}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;