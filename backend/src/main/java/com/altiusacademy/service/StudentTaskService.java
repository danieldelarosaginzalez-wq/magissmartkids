package com.altiusacademy.service;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentTaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskSubmissionRepository taskSubmissionRepository;
    
    public StudentTaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            TaskSubmissionRepository taskSubmissionRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
    }
    
    public List<TaskResponse> getStudentTasks(Long studentId) {
        System.out.println("🔍 getStudentTasks llamado para studentId: " + studentId);
        
        // Obtener el estudiante y su grado
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        System.out.println("👤 Estudiante encontrado: " + student.getFullName() + " (ID: " + student.getId() + ")");
        
        // Si el estudiante no tiene grado asignado, retornar lista vacía
        if (student.getSchoolGrade() == null) {
            System.out.println("⚠️ Estudiante " + studentId + " no tiene grado asignado");
            return List.of();
        }
        
        String gradeName = student.getSchoolGrade().getGradeName();
        System.out.println("📚 Buscando tareas para estudiante " + studentId + " del grado: '" + gradeName + "'");
        
        // Buscar tareas por grado
        List<Task> tasks = taskRepository.findByGrade(gradeName);
        System.out.println("✅ Encontradas " + tasks.size() + " tareas para el grado '" + gradeName + "'");
        
        if (tasks.isEmpty()) {
            // Buscar todas las tareas para ver qué grados existen
            List<Task> allTasks = taskRepository.findAll();
            System.out.println("📋 Total de tareas en el sistema: " + allTasks.size());
            allTasks.forEach(t -> System.out.println("   - Tarea: " + t.getTitle() + " | Grado: '" + t.getGrade() + "'"));
        }
        
        // Convertir tareas a respuestas, incluyendo información de entregas del estudiante
        return tasks.stream()
                .map(task -> convertToResponseWithSubmission(task, studentId))
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getPendingTasks(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        if (student.getSchoolGrade() == null) {
            return List.of();
        }
        
        String gradeName = student.getSchoolGrade().getGradeName();
        List<Task> tasks = taskRepository.findByGrade(gradeName);
        
        return tasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.PENDING)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getSubmittedTasks(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        if (student.getSchoolGrade() == null) {
            return List.of();
        }
        
        String gradeName = student.getSchoolGrade().getGradeName();
        List<Task> tasks = taskRepository.findByGrade(gradeName);
        
        return tasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.SUBMITTED)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getGradedTasks(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        if (student.getSchoolGrade() == null) {
            return List.of();
        }
        
        String gradeName = student.getSchoolGrade().getGradeName();
        List<Task> tasks = taskRepository.findByGrade(gradeName);
        
        return tasks.stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.GRADED)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TaskResponse getTaskById(Long taskId, Long studentId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (task.getStudent() == null || !task.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("No tienes permiso para ver esta tarea");
        }
        
        return convertToResponse(task);
    }
    
    @Transactional
    public TaskResponse submitTask(Long taskId, Long studentId, TaskSubmissionRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        // Verificar si el estudiante ya entregó esta tarea
        if (taskSubmissionRepository.existsByTaskIdAndStudentId(taskId, studentId)) {
            throw new RuntimeException("Ya has entregado esta tarea. Usa la opción de actualizar entrega si necesitas hacer cambios.");
        }
        
        // Crear nueva entrega
        TaskSubmission submission = new TaskSubmission();
        submission.setTask(task);
        submission.setStudent(student);
        submission.setSubmissionText(request.getSubmissionText());
        
        // Limpiar URL de archivo para evitar duplicación de prefijos
        String fileUrl = request.getSubmissionFileUrl();
        if (fileUrl != null) {
            // Remover cualquier prefijo /api/files/download/ para guardar solo la ruta relativa
            fileUrl = fileUrl.replaceAll("^/api/files/download/", "");
        }
        submission.setSubmissionFileUrl(fileUrl);
        
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(TaskSubmission.SubmissionStatus.SUBMITTED);
        
        // Si es una tarea interactiva, calificar automáticamente
        if (task.getTaskType() == Task.TaskType.INTERACTIVE && request.getSubmissionText() != null) {
            try {
                // Parsear el JSON de resultados
                ObjectMapper mapper = new ObjectMapper();
                JsonNode results = mapper.readTree(request.getSubmissionText());
                
                int correctAnswers = results.get("correctAnswers").asInt();
                int totalQuestions = results.get("totalQuestions").asInt();
                double percentage = results.get("percentage").asDouble();
                
                // Calcular la nota basada en el porcentaje
                double score = (percentage / 100.0) * task.getMaxGrade();
                
                submission.setScore(score);
                submission.setStatus(TaskSubmission.SubmissionStatus.GRADED);
                submission.setGradedAt(LocalDateTime.now());
                submission.setFeedback(String.format("Calificación automática: %d/%d respuestas correctas (%.1f%%)", 
                    correctAnswers, totalQuestions, percentage));
                
                System.out.println("✅ Tarea interactiva calificada automáticamente: " + score + "/" + task.getMaxGrade());
            } catch (Exception e) {
                System.err.println("⚠️ Error al calificar automáticamente: " + e.getMessage());
            }
        }
        
        taskSubmissionRepository.save(submission);
        
        System.out.println("✅ Entrega guardada exitosamente para estudiante " + studentId + " en tarea " + taskId);
        
        return convertToResponse(task);
    }
    
    @Transactional
    public TaskResponse updateSubmission(Long taskId, Long studentId, TaskSubmissionRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (task.getStudent() == null || !task.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("No tienes permiso para actualizar esta tarea");
        }
        
        if (task.getStatus() == Task.TaskStatus.GRADED) {
            throw new RuntimeException("No puedes modificar una tarea ya calificada");
        }
        
        task.setSubmissionText(request.getSubmissionText());
        
        // Limpiar URL de archivo para evitar duplicación de prefijos
        String fileUrl = request.getSubmissionFileUrl();
        if (fileUrl != null) {
            fileUrl = fileUrl.replaceAll("^/api/files/download/", "");
        }
        task.setSubmissionFileUrl(fileUrl);
        
        task.setSubmittedAt(LocalDateTime.now());
        
        return convertToResponse(taskRepository.save(task));
    }
    
    private TaskResponse convertToResponseWithSubmission(Task task, Long studentId) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setPriority(task.getPriority().name());
        response.setTaskType(task.getTaskType().name());
        
        if (task.getSubject() != null) {
            response.setSubjectId(task.getSubject().getId());
            response.setSubjectName(task.getSubject().getName());
        }
        
        if (task.getTeacher() != null) {
            response.setTeacherId(task.getTeacher().getId());
            response.setTeacherName(task.getTeacher().getFullName());
        }
        
        response.setGrade(task.getGrade());
        response.setMaxGrade(task.getMaxGrade());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        
        response.setAllowedFormats(task.getAllowedFormats());
        response.setMaxFiles(task.getMaxFiles());
        response.setMaxSizeMb(task.getMaxSizeMb());
        response.setActivityConfig(task.getActivityConfig());
        response.setMaxScore(task.getMaxScore());
        
        // Buscar la entrega del estudiante para esta tarea
        TaskSubmission submission = taskSubmissionRepository.findByTaskIdAndStudentId(task.getId(), studentId)
                .orElse(null);
        
        if (submission != null) {
            // Si hay entrega, usar el estado y datos de la entrega
            response.setStatus(submission.getStatus().name());
            response.setSubmissionText(submission.getSubmissionText());
            
            String fileUrl = submission.getSubmissionFileUrl();
            if (fileUrl != null && !fileUrl.startsWith("/api/files/download/") && !fileUrl.startsWith("http")) {
                fileUrl = "/api/files/download/" + fileUrl;
            }
            response.setSubmissionFileUrl(fileUrl);
            
            response.setSubmittedAt(submission.getSubmittedAt());
            response.setScore(submission.getScore());
            response.setFeedback(submission.getFeedback());
            response.setGradedAt(submission.getGradedAt());
            
            System.out.println("   ✅ Tarea " + task.getId() + " - " + task.getTitle() + " | Estado: " + submission.getStatus() + " | Score: " + submission.getScore());
        } else {
            // Si no hay entrega, la tarea está pendiente
            response.setStatus("PENDING");
            System.out.println("   ⏳ Tarea " + task.getId() + " - " + task.getTitle() + " | Estado: PENDING (sin entrega)");
        }
        
        return response;
    }
    
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setPriority(task.getPriority().name());
        response.setStatus(task.getStatus().name());
        response.setTaskType(task.getTaskType().name());
        
        if (task.getSubject() != null) {
            response.setSubjectId(task.getSubject().getId());
            response.setSubjectName(task.getSubject().getName());
        }
        
        if (task.getTeacher() != null) {
            response.setTeacherId(task.getTeacher().getId());
            response.setTeacherName(task.getTeacher().getFullName());
        }
        
        if (task.getStudent() != null) {
            response.setStudentId(task.getStudent().getId());
            response.setStudentName(task.getStudent().getFullName());
        }
        
        response.setGrade(task.getGrade());
        response.setSubmissionText(task.getSubmissionText());
        
        // Construir URL completa si solo está la ruta relativa
        String fileUrl = task.getSubmissionFileUrl();
        if (fileUrl != null && !fileUrl.startsWith("/api/files/download/") && !fileUrl.startsWith("http")) {
            fileUrl = "/api/files/download/" + fileUrl;
        }
        response.setSubmissionFileUrl(fileUrl);
        
        response.setSubmittedAt(task.getSubmittedAt());
        response.setScore(task.getScore());
        response.setMaxGrade(task.getMaxGrade());
        response.setFeedback(task.getFeedback());
        response.setGradedAt(task.getGradedAt());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        
        response.setAllowedFormats(task.getAllowedFormats());
        response.setMaxFiles(task.getMaxFiles());
        response.setMaxSizeMb(task.getMaxSizeMb());
        response.setActivityConfig(task.getActivityConfig());
        response.setMaxScore(task.getMaxScore());
        
        return response;
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + email));
    }
}
