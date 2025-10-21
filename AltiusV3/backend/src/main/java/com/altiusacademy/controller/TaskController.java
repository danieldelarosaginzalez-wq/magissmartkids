package com.altiusacademy.controller;

import com.altiusacademy.dto.TaskDto;
import com.altiusacademy.dto.TaskSubmissionDto;
import com.altiusacademy.dto.TaskGradeDto;
import com.altiusacademy.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador para tareas tradicionales (MySQL)
 * Maneja tareas estructuradas con entregas y calificaciones
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ========== ENDPOINTS PARA ESTUDIANTES ==========
    
    /**
     * Obtener tareas del estudiante autenticado
     */
    @GetMapping("/student")
    public ResponseEntity<List<TaskDto>> getStudentTasks(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<TaskDto> tasks = taskService.getStudentTasks(userEmail, status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener una tarea específica
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskDto task = taskService.getTask(taskId, userEmail);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Entregar una tarea
     */
    @PostMapping("/{taskId}/submit")
    public ResponseEntity<TaskDto> submitTask(
            @PathVariable Long taskId,
            @RequestBody TaskSubmissionDto submission,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskDto task = taskService.submitTask(taskId, submission, userEmail);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Subir archivo para una tarea
     */
    @PostMapping("/{taskId}/upload")
    public ResponseEntity<String> uploadTaskFile(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            String fileUrl = taskService.uploadTaskFile(taskId, file, userEmail);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al subir archivo");
        }
    }

    // ========== ENDPOINTS PARA PROFESORES ==========
    
    /**
     * Crear nueva tarea
     */
    @PostMapping
    public ResponseEntity<TaskDto> createTask(
            @RequestBody TaskDto taskDto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskDto task = taskService.createTask(taskDto, userEmail);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener tareas creadas por el profesor
     */
    @GetMapping("/teacher")
    public ResponseEntity<List<TaskDto>> getTeacherTasks(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<TaskDto> tasks = taskService.getTeacherTasks(userEmail, status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Actualizar tarea
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskDto taskDto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskDto task = taskService.updateTask(taskId, taskDto, userEmail);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Calificar tarea
     */
    @PostMapping("/{taskId}/grade")
    public ResponseEntity<TaskDto> gradeTask(
            @PathVariable Long taskId,
            @RequestBody TaskGradeDto gradeDto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            TaskDto task = taskService.gradeTask(taskId, gradeDto, userEmail);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Eliminar tarea
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            taskService.deleteTask(taskId, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener entregas de una tarea
     */
    @GetMapping("/{taskId}/submissions")
    public ResponseEntity<List<TaskDto>> getTaskSubmissions(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<TaskDto> submissions = taskService.getTaskSubmissions(taskId, userEmail);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}