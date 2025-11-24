import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  taskType: string;
  maxScore: number;
  maxGrade: number;
  grade: string;
  createdAt: string;
  teacherId: number;
  teacherName: string;
  submissionText?: string;
  submissionFileUrl?: string;
  submittedAt?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

interface Stats {
  totalTasks: number;
  submittedTasks: number;
  gradedTasks: number;
  pendingTasks: number;
  averageScore: number;
  gradeName: string;
}

type SortOption = 'a-z' | 'z-a' | 'newest' | 'oldest';

export default function StudentGradeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
      const submittedCount = tasks.filter(t => t.status === 'SUBMITTED').length;
      const gradedCount = tasks.filter(t => t.status === 'GRADED').length;
      const gradedTasks = tasks.filter(t => t.score !== undefined && t.score !== null);
      const avgScore = gradedTasks.length > 0 
        ? gradedTasks.reduce((sum, t) => sum + (t.score || 0), 0) / gradedTasks.length 
        : 0;
      
      setStats({
        totalTasks: tasks.length,
        pendingTasks: pendingCount,
        submittedTasks: submittedCount,
        gradedTasks: gradedCount,
        averageScore: avgScore,
        gradeName: tasks[0]?.grade || 'Sin grado'
      });
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      // Obtener token del authStore
      const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      const token = authState?.state?.token;
      
      console.log('🔍 Cargando tareas desde: /api/student/tasks');
      console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/student/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        setTasks(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', response.status, errorText);
        alert(`Error al cargar tareas: ${response.status}\n\n${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar tareas:', error);
      alert('No se pudo conectar con el servidor.\n\nAsegúrate de que el backend esté corriendo en el puerto 8090:\n\ncd backend\nmvn spring-boot:run');
    } finally {
      setLoading(false);
    }
  };

  const sortTasks = (tasksToSort: Task[]) => {
    const sorted = [...tasksToSort];
    
    switch (sortBy) {
      case 'a-z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return sorted;
    }
  };

  const filteredTasks = sortTasks(tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'PENDING';
    if (filter === 'submitted') return task.status === 'SUBMITTED';
    if (filter === 'graded') return task.status === 'GRADED';
    return true;
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskTypeLabel = (type: string) => {
    return type === 'INTERACTIVE' ? 'Interactiva' : 'Tradicional';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 font-bold';
    if (score >= 4.0) return 'text-blue-600 font-semibold';
    if (score >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Tareas - {stats?.gradeName}</h1>
        <p className="text-gray-600">Aquí puedes ver todas las tareas asignadas a tu grado</p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
            <div className="text-sm text-gray-600">Total Tareas</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.submittedTasks}</div>
            <div className="text-sm text-gray-600">Entregadas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.gradedTasks}</div>
            <div className="text-sm text-gray-600">Calificadas</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{stats.averageScore.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Promedio</div>
          </div>
        </div>
      )}

      {/* Filtros y Ordenamiento */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Pendientes ({tasks.filter(t => t.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg ${filter === 'submitted' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Entregadas ({tasks.filter(t => t.status === 'SUBMITTED').length})
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-4 py-2 rounded-lg ${filter === 'graded' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Calificadas ({tasks.filter(t => t.status === 'GRADED').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="a-z">🔤 A → Z</option>
            <option value="z-a">🔤 Z → A</option>
            <option value="newest">🆕 Más recientes</option>
            <option value="oldest">📜 Más antiguas</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay tareas para mostrar</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/grade-tasks/${task.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Profesor: {task.teacherName}</span>
                    <span>•</span>
                    <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {getTaskTypeLabel(task.taskType)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">
                    Puntos: <span className="font-semibold">{task.maxScore}</span>
                  </span>
                  <span className="text-gray-600">
                    Nota máxima: <span className="font-semibold">{task.maxGrade}</span>
                  </span>
                </div>

                {task.status === 'GRADED' ? (
                  <div className="flex items-center gap-3">
                    {task.score !== undefined && task.score !== null ? (
                      <div className="text-right">
                        <div className={`text-2xl ${getScoreColor(task.score)}`}>
                          {task.score.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">Calificación</div>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Calificada
                      </span>
                    )}
                  </div>
                ) : task.status === 'SUBMITTED' ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pendiente de calificar
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student/grade-tasks/${task.id}`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Entregar Tarea
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
