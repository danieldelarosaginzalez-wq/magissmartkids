# API de Tareas - Endpoints

## Endpoints para Estudiantes

### GET /api/student/tasks
Obtiene todas las tareas del estudiante autenticado.

### GET /api/student/tasks/pending
Obtiene las tareas pendientes del estudiante.

### GET /api/student/tasks/submitted
Obtiene las tareas entregadas del estudiante.

### GET /api/student/tasks/graded
Obtiene las tareas calificadas del estudiante.

### GET /api/student/tasks/{taskId}
Obtiene los detalles de una tarea específica.

### POST /api/student/tasks/{taskId}/submit
Entrega una tarea.
```json
{
  "submissionText": "Texto de la entrega",
  "submissionFileUrl": "https://..."
}
```

### PUT /api/student/tasks/{taskId}/submission
Actualiza la entrega de una tarea (solo si no está calificada).
```json
{
  "submissionText": "Texto actualizado",
  "submissionFileUrl": "https://..."
}
```

## Endpoints para Profesores

### POST /api/teacher/tasks
Crea una nueva tarea.
```json
{
  "title": "Título de la tarea",
  "description": "Descripción detallada",
  "dueDate": "2025-11-15",
  "priority": "MEDIUM",
  "taskType": "MULTIMEDIA",
  "subjectId": 1,
  "studentIds": [1, 2, 3],
  "grades": ["1° A", "1° B"],
  "allowedFormats": ["jpg", "png", "pdf"],
  "maxFiles": 3,
  "maxSizeMb": 10,
  "maxGrade": 5.0
}
```

### GET /api/teacher/tasks
Obtiene todas las tareas creadas por el profesor.

### GET /api/teacher/tasks/{taskId}
Obtiene los detalles de una tarea específica.

### PUT /api/teacher/tasks/{taskId}
Actualiza una tarea existente.

### DELETE /api/teacher/tasks/{taskId}
Elimina una tarea.

### POST /api/teacher/tasks/{taskId}/grade
Califica una tarea entregada.
```json
{
  "score": 4.5,
  "feedback": "Excelente trabajo"
}
```

### GET /api/teacher/tasks/submitted
Obtiene todas las tareas entregadas pendientes de calificación.

### GET /api/teacher/tasks/subject/{subjectId}
Obtiene todas las tareas de una materia específica.

## Tipos de Datos

### TaskType
- `MULTIMEDIA`: Para evidencias fotográficas, documentos, archivos
- `INTERACTIVE`: Para quizzes, ejercicios autocorregidos

### TaskPriority
- `LOW`: Prioridad baja
- `MEDIUM`: Prioridad media
- `HIGH`: Prioridad alta

### TaskStatus
- `PENDING`: Pendiente
- `IN_PROGRESS`: En progreso
- `SUBMITTED`: Entregada
- `GRADED`: Calificada
- `OVERDUE`: Vencida
