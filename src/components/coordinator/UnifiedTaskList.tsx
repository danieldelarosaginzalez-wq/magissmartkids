import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { api } from '../../services/api';

interface UnifiedTask {
  id: string;
  title: string;
  description: string;
  type: 'TRADITIONAL' | 'INTERACTIVE';
  subjectName: string;
  dueDate: string;
  status: string;
  maxScore: number;
  createdAt: string;
  source: 'MYSQL' | 'MONGODB';
}

interface UnifiedTaskListProps {
  institutionNit: string;
}

export const UnifiedTaskList: React.FC<UnifiedTaskListProps> = ({ institutionNit }) => {
  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    status: ''
  });

  useEffect(() => {
    loadTasks();
  }, [institutionNit, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        institutionNit,
        ...(filters.type && { type: filters.type }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.status && { status: filters.status })
      });
      
      const response = await api.get(`/api/unified-tasks/filtered?${params}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading unified tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'INTERACTIVE' ? '🎮' : '📝';
  };

  const getSourceBadge = (source: string) => {
    return source === 'MONGODB' ? 'Interactiva' : 'Tradicional';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sistema Unificado de Tareas</h2>
        <div className="text-sm text-gray-500">
          {tasks.length} tareas encontradas
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="TRADITIONAL">Tradicional</option>
              <option value="INTERACTIVE">Interactiva</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <input
              type="text"
              placeholder="Filtrar por materia..."
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVE">Activo</option>
              <option value="PENDING">Pendiente</option>
              <option value="COMPLETED">Completado</option>
              <option value="GRADED">Calificado</option>
              <option value="DRAFT">Borrador</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => setFilters({ type: '', subject: '', status: '' })}
            variant="outline"
            size="sm"
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No se encontraron tareas"
          description="Ajusta los filtros para ver más resultados"
        />
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={`${task.source}-${task.id}`} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(task.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {getSourceBadge(task.source)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Materia:</span>
                      <p className="text-gray-600">{task.subjectName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Puntuación Máxima:</span>
                      <p className="text-gray-600">{task.maxScore} puntos</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fecha de Vencimiento:</span>
                      <p className="text-gray-600">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Creado:</span>
                      <p className="text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Navigate to task details
                      const baseUrl = task.type === 'INTERACTIVE' ? '/interactive-activities' : '/tareas';
                      window.open(`${baseUrl}/${task.id}`, '_blank');
                    }}
                  >
                    Ver Detalles
                  </Button>
                  
                  {task.status.toLowerCase() === 'pending' && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // Navigate to complete task
                        const baseUrl = task.type === 'INTERACTIVE' ? '/interactive-activities' : '/tareas';
                        window.open(`${baseUrl}/${task.id}/complete`, '_blank');
                      }}
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Tareas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.type === 'TRADITIONAL').length}
            </div>
            <div className="text-sm text-gray-600">Tareas Tradicionales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {tasks.filter(t => t.type === 'INTERACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Actividades Interactivas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => ['completed', 'graded'].includes(t.status.toLowerCase())).length}
            </div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => ['pending', 'active'].includes(t.status.toLowerCase())).length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
        </div>
      </Card>
    </div>
  );
};