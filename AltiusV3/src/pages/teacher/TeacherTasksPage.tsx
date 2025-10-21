import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Plus, Calendar, Users, RefreshCw, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

interface TeacherTask {
  id: number;
  titulo: string;
  descripcion?: string;
  materiaId?: number;
  grados?: string[];
  fechaEntrega?: string;
  tipo?: string;
  fechaCreacion?: string;
}

interface CreateTaskForm {
  titulo: string;
  descripcion: string;
  materiaId: number;
  grados: string[];
  fechaEntrega: string;
  tipo: string;
  archivosAdjuntos: string[];
}

const TeacherTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    titulo: '',
    descripcion: '',
    materiaId: 0,
    grados: [],
    fechaEntrega: '',
    tipo: 'traditional',
    archivosAdjuntos: []
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading teacher tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teacher/tasks', createForm);
      setShowCreateForm(false);
      setCreateForm({
        titulo: '',
        descripcion: '',
        materiaId: 0,
        grados: [],
        fechaEntrega: '',
        tipo: 'traditional',
        archivosAdjuntos: []
      });
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };



  const getTaskTypeBadge = (tipo: string) => {
    return tipo === 'traditional' 
      ? <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tradicional</Badge>
      : <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interactiva</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Tareas"
          description="Crea y administra tareas para tus estudiantes"
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Tareas"
        description="Crea y administra tareas para tus estudiantes"
        icon={FileText}
        action={
          <div className="flex gap-2">
            <Button 
              onClick={loadTasks}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>
        }
      />

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Crear Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={createForm.titulo}
                    onChange={(e) => setCreateForm({...createForm, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: Ejercicios de Álgebra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={createForm.fechaEntrega}
                    onChange={(e) => setCreateForm({...createForm, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Descripción
                </label>
                <textarea
                  value={createForm.descripcion}
                  onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Describe la tarea y las instrucciones..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Tipo de Tarea
                  </label>
                  <select
                    value={createForm.tipo}
                    onChange={(e) => setCreateForm({...createForm, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="traditional">Tarea Tradicional</option>
                    <option value="interactive">Actividad Interactiva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Grados (separados por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 10° A, 10° B, 10° C"
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      grados: e.target.value.split(',').map(g => g.trim()).filter(g => g)
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  Crear Tarea
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de tareas */}
      {tasks.length === 0 ? (
        <EmptyState
          icon="file"
          title="No hay tareas creadas"
          description="Crea tu primera tarea para comenzar a asignar trabajo a tus estudiantes."
          action={{
            label: "Crear Primera Tarea",
            onClick: () => setShowCreateForm(true),
            variant: "primary"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="border-secondary-200 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-neutral-black">
                      {task.titulo}
                    </CardTitle>
                    <p className="text-sm text-secondary mt-1">
                      {task.descripcion}
                    </p>
                  </div>
                  {task.tipo && getTaskTypeBadge(task.tipo)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Información de la tarea */}
                <div className="space-y-2">
                  {task.grados && task.grados.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Grados:</span>
                      <span className="text-neutral-black font-medium">
                        {task.grados.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {task.fechaEntrega && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Entrega:</span>
                      <span className="text-neutral-black font-medium">
                        {new Date(task.fechaEntrega).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {task.fechaCreacion && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Creada:</span>
                      <span className="text-neutral-black font-medium">
                        {new Date(task.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-secondary-200">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherTasksPage;