package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.AcademicGrade;
import com.altiusacademy.model.entity.Activity;
import com.altiusacademy.model.entity.ActivityResult;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.AcademicGradeRepository;
import com.altiusacademy.repository.mysql.ActivityRepository;
import com.altiusacademy.repository.mysql.ActivityResultRepository;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired private ActivityRepository activityRepository;
    @Autowired private ActivityResultRepository activityResultRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private InstitutionRepository institutionRepository;
    @Autowired private AcademicGradeRepository academicGradeRepository;

    /**
     * Obtener actividades para un estudiante (filtradas por institución y grado)
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getActivitiesForStudent(@PathVariable Long studentId) {
        try {
            System.out.println("📚 Obteniendo actividades para estudiante ID: " + studentId);
            
            User student = userRepository.findById(studentId).orElseThrow(() -> 
                new RuntimeException("Estudiante no encontrado"));
            
            List<Activity> activities;
            if (student.getAcademicGrade() != null) {
                activities = activityRepository.findByInstitutionAndGrade(
                    student.getInstitution().getId(), 
                    student.getAcademicGrade()
                );
            } else {
                activities = activityRepository.findByInstitutionIdAndIsActiveTrue(
                    student.getInstitution().getId()
                );
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("activities", activities);
            response.put("total", activities.size());
            
            System.out.println("✅ Encontradas " + activities.size() + " actividades para el estudiante");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo actividades: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar actividades: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener actividades creadas por un profesor
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('COORDINATOR')")
    public ResponseEntity<?> getActivitiesByTeacher(@PathVariable Long teacherId) {
        try {
            System.out.println("👩‍🏫 Obteniendo actividades del profesor ID: " + teacherId);
            
            List<Activity> activities = activityRepository.findByTeacherIdAndIsActiveTrue(teacherId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("activities", activities);
            response.put("total", activities.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo actividades del profesor: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar actividades: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener actividad específica por ID
     */
    @GetMapping("/{activityId}")
    public ResponseEntity<?> getActivity(@PathVariable Long activityId) {
        try {
            System.out.println("🎯 Obteniendo actividad ID: " + activityId);
            
            Activity activity = activityRepository.findById(activityId).orElseThrow(() -> 
                new RuntimeException("Actividad no encontrada"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("activity", activity);
            
            System.out.println("✅ Actividad encontrada: " + activity.getTitle());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo actividad: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar actividad: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Crear nueva actividad
     */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('COORDINATOR')")
    public ResponseEntity<?> createActivity(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🎯 Creando nueva actividad...");
            
            Activity activity = new Activity();
            activity.setTitle((String) request.get("title"));
            activity.setDescription((String) request.get("description"));
            activity.setType((String) request.getOrDefault("type", "exam"));
            activity.setContent((String) request.get("content"));
            
            Long teacherId = Long.valueOf(request.get("teacherId").toString());
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            
            User teacher = userRepository.findById(teacherId).orElseThrow();
            Institution institution = institutionRepository.findById(institutionId).orElseThrow();
            
            activity.setTeacher(teacher);
            activity.setInstitution(institution);
            
            // Grado académico opcional
            if (request.get("academicGradeId") != null) {
                Long gradeId = Long.valueOf(request.get("academicGradeId").toString());
                AcademicGrade grade = academicGradeRepository.findById(gradeId).orElse(null);
                activity.setAcademicGrade(grade);
            }
            
            // Configuraciones opcionales
            if (request.get("maxScore") != null) {
                activity.setMaxScore((Integer) request.get("maxScore"));
            }
            if (request.get("timeLimitMinutes") != null) {
                activity.setTimeLimitMinutes((Integer) request.get("timeLimitMinutes"));
            }
            
            Activity savedActivity = activityRepository.save(activity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Actividad creada exitosamente");
            response.put("activity", savedActivity);
            
            System.out.println("✅ Actividad creada con ID: " + savedActivity.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error creando actividad: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al crear actividad: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Enviar resultado de actividad
     */
    @PostMapping("/{activityId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> submitActivityResult(
            @PathVariable Long activityId, 
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("📤 Enviando resultado de actividad ID: " + activityId);
            
            Long userId = Long.valueOf(request.get("userId").toString());
            Integer score = (Integer) request.get("score");
            String answers = (String) request.get("answers");
            
            User user = userRepository.findById(userId).orElseThrow();
            Activity activity = activityRepository.findById(activityId).orElseThrow();
            
            // Verificar si ya existe un resultado
            Optional<ActivityResult> existingResult = activityResultRepository
                .findByUserIdAndActivityId(userId, activityId);
            
            ActivityResult result;
            if (existingResult.isPresent()) {
                result = existingResult.get();
                System.out.println("🔄 Actualizando resultado existente");
            } else {
                result = new ActivityResult();
                result.setUser(user);
                result.setActivity(activity);
            }
            
            result.setScore(score);
            result.setMaxScore(activity.getMaxScore());
            result.setAnswers(answers);
            result.setIsCompleted(true);
            
            if (request.get("timeSpentMinutes") != null) {
                result.setTimeSpentMinutes((Integer) request.get("timeSpentMinutes"));
            }
            
            ActivityResult savedResult = activityResultRepository.save(result);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resultado guardado exitosamente");
            response.put("result", savedResult);
            
            System.out.println("✅ Resultado guardado - Puntuación: " + score + "/" + activity.getMaxScore());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error guardando resultado: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar resultado: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener resultados de un estudiante
     */
    @GetMapping("/results/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('COORDINATOR')")
    public ResponseEntity<?> getStudentResults(@PathVariable Long studentId) {
        try {
            List<ActivityResult> results = activityResultRepository.findByUserId(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("results", results);
            response.put("total", results.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar resultados: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener resultados de una actividad específica (para profesores)
     */
    @GetMapping("/{activityId}/results")
    @PreAuthorize("hasRole('TEACHER') or hasRole('COORDINATOR')")
    public ResponseEntity<?> getActivityResults(@PathVariable Long activityId) {
        try {
            List<ActivityResult> results = activityResultRepository.findByActivityId(activityId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("results", results);
            response.put("total", results.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar resultados: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}