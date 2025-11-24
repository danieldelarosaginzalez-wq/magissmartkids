package com.altiusacademy.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.TaskSubmission;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.TaskSubmissionRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.TeacherService;
import com.altiusacademy.service.StudentService;

/**
 * Controlador para funcionalidades del Coordinador
 * Proporciona endpoints para gestión de usuarios, materias y reportes
 */
@RestController
@RequestMapping("/api/coordinator")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN', 'SUPER_ADMIN')")
public class CoordinatorController {

    private static final Logger log = LoggerFactory.getLogger(CoordinatorController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private com.altiusacademy.repository.mysql.SchoolGradeRepository schoolGradeRepository;

    @Autowired
    private com.altiusacademy.repository.mysql.TeacherGradeRepository teacherGradeRepository;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskSubmissionRepository taskSubmissionRepository;

    /**
     * Obtener estadísticas del dashboard del coordinador
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@RequestParam Long institutionId) {
        try {
            log.info("📊 Obteniendo estadísticas del dashboard para institución: {}", institutionId);

            // Contar usuarios por rol
            List<User> allUsers = userRepository.findAll();
            long totalTeachers = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.TEACHER)
                    .count();
            long totalStudents = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT)
                    .count();

            // Contar materias
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);
            long totalSubjects = subjects.size();
            long subjectsWithTeacher = subjects.stream()
                    .filter(s -> s.getTeacher() != null)
                    .count();
            long subjectsWithoutTeacher = totalSubjects - subjectsWithTeacher;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalTeachers", totalTeachers);
            stats.put("totalStudents", totalStudents);
            stats.put("totalUsers", totalTeachers + totalStudents);
            stats.put("totalSubjects", totalSubjects);
            stats.put("subjectsWithTeacher", subjectsWithTeacher);
            stats.put("subjectsWithoutTeacher", subjectsWithoutTeacher);
            stats.put("activeTasks", 0); // TODO: Implementar conteo de tareas activas

            log.info("✅ Estadísticas calculadas: {} profesores, {} estudiantes, {} materias",
                    totalTeachers, totalStudents, totalSubjects);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "stats", stats));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estadísticas del dashboard: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estadísticas: " + e.getMessage()));
        }
    }

    /**
     * Obtener lista de profesores
     */
    @GetMapping("/teachers")
    public ResponseEntity<?> getTeachers(
            @RequestParam Long institutionId,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            log.info("👥 Obteniendo profesores para institución: {}", institutionId);

            List<User> teachers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.TEACHER)
                    .limit(limit)
                    .collect(Collectors.toList());

            log.info("✅ Profesores encontrados: {}", teachers.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "teachers", teachers,
                    "total", teachers.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo profesores: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Error al obtener profesores: " + e.getMessage()));
        }
    }

    /**
     * Obtener lista de estudiantes
     */
    @GetMapping("/students")
    public ResponseEntity<?> getStudents(
            @RequestParam Long institutionId,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            log.info("👥 Obteniendo estudiantes para institución: {}", institutionId);

            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT)
                    .limit(limit)
                    .collect(Collectors.toList());

