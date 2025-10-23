package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.service.InstitutionService;
import com.altiusacademy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final UserService userService;
    private final InstitutionService institutionService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSuperAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        // User statistics
        List<User> allUsers = userService.findAllUsers();
        stats.put("totalUsers", allUsers.size());
        stats.put("totalStudents", allUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count());
        stats.put("totalTeachers", allUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count());
        stats.put("totalCoordinators", allUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue())).count());
        stats.put("totalParents", allUsers.stream().filter(u -> "parent".equals(u.getRole().getValue())).count());

        // Institution statistics
        List<Institution> allInstitutions = institutionService.findAllInstitutions();
        stats.put("totalInstitutions", allInstitutions.size());
        stats.put("activeInstitutions", allInstitutions.stream().filter(i -> i.getIsActive() != null && i.getIsActive()).count());

        // System metrics (mock data for now)
        stats.put("systemUptime", "99.9%");
        stats.put("databaseSize", "2.5 GB");
        stats.put("monthlyGrowth", "+15.2%");
        stats.put("activeSessions", 247);
        stats.put("pendingApprovals", 12);
        stats.put("systemHealth", "excellent");

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/institutions")
    public ResponseEntity<Map<String, Object>> getAllInstitutions() {
        List<Institution> institutions = institutionService.findAllInstitutions();

        Map<String, Object> response = new HashMap<>();
        response.put("institutions", institutions.stream().map(inst -> {
            Map<String, Object> instData = new HashMap<>();
            instData.put("id", inst.getId());
            instData.put("name", inst.getName());
            instData.put("address", inst.getAddress());
            instData.put("status", inst.getIsActive() != null && inst.getIsActive() ? "active" : "inactive");
            instData.put("createdAt", inst.getCreatedAt());

            // Get users for this institution
            List<User> institutionUsers = userService.findUsersByInstitution(inst.getId());
            instData.put("students", institutionUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count());
            instData.put("teachers", institutionUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count());
            instData.put("coordinators", institutionUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue())).count());

            // Mock average grade for now
            instData.put("avgGrade", 4.0);
            instData.put("subscriptionTier", "Standard");

            return instData;
        }).toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userService.findAllUsers();

        Map<String, Object> response = new HashMap<>();
        response.put("users", users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole().getValue());
            userData.put("status", user.getIsActive() != null && user.getIsActive() ? "active" : "inactive");
            userData.put("createdAt", user.getCreatedAt());

            // Add institution name if user belongs to one
            if (user.getInstitution() != null) {
                userData.put("institutionName", user.getInstitution().getName());
            }

            return userData;
        }).toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/system-metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Mock system metrics - in a real implementation, these would come from monitoring tools
        metrics.put("cpuUsage", 45);
        metrics.put("memoryUsage", 67);
        metrics.put("diskUsage", 78);
        metrics.put("networkTraffic", 120);
        metrics.put("activeConnections", 247);
        metrics.put("responseTime", 125);

        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/institutions")
    public ResponseEntity<Map<String, Object>> createInstitution(@RequestBody Map<String, Object> institutionData) {
        try {
            System.out.println("🏛️ [POST] /api/super-admin/institutions - Creando nueva institución por super admin");

            // Validar datos requeridos
            if (institutionData.get("name") == null || institutionData.get("name").toString().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El nombre de la institución es requerido");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar NIT si está presente
            String nit = null;
            if (institutionData.get("nit") != null) {
                nit = institutionData.get("nit").toString().trim();
                if (!nit.isEmpty()) {
                    // Verificar que el NIT sea único
                    if (institutionService.findByNit(nit) != null) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("message", "Ya existe una institución con este NIT");
                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }

            // Verificar que no exista una institución con el mismo nombre
            if (institutionService.existsByNameIgnoreCase(institutionData.get("name").toString().trim())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Ya existe una institución con ese nombre");
                return ResponseEntity.badRequest().body(response);
            }

            // Crear nueva institución
            Institution institution = new Institution();
            institution.setName(institutionData.get("name").toString().trim());

            if (nit != null && !nit.isEmpty()) {
                institution.setNit(nit);
            }

            if (institutionData.get("address") != null) {
                institution.setAddress(institutionData.get("address").toString().trim());
            }

            if (institutionData.get("phone") != null) {
                institution.setPhone(institutionData.get("phone").toString().trim());
            }

            if (institutionData.get("email") != null) {
                String email = institutionData.get("email").toString().trim();
                if (!email.isEmpty()) {
                    institution.setEmail(email.toLowerCase());
                }
            }

            institution.setIsActive(true);

            Institution savedInstitution = institutionService.saveInstitution(institution);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Institución creada correctamente");
            response.put("institution", savedInstitution);

            System.out.println("✅ Institución creada por super admin con ID: " + savedInstitution.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error creando institución por super admin: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al crear institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/institutions/{id}")
    public ResponseEntity<Institution> updateInstitution(@PathVariable Long id, @RequestBody Map<String, Object> institutionData) {
        Institution institution = institutionService.findInstitutionById(id);
        if (institution != null) {
            institution.setName((String) institutionData.get("name"));
            institution.setAddress((String) institutionData.get("address"));
            institution.setIsActive("active".equals(institutionData.get("status")));

            Institution updatedInstitution = institutionService.saveInstitution(institution);
            return ResponseEntity.ok(updatedInstitution);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/institutions/{id}")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long id) {
        institutionService.deleteInstitution(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> userData) {
        // Implementation for creating users
        User user = new User();
        user.setFirstName((String) userData.get("firstName"));
        user.setLastName((String) userData.get("lastName"));
        user.setEmail((String) userData.get("email"));
        // Set other user properties...

        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        User user = userService.findUserById(id);
        if (user != null) {
            user.setFirstName((String) userData.get("firstName"));
            user.setLastName((String) userData.get("lastName"));
            user.setEmail((String) userData.get("email"));
            // Update other properties...

            User updatedUser = userService.saveUser(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/assign-institution/{institutionId}")
    public ResponseEntity<Void> assignUserToInstitution(@PathVariable Long userId, @PathVariable Long institutionId) {
        userService.assignUserToInstitution(userId, institutionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/change-role")
    public ResponseEntity<Void> changeUserRole(@PathVariable Long userId, @RequestBody Map<String, String> roleData) {
        String newRole = roleData.get("role");
        userService.changeUserRole(userId, newRole);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long institutionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<User> allUsers = userService.findAllUsers();
        
        // Apply filters
        List<User> filteredUsers = allUsers.stream()
            .filter(user -> query == null || query.isEmpty() || 
                    user.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                    user.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(query.toLowerCase()))
            .filter(user -> role == null || role.isEmpty() || user.getRole().getValue().equals(role))
            .filter(user -> status == null || status.isEmpty() || 
                    (status.equals("active") && user.getIsActive() != null && user.getIsActive()) ||
                    (status.equals("inactive") && (user.getIsActive() == null || !user.getIsActive())))
            .filter(user -> institutionId == null || 
                    (user.getInstitution() != null && user.getInstitution().getId().equals(institutionId)))
            .toList();

        // Apply pagination
        int totalElements = filteredUsers.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);
        
        List<User> paginatedUsers = startIndex < totalElements ? 
            filteredUsers.subList(startIndex, endIndex) : new ArrayList<>();

        Map<String, Object> response = new HashMap<>();
        response.put("users", paginatedUsers.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("firstName", user.getFirstName());
            userData.put("lastName", user.getLastName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole().getValue());
            userData.put("status", user.getIsActive() != null && user.getIsActive() ? "active" : "inactive");
            userData.put("createdAt", user.getCreatedAt());
            if (user.getInstitution() != null) {
                userData.put("institutionName", user.getInstitution().getName());
            }
            return userData;
        }).toList());
        
        response.put("pagination", Map.of(
            "page", page,
            "size", size,
            "totalElements", totalElements,
            "totalPages", totalPages,
            "hasNext", page < totalPages - 1,
            "hasPrevious", page > 0
        ));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/institutions/search")
    public ResponseEntity<Map<String, Object>> searchInstitutions(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<Institution> allInstitutions = institutionService.findAllInstitutions();
        
        // Apply filters
        List<Institution> filteredInstitutions = allInstitutions.stream()
            .filter(inst -> query == null || query.isEmpty() || 
                    inst.getName().toLowerCase().contains(query.toLowerCase()) ||
                    (inst.getAddress() != null && inst.getAddress().toLowerCase().contains(query.toLowerCase())))
            .filter(inst -> status == null || status.isEmpty() || 
                    (status.equals("active") && inst.getIsActive() != null && inst.getIsActive()) ||
                    (status.equals("inactive") && (inst.getIsActive() == null || !inst.getIsActive())))
            .toList();

        // Apply pagination
        int totalElements = filteredInstitutions.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);
        
        List<Institution> paginatedInstitutions = startIndex < totalElements ? 
            filteredInstitutions.subList(startIndex, endIndex) : new ArrayList<>();

        Map<String, Object> response = new HashMap<>();
        response.put("institutions", paginatedInstitutions.stream().map(inst -> {
            Map<String, Object> instData = new HashMap<>();
            instData.put("id", inst.getId());
            instData.put("name", inst.getName());
            instData.put("address", inst.getAddress());
            instData.put("status", inst.getIsActive() != null && inst.getIsActive() ? "active" : "inactive");
            instData.put("createdAt", inst.getCreatedAt());

            // Get users for this institution
            List<User> institutionUsers = userService.findUsersByInstitution(inst.getId());
            instData.put("students", institutionUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count());
            instData.put("teachers", institutionUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count());
            instData.put("coordinators", institutionUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue())).count());

            // Mock average grade for now
            instData.put("avgGrade", 4.0);
            instData.put("subscriptionTier", "Standard");

            return instData;
        }).toList());
        
        response.put("pagination", Map.of(
            "page", page,
            "size", size,
            "totalElements", totalElements,
            "totalPages", totalPages,
            "hasNext", page < totalPages - 1,
            "hasPrevious", page > 0
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/bulk-activate")
    public ResponseEntity<Map<String, Object>> bulkActivateUsers(@RequestBody Map<String, List<Long>> request) {
        List<Long> userIds = request.get("userIds");
        if (userIds == null || userIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userIds list cannot be empty"));
        }

        int successCount = 0;
        List<Long> failedIds = new ArrayList<>();

        for (Long userId : userIds) {
            try {
                User user = userService.findUserById(userId);
                if (user != null) {
                    user.setIsActive(true);
                    userService.saveUser(user);
                    successCount++;
                } else {
                    failedIds.add(userId);
                }
            } catch (Exception e) {
                failedIds.add(userId);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bulk activation completed");
        response.put("successCount", successCount);
        response.put("failedIds", failedIds);
        response.put("totalRequested", userIds.size());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/bulk-deactivate")
    public ResponseEntity<Map<String, Object>> bulkDeactivateUsers(@RequestBody Map<String, List<Long>> request) {
        List<Long> userIds = request.get("userIds");
        if (userIds == null || userIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userIds list cannot be empty"));
        }

        int successCount = 0;
        List<Long> failedIds = new ArrayList<>();

        for (Long userId : userIds) {
            try {
                User user = userService.findUserById(userId);
                if (user != null) {
                    user.setIsActive(false);
                    userService.saveUser(user);
                    successCount++;
                } else {
                    failedIds.add(userId);
                }
            } catch (Exception e) {
                failedIds.add(userId);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bulk deactivation completed");
        response.put("successCount", successCount);
        response.put("failedIds", failedIds);
        response.put("totalRequested", userIds.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType) {
        
        // Mock audit logs for demonstration - in a real implementation, this would come from a database
        List<Map<String, Object>> auditLogs = new ArrayList<>();
        
        // Sample audit log entries
        Map<String, Object> log1 = new HashMap<>();
        log1.put("id", 1L);
        log1.put("timestamp", java.time.LocalDateTime.now().minusHours(2));
        log1.put("action", "USER_CREATED");
        log1.put("entityType", "USER");
        log1.put("entityId", 1L);
        log1.put("userId", 999L);
        log1.put("userEmail", "admin@altius.com");
        log1.put("details", "Created new user account");
        log1.put("ipAddress", "192.168.1.100");
        auditLogs.add(log1);
        
        Map<String, Object> log2 = new HashMap<>();
        log2.put("id", 2L);
        log2.put("timestamp", java.time.LocalDateTime.now().minusHours(1));
        log2.put("action", "INSTITUTION_UPDATED");
        log2.put("entityType", "INSTITUTION");
        log2.put("entityId", 1L);
        log2.put("userId", 999L);
        log2.put("userEmail", "admin@altius.com");
        log2.put("details", "Updated institution details");
        log2.put("ipAddress", "192.168.1.100");
        auditLogs.add(log2);
        
        Map<String, Object> log3 = new HashMap<>();
        log3.put("id", 3L);
        log3.put("timestamp", java.time.LocalDateTime.now().minusMinutes(30));
        log3.put("action", "BULK_USER_ACTIVATION");
        log3.put("entityType", "USER");
        log3.put("entityId", null);
        log3.put("userId", 999L);
        log3.put("userEmail", "admin@altius.com");
        log3.put("details", "Activated 5 user accounts");
        log3.put("ipAddress", "192.168.1.100");
        auditLogs.add(log3);

        // Apply filters
        List<Map<String, Object>> filteredLogs = auditLogs.stream()
            .filter(log -> action == null || action.isEmpty() || action.equals(log.get("action")))
            .filter(log -> entityType == null || entityType.isEmpty() || entityType.equals(log.get("entityType")))
            .toList();

        // Apply pagination
        int totalElements = filteredLogs.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalElements);
        
        List<Map<String, Object>> paginatedLogs = startIndex < totalElements ? 
            filteredLogs.subList(startIndex, endIndex) : new ArrayList<>();

        Map<String, Object> response = new HashMap<>();
        response.put("auditLogs", paginatedLogs);
        response.put("pagination", Map.of(
            "page", page,
            "size", size,
            "totalElements", totalElements,
            "totalPages", totalPages,
            "hasNext", page < totalPages - 1,
            "hasPrevious", page > 0
        ));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/system-config")
    public ResponseEntity<Map<String, Object>> getSystemConfig() {
        // Mock system configuration - in a real implementation, this would come from a database or config service
        Map<String, Object> config = new HashMap<>();
        
        config.put("systemName", "Altius Academy");
        config.put("version", "3.0.0");
        config.put("environment", "production");
        config.put("maxUsersPerInstitution", 1000);
        config.put("maxInstitutions", 500);
        config.put("sessionTimeoutMinutes", 60);
        config.put("emailNotificationsEnabled", true);
        config.put("maintenanceMode", false);
        config.put("backupFrequency", "daily");
        config.put("logRetentionDays", 90);
        config.put("maxFileUploadSizeMB", 50);
        config.put("supportedFileTypes", List.of("pdf", "doc", "docx", "jpg", "png"));
        
        return ResponseEntity.ok(config);
    }

    @PutMapping("/system-config")
    public ResponseEntity<Map<String, Object>> updateSystemConfig(@RequestBody Map<String, Object> updates) {
        // In a real implementation, this would validate and persist the configuration changes
        Map<String, Object> response = new HashMap<>();
        response.put("message", "System configuration updated successfully");
        response.put("updatedFields", updates.keySet());
        response.put("requiresRestart", updates.containsKey("maintenanceMode") || updates.containsKey("maxUsersPerInstitution"));
        
        // Log the configuration change
        System.out.println("System configuration updated by super admin: " + updates);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/system/maintenance-mode")
    public ResponseEntity<Map<String, Object>> toggleMaintenanceMode(@RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "enabled field is required"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", enabled ? "Maintenance mode enabled" : "Maintenance mode disabled");
        response.put("maintenanceMode", enabled);
        response.put("timestamp", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export/users")
    public ResponseEntity<Map<String, Object>> exportUsers(
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        
        List<User> allUsers = userService.findAllUsers();
        
        // Apply filters
        List<User> filteredUsers = allUsers.stream()
            .filter(user -> role == null || role.isEmpty() || user.getRole().getValue().equals(role))
            .filter(user -> status == null || status.isEmpty() || 
                    (status.equals("active") && user.getIsActive() != null && user.getIsActive()) ||
                    (status.equals("inactive") && (user.getIsActive() == null || !user.getIsActive())))
            .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("exportFormat", format != null ? format : "json");
        response.put("totalRecords", filteredUsers.size());
        response.put("filtersApplied", Map.of(
            "role", role,
            "status", status
        ));
        
        // Convert to export format
        List<Map<String, Object>> exportData = filteredUsers.stream()
            .map(user -> {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("email", user.getEmail());
                userData.put("firstName", user.getFirstName());
                userData.put("lastName", user.getLastName());
                userData.put("role", user.getRole().getValue());
                userData.put("status", user.getIsActive() != null && user.getIsActive() ? "active" : "inactive");
                userData.put("phone", user.getPhone());
                userData.put("institutionName", user.getInstitution() != null ? user.getInstitution().getName() : null);
                userData.put("createdAt", user.getCreatedAt());
                userData.put("updatedAt", user.getUpdatedAt());
                return userData;
            })
            .toList();
        
        response.put("data", exportData);
        response.put("exportedAt", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export/institutions")
    public ResponseEntity<Map<String, Object>> exportInstitutions(
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String status) {
        
        List<Institution> allInstitutions = institutionService.findAllInstitutions();
        
        // Apply filters
        List<Institution> filteredInstitutions = allInstitutions.stream()
            .filter(inst -> status == null || status.isEmpty() || 
                    (status.equals("active") && inst.getIsActive() != null && inst.getIsActive()) ||
                    (status.equals("inactive") && (inst.getIsActive() == null || !inst.getIsActive())))
            .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("exportFormat", format != null ? format : "json");
        response.put("totalRecords", filteredInstitutions.size());
        response.put("filtersApplied", Map.of("status", status));
        
        // Convert to export format
        List<Map<String, Object>> exportData = filteredInstitutions.stream()
            .map(inst -> {
                // Get user counts for this institution
                List<User> institutionUsers = userService.findUsersByInstitution(inst.getId());
                long studentCount = institutionUsers.stream().filter(u -> "student".equals(u.getRole().getValue())).count();
                long teacherCount = institutionUsers.stream().filter(u -> "teacher".equals(u.getRole().getValue())).count();
                long coordinatorCount = institutionUsers.stream().filter(u -> "coordinator".equals(u.getRole().getValue())).count();
                
                Map<String, Object> instData = new HashMap<>();
                instData.put("id", inst.getId());
                instData.put("name", inst.getName());
                instData.put("nit", inst.getNit());
                instData.put("address", inst.getAddress());
                instData.put("phone", inst.getPhone());
                instData.put("email", inst.getEmail());
                instData.put("status", inst.getIsActive() != null && inst.getIsActive() ? "active" : "inactive");
                instData.put("studentCount", (int) studentCount);
                instData.put("teacherCount", (int) teacherCount);
                instData.put("coordinatorCount", (int) coordinatorCount);
                instData.put("totalUsers", institutionUsers.size());
                instData.put("createdAt", inst.getCreatedAt());
                instData.put("updatedAt", inst.getUpdatedAt());
                return instData;
            })
            .toList();
        
        response.put("data", exportData);
        response.put("exportedAt", java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
}
