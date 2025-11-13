package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.InstitutionService;

@RestController
@RequestMapping("/api/multi-institution")
public class MultiInstitutionController {

    @Autowired private InstitutionService institutionService;
    @Autowired private UserRepository userRepository;

    /**
     * Obtener estadísticas completas de una institución
     */
    @GetMapping("/stats/{institutionId}")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'SUPER_ADMIN')")
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
    @PreAuthorize("hasAnyRole('COORDINATOR', 'SUPER_ADMIN')")
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
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> assignUserToInstitution(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🔗 Asignando usuario a institución");
            
            Long userId = Long.valueOf(request.get("userId").toString());
            Long institutionId = Long.valueOf(request.get("institutionId").toString());
            String role = request.get("role").toString();
            
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
}