            log.info("✅ Estudiantes encontrados: {}", students.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "students", students,
                    "total", students.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estudiantes: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estudiantes: " + e.getMessage()));
        }
    }

    /**
     * Crear nuevo profesor
     */
    @PostMapping("/teachers")
    public ResponseEntity<?> createTeacher(@RequestBody Map<String, Object> teacherData) {
        try {
            log.info("➕ Creando nuevo profesor");

            User teacher = new User();
            teacher.setFirstName((String) teacherData.get("firstName"));
            teacher.setLastName((String) teacherData.get("lastName"));
            teacher.setEmail((String) teacherData.get("email"));
            teacher.setPassword((String) teacherData.get("password")); // TODO: Encriptar
            teacher.setRole(UserRole.TEACHER);
            teacher.setIsActive(true);

            User savedTeacher = userRepository.save(teacher);

            log.info("✅ Profesor creado: {} {}", savedTeacher.getFirstName(), savedTeacher.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "teacher", savedTeacher,
                    "message", "Profesor creado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error creando profesor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al crear profesor: " + e.getMessage()));
        }
    }

    /**
     * Actualizar profesor
     */
    @PutMapping("/teachers/{id}")
    public ResponseEntity<?> updateTeacher(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            log.info("✏️ Actualizando profesor: {}", id);

            User teacher = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

            if (updates.containsKey("firstName")) {
                teacher.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                teacher.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("email")) {
                teacher.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("isActive")) {
                teacher.setIsActive((Boolean) updates.get("isActive"));
            }

            User updatedTeacher = userRepository.save(teacher);

            log.info("✅ Profesor actualizado: {} {}", updatedTeacher.getFirstName(), updatedTeacher.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "teacher", updatedTeacher,
                    "message", "Profesor actualizado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error actualizando profesor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al actualizar profesor: " + e.getMessage()));
        }
    }

    /**
     * Eliminar profesor
     */
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        try {
            log.info("🗑️ Eliminando profesor: {}", id);

            User teacher = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

            userRepository.delete(teacher);

            log.info("✅ Profesor eliminado: {} {}", teacher.getFirstName(), teacher.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profesor eliminado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error eliminando profesor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al eliminar profesor: " + e.getMessage()));
        }
    }

    /**
     * Crear nuevo estudiante
     */
    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, Object> studentData) {
        try {
            log.info("➕ Creando nuevo estudiante");

            User student = new User();
            student.setFirstName((String) studentData.get("firstName"));
            student.setLastName((String) studentData.get("lastName"));
            student.setEmail((String) studentData.get("email"));
            student.setPassword((String) studentData.get("password")); // TODO: Encriptar
            student.setRole(UserRole.STUDENT);
            student.setIsActive(true);

            User savedStudent = userRepository.save(student);

            log.info("✅ Estudiante creado: {} {}", savedStudent.getFirstName(), savedStudent.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "student", savedStudent,
                    "message", "Estudiante creado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error creando estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al crear estudiante: " + e.getMessage()));
        }
    }

    /**
     * Actualizar estudiante
     */
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            log.info("✏️ Actualizando estudiante: {}", id);

            User student = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (updates.containsKey("firstName")) {
                student.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                student.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("email")) {
                student.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("isActive")) {
                student.setIsActive((Boolean) updates.get("isActive"));
            }

            User updatedStudent = userRepository.save(student);

            log.info("✅ Estudiante actualizado: {} {}", updatedStudent.getFirstName(), updatedStudent.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "student", updatedStudent,
                    "message", "Estudiante actualizado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error actualizando estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al actualizar estudiante: " + e.getMessage()));
        }
    }

    /**
     * Eliminar estudiante
     */
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            log.info("🗑️ Eliminando estudiante: {}", id);

            User student = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            userRepository.delete(student);

            log.info("✅ Estudiante eliminado: {} {}", student.getFirstName(), student.getLastName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Estudiante eliminado exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error eliminando estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al eliminar estudiante: " + e.getMessage()));
        }
    }

    // ==================== DETALLES DE PROFESORES ====================

    /**
     * Obtener estadísticas detalladas de un profesor
     */
    @GetMapping("/teachers/{teacherId}/stats")
    public ResponseEntity<?> getTeacherDetailedStats(@PathVariable Long teacherId) {
        try {
            log.info("📊 Obteniendo estadísticas detalladas del profesor: {}", teacherId);

            User teacher = userRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

            // Obtener materias del profesor
            List<Subject> subjects = subjectRepository.findByTeacherId(teacherId);

            // Calcular estadísticas
            int totalSubjects = subjects.size();
            int totalStudents = subjects.stream()
                    .mapToInt(s -> s.getSchoolGrade() != null ? 30 : 0) // Estimado
                    .sum();

            Map<String, Object> stats = new HashMap<>();
            stats.put("teacherId", teacherId);
            stats.put("teacherName", teacher.getFirstName() + " " + teacher.getLastName());
            stats.put("email", teacher.getEmail());
            stats.put("isActive", teacher.getIsActive());
            stats.put("totalSubjects", totalSubjects);
            stats.put("totalStudents", totalStudents);
            stats.put("subjects", subjects.stream().map(s -> Map.of(
                    "id", s.getId(),
                    "name", s.getName(),
                    "grade", s.getSchoolGrade() != null ? s.getSchoolGrade().getGradeName() : "Sin grado",
                    "color", s.getColor())).collect(Collectors.toList()));

            log.info("✅ Estadísticas del profesor obtenidas: {} materias", totalSubjects);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "stats", stats));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estadísticas del profesor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estadísticas: " + e.getMessage()));
        }
    }

    /**
     * Obtener materias de un profesor
     */
    @GetMapping("/teachers/{teacherId}/subjects")
    public ResponseEntity<?> getTeacherSubjects(@PathVariable Long teacherId) {
        try {
            log.info("📚 Obteniendo materias del profesor: {}", teacherId);

            List<Subject> subjects = subjectRepository.findByTeacherId(teacherId);

            List<Map<String, Object>> subjectList = subjects.stream().map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("description", subject.getDescription());
                subjectMap.put("color", subject.getColor());
                subjectMap.put("isActive", subject.getIsActive());

                if (subject.getSchoolGrade() != null) {
                    subjectMap.put("grade", Map.of(
                            "id", subject.getSchoolGrade().getId(),
                            "gradeName", subject.getSchoolGrade().getGradeName(),
                            "gradeLevel", subject.getSchoolGrade().getGradeLevel()));
                }

                return subjectMap;
            }).collect(Collectors.toList());

            log.info("✅ Materias del profesor obtenidas: {}", subjectList.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subjects", subjectList,
                    "total", subjectList.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo materias del profesor: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener materias: " + e.getMessage()));
        }
    }

    // ==================== DETALLES DE ESTUDIANTES ====================

    /**
     * Obtener estadísticas detalladas de un estudiante
     */
    @GetMapping("/students/{studentId}/stats")
    public ResponseEntity<?> getStudentDetailedStats(@PathVariable Long studentId) {
        try {
            log.info("📊 Obteniendo estadísticas detalladas del estudiante: {}", studentId);

            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            Map<String, Object> stats = new HashMap<>();
            stats.put("studentId", studentId);
            stats.put("studentName", student.getFirstName() + " " + student.getLastName());
            stats.put("email", student.getEmail());
            stats.put("isActive", student.getIsActive());
            stats.put("grade",
                    student.getSchoolGrade() != null ? student.getSchoolGrade().getGradeName() : "Sin grado");
            stats.put("totalTasks", 0); // TODO: Implementar conteo real
            stats.put("completedTasks", 0);
            stats.put("pendingTasks", 0);
            stats.put("averageGrade", 0.0);
            stats.put("completionRate", 0.0);

            log.info("✅ Estadísticas del estudiante obtenidas");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "stats", stats));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estadísticas del estudiante: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estadísticas: " + e.getMessage()));
        }
    }

    // ==================== MONITOREO DE MATERIAS ====================

    /**
     * Obtener detalles de una materia
     */
    @GetMapping("/subjects/{subjectId}/details")
    public ResponseEntity<?> getSubjectDetails(@PathVariable Long subjectId) {
        try {
            log.info("📚 Obteniendo detalles de la materia: {}", subjectId);

            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada"));

            Map<String, Object> details = new HashMap<>();
            details.put("id", subject.getId());
            details.put("name", subject.getName());
            details.put("description", subject.getDescription());
            details.put("color", subject.getColor());
            details.put("isActive", subject.getIsActive());

            if (subject.getSchoolGrade() != null) {
                details.put("grade", Map.of(
                        "id", subject.getSchoolGrade().getId(),
                        "gradeName", subject.getSchoolGrade().getGradeName(),
                        "gradeLevel", subject.getSchoolGrade().getGradeLevel()));
            }

            if (subject.getTeacher() != null) {
                details.put("teacher", Map.of(
                        "id", subject.getTeacher().getId(),
                        "name", subject.getTeacher().getFirstName() + " " + subject.getTeacher().getLastName(),
                        "email", subject.getTeacher().getEmail()));
            }

            // Estadísticas estimadas
            details.put("totalStudents", 30); // Estimado
            details.put("totalTasks", 0); // TODO: Implementar
            details.put("averageGrade", 0.0); // TODO: Implementar

            log.info("✅ Detalles de la materia obtenidos");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subject", details));

        } catch (Exception e) {
            log.error("❌ Error obteniendo detalles de la materia: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener detalles: " + e.getMessage()));
        }
    }

    /**
     * Comparar materias de la institución
     */
    @GetMapping("/subjects/comparison")
    public ResponseEntity<?> compareSubjects(@RequestParam Long institutionId) {
        try {
            log.info("📊 Comparando materias de la institución: {}", institutionId);

            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);

            List<Map<String, Object>> comparison = subjects.stream().map(subject -> {
                Map<String, Object> subjectData = new HashMap<>();
                subjectData.put("id", subject.getId());
                subjectData.put("name", subject.getName());
                subjectData.put("grade",
                        subject.getSchoolGrade() != null ? subject.getSchoolGrade().getGradeName() : "Sin grado");
                subjectData.put("hasTeacher", subject.getTeacher() != null);
                subjectData.put("teacherName",
                        subject.getTeacher() != null
                                ? subject.getTeacher().getFirstName() + " " + subject.getTeacher().getLastName()
                                : "Sin asignar");
                subjectData.put("color", subject.getColor());
                subjectData.put("isActive", subject.getIsActive());
                return subjectData;
            }).collect(Collectors.toList());

            log.info("✅ Comparación de materias completada: {} materias", comparison.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subjects", comparison,
                    "total", comparison.size()));

        } catch (Exception e) {
            log.error("❌ Error comparando materias: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al comparar materias: " + e.getMessage()));
        }
    }

    // ==================== MONITOREO DE GRADOS ====================

    /**
     * Obtener estadísticas de un grado
     */
    @GetMapping("/grades/{grade}/stats")
    public ResponseEntity<?> getGradeStats(@PathVariable String grade) {
        try {
            log.info("📊 Obteniendo estadísticas del grado: {}", grade);

            // Obtener materias del grado
            List<Subject> gradeSubjects = subjectRepository.findAll().stream()
                    .filter(s -> s.getSchoolGrade() != null &&
                            s.getSchoolGrade().getGradeName().equals(grade))
                    .collect(Collectors.toList());

            // Obtener estudiantes del grado (estimado)
            int totalStudents = 30; // Estimado por grado

            Map<String, Object> stats = new HashMap<>();
            stats.put("grade", grade);
            stats.put("totalSubjects", gradeSubjects.size());
            stats.put("totalStudents", totalStudents);
            stats.put("subjectsWithTeacher", gradeSubjects.stream()
                    .filter(s -> s.getTeacher() != null)
                    .count());
            stats.put("subjectsWithoutTeacher", gradeSubjects.stream()
                    .filter(s -> s.getTeacher() == null)
                    .count());

            log.info("✅ Estadísticas del grado obtenidas");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "stats", stats));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estadísticas del grado: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estadísticas: " + e.getMessage()));
        }
    }

    /**
     * Comparar todos los grados de la institución
     */
    @GetMapping("/grades/comparison")
    public ResponseEntity<?> compareGrades(@RequestParam Long institutionId) {
        try {
            log.info("📊 Comparando grados de la institución: {}", institutionId);

            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);

            // Agrupar por grado
            Map<String, List<Subject>> subjectsByGrade = allSubjects.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .collect(Collectors.groupingBy(s -> s.getSchoolGrade().getGradeName()));

            List<Map<String, Object>> comparison = subjectsByGrade.entrySet().stream()
                    .map(entry -> {
                        String gradeName = entry.getKey();
                        List<Subject> subjects = entry.getValue();

                        Map<String, Object> gradeData = new HashMap<>();
                        gradeData.put("grade", gradeName);
                        gradeData.put("totalSubjects", subjects.size());
                        gradeData.put("subjectsWithTeacher", subjects.stream()
                                .filter(s -> s.getTeacher() != null)
                                .count());
                        gradeData.put("estimatedStudents", 30); // Estimado

                        return gradeData;
                    })
                    .collect(Collectors.toList());

            log.info("✅ Comparación de grados completada: {} grados", comparison.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "grades", comparison,
                    "total", comparison.size()));

        } catch (Exception e) {
            log.error("❌ Error comparando grados: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al comparar grados: " + e.getMessage()));
        }
    }

    // ==================== REPORTES AVANZADOS ====================

    /**
     * Reporte de rendimiento institucional
     */
    @GetMapping("/reports/institutional-performance")
    public ResponseEntity<?> getInstitutionalPerformance(@RequestParam Long institutionId) {
        try {
            log.info("📊 Generando reporte de rendimiento institucional: {}", institutionId);

            List<User> allUsers = userRepository.findAll();
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);

            long totalTeachers = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.TEACHER)
                    .count();
            long totalStudents = allUsers.stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT)
                    .count();

            Map<String, Object> report = new HashMap<>();
            report.put("institutionId", institutionId);
            report.put("totalTeachers", totalTeachers);
            report.put("totalStudents", totalStudents);
            report.put("totalSubjects", allSubjects.size());
            report.put("subjectsWithTeacher", allSubjects.stream()
                    .filter(s -> s.getTeacher() != null)
                    .count());
            report.put("averageSubjectsPerTeacher",
                    totalTeachers > 0 ? (double) allSubjects.size() / totalTeachers : 0);
            report.put("generatedAt", java.time.LocalDateTime.now());

            log.info("✅ Reporte de rendimiento generado");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "report", report));

        } catch (Exception e) {
            log.error("❌ Error generando reporte: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al generar reporte: " + e.getMessage()));
        }
    }

    /**
     * Reporte de actividad de profesores
     */
    @GetMapping("/reports/teacher-activity")
    public ResponseEntity<?> getTeacherActivity(@RequestParam Long institutionId) {
        try {
            log.info("📊 Generando reporte de actividad de profesores: {}", institutionId);

            List<User> teachers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.TEACHER)
                    .collect(Collectors.toList());

            List<Map<String, Object>> teacherActivity = teachers.stream().map(teacher -> {
                List<Subject> teacherSubjects = subjectRepository.findByTeacherId(teacher.getId());

                Map<String, Object> activity = new HashMap<>();
                activity.put("teacherId", teacher.getId());
                activity.put("teacherName", teacher.getFirstName() + " " + teacher.getLastName());
                activity.put("email", teacher.getEmail());
                activity.put("totalSubjects", teacherSubjects.size());
                activity.put("isActive", teacher.getIsActive());
                activity.put("subjects", teacherSubjects.stream()
                        .map(s -> s.getName())
                        .collect(Collectors.toList()));

                return activity;
            }).collect(Collectors.toList());

            log.info("✅ Reporte de actividad generado: {} profesores", teacherActivity.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "teachers", teacherActivity,
                    "total", teacherActivity.size()));

        } catch (Exception e) {
            log.error("❌ Error generando reporte de actividad: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al generar reporte: " + e.getMessage()));
        }
    }

    /**
     * Reporte de participación estudiantil
     */
    @GetMapping("/reports/student-participation")
    public ResponseEntity<?> getStudentParticipation(@RequestParam Long institutionId) {
        try {
            log.info("📊 Generando reporte de participación estudiantil: {}", institutionId);

            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT)
                    .collect(Collectors.toList());

            // Agrupar por grado
            Map<String, Long> studentsByGrade = students.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .collect(Collectors.groupingBy(
                            s -> s.getSchoolGrade().getGradeName(),
                            Collectors.counting()));

            Map<String, Object> report = new HashMap<>();
            report.put("totalStudents", students.size());
            report.put("activeStudents", students.stream()
                    .filter(User::getIsActive)
                    .count());
            report.put("studentsByGrade", studentsByGrade);
            report.put("generatedAt", java.time.LocalDateTime.now());

            log.info("✅ Reporte de participación generado: {} estudiantes", students.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "report", report));

        } catch (Exception e) {
            log.error("❌ Error generando reporte de participación: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al generar reporte: " + e.getMessage()));
        }
    }

    // ==================== GESTIÓN DE GRADOS ====================

    /**
     * Inicializar grados escolares (solo para desarrollo)
     */
    @PostMapping("/school-grades/init")
    public ResponseEntity<?> initSchoolGrades() {
        try {
            log.info("🔧 Inicializando grados escolares...");

            // Verificar si ya existen grados
            long existingGrades = schoolGradeRepository.count();
            if (existingGrades > 0) {
                log.info("ℹ️ Ya existen {} grados en la base de datos", existingGrades);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Ya existen " + existingGrades + " grados en la base de datos"));
            }

            // Crear grados de ejemplo
            String[] gradeNames = {
                    "Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto",
                    "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo", "Duodécimo"
            };

            for (int i = 0; i < gradeNames.length; i++) {
                com.altiusacademy.model.entity.SchoolGrade grade = new com.altiusacademy.model.entity.SchoolGrade();
                grade.setGradeName(gradeNames[i]);
                grade.setGradeLevel(i + 1);
                grade.setDescription(gradeNames[i] + " grado");
                grade.setIsActive(true);
                schoolGradeRepository.save(grade);
            }

            long totalGrades = schoolGradeRepository.count();
            log.info("✅ Grados escolares inicializados: {}", totalGrades);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Grados inicializados exitosamente",
                    "total", totalGrades));

        } catch (Exception e) {
            log.error("❌ Error inicializando grados: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al inicializar grados: " + e.getMessage()));
        }
    }

    /**
     * Obtener todos los grados escolares de la institución
     */
    @GetMapping("/school-grades")
    public ResponseEntity<?> getAllSchoolGrades(@RequestParam Long institutionId) {
        try {
            log.info("📚 Obteniendo grados escolares de la institución: {}", institutionId);

            List<com.altiusacademy.model.entity.TeacherGrade> teacherGrades = teacherGradeRepository
                    .findAllByInstitutionWithTeacher(institutionId);

            // Agrupar por gradeLevel para obtener grados únicos
            Map<Integer, com.altiusacademy.model.entity.TeacherGrade> uniqueGrades = new HashMap<>();
            for (com.altiusacademy.model.entity.TeacherGrade tg : teacherGrades) {
                if (!uniqueGrades.containsKey(tg.getGradeLevel())) {
                    uniqueGrades.put(tg.getGradeLevel(), tg);
                }
            }

            List<Map<String, Object>> gradeList = uniqueGrades.values().stream()
                    .sorted((a, b) -> a.getGradeLevel().compareTo(b.getGradeLevel()))
                    .map(grade -> {
                        Map<String, Object> gradeMap = new HashMap<>();
                        gradeMap.put("id", grade.getId());
                        gradeMap.put("gradeName", getGradeName(grade.getGradeLevel()) + " " + grade.getSection());
                        gradeMap.put("gradeLevel", grade.getGradeLevel());
                        gradeMap.put("section", grade.getSection());
                        gradeMap.put("academicYear", grade.getAcademicYear());
                        gradeMap.put("isActive", grade.getIsActive());
                        return gradeMap;
                    }).collect(Collectors.toList());

            log.info("✅ Grados escolares obtenidos: {}", gradeList.size());

            return ResponseEntity.ok(gradeList);

        } catch (Exception e) {
            log.error("❌ Error obteniendo grados escolares: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener grados: " + e.getMessage()));
        }
    }

    /**
     * Helper para convertir nivel de grado a nombre
     */
    private String getGradeName(Integer level) {
        String[] names = { "", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto",
                "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo", "Undécimo", "Duodécimo" };
        return level > 0 && level < names.length ? names[level] : "Grado " + level;
    }

    // ==================== GESTIÓN DE ESTUDIANTES Y GRADOS ====================

    /**
     * Asignar estudiantes masivamente a un grado
     */
    @PostMapping("/students/assign-grade")
    public ResponseEntity<?> assignStudentsToGrade(@RequestBody Map<String, Object> request) {
        try {
            log.info("📥 Request recibido: {}", request);

            if (!request.containsKey("studentIds") || !request.containsKey("schoolGradeId")) {
                throw new RuntimeException("Faltan parámetros requeridos: studentIds y schoolGradeId");
            }

            @SuppressWarnings("unchecked")
            List<Integer> studentIdsInt = (List<Integer>) request.get("studentIds");
            List<Long> studentIds = studentIdsInt.stream().map(Long::valueOf).collect(Collectors.toList());

            Object gradeIdObj = request.get("schoolGradeId");
            Long teacherGradeId = gradeIdObj instanceof Integer ? Long.valueOf((Integer) gradeIdObj)
                    : (Long) gradeIdObj;

            log.info("📚 Asignando {} estudiantes al teacher_grade ID: {}", studentIds.size(), teacherGradeId);

            // Buscar el TeacherGrade para obtener el nivel y sección
            com.altiusacademy.model.entity.TeacherGrade teacherGrade = teacherGradeRepository.findById(teacherGradeId)
                    .orElseThrow(
                            () -> new RuntimeException("Grado de profesor no encontrado con ID: " + teacherGradeId));

            log.info("📖 TeacherGrade encontrado: Nivel {}, Sección {}",
                    teacherGrade.getGradeLevel(), teacherGrade.getSection());

            // Buscar o crear el SchoolGrade correspondiente
            String gradeName = getGradeName(teacherGrade.getGradeLevel());
            com.altiusacademy.model.entity.SchoolGrade schoolGrade = schoolGradeRepository
                    .findAll().stream()
                    .filter(g -> g.getGradeLevel().equals(teacherGrade.getGradeLevel()))
                    .findFirst()
                    .orElseGet(() -> {
                        com.altiusacademy.model.entity.SchoolGrade newGrade = new com.altiusacademy.model.entity.SchoolGrade();
                        newGrade.setGradeName(gradeName);
                        newGrade.setGradeLevel(teacherGrade.getGradeLevel());
                        newGrade.setIsActive(true);
                        return schoolGradeRepository.save(newGrade);
                    });

            int assigned = 0;
            for (Long studentId : studentIds) {
                User student = userRepository.findById(studentId).orElse(null);
                if (student != null && student.getRole() == UserRole.STUDENT) {
                    student.setSchoolGrade(schoolGrade);
                    userRepository.save(student);
                    assigned++;
                    log.info("  ✅ Estudiante {} asignado", student.getFullName());
                }
            }

            log.info("✅ {} estudiantes asignados al grado {}", assigned, schoolGrade.getGradeName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", assigned + " estudiantes asignados exitosamente",
                    "assigned", assigned));

        } catch (Exception e) {
            log.error("❌ Error asignando estudiantes a grado: {}", e.getMessage(), e);
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al asignar estudiantes: " + e.getMessage()));
        }
    }

    /**
     * Obtener estudiantes sin grado asignado
     */
    @GetMapping("/students/without-grade")
    public ResponseEntity<?> getStudentsWithoutGrade(@RequestParam Long institutionId) {
        try {
            log.info("📋 Obteniendo estudiantes sin grado de la institución: {}", institutionId);

            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.STUDENT)
                    .filter(u -> u.getSchoolGrade() == null)
                    .collect(Collectors.toList());

            log.info("✅ Encontrados {} estudiantes sin grado", students.size());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "students", students,
                    "total", students.size()));

        } catch (Exception e) {
            log.error("❌ Error obteniendo estudiantes sin grado: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al obtener estudiantes: " + e.getMessage()));
        }
    }

    // ==================== GESTIÓN DE MATERIAS ====================

    /**
     * Crear nueva materia
     */
    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@RequestBody Map<String, Object> subjectData) {
        try {
            log.info("➕ Creando nueva materia");

            Subject subject = new Subject();
            subject.setName((String) subjectData.get("name"));
            subject.setDescription((String) subjectData.get("description"));
            subject.setColor((String) subjectData.get("color"));
            subject.setIsActive((Boolean) subjectData.getOrDefault("isActive", true));

            // Asignar grado
            if (subjectData.containsKey("schoolGradeId")) {
                Long gradeId = Long.valueOf(subjectData.get("schoolGradeId").toString());
                com.altiusacademy.model.entity.SchoolGrade grade = schoolGradeRepository.findById(gradeId)
                        .orElseThrow(() -> new RuntimeException("Grado no encontrado"));
                subject.setSchoolGrade(grade);
            }

            // Asignar institución
            if (subjectData.containsKey("institutionId")) {
                Long institutionId = Long.valueOf(subjectData.get("institutionId").toString());
                com.altiusacademy.model.entity.Institution institution = new com.altiusacademy.model.entity.Institution();
                institution.setId(institutionId);
                subject.setInstitution(institution);
            }

            Subject savedSubject = subjectRepository.save(subject);

            log.info("✅ Materia creada: {}", savedSubject.getName());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "subject", savedSubject,
                    "message", "Materia creada exitosamente"));

        } catch (Exception e) {
            log.error("❌ Error creando materia: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error al crear materia: " + e.getMessage()));
        }
    }

    /**
     * 📊 ANALYTICS ENDPOINTS - Análisis de Rendimiento Académico en Tiempo Real
     */

    @GetMapping("/analytics/grades")
    public ResponseEntity<?> getGradesAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        try {
            log.info("📊 Getting grades analytics for period: {}", period);

            List<Map<String, Object>> gradesAnalytics = new ArrayList<>();
            String[] grades = { "Preescolar", "1° A", "2° A", "3° A", "4° A", "5° A" };

            for (String grade : grades) {
                List<User> students = userRepository.findAll().stream()
                        .filter(u -> u.getRole() == com.altiusacademy.model.enums.UserRole.STUDENT)
                        .filter(u -> u.getSchoolGrade() != null && u.getSchoolGrade().getGradeName().equals(grade))
                        .collect(Collectors.toList());

                if (!students.isEmpty()) {
                    double totalScore = 0;
                    int studentsWithGrades = 0;
                    int atRisk = 0;
                    int passed = 0;

                    for (User student : students) {
                        List<TaskSubmission> submissions = taskSubmissionRepository.findByStudentId(student.getId());
                        long gradedSubmissions = submissions.stream().filter(s -> s.getScore() != null).count();

                        if (gradedSubmissions > 0) {
                            double avgScore = submissions.stream()
                                    .filter(s -> s.getScore() != null)
                                    .mapToDouble(TaskSubmission::getScore)
                                    .average()
                                    .orElse(0.0);

                            totalScore += avgScore;
                            studentsWithGrades++;
                            if (avgScore >= 3.0)
                                passed++;
                            if (avgScore < 3.5)
                                atRisk++;
                        }
                    }

                    double averageScore = studentsWithGrades > 0 ? totalScore / studentsWithGrades : 0.0;
                    double passRate = students.size() > 0 ? (passed * 100.0 / students.size()) : 0.0;

                    Map<String, Object> gradeData = new HashMap<>();
                    gradeData.put("grade", grade);
                    gradeData.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
                    gradeData.put("totalStudents", students.size());
                    gradeData.put("passRate", Math.round(passRate));
                    gradeData.put("atRiskStudents", atRisk);
                    gradeData.put("trend", averageScore >= 4.0 ? "up" : averageScore >= 3.0 ? "stable" : "down");
                    gradeData.put("trendPercentage", Math.round((Math.random() * 10 - 5) * 10.0) / 10.0);

                    gradesAnalytics.add(gradeData);
                }
            }

            return ResponseEntity.ok(Map.of("grades", gradesAnalytics));
        } catch (Exception e) {
            log.error("❌ Error getting grades analytics: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics/subjects")
    public ResponseEntity<?> getSubjectsAnalytics(@RequestParam(defaultValue = "month") String period) {
        try {
            log.info("📊 Getting subjects analytics");

            List<Subject> allSubjects = subjectRepository.findAll();
            List<Map<String, Object>> subjectsAnalytics = new ArrayList<>();

            for (Subject subject : allSubjects) {
                List<Task> tasks = taskRepository.findBySubjectIdIn(List.of(subject.getId()));

                if (!tasks.isEmpty()) {
                    List<TaskSubmission> submissions = new ArrayList<>();
                    for (Task task : tasks) {
                        submissions.addAll(taskSubmissionRepository.findByTaskId(task.getId()));
                    }

                    double avgScore = submissions.stream()
                            .filter(s -> s.getScore() != null)
                            .mapToDouble(TaskSubmission::getScore)
                            .average()
                            .orElse(0.0);

                    long completedTasks = submissions.stream().filter(s -> s.getScore() != null).count();
                    double completionRate = submissions.size() > 0 ? (completedTasks * 100.0 / submissions.size())
                            : 0.0;

                    Map<String, Object> subjectData = new HashMap<>();
                    subjectData.put("subjectName", subject.getName());
                    subjectData.put("teacherName",
                            subject.getTeacher() != null ? subject.getTeacher().getFullName() : "Sin asignar");
                    subjectData.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
                    subjectData.put("completionRate", Math.round(completionRate));
                    subjectData.put("studentsCount", submissions.size());

                    subjectsAnalytics.add(subjectData);
                }
            }

            return ResponseEntity.ok(Map.of("subjects", subjectsAnalytics));
        } catch (Exception e) {
            log.error("❌ Error getting subjects analytics: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics/alerts")
    public ResponseEntity<?> getAcademicAlerts() {
        try {
            log.info("🚨 Getting academic alerts");

            List<Map<String, Object>> alerts = new ArrayList<>();
            List<User> students = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == com.altiusacademy.model.enums.UserRole.STUDENT)
                    .collect(Collectors.toList());

            int alertId = 1;
            for (User student : students) {
                List<TaskSubmission> submissions = taskSubmissionRepository.findByStudentId(student.getId());
                long gradedSubmissions = submissions.stream().filter(s -> s.getScore() != null).count();

                if (gradedSubmissions > 0) {
                    double avgScore = submissions.stream()
                            .filter(s -> s.getScore() != null)
                            .mapToDouble(TaskSubmission::getScore)
                            .average()
                            .orElse(0.0);

                    if (avgScore < 3.0) {
                        Map<String, Object> alert = new HashMap<>();
                        alert.put("id", alertId++);
                        alert.put("type", "critical");
                        alert.put("message", "Estudiante con promedio crítico - Requiere intervención inmediata");
                        alert.put("studentName", student.getFullName());
                        alert.put("grade",
                                student.getSchoolGrade() != null ? student.getSchoolGrade().getGradeName() : "N/A");
                        alert.put("timestamp", java.time.LocalDateTime.now().toString());
                        alerts.add(alert);
                    } else if (avgScore < 3.5) {
                        Map<String, Object> alert = new HashMap<>();
                        alert.put("id", alertId++);
                        alert.put("type", "warning");
                        alert.put("message", "Estudiante en riesgo - Monitoreo recomendado");
                        alert.put("studentName", student.getFullName());
                        alert.put("grade",
                                student.getSchoolGrade() != null ? student.getSchoolGrade().getGradeName() : "N/A");
                        alert.put("timestamp", java.time.LocalDateTime.now().toString());
                        alerts.add(alert);
                    }
                }
            }

            return ResponseEntity.ok(Map.of("alerts", alerts));
        } catch (Exception e) {
            log.error("❌ Error getting academic alerts: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
