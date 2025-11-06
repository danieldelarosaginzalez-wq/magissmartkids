package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.InstitutionRepository;
import com.altiusacademy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstitutionRepository institutionRepository;

    /**
     * Obtener estadísticas generales del dashboard para Super Admin
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("📊 Obteniendo estadísticas del dashboard");

            // Contar usuarios por rol
            long totalUsers = userRepository.count();
            long totalStudents = userRepository.countByRole(UserRole.STUDENT);
            long totalTeachers = userRepository.countByRole(UserRole.TEACHER);
            long totalCoordinators = userRepository.countByRole(UserRole.COORDINATOR);


            // Contar instituciones
            long totalInstitutions = institutionRepository.count();
            long activeInstitutions = institutionRepository.countByIsActiveTrue();

            // Calcular crecimiento (simulado por ahora)
            double growthPercentage = 0.0; // TODO: Implementar cálculo real basado en fechas

            // Estado del sistema
            String systemStatus = "UP";
            String uptime = "99.9%";

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalStudents", totalStudents);
            stats.put("totalTeachers", totalTeachers);
            stats.put("totalCoordinators", totalCoordinators);

            stats.put("totalInstitutions", totalInstitutions);
            stats.put("activeInstitutions", activeInstitutions);
            stats.put("growthPercentage", growthPercentage);
            stats.put("systemStatus", systemStatus);
            stats.put("uptime", uptime);
            stats.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            response.put("message", "Estadísticas obtenidas correctamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo estadísticas: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener resumen de instituciones con estadísticas detalladas
     */
    @GetMapping("/institutions-summary")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> getInstitutionsSummary() {
        try {
            System.out.println("🏛️ Obteniendo resumen de instituciones");

            List<Institution> institutions = institutionRepository.findAll();
            
            List<Map<String, Object>> institutionsSummary = institutions.stream().map(institution -> {
                // Contar usuarios por institución
                long studentsCount = userRepository.countByInstitutionIdAndRole(institution.getId(), UserRole.STUDENT);
                long teachersCount = userRepository.countByInstitutionIdAndRole(institution.getId(), UserRole.TEACHER);
                long coordinatorsCount = userRepository.countByInstitutionIdAndRole(institution.getId(), UserRole.COORDINATOR);
                
                // Calcular promedio (simulado por ahora)
                double averageGrade = studentsCount > 0 ? 4.2 : 0.0; // TODO: Implementar cálculo real de promedios

                Map<String, Object> summary = new HashMap<>();
                summary.put("id", institution.getId());
                summary.put("name", institution.getName());
                summary.put("nit", institution.getNit());
                summary.put("email", institution.getEmail());
                summary.put("phone", institution.getPhone());
                summary.put("address", institution.getAddress());
                summary.put("isActive", institution.getIsActive());
                summary.put("studentsCount", studentsCount);
                summary.put("teachersCount", teachersCount);
                summary.put("coordinatorsCount", coordinatorsCount);
                summary.put("averageGrade", averageGrade);
                summary.put("status", institution.getIsActive() ? "Activo" : "Inactivo");

                return summary;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutions", institutionsSummary);
            response.put("total", institutionsSummary.size());
            response.put("message", "Resumen de instituciones obtenido correctamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo resumen de instituciones: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener resumen de instituciones: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener actividad reciente del sistema
     */
    @GetMapping("/recent-activity")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> getRecentActivity() {
        try {
            System.out.println("📋 Obteniendo actividad reciente");

            // Por ahora simulamos actividad reciente
            // TODO: Implementar sistema de logs/auditoría real
            List<Map<String, Object>> activities = List.of(
                Map.of(
                    "id", 1,
                    "type", "user_created",
                    "description", "Nuevo usuario registrado: juan.perez@email.com",
                    "timestamp", LocalDateTime.now().minusHours(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "user", "Sistema",
                    "status", "success"
                ),
                Map.of(
                    "id", 2,
                    "type", "institution_updated",
                    "description", "Institución 'Colegio Altius Central' actualizada",
                    "timestamp", LocalDateTime.now().minusHours(2).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "user", "admin@altius.com",
                    "status", "success"
                ),
                Map.of(
                    "id", 3,
                    "type", "backup_completed",
                    "description", "Backup automático completado exitosamente",
                    "timestamp", LocalDateTime.now().minusHours(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    "user", "Sistema",
                    "status", "success"
                )
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("activities", activities);
            response.put("total", activities.size());
            response.put("message", "Actividad reciente obtenida correctamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo actividad reciente: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener actividad reciente: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Activar/Desactivar institución
     */
    @PutMapping("/institutions/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN','COORDINATOR')")
    public ResponseEntity<?> toggleInstitutionStatus(@PathVariable Long id) {
        try {
            System.out.println("🔄 Cambiando estado de institución ID: " + id);

            Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Institución no encontrada"));

            institution.setIsActive(!institution.getIsActive());
            Institution updatedInstitution = institutionRepository.save(institution);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estado de institución actualizado correctamente");
            response.put("institution", Map.of(
                "id", updatedInstitution.getId(),
                "name", updatedInstitution.getName(),
                "isActive", updatedInstitution.getIsActive(),
                "status", updatedInstitution.getIsActive() ? "Activo" : "Inactivo"
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error cambiando estado de institución: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cambiar estado de institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener estado de salud del sistema
     */
    @GetMapping("/health")
    public ResponseEntity<?> getSystemHealth() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            health.put("uptime", "99.9%");
            health.put("database", "Connected");
            health.put("memory", "Normal");
            health.put("disk", "Normal");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("health", health);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estado del sistema: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
