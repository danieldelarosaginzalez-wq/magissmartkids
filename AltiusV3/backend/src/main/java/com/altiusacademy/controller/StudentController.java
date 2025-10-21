package com.altiusacademy.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.StudentDashboardStatsDto;
import com.altiusacademy.dto.StudentGradeDto;
import com.altiusacademy.dto.StudentSubjectDto;
import com.altiusacademy.dto.StudentTaskDto;
import com.altiusacademy.service.StudentService;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    /**
     * Obtener estadísticas del dashboard del estudiante
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<StudentDashboardStatsDto> getDashboardStats(Authentication authentication) {
        try {
            log.info("Getting dashboard stats for student");
            
            // Manejo temporal sin autenticación para testing
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName() cuando esté configurado
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            StudentDashboardStatsDto stats = studentService.getDashboardStats(userEmail);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener tareas del estudiante
     */
    @GetMapping("/tasks")
    public ResponseEntity<List<StudentTaskDto>> getTasks(
            @RequestParam(required = false) String status,
            Authentication authentication) {
        try {
            log.info("Getting tasks for student with status: {}", status);
            
            // Manejo temporal sin autenticación para testing
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName() cuando esté configurado
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            List<StudentTaskDto> tasks = studentService.getTasks(userEmail, status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting tasks: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener progreso de materias del estudiante
     */
    @GetMapping("/subjects/progress")
    public ResponseEntity<List<StudentSubjectDto>> getSubjectsProgress(Authentication authentication) {
        try {
            log.info("Getting subjects progress for student");
            
            // Manejo temporal sin autenticación para testing
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName() cuando esté configurado
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            List<StudentSubjectDto> subjects = studentService.getSubjectsProgress(userEmail);
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            log.error("Error getting subjects progress: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtener notas recientes del estudiante
     */
    @GetMapping("/grades/recent")
    public ResponseEntity<List<StudentGradeDto>> getRecentGrades(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {
        try {
            log.info("Getting recent grades for student with limit: {}", limit);
            
            // Manejo temporal sin autenticación para testing
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName() cuando esté configurado
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            List<StudentGradeDto> grades = studentService.getRecentGrades(userEmail, limit);
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            log.error("Error getting recent grades: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Enviar tarea multimedia (evidencias fotográficas)
     */
    @PostMapping("/tasks/{taskId}/submit-multimedia")
    public ResponseEntity<Void> submitMultimediaTask(
            @PathVariable String taskId,
            @RequestParam("files") List<org.springframework.web.multipart.MultipartFile> files,
            @RequestParam(value = "submissionText", required = false) String submissionText,
            Authentication authentication) {
        try {
            log.info("Submitting multimedia task {} with {} files", taskId, files.size());
            
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName()
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            studentService.submitMultimediaTask(taskId, files, submissionText, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error submitting multimedia task: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Iniciar tarea interactiva
     */
    @PostMapping("/tasks/{taskId}/start-interactive")
    public ResponseEntity<String> startInteractiveTask(
            @PathVariable String taskId,
            Authentication authentication) {
        try {
            log.info("Starting interactive task {}", taskId);
            
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName()
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            String activityData = studentService.startInteractiveTask(taskId, userEmail);
            return ResponseEntity.ok(activityData);
        } catch (Exception e) {
            log.error("Error starting interactive task: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Completar tarea interactiva
     */
    @PostMapping("/tasks/{taskId}/complete-interactive")
    public ResponseEntity<Void> completeInteractiveTask(
            @PathVariable String taskId,
            @RequestBody String answers,
            Authentication authentication) {
        try {
            log.info("Completing interactive task {}", taskId);
            
            String userEmail = "estudiante@test.com"; // TODO: Usar authentication.getName()
            if (authentication != null && authentication.getName() != null) {
                userEmail = authentication.getName();
            }
            
            studentService.completeInteractiveTask(taskId, answers, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error completing interactive task: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}