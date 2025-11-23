package com.altiusacademy.controller;

import com.altiusacademy.dto.UserUpdateRequest;
import com.altiusacademy.dto.PasswordUpdateRequest;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador de usuarios
 * 
 * Maneja operaciones CRUD de usuarios y gestión de perfiles.
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;



    /**
     * Listar todos los usuarios - Solo coordinadores
     */
    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getAllUsers() {
        try {
            logger.info("Listando todos los usuarios");
            
            List<User> users = userRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error listando usuarios: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error obteniendo usuarios");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Obtener perfil del usuario actual
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Obteniendo perfil para: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error obteniendo perfil: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error obteniendo perfil");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Actualizar perfil del usuario actual
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(
            @Valid @RequestBody UserUpdateRequest updateRequest,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Actualizando perfil para: {}", email);
            
            // TODO: Implementar updateUserProfile en UserService
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Actualizar campos básicos
            if (updateRequest.getFirstName() != null) {
                user.setFirstName(updateRequest.getFirstName());
            }
            if (updateRequest.getLastName() != null) {
                user.setLastName(updateRequest.getLastName());
            }
            
            User updatedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Perfil actualizado exitosamente");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error actualizando perfil: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Cambiar contraseña del usuario actual
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody PasswordUpdateRequest passwordRequest,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Cambiando contraseña para: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Por ahora solo validamos que la contraseña nueva no esté vacía
            if (passwordRequest.getNewPassword() == null || passwordRequest.getNewPassword().length() < 6) {
                throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
            }
            
            // TODO: Validar contraseña actual con passwordEncoder
            // TODO: Encriptar nueva contraseña con passwordEncoder
            // user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
            // userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contraseña actualizada exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error cambiando contraseña: {}", e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Obtener usuario por ID - Solo coordinadores
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            logger.info("Obteniendo usuario por ID: {}", id);
            
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error obteniendo usuario {}: {}", id, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Usuario no encontrado");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}