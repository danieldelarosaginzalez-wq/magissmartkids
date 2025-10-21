package com.altiusacademy.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.altiusacademy.dto.TaskDto;
import com.altiusacademy.dto.TaskGradeDto;
import com.altiusacademy.dto.TaskSubmissionDto;
import com.altiusacademy.model.entity.User;
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

    /**
     * Obtener tareas del estudiante
     */
    public List<TaskDto> getStudentTasks(String userEmail, String status) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User student = userOpt.get();
        
        // Por ahora retornamos datos de ejemplo
        // TODO: Implementar consulta real a TaskRepository
        return List.of(
            createSampleTaskDto("1", "Ejercicios de álgebra", "Matemáticas", "HIGH", "pending"),
            createSampleTaskDto("2", "Laboratorio de química", "Ciencias", "MEDIUM", "pending"),
            createSampleTaskDto("3", "Ensayo sobre la independencia", "Historia", "LOW", "pending")
        );
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
        // TODO: Implementar creación de tarea
        return taskDto;
    }

    /**
     * Obtener tareas del profesor
     */
    public List<TaskDto> getTeacherTasks(String userEmail, String status) {
        // TODO: Implementar consulta de tareas del profesor
        return List.of();
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
}