package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.InstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/multi-institution")
@CrossOrigin(origins = "*")
public class MultiInstitutionController {

    @Autowired private InstitutionService institutionService;
    @Autowired private UserRepository userRepository;

    /**
     * Obtener estadísticas completas de una institución
     */
    @GetMapping("/stats/{institutionId}")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getInstitutionStats(@PathVariable Long institutionId) {
        try {
            System.out.println("📊 Solicitando estadísticas para institución: " + institutionId);
            
            Map<String, Object> stats = institutionService.getInstitutionStats(institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
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
     * Obtener todos los usuarios de una institución agrupados por rol
     */
    @GetMapping("/users/{institutionId}")
    @PreAuthorize("hasRole('COORDINATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getInstitutionUsers(@PathVariable Long institutionId) {
        try {
            System.out.println("👥 Solicitando usuarios para institución: " + institutionId);
            
            Map<String, Object> users = institutionService.getInstitutionUsers(institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuarios: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener instituciones del usuario autenticado
     */
    @GetMapping("/my-institutions")
    public ResponseEntity<?> getMyInstitutions(Authentication authentication) {
        try {
            System.out.println("🏛️ Obteniendo instituciones del usuario: " + authentication.getName());
            
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            List<UserInstitutionRole> institutions = institutionService.getUserInstitutions(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutions", institutions);
            response.put("primaryInstitution", user.getInstitution());
            response.put("totalInstitutions", institutions.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo instituciones del usuario: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener instituciones: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Asignar usuario a institución con rol específico
     */
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignUserToInstitution(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🔗 Asignando usuario a institución");
            
            Long userId = Long.valueOf(request.get("userId").toString());
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            String role = (String) request.get("role");
            
            UserInstitutionRole assignment = institutionService.assignUserToInstitution(userId, institutionId, role);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("assignment", assignment);
            response.put("message", "Usuario asignado exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error asignando usuario: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al asignar usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Cambiar institución principal del usuario
     */
    @PutMapping("/change-primary")
    public ResponseEntity<?> changePrimaryInstitution(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("🔄 Cambiando institución principal");
            
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            
            // Verificar que el usuario pertenezca a esa institución
            if (!institutionService.userBelongsToInstitution(user.getId(), institutionId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No tienes acceso a esa institución");
                return ResponseEntity.status(403).body(response);
            }
            
            User updatedUser = institutionService.changeUserPrimaryInstitution(user.getId(), institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", updatedUser);
            response.put("message", "Institución principal cambiada exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error cambiando institución principal: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cambiar institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verificar acceso del usuario a una institución
     */
    @GetMapping("/check-access/{institutionId}")
    public ResponseEntity<?> checkInstitutionAccess(@PathVariable Long institutionId, Authentication authentication) {
        try {
            System.out.println("🔍 Verificando acceso a institución: " + institutionId);
            
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("hasAccess", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            boolean hasAccess = institutionService.userBelongsToInstitution(user.getId(), institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hasAccess", hasAccess);
            response.put("userId", user.getId());
            response.put("institutionId", institutionId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error verificando acceso: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("hasAccess", false);
            response.put("message", "Error al verificar acceso: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}