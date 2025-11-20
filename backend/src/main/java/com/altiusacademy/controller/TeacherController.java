package com.altiusacademy.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.GradeTaskDto;
import com.altiusacademy.dto.StudentDto;
import com.altiusacademy.dto.TeacherDashboardStatsDto;
import com.altiusacademy.dto.TeacherTaskDto;
import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.TaskTemplate;
import com.altiusacademy.model.entity.TeacherSubject;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.TeacherSubjectRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
public class TeacherController {
    
    private static final Logger log = LoggerFactory.getLogger(TeacherController.class);
    
    @Autowired
    private TeacherService teacherService;
    
    @Autowired
    private com.altiusacademy.service.TeacherSubjectService teacherSubjectService;
    
    @Autowired
    private TeacherSubjectRepository teacherSubjectRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Método helper para obtener el usuario autenticado desde el Authentication
     */
    private User getUserFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<TeacherDashboardStatsDto> getDashboardStats(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for dashboard stats");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting dashboard stats for teacher: {} (ID: {})", user.getFullName(), teacherId);
            TeacherDashboardStatsDto stats = teacherService.getDashboardStats(teacherId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting teacher dashboard stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<?> getTeacherSubjects(org.springframework.security.core.Authentication authentication) {
        try {
            String email = authentication.getName();
            log.info("Getting subjects for teacher: {}", email);
            
            Map<String, Object> response = teacherSubjectService.getTeacherSubjectsWithStats(email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting teacher subjects: {}", e.getMessage(), e);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "subjects", List.of(),
                "total", 0,
                "message", "No se encontraron materias asignadas"
            ));
        }
    }

    @PostMapping("/tasks/template")
    public ResponseEntity<TaskTemplate> createTask(@RequestBody TeacherTaskDto taskDto, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for task creation");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Creating task for teacher: {} (ID: {})", user.getFullName(), teacherId);
            TaskTemplate task = teacherService.createTask(taskDto, teacherId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/tasks/overview")
    public ResponseEntity<List<TeacherTaskDto>> getTeacherTasks(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for tasks overview");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting tasks for teacher: {} (ID: {})", user.getFullName(), teacherId);
            List<TeacherTaskDto> tasks = teacherService.getTeacherTasks(teacherId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting teacher tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/subjects/{subjectId}/tasks")
    public ResponseEntity<?> getTasksBySubjectAndGrade(
            @PathVariable Long subjectId,
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting tasks for subject {} and grade {} by teacher {}", subjectId, grade, teacherId);
            
            List<Map<String, Object>> tasks = teacherService.getTasksBySubjectAndGrade(teacherId, subjectId, grade);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting tasks by subject and grade: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/subjects/tasks/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId, Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            teacherService.deleteTask(taskId, user.getId());
            return ResponseEntity.ok(Map.of("success", true, "message", "Tarea eliminada correctamente"));
        } catch (Exception e) {
            log.error("Error deleting task: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<?> updateSubmissionGrade(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> gradeData,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            Double score = gradeData.get("score") != null ? 
                Double.parseDouble(gradeData.get("score").toString()) : null;
            String feedback = gradeData.get("feedback") != null ? 
                gradeData.get("feedback").toString() : null;
            
            teacherService.updateSubmissionGrade(submissionId, user.getId(), score, feedback);
            return ResponseEntity.ok(Map.of("success", true, "message", "Nota actualizada correctamente"));
        } catch (Exception e) {
            log.error("Error updating submission grade: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<GradeTaskDto>> getGradingTasks(
            @RequestParam Long subjectId,
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for grading tasks");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Getting grading tasks for teacher: {} (ID: {})", user.getFullName(), teacherId);
            List<GradeTaskDto> gradingTasks = teacherService.getGradingTasks(teacherId, subjectId, grade);
            return ResponseEntity.ok(gradingTasks);
        } catch (Exception e) {
            log.error("Error getting grading tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/tasks/{taskId}/grade")
    public ResponseEntity<Void> gradeTask(
            @PathVariable Long taskId,
            @RequestBody GradeTaskDto gradeDto,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for grading task");
                return ResponseEntity.status(401).build();
            }
            
            Long teacherId = user.getId();
            log.info("Grading task {} by teacher: {} (ID: {})", taskId, user.getFullName(), teacherId);
            teacherService.gradeTask(taskId, gradeDto, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error grading task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getStudentsByGrade(
            @RequestParam String grade,
            Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                log.error("No authenticated user found for students list");
                return ResponseEntity.status(401).build();
            }
            
            log.info("Getting students for grade {} by teacher: {} (ID: {})", grade, user.getFullName(), user.getId());
            List<StudentDto> students = teacherService.getStudentsByGrade(grade);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            log.error("Error getting students by grade: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Endpoint temporal para inicializar materias de prueba para el profesor autenticado
     * SOLO PARA DESARROLLO - Eliminar en producción
     */
    @PostMapping("/init-test-subjects")
    public ResponseEntity<?> initTestSubjects(Authentication authentication) {
        try {
            User user = getUserFromAuthentication(authentication);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            Long teacherId = user.getId();
            log.info("Initializing test subjects for teacher: {} (ID: {})", user.getFullName(), teacherId);
            
            // Verificar si ya tiene materias asignadas
            List<TeacherSubject> existing = teacherSubjectRepository.findByTeacherId(teacherId);
            if (!existing.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "message", "El profesor ya tiene " + existing.size() + " materias asignadas",
                    "subjects", existing.size()
                ));
            }
            
            // Obtener algunas materias de la base de datos
            List<Subject> allSubjects = subjectRepository.findAll();
            if (allSubjects.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "error", "No hay materias en la base de datos. Primero crea materias."
                ));
            }
            
            // Asignar las primeras 3-5 materias al profesor para el grado "5° A"
            int subjectsToAssign = Math.min(5, allSubjects.size());
            List<TeacherSubject> newAssignments = new java.util.ArrayList<>();
            
            for (int i = 0; i < subjectsToAssign; i++) {
                Subject subject = allSubjects.get(i);
                TeacherSubject ts = new TeacherSubject();
                ts.setTeacherId(teacherId);
                ts.setSubjectId(subject.getId());
                ts.setGrade("5° A");
                ts.setPeriod("2025-1");
                ts.setIsActive(true);
                
                newAssignments.add(teacherSubjectRepository.save(ts));
                log.info("Assigned subject {} to teacher {}", subject.getName(), teacherId);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Se asignaron " + newAssignments.size() + " materias al profesor",
                "subjects", newAssignments.size(),
                "grade", "5° A"
            ));
            
        } catch (Exception e) {
            log.error("Error initializing test subjects: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al inicializar materias: " + e.getMessage()
            ));
        }
    }
}