package com.altiusacademy.service;

import com.altiusacademy.dto.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    
    private static final Logger log = LoggerFactory.getLogger(TeacherService.class);
    
    @Autowired
    private TeacherSubjectRepository teacherSubjectRepository;
    
    @Autowired
    private TaskTemplateRepository taskTemplateRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private TaskSubmissionRepository taskSubmissionRepository;
    
    public TeacherDashboardStatsDto getDashboardStats(Long teacherId) {
        try {
            // Obtener materias del profesor
            List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherIdWithSubject(teacherId);
            int totalMaterias = teacherSubjects.size();
            
            // Contar estudiantes únicos en todos los grados
            Set<String> uniqueGrades = teacherSubjects.stream()
                .map(TeacherSubject::getGrade)
                .collect(Collectors.toSet());
            
            long totalEstudiantes = uniqueGrades.stream()
                .mapToLong(grade -> teacherSubjectRepository.countStudentsByGrade(grade))
                .sum();
            
            // Tareas pendientes de corrección
            long tareasPendientesCorreccion = taskRepository.countPendingGradingByTeacher(teacherId);
            
            // Promedio general (simplificado)
            Double promedioGeneral = taskRepository.getAverageScoreByTeacher(teacherId);
            if (promedioGeneral == null) promedioGeneral = 0.0;
            
            // Próximas entregas
            List<TaskTemplate> proximasEntregas = taskTemplateRepository.findUpcomingTasksByTeacher(
                teacherId, LocalDate.now()
            ).stream().limit(5).collect(Collectors.toList());
            
            // Actividades recientes (últimas tareas creadas - incluir tanto templates como tasks individuales)
            List<TaskTemplate> templatesRecientes = taskTemplateRepository.findByTeacherId(teacherId)
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
            
            // Si no hay templates, buscar en tasks individuales
            List<TaskTemplate> actividadesRecientes = templatesRecientes;
            if (templatesRecientes.isEmpty()) {
                // Buscar tareas individuales y convertirlas a formato de template
                List<Task> tasksRecientes = taskRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId)
                    .stream()
                    .limit(5)
                    .collect(Collectors.toList());
                
                // Convertir Tasks a TaskTemplates para mantener compatibilidad
                actividadesRecientes = tasksRecientes.stream()
                    .map(task -> {
                        TaskTemplate template = new TaskTemplate();
                        template.setId(task.getId());
                        template.setTitle(task.getTitle());
                        template.setDescription(task.getDescription());
                        template.setTeacherId(teacherId);
                        template.setSubjectId(task.getSubject() != null ? task.getSubject().getId() : null);
                        template.setDueDate(task.getDueDate());
                        template.setCreatedAt(task.getCreatedAt());
                        template.setType(task.getTaskType() == Task.TaskType.MULTIMEDIA ? 
                            TaskTemplate.TaskType.TRADITIONAL : TaskTemplate.TaskType.INTERACTIVE);
                        // Crear JSON de grados
                        try {
                            template.setGrades(objectMapper.writeValueAsString(List.of(task.getGrade())));
                        } catch (Exception e) {
                            template.setGrades("[]");
                        }
                        return template;
                    })
                    .collect(Collectors.toList());
            }
            
            TeacherDashboardStatsDto stats = new TeacherDashboardStatsDto();
            stats.setTotalMaterias(totalMaterias);
            stats.setTotalEstudiantes((int) totalEstudiantes);
            stats.setTareasPendientesCorreccion((int) tareasPendientesCorreccion);
            stats.setPromedioGeneral(promedioGeneral);
            stats.setProximasEntregas(proximasEntregas.stream()
                .map(this::convertToTaskDto)
                .collect(Collectors.toList()));
            stats.setActividadesRecientes(actividadesRecientes.stream()
                .map(this::convertToTaskDto)
                .collect(Collectors.toList()));
            
            return stats;
                
        } catch (Exception e) {
            log.error("Error getting teacher dashboard stats for teacher {}: {}", teacherId, e.getMessage());
            TeacherDashboardStatsDto fallback = new TeacherDashboardStatsDto();
            fallback.setTotalMaterias(0);
            fallback.setTotalEstudiantes(0);
            fallback.setTareasPendientesCorreccion(0);
            fallback.setPromedioGeneral(0.0);
            fallback.setProximasEntregas(new ArrayList<>());
            fallback.setActividadesRecientes(new ArrayList<>());
            return fallback;
        }
    }
    
    public List<TeacherSubjectDto> getTeacherSubjects(Long teacherId) {
        try {
            List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherIdWithSubject(teacherId);
            
            return teacherSubjects.stream()
                .map(ts -> {
                    long studentCount = teacherSubjectRepository.countStudentsByGrade(ts.getGrade());
                    
                    // Calcular progreso promedio (simplificado)
                    Double progresoPromedio = taskRepository.getAverageProgressByTeacherAndSubjectAndGrade(
                        teacherId, ts.getSubjectId(), ts.getGrade()
                    );
                    if (progresoPromedio == null) progresoPromedio = 0.0;
                    
                    TeacherSubjectDto dto = new TeacherSubjectDto();
                    dto.setId(ts.getId().toString());
                    dto.setNombre(ts.getSubject().getName());
                    dto.setGrado(ts.getGrade());
                    dto.setEstudiantes((int) studentCount);
                    dto.setProgresoPromedio(progresoPromedio);
                    dto.setColor(generateSubjectColor(ts.getSubject().getName()));
                    
                    return dto;
                })
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting teacher subjects for teacher {}: {}", teacherId, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Transactional
    public TaskTemplate createTask(TeacherTaskDto taskDto, Long teacherId) {
        try {
            // Crear template de tarea
            TaskTemplate template = new TaskTemplate();
            template.setTitle(taskDto.getTitulo());
            template.setDescription(taskDto.getDescripcion());
            template.setTeacherId(teacherId);
            template.setSubjectId(taskDto.getMateriaId());
            template.setDueDate(taskDto.getFechaEntrega());
            template.setType(TaskTemplate.TaskType.valueOf(taskDto.getTipo().toUpperCase()));
            
            // Convertir grados a JSON
            String gradesJson = objectMapper.writeValueAsString(taskDto.getGrados());
            template.setGrades(gradesJson);
            
            // Convertir archivos adjuntos a JSON si existen
            if (taskDto.getArchivosAdjuntos() != null && !taskDto.getArchivosAdjuntos().isEmpty()) {
                String attachmentsJson = objectMapper.writeValueAsString(taskDto.getArchivosAdjuntos());
                template.setAttachments(attachmentsJson);
            }
            
            // Guardar template
            template = taskTemplateRepository.save(template);
            
            // Crear tareas individuales para cada estudiante en cada grado
            createIndividualTasks(template, taskDto.getGrados());
            
            return template;
            
        } catch (Exception e) {
            log.error("Error creating task for teacher {}: {}", teacherId, e.getMessage());
            throw new RuntimeException("Error creating task: " + e.getMessage());
        }
    }
    
    private void createIndividualTasks(TaskTemplate template, List<String> grades) {
        try {
            for (String grade : grades) {
                // Obtener estudiantes del grado
                List<User> students = userRepository.findStudentsByGrade(grade);
                
                for (User student : students) {
                    Task task = new Task();
                    task.setTitle(template.getTitle());
                    task.setDescription(template.getDescription());
                    task.setDueDate(template.getDueDate());
                    task.setTaskTemplate(template);
                    task.setTeacher(userRepository.findById(template.getTeacherId()).orElse(null));
                    task.setStudent(student);
                    task.setSubject(subjectRepository.findById(template.getSubjectId()).orElse(null));
                    task.setGrade(grade);
                    task.setMaxGrade(template.getMaxGrade());
                    
                    taskRepository.save(task);
                }
            }
        } catch (Exception e) {
            log.error("Error creating individual tasks for template {}: {}", template.getId(), e.getMessage());
            throw new RuntimeException("Error creating individual tasks: " + e.getMessage());
        }
    }
    
    public List<TeacherTaskDto> getTeacherTasks(Long teacherId) {
        try {
            List<TaskTemplate> templates = taskTemplateRepository.findByTeacherId(teacherId);
            
            return templates.stream()
                .map(this::convertToTaskDto)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting teacher tasks for teacher {}: {}", teacherId, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public List<GradeTaskDto> getGradingTasks(Long teacherId, Long subjectId, String grade) {
        try {
            List<Task> tasks = taskRepository.findByTeacherAndSubjectAndGrade(teacherId, subjectId, grade);
            
            return tasks.stream()
                .map(task -> {
                    GradeTaskDto dto = new GradeTaskDto();
                    dto.setTaskId(task.getId());
                    dto.setStudentId(task.getStudent().getId());
                    dto.setStudentName(task.getStudent().getFullName());
                    dto.setTaskTitle(task.getTitle());
                    dto.setSubmissionText(task.getSubmissionText());
                    dto.setSubmissionFileUrl(task.getSubmissionFileUrl());
                    dto.setSubmittedAt(task.getSubmittedAt());
                    dto.setCurrentScore(task.getScore());
                    dto.setMaxScore(task.getMaxGrade());
                    dto.setFeedback(task.getFeedback());
                    dto.setStatus(task.getStatus().name());
                    return dto;
                })
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting grading tasks for teacher {}: {}", teacherId, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Transactional
    public void gradeTask(Long taskId, GradeTaskDto gradeDto, Long teacherId) {
        try {
            Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
            
            // Verificar que el profesor es el dueño de la tarea
            if (!task.getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("Unauthorized to grade this task");
            }
            
            task.setScore(gradeDto.getNewScore());
            task.setFeedback(gradeDto.getNewFeedback());
            task.setStatus(Task.TaskStatus.GRADED);
            task.setGradedAt(LocalDateTime.now());
            
            taskRepository.save(task);
            
        } catch (Exception e) {
            log.error("Error grading task {}: {}", taskId, e.getMessage());
            throw new RuntimeException("Error grading task: " + e.getMessage());
        }
    }
    
    public List<StudentDto> getStudentsByGrade(String grade) {
        try {
            log.info("🔍 Buscando estudiantes para el grado: '{}'", grade);
            
            // Intentar buscar estudiantes
            List<User> students = userRepository.findStudentsByGrade(grade);
            log.info("📊 Estudiantes encontrados con búsqueda exacta: {}", students.size());
            
            // Si no se encuentran estudiantes, intentar búsqueda alternativa
            if (students.isEmpty()) {
                log.warn("⚠️ No se encontraron estudiantes con búsqueda exacta para el grado: '{}'", grade);
                log.info("🔄 Intentando búsqueda alternativa...");
                
                // Buscar todos los estudiantes activos y filtrar por grado
                List<User> allStudents = userRepository.findByRole(UserRole.STUDENT);
                students = allStudents.stream()
                    .filter(u -> u.getIsActive() && 
                                u.getSchoolGrade() != null && 
                                u.getSchoolGrade().getGradeName() != null &&
                                u.getSchoolGrade().getGradeName().equalsIgnoreCase(grade))
                    .collect(Collectors.toList());
                
                log.info("📊 Estudiantes encontrados con búsqueda alternativa: {}", students.size());
                
                if (students.isEmpty()) {
                    // Log de debug: mostrar algunos grados disponibles
                    List<String> availableGrades = allStudents.stream()
                        .filter(u -> u.getSchoolGrade() != null && u.getSchoolGrade().getGradeName() != null)
                        .map(u -> u.getSchoolGrade().getGradeName())
                        .distinct()
                        .limit(10)
                        .collect(Collectors.toList());
                    log.warn("⚠️ Grados disponibles en la BD: {}", availableGrades);
                }
            }
            
            return students.stream()
                .map(student -> {
                    // Calcular estadísticas del estudiante desde task_submissions
                    Double averageScore = taskSubmissionRepository.getAverageScoreByStudent(student.getId());
                    Long completedTasks = taskSubmissionRepository.countCompletedTasksByStudent(student.getId());
                    Long pendingTasks = taskSubmissionRepository.countPendingTasksByStudent(student.getId());
                    
                    StudentDto dto = new StudentDto();
                    dto.setId(student.getId());
                    dto.setFirstName(student.getFirstName());
                    dto.setLastName(student.getLastName());
                    dto.setFullName(student.getFullName());
                    dto.setEmail(student.getEmail());
                    dto.setGrade(student.getSchoolGrade() != null ? student.getSchoolGrade().getGradeName() : "");
                    dto.setAvatarUrl(student.getAvatarUrl());
                    dto.setIsActive(student.getIsActive());
                    dto.setAverageScore(averageScore != null ? averageScore : 0.0);
                    dto.setCompletedTasks(completedTasks.intValue());
                    dto.setPendingTasks(pendingTasks.intValue());
                    
                    log.debug("✅ Estudiante: {} {} - Grado: {} - Promedio: {} - Completadas: {} - Pendientes: {}", 
                        student.getFirstName(), student.getLastName(), dto.getGrade(), 
                        dto.getAverageScore(), dto.getCompletedTasks(), dto.getPendingTasks());
                    
                    return dto;
                })
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("❌ Error getting students by grade {}: {}", grade, e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    private TeacherTaskDto convertToTaskDto(TaskTemplate template) {
        try {
            List<String> grades = objectMapper.readValue(
                template.getGrades(), 
                new TypeReference<List<String>>() {}
            );
            
            List<String> attachments = new ArrayList<>();
            if (template.getAttachments() != null) {
                attachments = objectMapper.readValue(
                    template.getAttachments(), 
                    new TypeReference<List<String>>() {}
                );
            }
            
            TeacherTaskDto dto = new TeacherTaskDto();
            dto.setId(template.getId());
            dto.setTitulo(template.getTitle());
            dto.setDescripcion(template.getDescription());
            dto.setMateriaId(template.getSubjectId());
            dto.setGrados(grades);
            dto.setFechaEntrega(template.getDueDate());
            dto.setTipo(template.getType().name().toLowerCase());
            dto.setArchivosAdjuntos(attachments);
            dto.setFechaCreacion(template.getCreatedAt());
            
            return dto;
                
        } catch (Exception e) {
            log.error("Error converting template to DTO: {}", e.getMessage());
            TeacherTaskDto fallback = new TeacherTaskDto();
            fallback.setId(template.getId());
            fallback.setTitulo(template.getTitle());
            fallback.setDescripcion(template.getDescription());
            return fallback;
        }
    }
    
    private String generateSubjectColor(String subjectName) {
        // Generar colores consistentes basados en el nombre de la materia
        String[] colors = {
            "#00368F", "#2E5BFF", "#7C3AED", "#F5A623", "#FF6B35",
            "#8B5CF6", "#06B6D4", "#3B82F6", "#F59E0B", "#EF4444"
        };
        
        int hash = Math.abs(subjectName.hashCode());
        return colors[hash % colors.length];
    }
    
    public int countTasksBySubjectAndGrade(Long subjectId, String grade) {
        try {
            Long count = taskTemplateRepository.countBySubjectIdAndGrade(subjectId, grade);
            return count != null ? count.intValue() : 0;
        } catch (Exception e) {
            log.error("Error counting tasks for subject {} and grade {}: {}", subjectId, grade, e.getMessage());
            return 0;
        }
    }
    
    public int countCompletedTasksBySubjectAndGrade(Long subjectId, String grade) {
        try {
            Long count = taskRepository.countCompletedBySubjectAndGrade(subjectId, grade);
            return count != null ? count.intValue() : 0;
        } catch (Exception e) {
            log.error("Error counting completed tasks for subject {} and grade {}: {}", subjectId, grade, e.getMessage());
            return 0;
        }
    }
    
    public double getAverageGradeBySubjectAndGrade(Long subjectId, String grade) {
        try {
            Double average = taskRepository.getAverageScoreBySubjectAndGrade(subjectId, grade);
            return average != null ? average : 0.0;
        } catch (Exception e) {
            log.error("Error getting average grade for subject {} and grade {}: {}", subjectId, grade, e.getMessage());
            return 0.0;
        }
    }
    
    public List<Map<String, Object>> getTasksBySubjectAndGrade(Long teacherId, Long subjectId, String grade) {
        try {
            // Buscar TaskTemplates en lugar de Tasks individuales
            List<TaskTemplate> templates = taskTemplateRepository.findByTeacherIdAndSubjectIdAndGrade(teacherId, subjectId, grade);
            
            return templates.stream()
                .map(template -> {
                    Map<String, Object> taskMap = new java.util.HashMap<>();
                    taskMap.put("id", template.getId());
                    taskMap.put("title", template.getTitle());
                    taskMap.put("description", template.getDescription());
                    taskMap.put("dueDate", template.getDueDate());
                    taskMap.put("createdAt", template.getCreatedAt());
                    taskMap.put("taskType", template.getType().name());
                    taskMap.put("status", "ACTIVE");
                    
                    // Contar entregas de las tareas individuales asociadas a este template
                    long submissionsCount = taskRepository.countByTaskTemplateIdAndStatusIn(
                        template.getId(), 
                        List.of(Task.TaskStatus.SUBMITTED, Task.TaskStatus.GRADED)
                    );
                    long totalStudents = userRepository.countStudentsByGrade(grade);
                    
                    taskMap.put("submissionsCount", (int) submissionsCount);
                    taskMap.put("totalStudents", (int) totalStudents);
                    
                    return taskMap;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting tasks by subject and grade: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    @Transactional
    public void updateSubmissionGrade(Long submissionId, Long teacherId, Double score, String feedback) {
        try {
            // Buscar la entrega
            TaskSubmission submission = taskSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Entrega no encontrada"));
            
            // Verificar que el profesor sea el dueño de la tarea
            Task task = submission.getTask();
            if (task == null || task.getTeacher() == null || !task.getTeacher().getId().equals(teacherId)) {
                throw new RuntimeException("No tienes permiso para calificar esta entrega");
            }
            
            // Actualizar nota y feedback
            submission.setScore(score);
            submission.setFeedback(feedback);
            submission.setStatus(TaskSubmission.SubmissionStatus.GRADED);
            submission.setGradedAt(LocalDateTime.now());
            submission.setGradedBy(userRepository.findById(teacherId).orElse(null));
            
            taskSubmissionRepository.save(submission);
            log.info("Submission {} graded by teacher {}: score={}, feedback={}", 
                submissionId, teacherId, score, feedback != null ? "provided" : "none");
        } catch (Exception e) {
            log.error("Error updating submission grade {}: {}", submissionId, e.getMessage(), e);
            throw new RuntimeException("Error al actualizar la nota: " + e.getMessage());
        }
    }
    
    @Transactional
    public void deleteTask(Long taskId, Long teacherId) {
        try {
            log.info("Attempting to delete task {} by teacher {}", taskId, teacherId);
            
            // Intentar eliminar como TaskTemplate primero
            TaskTemplate template = taskTemplateRepository.findById(taskId).orElse(null);
            
            if (template != null) {
                // Es un template
                log.info("Found TaskTemplate {}", taskId);
                if (!template.getTeacherId().equals(teacherId)) {
                    throw new RuntimeException("No tienes permiso para eliminar esta tarea");
                }
                
                // Eliminar todas las tareas individuales asociadas y sus entregas
                List<Task> individualTasks = taskRepository.findByTaskTemplateId(taskId);
                log.info("Found {} individual tasks to delete", individualTasks.size());
                
                // Eliminar cada tarea individual (esto debería eliminar las entregas por CASCADE)
                for (Task task : individualTasks) {
                    taskRepository.delete(task);
                }
                
                // Eliminar el template
                taskTemplateRepository.delete(template);
                log.info("TaskTemplate {} and {} individual tasks deleted successfully", taskId, individualTasks.size());
            } else {
                // Es una tarea individual
                log.info("Not a template, trying as individual Task");
                Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
                
                if (task.getTeacher() == null || !task.getTeacher().getId().equals(teacherId)) {
                    throw new RuntimeException("No tienes permiso para eliminar esta tarea");
                }
                
                // Eliminar la tarea (las entregas deberían eliminarse por CASCADE)
                taskRepository.delete(task);
                log.info("Task {} deleted successfully", taskId);
            }
        } catch (Exception e) {
            log.error("Error deleting task {}: {}", taskId, e.getMessage(), e);
            throw new RuntimeException("Error al eliminar la tarea: " + e.getMessage());
        }
    }
    
    public List<Map<String, Object>> getStudentGradesForGrade(String grade) {
        try {
            log.info("Getting student grades for grade: {}", grade);
            
            // Obtener todos los estudiantes del grado
            List<User> students = userRepository.findStudentsByGrade(grade);
            
            List<Map<String, Object>> studentGrades = new ArrayList<>();
            
            for (User student : students) {
                // Obtener todas las tareas asignadas específicamente a este estudiante
                // (las tareas individuales tienen student_id, las generales no)
                List<Task> assignedTasks = taskRepository.findByStudentId(student.getId());
                
                // Obtener todas las entregas del estudiante
                List<TaskSubmission> submissions = taskSubmissionRepository.findByStudentId(student.getId());
                
                // Calcular estadísticas
                int totalTasks = assignedTasks.size();
                int completedTasks = (int) submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .count();
                int pendingTasks = totalTasks - completedTasks;
                
                // Calcular promedio
                double averageGrade = submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .mapToDouble(TaskSubmission::getScore)
                    .average()
                    .orElse(0.0);
                
                // Crear mapa con información del estudiante
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("id", student.getId());
                studentData.put("name", student.getFullName());
                studentData.put("email", student.getEmail());
                studentData.put("grade", grade);
                studentData.put("averageGrade", Math.round(averageGrade * 10.0) / 10.0);
                studentData.put("totalTasks", totalTasks);
                studentData.put("completedTasks", completedTasks);
                studentData.put("pendingTasks", pendingTasks);
                
                // Agregar detalles de entregas
                List<Map<String, Object>> submissionDetails = submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .map(s -> {
                        Map<String, Object> detail = new HashMap<>();
                        detail.put("taskTitle", s.getTask() != null ? s.getTask().getTitle() : "Sin título");
                        detail.put("score", s.getScore());
                        detail.put("submittedAt", s.getSubmittedAt());
                        return detail;
                    })
                    .collect(Collectors.toList());
                
                studentData.put("submissions", submissionDetails);
                
                studentGrades.add(studentData);
            }
            
            log.info("Found {} students for grade {}", studentGrades.size(), grade);
            return studentGrades;
            
        } catch (Exception e) {
            log.error("Error getting student grades for grade {}: {}", grade, e.getMessage(), e);
            throw new RuntimeException("Error al obtener calificaciones: " + e.getMessage());
        }
    }
}
