import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  FileText, 
  Camera, 
  Play, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Image,
  Video,
  FileIcon,
  X
} from 'lucide-react';
import { tasksApi, type TaskResponse } from '../services/tasksApi';
import { useUserInfo } from '../hooks/useUserInfo';

type StudentTask = TaskResponse;

type TaskFilter = 'todos' | 'multimedia' | 'interactive' | 'pending' | 'completed';

const TareasPage: React.FC = () => {
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('todos');
  const [selectedTask, setSelectedTask] = useState<StudentTask | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const { userInfo } = useUserInfo();
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await tasksApi.getStudentTasks(user?.id || '');
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'multimedia':
        return task.taskType === 'multimedia';
      case 'interactive':
        return task.taskType === 'interactive';
      case 'pending':
        return task.status === 'pending';
      case 'completed':
        return task.hasSubmission;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    return taskType === 'multimedia' ? Camera : Play;
  };

  const getTaskTypeBadge = (taskType: string) => {
    return taskType === 'multimedia' 
      ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">📸 Evidencia</Badge>
      : <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎮 Interactiva</Badge>;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const task = selectedTask;
    
    if (!task) return;
    
    // Validar número de archivos
    if (task.maxFiles && files.length > task.maxFiles) {
      alert(`Solo puedes subir máximo ${task.maxFiles} archivos`);
      return;
    }
    
    // Validar formatos
    if (task.allowedFormats) {
      const invalidFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return !task.allowedFormats!.includes(extension || '');
      });
      
      if (invalidFiles.length > 0) {
        alert(`Formatos no permitidos: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    // Validar tamaño
    if (task.maxSizeMb) {
      const oversizedFiles = files.filter(file => file.size > (task.maxSizeMb! * 1024 * 1024));
      if (oversizedFiles.length > 0) {
        alert(`Archivos muy grandes: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    setUploadFiles(files);
  };

  const submitMultimediaTask = async () => {
    if (!selectedTask) return;
    
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      formData.append('submissionText', submissionText);
      
      await tasksApi.submitTask(selectedTask.id, formData);
      
      setShowUploadModal(false);
      setUploadFiles([]);
      setSubmissionText('');
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error al enviar la tarea');
    }
  };

  const startInteractiveTask = async (task: TaskResponse) => {
    try {
      await tasksApi.startInteractiveTask(task.id);
      // TODO: Navigate to interactive activity view
      window.location.href = `/interactive-activity/${task.id}`;
    } catch (error) {
      console.error('Error starting interactive task:', error);
      alert('Error al iniciar la actividad');
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4 text-blue-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-4 w-4 text-purple-600" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Tareas"
          description="Gestiona tus tareas multimedia e interactivas"
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Tareas"
        description="Gestiona tus tareas multimedia e interactivas"
        icon={FileText}
      />

      {/* Filtros */}
      <Card className="border-secondary-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'todos' ? 'default' : 'outline'}
              onClick={() => setFilter('todos')}
              size="sm"
            >
              Todas las Tareas
            </Button>
            <Button
              variant={filter === 'multimedia' ? 'default' : 'outline'}
              onClick={() => setFilter('multimedia')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              📸 Evidencias
            </Button>
            <Button
              variant={filter === 'interactive' ? 'default' : 'outline'}
              onClick={() => setFilter('interactive')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              🎮 Interactivas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Pendientes
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="file"
          title="No hay tareas"
          description={
            filter === 'todos' 
              ? "No tienes tareas asignadas en este momento."
              : `No hay tareas ${filter === 'multimedia' ? 'multimedia' : filter === 'interactive' ? 'interactivas' : filter}.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const TaskIcon = getTaskTypeIcon(task.taskType);
            
            return (
              <Card 
                key={task.id} 
                className="border-secondary-200 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TaskIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-bold text-neutral-black">
                          {task.title}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-secondary">
                        {task.subject}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getTaskTypeBadge(task.taskType)}
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Descripción */}
                  <p className="text-sm text-neutral-black">
                    {task.description}
                  </p>

                  {/* Información específica por tipo */}
                  {task.taskType === 'multimedia' && task.allowedFormats && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        📎 Formatos permitidos:
                      </p>
                      <p className="text-xs text-blue-600">
                        {task.allowedFormats.join(', ')} • Máx. {task.maxFiles} archivos • {task.maxSizeMb}MB
                      </p>
                    </div>
                  )}

                  {task.taskType === 'interactive' && task.activityConfig && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800 font-medium mb-1">
                        🎯 Actividad interactiva
                      </p>
                      <p className="text-xs text-purple-600">
                        Puntaje máximo: {task.maxScore} puntos
                      </p>
                    </div>
                  )}

                  {/* Fecha de entrega */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span className="text-secondary">Entrega:</span>
                    <span className="text-neutral-black font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Estado de entrega */}
                  {task.hasSubmission && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Entregada
                      </span>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2 border-t border-secondary-200">
                    {task.taskType === 'multimedia' && !task.hasSubmission && (
                      <Button 
                        onClick={() => {
                          setSelectedTask(task);
                          setShowUploadModal(true);
                        }}
                        className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                        size="sm"
                      >
                        <Upload className="h-4 w-4" />
                        📤 Subir Evidencias
                      </Button>
                    )}
                    
                    {task.taskType === 'interactive' && !task.hasSubmission && (
                      <Button 
                        onClick={() => startInteractiveTask(task)}
                        className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                        size="sm"
                      >
                        <Play className="h-4 w-4" />
                        🎯 Comenzar Actividad
                      </Button>
                    )}

                    {task.hasSubmission && (
                      <Button 
                        variant="outline"
                        className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Ver Entrega
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de subida de evidencias */}
      {showUploadModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  📸 Subir evidencias: {selectedTask.title}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                    setSubmissionText('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Descripción de la tarea */}
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-neutral-black">
                  {selectedTask.description}
                </p>
              </div>

              {/* Zona de arrastre y suelta */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple={selectedTask.maxFiles !== 1}
                  accept={selectedTask.allowedFormats?.map((f: string) => `.${f}`).join(',')}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    Formatos: {selectedTask.allowedFormats?.join(', ')} • 
                    Máx. {selectedTask.maxFiles} archivos • 
                    {selectedTask.maxSizeMb}MB por archivo
                  </p>
                </label>
              </div>

              {/* Vista previa de archivos */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-black">Archivos seleccionados:</h4>
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {getFileIcon(file.name)}
                      <span className="text-sm flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Texto de entrega */}
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Describe tu evidencia o agrega comentarios..."
                />
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={submitMultimediaTask}
                  disabled={uploadFiles.length === 0}
                  className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  ✅ Enviar Evidencias
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                    setSubmissionText('');
                  }}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TareasPage;