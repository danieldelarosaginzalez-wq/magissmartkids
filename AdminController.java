package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.service.InstitutionService;
import com.altiusacademy.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador de administración
 * 
 * Maneja operaciones administrativas y de super administrador.
 * Solo accesible para usuarios con rol SUPER_ADMIN.
 * 
 * Endpoints:
 * - /api/admin/* - Operaciones administrativas generales
 * - /api/super-admin/* - Operaciones de super administrador (alias)
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@RestController
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final UserService userService;
    private final InstitutionService institutionService;

    public AdminController(UserService userService, InstitutionService institutionService) {
        this.userService = userService;
        this.institutionService = institutionService;
    }

    /**
     * Obtener estadísticas del dashboard administrativo
     * Endpoints: /api/admin/dashboard/stats y /api/super-admin/stats
     */
    @GetMapping({ "/api/admin/dashboard/stats", "/api/super-admin/stats" })
    public ResponseEntity<Map<String, Object>> getAdminDashboardStats() {
        try {
            logger.info("Obteniendo estadísticas del dashboard administrativo");

            List<User> allUsers = userService.findAllUsers();
            long totalStudents = allUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count();
            long totalTeachers = allUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count();
            long totalCoordinators = allUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue()))
                    .count();

            List<Institution> allInstitutions = institutionService.findAllInstitutions();
            long totalInstitutions = allInstitutions.size();
            long activeInstitutions = allInstitutions.stream()
                    .filter(i -> i.getIsActive() != null && i.getIsActive())
                    .count();

            List<User> recentUsers = allUsers.stream()
                    .sorted((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt()))
                    .limit(5)
                    .toList();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", allUsers.size());
            stats.put("totalStudents", totalStudents);
            stats.put("totalTeachers", totalTeachers);
            stats.put("totalCoordinators", totalCoordinators);
            stats.put("totalInstitutions", totalInstitutions);
            stats.put("activeInstitutions", activeInstitutions);
            stats.put("recentUsers", recentUsers);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            logger.error("Error obteniendo estadísticas administrativas: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error obteniendo estadísticas"));
        }
    }

    /**
     * Obtener todos los usuarios del sistema
     * Endpoints: /api/admin/users y /api/super-admin/users
     */
    @GetMapping({ "/api/admin/users", "/api/super-admin/users" })
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            logger.info("Obteniendo todos los usuarios");

            List<User> users = userService.findAllUsers();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users);
            response.put("total", users.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error obteniendo usuarios: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error obteniendo usuarios"));
        }
    }

    /**
     * Obtener todas las instituciones
     * Endpoints: /api/admin/institutions y /api/super-admin/institutions
     */
    @GetMapping({ "/api/admin/institutions", "/api/super-admin/institutions" })
    public ResponseEntity<Map<String, Object>> getAllInstitutions() {
        try {
            logger.info("Obteniendo todas las instituciones");

            List<Institution> institutions = institutionService.findAllInstitutions();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutions", institutions);
            response.put("total", institutions.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error obteniendo instituciones: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error obteniendo instituciones"));
        }
    }

    /**
     * Obtener estudiantes por grado
     * Endpoint: /api/students/by-grade?grade=Cuarto C
     */
    @GetMapping("/api/students/by-grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'COORDINATOR', 'SUPER_ADMIN')")
    public ResponseEntity<?> getStudentsByGrade(@RequestParam String grade) {
        try {
            logger.info("Obteniendo estudiantes del grado: {}", grade);

            List<User> students = userService.findStudentsByGrade(grade);

            return ResponseEntity.ok(students);

        } catch (Exception e) {
            logger.error("Error obteniendo estudiantes del grado {}: {}", grade, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Error obteniendo estudiantes"));
        }
    }


// ==================== ESTADÍSTICAS AVANZADAS ====================
// AGREGAR ESTOS MÉTODOS ANTES DEL CIERRE DE LA CLASE AdminController

/**
 * Obtener instituciones por ubicación (dirección)
 * GET /api/admin/stats/institutions-by-region
 * 
 * Agrupa las instituciones por la dirección exacta que ingresaron al crear la
 * institución
 */
@GetMapping({ "/api/admin/stats/institutions-by-region", "/api/super-admin/stats/institutions-by-region" })
public ResponseEntity<Map<String, Object>> getInstitutionsByRegion() {
    try {
        logger.info("📍 Obteniendo instituciones por ubicación");

        List<Institution> allInstitutions = institutionService.findAllInstitutions();
        logger.info("✅ Instituciones encontradas: {}", allInstitutions.size());

        // Agrupar por dirección/ubicación exacta que ingresaron
        Map<String, Long> institutionsByLocation = new HashMap<>();

        for (Institution inst : allInstitutions) {
            String address = inst.getAddress();

            // Si no tiene dirección, usar "Sin ubicación"
            String location = (address != null && !address.trim().isEmpty())
                    ? address.trim()
                    : "Sin ubicación";

            // Contar instituciones por ubicación
            institutionsByLocation.put(location, institutionsByLocation.getOrDefault(location, 0L) + 1);
        }

        logger.info("📊 Instituciones por ubicación: {}", institutionsByLocation);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", institutionsByLocation);
        response.put("total", allInstitutions.size());

        logger.info("✅ Respuesta generada exitosamente con {} ubicaciones únicas", institutionsByLocation.size());
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        logger.error("❌ Error obteniendo instituciones por ubicación: {}", e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", "Error obteniendo estadísticas: " + e.getMessage());
        return ResponseEntity.status(500).body(errorResponse);
    }
}

/**
 * Obtener actividad mensual
 * GET /api/admin/stats/monthly-activity
 */
@GetMapping({ "/api/admin/stats/monthly-activity", "/api/super-admin/stats/monthly-activity" })
public ResponseEntity<Map<String, Object>> getMonthlyActivity() {
    try {
        logger.info("📊 Obteniendo actividad mensual");

        List<User> allUsers = userService.findAllUsers();
        logger.info("✅ Usuarios encontrados: {}", allUsers.size());

        // Calcular usuarios nuevos este mes
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        long newRegistrations = allUsers.stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(startOfMonth))
                .count();

        logger.info("📈 Nuevos registros este mes: {}", newRegistrations);

        // Contar tareas creadas este mes (DATOS REALES)
        long tasksCreated = taskRepository.findAll().stream()
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isAfter(startOfMonth))
                .count();
        logger.info("📝 Tareas creadas este mes: {}", tasksCreated);

        // Contar tareas calificadas este mes (DATOS REALES)
        long gradesSubmitted = taskRepository.findAll().stream()
                .filter(t -> t.getGradedAt() != null && t.getGradedAt().isAfter(startOfMonth))
                .count();
        logger.info("✅ Calificaciones enviadas este mes: {}", gradesSubmitted);

        // Contar registros de asistencia este mes (DATOS REALES)
        long attendanceRecords = attendanceRepository.findAll().stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().isAfter(startOfMonth))
                .count();
        logger.info("📊 Registros de asistencia este mes: {}", attendanceRecords);

        Map<String, Object> activity = new HashMap<>();
        activity.put("newRegistrations", newRegistrations);
        activity.put("tasksCreated", tasksCreated); // REAL
        activity.put("gradesSubmitted", gradesSubmitted); // REAL
        activity.put("reportsGenerated", attendanceRecords); // REAL

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", activity);

        logger.info("✅ Respuesta de actividad mensual generada exitosamente");
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        logger.error("❌ Error obteniendo actividad mensual: {}", e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", "Error obteniendo actividad mensual: " + e.getMessage());
        return ResponseEntity.status(500).body(errorResponse);
    }
}

/**
 * Obtener rendimiento académico
 * GET /api/admin/stats/academic-performance
 */
@GetMapping({ "/api/admin/stats/academic-performance", "/api/super-admin/stats/academic-performance" })
public ResponseEntity<Map<String, Object>> getAcademicPerformance() {
    try {
        logger.info("🎓 Obteniendo rendimiento académico");

        List<User> allStudents = userService.findAllUsers().stream()
                .filter(u -> "student".equals(u.getRole().getValue()))
                .toList();

        logger.info("✅ Estudiantes encontrados: {}", allStudents.size());

        // Calcular estadísticas (simuladas - agregar tablas de calificaciones)
        // 1. Promedio de calificaciones reales
        List<Task> allTasks = taskRepository.findAll();
        double averageGrade = allTasks.stream()
                .filter(t -> t.getScore() != null && t.getScore() > 0)
                .mapToDouble(Task::getScore)
                .average()
                .orElse(0.0);
        logger.info("📊 Promedio real: {}", averageGrade);
        
        // 2. Tasa de aprobación real
        long totalGraded = allTasks.stream()
                .filter(t -> t.getScore() != null && t.getScore() > 0)
                .count();
        long approved = allTasks.stream()
                .filter(t -> t.getScore() != null && t.getScore() >= 3.0)
                .count();
        double approvalRate = totalGraded > 0 ? (approved * 100.0 / totalGraded) : 0.0;
        logger.info("✅ Aprobación real: {}%", approvalRate);
        
        // 3. Tasa de asistencia real
        List<Attendance> allAttendance = attendanceRepository.findAll();
        long totalAttendance = allAttendance.size();
        long presentCount = allAttendance.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
        double attendanceRate = totalAttendance > 0 ? (presentCount * 100.0 / totalAttendance) : 0.0;
        logger.info("📅 Asistencia real: {}%", attendanceRate);
        

        Map<String, Object> performance = new HashMap<>();
        performance.put("averageGrade", averageGrade);
        performance.put("approvalRate", approvalRate);
        performance.put("attendanceRate", attendanceRate);
        performance.put("totalStudents", allStudents.size());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", performance);

        logger.info("✅ Respuesta de rendimiento académico generada exitosamente");
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        logger.error("❌ Error obteniendo rendimiento académico: {}", e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", "Error obteniendo rendimiento académico: " + e.getMessage());
        return ResponseEntity.status(500).body(errorResponse);
    }
}

}