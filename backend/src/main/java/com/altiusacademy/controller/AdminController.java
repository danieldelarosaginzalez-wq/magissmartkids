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
    @GetMapping({"/api/admin/dashboard/stats", "/api/super-admin/stats"})
    public ResponseEntity<Map<String, Object>> getAdminDashboardStats() {
        try {
            logger.info("Obteniendo estadísticas del dashboard administrativo");
            
            List<User> allUsers = userService.findAllUsers();
            long totalStudents = allUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count();
            long totalTeachers = allUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count();
            long totalCoordinators = allUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue())).count();
            
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
    @GetMapping({"/api/admin/users", "/api/super-admin/users"})
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
    @GetMapping({"/api/admin/institutions", "/api/super-admin/institutions"})
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
}