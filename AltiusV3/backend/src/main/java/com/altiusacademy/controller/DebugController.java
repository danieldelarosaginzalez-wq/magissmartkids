package com.altiusacademy.controller;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Autowired private UserRepository userRepository;

    /**
     * Endpoint para verificar datos del usuario autenticado
     */
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        try {
            System.out.println("🔍 Debug: Obteniendo información del usuario: " + authentication.getName());
            
            Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("role", user.getRole());
            userInfo.put("isActive", user.getIsActive());
            
            // Información de institución
            if (user.getInstitution() != null) {
                Map<String, Object> institutionInfo = new HashMap<>();
                institutionInfo.put("id", user.getInstitution().getId());
                institutionInfo.put("name", user.getInstitution().getName());
                institutionInfo.put("address", user.getInstitution().getAddress());
                institutionInfo.put("phone", user.getInstitution().getPhone());
                institutionInfo.put("email", user.getInstitution().getEmail());
                userInfo.put("institution", institutionInfo);
                
                System.out.println("🏛️ Institución encontrada: " + user.getInstitution().getName());
            } else {
                userInfo.put("institution", null);
                System.out.println("⚠️ Usuario sin institución");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", userInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en debug: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Verificar usuario por email
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            System.out.println("🔍 Debug: Buscando usuario por email: " + email);
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado: " + email);
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("role", user.getRole());
            userInfo.put("institutionId", user.getInstitution() != null ? user.getInstitution().getId() : null);
            userInfo.put("institutionName", user.getInstitution() != null ? user.getInstitution().getName() : null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", userInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en debug: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}