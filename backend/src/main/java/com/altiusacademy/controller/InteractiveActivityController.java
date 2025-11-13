package com.altiusacademy.controller;

import com.altiusacademy.dto.InteractiveActivityDto;
import com.altiusacademy.dto.ActivityAttemptDto;
import com.altiusacademy.dto.StudentAnswerDto;
import com.altiusacademy.service.InteractiveActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para actividades interactivas (MongoDB)
 * Maneja contenido multimedia, juegos educativos y evaluaciones dinámicas
 */
@RestController
@RequestMapping("/api/interactive-activities")
public class InteractiveActivityController {

    @Autowired
    private InteractiveActivityService activityService;

    // ========== ENDPOINTS PARA ESTUDIANTES ==========
    
    /**
     * Obtener actividades disponibles para el estudiante
     */
    @GetMapping("/interactive")
    public ResponseEntity<List<InteractiveActivityDto>> getInteractiveActivities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<InteractiveActivityDto> activities = activityService.getActivitiesForStudent(userEmail, type, difficulty);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener una actividad específica
     */
    @GetMapping("/{activityId}")
    public ResponseEntity<InteractiveActivityDto> getActivity(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            InteractiveActivityDto activity = activityService.getActivity(activityId, userEmail);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Iniciar intento de actividad
     */
    @PostMapping("/{activityId}/start")
    public ResponseEntity<ActivityAttemptDto> startActivity(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ActivityAttemptDto attempt = activityService.startActivity(activityId, userEmail);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Enviar respuesta a una pregunta
     */
    @PostMapping("/attempts/{attemptId}/answer")
    public ResponseEntity<ActivityAttemptDto> submitAnswer(
            @PathVariable String attemptId,
            @RequestBody StudentAnswerDto answer,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ActivityAttemptDto attempt = activityService.submitAnswer(attemptId, answer, userEmail);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Completar actividad
     */
    @PostMapping("/attempts/{attemptId}/complete")
    public ResponseEntity<ActivityAttemptDto> completeActivity(
            @PathVariable String attemptId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ActivityAttemptDto attempt = activityService.completeActivity(attemptId, userEmail);
            return ResponseEntity.ok(attempt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener progreso del estudiante
     */
    @GetMapping("/progress")
    public ResponseEntity<List<ActivityAttemptDto>> getStudentProgress(
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ActivityAttemptDto> progress = activityService.getStudentProgress(userEmail);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener historial de intentos
     */
    @GetMapping("/{activityId}/attempts")
    public ResponseEntity<List<ActivityAttemptDto>> getActivityAttempts(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ActivityAttemptDto> attempts = activityService.getStudentAttempts(activityId, userEmail);
            return ResponseEntity.ok(attempts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ========== ENDPOINTS PARA PROFESORES ==========
    
    /**
     * Crear nueva actividad interactiva
     */
    @PostMapping
    public ResponseEntity<InteractiveActivityDto> createActivity(
            @RequestBody InteractiveActivityDto activityDto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            InteractiveActivityDto activity = activityService.createActivity(activityDto, userEmail);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener actividades creadas por el profesor
     */
    @GetMapping("/teacher")
    public ResponseEntity<List<InteractiveActivityDto>> getTeacherActivities(
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<InteractiveActivityDto> activities = activityService.getTeacherActivities(userEmail);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Actualizar actividad
     */
    @PutMapping("/{activityId}")
    public ResponseEntity<InteractiveActivityDto> updateActivity(
            @PathVariable String activityId,
            @RequestBody InteractiveActivityDto activityDto,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            InteractiveActivityDto activity = activityService.updateActivity(activityId, activityDto, userEmail);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Eliminar actividad
     */
    @DeleteMapping("/{activityId}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            activityService.deleteActivity(activityId, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener estadísticas de una actividad
     */
    @GetMapping("/{activityId}/stats")
    public ResponseEntity<Object> getActivityStats(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            Object stats = activityService.getActivityStats(activityId, userEmail);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener todos los intentos de una actividad (para el profesor)
     */
    @GetMapping("/{activityId}/all-attempts")
    public ResponseEntity<List<ActivityAttemptDto>> getAllActivityAttempts(
            @PathVariable String activityId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ActivityAttemptDto> attempts = activityService.getAllActivityAttempts(activityId, userEmail);
            return ResponseEntity.ok(attempts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}