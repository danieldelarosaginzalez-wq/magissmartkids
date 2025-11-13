package com.altiusacademy.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.altiusacademy.dto.TaskDto;
import com.altiusacademy.dto.TaskGradeDto;
import com.altiusacademy.dto.TaskSubmissionDto;
import com.altiusacademy.model.entity.SchoolGrade;
import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SchoolGradeRepository;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.UserRepository;

/**
 * Servicio para gestión de tareas tradicionales (MySQL)
 */
@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;

    /**
     * Obtener tareas del estudiante
     */
    public List<TaskDto> getStudentTasks(String userEmail, String status) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User student = userOpt.get();

        // Recolectar tareas visibles para el estudiante:
        // 1) Tareas asignadas directamente al estudiante
        // 2) Tareas cuyo campo 'grade' coincide con el gradeName del estudiante (ej. "1° A")
        // 3) Tareas sin grado asignado (visibles para todos)
        Set<Task> visible = new HashSet<>();

        try {
            List<Task> personal = taskRepository.findByStudentOrderByDueDateAsc(student);
            if (personal != null) visible.addAll(personal);
        } catch (Exception e) {
            // Ignorar si no hay relación directa
        }

        if (student.getSchoolGrade() != null && student.getSchoolGrade().getGradeName() != null) {
            try {
                List<Task> byGrade = taskRepository.findByGrade(student.getSchoolGrade().getGradeName());
                if (byGrade != null) visible.addAll(byGrade);
            } catch (Exception e) {
                // Ignorar.
            }
        }

        try {
            List<Task> global = taskRepository.findByGradeIsNull();
            if (global != null) visible.addAll(global);
        } catch (Exception e) {
            // Ignorar.
        }

        // Mapear a DTOs y ordenar por dueDate (si existe)
        List<TaskDto> dtos = visible.stream().map(task -> {
            TaskDto dto = new TaskDto();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setDueDate(task.getDueDate());
            dto.setPriority(task.getPriority() != null ? task.getPriority().toString() : "MEDIUM");
            dto.setStatus(task.getStatus() != null ? task.getStatus().toString() : "PENDING");
            if (task.getSubject() != null) {
                dto.setSubjectId(task.getSubject().getId());
                dto.setSubjectName(task.getSubject().getName());
            }
            if (task.getTeacher() != null) {
                dto.setTeacherId(task.getTeacher().getId());
                dto.setTeacherName(task.getTeacher().getFullName());
            }
            dto.setGradeLevel(task.getGrade());
            dto.setCreatedAt(task.getCreatedAt());
            return dto;
        }).sorted(Comparator.comparing(TaskDto::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
          .collect(Collectors.toList());

        return dtos;
    }

    /**
     * Obtener una tarea específica
     */
    public TaskDto getTask(Long taskId, String userEmail) {
        // TODO: Implementar consulta real
        return createSampleTaskDto(taskId.toString(), "Tarea de ejemplo", "Materia", "MEDIUM", "pending");
    }

    /**
     * Entregar una tarea
     */
    public TaskDto submitTask(Long taskId, TaskSubmissionDto submission, String userEmail) {
        // TODO: Implementar lógica de entrega
        TaskDto task = createSampleTaskDto(taskId.toString(), "Tarea entregada", "Materia", "MEDIUM", "submitted");
        task.setSubmissionText(submission.getSubmissionText());
        task.setSubmissionFileUrl(submission.getSubmissionFileUrl());
        task.setSubmittedAt(LocalDateTime.now());
        return task;
    }

    /**
     * Subir archivo para una tarea
     */
    public String uploadTaskFile(Long taskId, MultipartFile file, String userEmail) {
        // TODO: Implementar subida de archivos
        return "http://example.com/files/" + file.getOriginalFilename();
    }

    /**
     * Crear nueva tarea (profesor)
     */
    public TaskDto createTask(TaskDto taskDto, String userEmail) {
        try {
            // Buscar el usuario (profesor)
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }
            
            User teacher = userOpt.get();
            
            // Crear la entidad Task
            Task task = new Task();
            task.setTitle(taskDto.getTitle());
            task.setDescription(taskDto.getDescription());
            task.setTeacher(teacher);
            task.setGrade(taskDto.getGradeLevel()); // Asignar el grado

            // Tipo de tarea (MULTIMEDIA o INTERACTIVE)
            if (taskDto.getTaskType() != null) {
                try {
                    if (taskDto.getTaskType().equalsIgnoreCase("INTERACTIVE") || taskDto.getTaskType().toUpperCase().contains("INTERACTIVE")) {
                        task.setTaskType(Task.TaskType.INTERACTIVE);
                    } else {
                        task.setTaskType(Task.TaskType.MULTIMEDIA);
                    }
                } catch (Exception ex) {
                    task.setTaskType(Task.TaskType.MULTIMEDIA);
                }
            }

            // activityConfig: almacenar referencia a actividad interactiva y comentario si aplica
            if (taskDto.getActivityId() != null || (taskDto.getComment() != null && !taskDto.getComment().isBlank())) {
                StringBuilder cfg = new StringBuilder("{");
                if (taskDto.getActivityId() != null) {
                    cfg.append("\"activityId\":\"").append(taskDto.getActivityId()).append("\"");
                }
                if (taskDto.getComment() != null && !taskDto.getComment().isBlank()) {
                    if (cfg.length() > 1) cfg.append(",");
                    cfg.append("\"comment\":\"").append(taskDto.getComment().replace("\"","\\\"")).append("\"");
                }
                cfg.append("}");
                task.setActivityConfig(cfg.toString());
            }

            // allowedFormats: guardar como JSON array simple si se envía
            if (taskDto.getAllowedFormats() != null && !taskDto.getAllowedFormats().isEmpty()) {
                String formatsJson = taskDto.getAllowedFormats().stream()
                    .map(f -> "\"" + f + "\"")
                    .reduce((a, b) -> a + "," + b).orElse("");
                task.setAllowedFormats("[" + formatsJson + "]");
            }

            task.setCreatedAt(LocalDateTime.now());
            
            // Guardar en la base de datos
            Task savedTask = taskRepository.save(task);
            
            // Convertir de vuelta a DTO
            TaskDto result = new TaskDto();
            result.setId(savedTask.getId());
            result.setTitle(savedTask.getTitle());
            result.setDescription(savedTask.getDescription());
            result.setGradeLevel(savedTask.getGrade());
            result.setTeacherId(teacher.getId());
            result.setTeacherName(teacher.getFullName());
            result.setCreatedAt(savedTask.getCreatedAt());
            result.setStatus("PENDING");
            if (savedTask.getTaskType() != null) {
                result.setTaskType(savedTask.getTaskType().toString());
            }
            if (savedTask.getAllowedFormats() != null) {
                result.setAllowedFormats(java.util.Arrays.asList(savedTask.getAllowedFormats().replaceAll("\\[|\\]", "").replaceAll("\"", "").split(",")));
            }
            
            return result;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al crear la tarea: " + e.getMessage());
        }
    }

    /**
     * Obtener tareas del profesor
     */
    public List<TaskDto> getTeacherTasks(String userEmail, String status) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }
            
            User teacher = userOpt.get();
            List<Task> tasks = taskRepository.findByTeacherOrderByCreatedAtDesc(teacher);
            
            return tasks.stream().map(task -> {
                TaskDto dto = new TaskDto();
                dto.setId(task.getId());
                dto.setTitle(task.getTitle());
                dto.setDescription(task.getDescription());
                dto.setGradeLevel(task.getGrade());
                dto.setTeacherId(teacher.getId());
                dto.setTeacherName(teacher.getFullName());
                dto.setCreatedAt(task.getCreatedAt());
                dto.setStatus(task.getStatus() != null ? task.getStatus().toString() : "PENDING");
                    if (task.getTaskType() != null) {
                        dto.setTaskType(task.getTaskType().toString());
                    }
                return dto;
            }).toList();
            
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Actualizar tarea
     */
    public TaskDto updateTask(Long taskId, TaskDto taskDto, String userEmail) {
        // TODO: Implementar actualización
        return taskDto;
    }

    /**
     * Calificar tarea
     */
    public TaskDto gradeTask(Long taskId, TaskGradeDto gradeDto, String userEmail) {
        // TODO: Implementar calificación
        TaskDto task = createSampleTaskDto(taskId.toString(), "Tarea calificada", "Materia", "MEDIUM", "graded");
        task.setGrade(gradeDto.getGrade());
        task.setMaxGrade(gradeDto.getMaxGrade());
        task.setFeedback(gradeDto.getFeedback());
        task.setGradedAt(LocalDateTime.now());
        return task;
    }

    /**
     * Eliminar tarea
     */
    public void deleteTask(Long taskId, String userEmail) {
        // TODO: Implementar eliminación
    }

    /**
     * Obtener entregas de una tarea
     */
    public List<TaskDto> getTaskSubmissions(Long taskId, String userEmail) {
        // TODO: Implementar consulta de entregas
        return List.of();
    }

    // Método auxiliar para crear datos de ejemplo
    private TaskDto createSampleTaskDto(String id, String title, String subject, String priority, String status) {
        TaskDto task = new TaskDto();
        task.setId(Long.parseLong(id));
        task.setTitle(title);
        task.setDescription("Descripción de la tarea");
        task.setSubjectName(subject);
        task.setPriority(priority);
        task.setStatus(status);
        task.setCreatedAt(LocalDateTime.now());
        return task;
    }

    /**
     * Obtener grados disponibles
     */
    public List<String> getAvailableGrades() {
        try {
            // Obtener grados directamente de la tabla school_grades
            List<SchoolGrade> schoolGrades = schoolGradeRepository.findAll();
            
            if (!schoolGrades.isEmpty()) {
                return schoolGrades.stream()
                    .filter(grade -> grade.getIsActive())
                    .map(SchoolGrade::getGradeName)
                    .sorted()
                    .toList();
            }
            
            // Si no hay grados en la BD, retornar grados por defecto (incluye Preescolar)
            return List.of(
                "Preescolar",
                "1° A", "1° B", "1° C",
                "2° A", "2° B", "2° C", 
                "3° A", "3° B", "3° C",
                "4° A", "4° B", "4° C",
                "5° A", "5° B", "5° C"
            );
            
        } catch (Exception e) {
            // En caso de error, retornar grados por defecto (incluye Preescolar)
            return List.of(
                "Preescolar",
                "1° A", "1° B", "1° C",
                "2° A", "2° B", "2° C", 
                "3° A", "3° B", "3° C",
                "4° A", "4° B", "4° C",
                "5° A", "5° B", "5° C"
            );
        }
    }
}