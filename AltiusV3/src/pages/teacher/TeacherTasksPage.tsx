import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Plus, Calendar, Users, RefreshCw, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { activityStorage } from '../../services/activityStorage';
import ActivityEditor, { Activity } from '../../components/activities/ActivityEditor';

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
  actividadInteractivaId?: string;
  formatosPermitidos?: string[];
  comentario?: string;
  archivosAdjuntos: string[];
}

const TeacherTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [interactiveLibrary, setInteractiveLibrary] = useState<any[]>([]);
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [draftActivities, setDraftActivities] = useState<Activity[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  const [manageLibraryOpen, setManageLibraryOpen] = useState(false);
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);
  const [editingLibraryTask, setEditingLibraryTask] = useState<any | null>(null);
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    titulo: '',
    descripcion: '',
    materiaId: 0,
    grados: [],
    fechaEntrega: '',
    tipo: 'traditional',
    actividadInteractivaId: undefined,
    formatosPermitidos: [],
    comentario: '',
    archivosAdjuntos: []
  });

  const { token } = useAuthStore();

  useEffect(() => {
    loadTasks();
    loadAvailableGrades();
    // load interactive activities from local storage
    const lib = activityStorage.getTasks();
    console.log('📚 Biblioteca interactiva cargada:', lib);
    setInteractiveLibrary(lib);
  }, []);

  const handleAddDraftActivity = (activity: Activity) => {
    setDraftActivities(prev => [...prev, activity]);
    // keep editor open so teacher can add more
    setShowActivityEditor(true);
  };

  const handleSaveSingleActivity = (activity: Activity) => {
    // Save single activity immediately as before
    const id = `custom-${Date.now()}`;
    const title = activity.question || `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: activity.question || '',
      activities: [activity],
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      setCreateForm({...createForm, actividadInteractivaId: id});
      setShowActivityEditor(false);
    } catch (err) {
      console.error('Error saving new activity:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleSaveDraftAsLibrary = () => {
    if (draftActivities.length === 0) {
      alert('Agrega al menos una pregunta antes de guardar.');
      return;
    }

    const id = `custom-${Date.now()}`;
    const title = `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: draftActivities[0]?.question || title,
      activities: draftActivities,
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      // select the newly created activity for the task
      setCreateForm({...createForm, actividadInteractivaId: id});
      // reset draft state
      setDraftActivities([]);
      setShowActivityEditor(false);
      setEditingDraft(false);
    } catch (err) {
      console.error('Error saving draft activities:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleCancelDraft = () => {
    setDraftActivities([]);
    setShowActivityEditor(false);
    setEditingDraft(false);
  };

  const handleDeleteLibraryItem = (id: string) => {
    console.log('🗑️ Solicitud eliminar plantilla id=', id);
    if (!confirm('¿Eliminar esta actividad de la biblioteca?')) return;
    try {
      activityStorage.deleteTask(id);
      setInteractiveLibrary(activityStorage.getTasks());
      // clear selection if it was selected
      if (createForm.actividadInteractivaId === id) {
        setCreateForm({...createForm, actividadInteractivaId: undefined});
      }
    } catch (err) {
      console.error('Error deleting library item', err);
      alert('No se pudo eliminar la actividad. Revisa la consola.');
    }
  };

  const handleEditLibraryItem = (id: string) => {
    console.log('✏️ Solicitud editar plantilla id=', id);
    const task = activityStorage.getTask(id);
    if (!task) {
      alert('Plantilla no encontrada en la biblioteca');
      return;
    }
    // Open editor to edit first activity of the task (quick edit)
    setEditingLibraryId(id);
    setEditingLibraryTask(task);
    setCreateForm({...createForm, actividadInteractivaId: id});
    setShowActivityEditor(true);
  };

  const handleToggleManageLibrary = () => {
    console.log('🔧 Toggle administrar biblioteca ->', !manageLibraryOpen);
    setManageLibraryOpen(prev => !prev);
  };

  const loadAvailableGrades = async () => {
    try {
      console.log('🎓 Cargando grados disponibles...');
      const response = await fetch('/api/teacher/tasks/grades');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Response data:', data);
        // Backend returns { success: true, grades: [...] } but keep fallback
        if (data && Array.isArray(data)) {
          setAvailableGrades(data);
        } else if (data && data.success && Array.isArray(data.grades)) {
          setAvailableGrades(data.grades);
        } else {
          console.warn('❌ Respuesta inesperada al pedir grados, usando fallback');
          const fallback = [
            'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
          ];
          setAvailableGrades(fallback);
        }
      } else {
        console.error('❌ Error HTTP:', response.status);
        const fallback = [
          'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
        ];
        setAvailableGrades(fallback);
      }
    } catch (error) {
      console.error('❌ Error loading grades:', error);
      const fallback = [
        'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      ];
      setAvailableGrades(fallback);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teacher/tasks', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // data es un array de TaskResponse
        const formattedTasks = data.map((task: any) => ({
          id: task.id,
          titulo: task.title,
          descripcion: task.description,
          grados: task.grade ? [task.grade] : [],
          fechaEntrega: task.dueDate,
          fechaCreacion: task.createdAt,
          tipo: task.taskType === 'INTERACTIVE' ? 'interactive' : 'traditional'
        }));
        setTasks(formattedTasks);
      } else {
        setTasks([]);
      }
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
      if (createForm.tipo === 'interactive' && !createForm.actividadInteractivaId) {
        alert('Selecciona o crea una actividad interactiva antes de crear la tarea.');
        return;
      }
      // Usar el endpoint correcto que implementamos
      const response = await fetch('/api/teacher/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          title: createForm.titulo,
          description: createForm.descripcion,
          grades: createForm.grados, // Enviar array de grados
          dueDate: createForm.fechaEntrega,
          taskType: createForm.tipo === 'interactive' ? 'INTERACTIVE' : 'MULTIMEDIA',
          priority: 'MEDIUM',
          activityConfig: createForm.actividadInteractivaId || null,
          allowedFormats: createForm.formatosPermitidos || [],
          maxFiles: 3,
          maxSizeMb: 10,
          maxGrade: 5.0
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setShowCreateForm(false);
        setCreateForm({
          titulo: '',
          descripcion: '',
          materiaId: 0,
          grados: [],
          fechaEntrega: '',
          tipo: 'traditional',
          formatosPermitidos: [],
          comentario: '',
          archivosAdjuntos: []
        });
        loadTasks();
        alert('Tarea creada exitosamente');
      } else {
        const error = await response.json();
        console.error('Error creating task:', error);
        alert('Error: ' + (error.message || 'No se pudo crear la tarea'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error de conexión');
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
              onClick={async () => {
                try {
                  const resp = await fetch('/api/school-grades/initialize', { method: 'POST' });
                  const data = await resp.json();
                  console.log('Inicializar grados:', data);
                  await loadAvailableGrades();
                  alert('Inicialización de grados completada.');
                } catch (err) {
                  console.error('Error inicializando grados:', err);
                  alert('Error al inicializar grados. Mira la consola.');
                }
              }}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              Inicializar Grados
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
                    Grado
                  </label>
                  <select
                    value={createForm.grados[0] || ''}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      grados: e.target.value ? [e.target.value] : []
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Seleccionar grado</option>
                    {availableGrades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opciones según tipo de tarea */}
              {createForm.tipo === 'interactive' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Actividad interactiva</label>
                  {interactiveLibrary.length > 0 ? (
                    <>
                      <select
                        value={createForm.actividadInteractivaId || ''}
                        onChange={(e) => setCreateForm({...createForm, actividadInteractivaId: e.target.value})}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Seleccionar actividad...</option>
                        {interactiveLibrary.map((act) => (
                          <option key={act.id} value={act.id}>{act.title}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-3 mt-2">
                        <label className="text-xs text-secondary">Crear cuestionario (varias preguntas)</label>
                        <input type="checkbox" checked={editingDraft} onChange={(e) => setEditingDraft(e.target.checked)} />
                        <Button
                          onClick={() => { if (!editingDraft) setDraftActivities([]); setShowActivityEditor(true); }}
                          size="sm"
                          variant="outline"
                          className="border-secondary-300 text-secondary"
                        >
                          + Nueva Actividad
                        </Button>
                        <Button
                          onClick={() => handleToggleManageLibrary()}
                          size="sm"
                          variant="ghost"
                          className="text-secondary"
                        >
                          Administrar Biblioteca
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 border rounded bg-neutral-50">
                      <p className="text-sm text-secondary">No hay plantillas en la biblioteca.</p>
                      <div className="flex gap-2 mt-3">
                        <Button onClick={() => { setEditingDraft(false); setDraftActivities([]); setShowActivityEditor(true); }} className="bg-primary text-neutral-white">Crear actividad</Button>
                        <Button onClick={() => { setEditingDraft(true); setDraftActivities([]); setShowActivityEditor(true); }} variant="outline">Crear cuestionario</Button>
                        <Button onClick={() => setManageLibraryOpen(prev => !prev)} variant="ghost">Administrar Biblioteca</Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Formatos permitidos (opcional)</label>
                    <div className="flex gap-2 flex-wrap">
                      {['pdf','docx','jpg','png'].map(fmt => (
                        <label key={fmt} className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(createForm.formatosPermitidos || []).includes(fmt)}
                            onChange={(e) => {
                              const set = new Set(createForm.formatosPermitidos || []);
                              if (e.target.checked) set.add(fmt); else set.delete(fmt);
                              setCreateForm({...createForm, formatosPermitidos: Array.from(set)});
                            }}
                          />
                          <span className="capitalize">{fmt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Comentario (opcional)</label>
                    <input
                      type="text"
                      value={createForm.comentario}
                      onChange={(e) => setCreateForm({...createForm, comentario: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Instrucciones o comentario para la entrega"
                    />
                  </div>
                </div>
              )}

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

            {showActivityEditor && (
              <div className="mt-4 space-y-4">
                <ActivityEditor
                  key={draftActivities.length + (editingLibraryId ? 100000 : 0)}
                  activity={editingLibraryTask ? editingLibraryTask.activities && editingLibraryTask.activities[0] : undefined}
                  onSave={(act) => {
                    if (editingLibraryId) {
                      // Save edited activity into existing library task
                      const task = activityStorage.getTask(editingLibraryId);
                      if (task) {
                        // Replace first activity by default
                        const updated = { ...task };
                        if (Array.isArray(updated.activities) && updated.activities.length > 0) {
                          updated.activities[0] = act;
                        } else {
                          updated.activities = [act];
                        }
                        updated.title = act.question || updated.title;
                        activityStorage.saveTask(updated);
                        setInteractiveLibrary(activityStorage.getTasks());
                        setEditingLibraryId(null);
                        setEditingLibraryTask(null);
                        setShowActivityEditor(false);
                        return;
                      }
                    }

                    if (editingDraft) {
                      handleAddDraftActivity(act);
                    } else {
                      handleSaveSingleActivity(act);
                    }
                  }}
                  onCancel={() => { setShowActivityEditor(false); setEditingDraft(false); setDraftActivities([]); setEditingLibraryId(null); setEditingLibraryTask(null); }}
                />

                {draftActivities.length > 0 && (
                  <div className="p-4 border rounded space-y-3">
                    <h3 className="font-semibold">Preguntas agregadas ({draftActivities.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {draftActivities.map((d, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{d.question}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDraftActivities(prev => prev.filter((_, idx) => idx !== i))}>Eliminar</Button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveDraftAsLibrary} className="bg-primary text-neutral-white">Guardar actividad(s) en biblioteca</Button>
                      <Button variant="outline" onClick={handleCancelDraft}>Cancelar borrador</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Panel de administración de biblioteca */}
            {manageLibraryOpen && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Biblioteca de Actividades Interactivas</CardTitle>
                </CardHeader>
                <CardContent>
                  {interactiveLibrary.length === 0 ? (
                    <p className="text-sm text-secondary">No hay actividades en la biblioteca.</p>
                  ) : (
                    <ul className="space-y-3">
                      {interactiveLibrary.map((item: any) => (
                        <li key={item.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-secondary">{(item.activities || []).map((a:any)=>a.question).join(' · ')}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditLibraryItem(item.id)} className="z-50" style={{pointerEvents: 'auto'}}>Editar</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteLibraryItem(item.id)} className="z-50" style={{pointerEvents: 'auto'}}>Eliminar</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}

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