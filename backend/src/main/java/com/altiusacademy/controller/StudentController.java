package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.StudentDashboardStatsDto;
import com.altiusacademy.dto.StudentGradeDto;
import com.altiusacademy.dto.StudentSubjectDto;
import com.altiusacademy.dto.StudentTaskDto;
import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.StudentService;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

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

    // ==================== NUEVOS ENDPOINTS PARA MATERIAS DEL ESTUDIANTE
    // ====================

    /**
     * 🆕 Obtener materias del estudiante autenticado
     * Retorna todas las materias del grado del estudiante que tienen profesor
     * asignado
     */
    @GetMapping("/me/subjects")
    public ResponseEntity<?> getMySubjects(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Usuario no autenticado"));
            }

            String email = authentication.getName();
            log.info("📚 Obteniendo materias para estudiante: {}", email);

            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "subjects", List.of(),
                        "message", "El estudiante no tiene un grado asignado"));
            }

            List<Subject> subjects = subjectRepository
                    .findActiveSubjectsWithTeacherByGrade(student.getSchoolGrade().getId());

            List<Map<String, Object>> subjectList = subjects.stream()
                    .map(subject -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", subject.getId());
                        map.put("name", subject.getName());
                        map.put("description", subject.getDescription());
                        map.put("color", subject.getColor());
                        map.put("teacher", Map.of(
                                "id", subject.getTeacher().getId(),
                                "name", subject.getTeacher().getFullName(),
                                "email", subject.getTeacher().getEmail()));
                        map.put("grade", subject.getSchoolGrade().getGradeName());
                        return map;
                    })
                    .collect(Collectors.toList());

            log.info("✅ Materias encontradas: {}", subjectList.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subjects", subjectList,
                    "total", subjectList.size(),
                    "grade", student.getSchoolGrade().getGradeName()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo materias del estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()));
        }
    }

    /**
     * 🆕 Obtener materias de un estudiante específico (para coordinador/admin)
     */
    @GetMapping("/{studentId}/subjects")
    public ResponseEntity<?> getStudentSubjects(@PathVariable Long studentId) {
        try {
            log.info("📚 Obteniendo materias para estudiante ID: {}", studentId);

            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "subjects", List.of(),
                        "message", "El estudiante no tiene un grado asignado"));
            }

            List<Subject> subjects = subjectRepository
                    .findActiveSubjectsWithTeacherByGrade(student.getSchoolGrade().getId());

            List<Map<String, Object>> subjectList = subjects.stream()
                    .map(subject -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", subject.getId());
                        map.put("name", subject.getName());
                        map.put("description", subject.getDescription());
                        map.put("color", subject.getColor());
                        map.put("teacher", Map.of(
                                "id", subject.getTeacher().getId(),
                                "name", subject.getTeacher().getFullName(),
                                "email", subject.getTeacher().getEmail()));
                        map.put("grade", subject.getSchoolGrade().getGradeName());
                        return map;
                    })
                    .collect(Collectors.toList());

            log.info("✅ Materias encontradas: {}", subjectList.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "student", Map.of(
                            "id", student.getId(),
                            "name", student.getFullName(),
                            "email", student.getEmail(),
                            "grade", student.getSchoolGrade().getGradeName()),
                    "subjects", subjectList,
                    "total", subjectList.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo materias del estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()));
        }
    }

    /**
     * 🆕 Obtener tareas de las materias del estudiante
     */
    @GetMapping("/me/subject-tasks")
    public ResponseEntity<?> getMySubjectTasks(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Usuario no autenticado"));
            }

            String email = authentication.getName();
            log.info("📝 Obteniendo tareas para estudiante: {}", email);

            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "tasks", List.of()));
            }

            // Obtener materias del estudiante
            List<Subject> subjects = subjectRepository
                    .findActiveSubjectsWithTeacherByGrade(student.getSchoolGrade().getId());

            List<Long> subjectIds = subjects.stream()
                    .map(Subject::getId)
                    .collect(Collectors.toList());

            // Obtener tareas de esas materias
            List<Task> tasks = taskRepository.findBySubjectIdIn(subjectIds);

            List<Map<String, Object>> taskList = tasks.stream()
                    .map(task -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", task.getId());
                        map.put("title", task.getTitle());
                        map.put("description", task.getDescription());
                        map.put("dueDate", task.getDueDate());
                        map.put("status", task.getStatus());
                        map.put("subject", Map.of(
                                "id", task.getSubject().getId(),
                                "name", task.getSubject().getName(),
                                "color", task.getSubject().getColor()));
                        return map;
                    })
                    .collect(Collectors.toList());

            log.info("✅ Tareas encontradas: {}", taskList.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "tasks", taskList,
                    "total", taskList.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo tareas: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()));
        }
    }

    /**
     * 🆕 Obtener materias donde el estudiante necesita refuerzo
     * Identifica materias con promedio bajo o tareas pendientes
     */
    @GetMapping("/me/subjects/needs-reinforcement")
    public ResponseEntity<?> getSubjectsNeedingReinforcement(Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Usuario no autenticado"));
            }

            String email = authentication.getName();
            log.info("🎯 Identificando materias que necesitan refuerzo para: {}", email);

            User student = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (student.getSchoolGrade() == null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "subjects", List.of()));
            }

            // Obtener materias del estudiante
            List<Subject> subjects = subjectRepository
                    .findActiveSubjectsWithTeacherByGrade(student.getSchoolGrade().getId());

            // TODO: Implementar lógica real de cálculo de promedio y tareas pendientes
            // Por ahora, retornamos todas las materias con información básica
            List<Map<String, Object>> subjectsNeedingHelp = subjects.stream()
                    .map(subject -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", subject.getId());
                        map.put("name", subject.getName());
                        map.put("color", subject.getColor());
                        map.put("teacher", Map.of(
                                "id", subject.getTeacher().getId(),
                                "name", subject.getTeacher().getFullName()));
                        map.put("averageGrade", 0.0); // TODO: Calcular promedio real
                        map.put("pendingTasks", 0); // TODO: Contar tareas pendientes
                        map.put("needsReinforcement", false); // TODO: Determinar si necesita refuerzo
                        map.put("reinforcementReason", ""); // TODO: Razón del refuerzo
                        return map;
                    })
                    .collect(Collectors.toList());

            log.info("✅ Materias analizadas: {}", subjectsNeedingHelp.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subjects", subjectsNeedingHelp,
                    "total", subjectsNeedingHelp.size(),
                    "message", "Análisis de refuerzo completado"));

        } catch (Exception e) {
            log.error("❌ Error analizando materias para refuerzo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error: " + e.getMessage()));
        }
    }
}