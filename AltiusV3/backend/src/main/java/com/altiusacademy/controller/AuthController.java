package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.AuthResponse;
import com.altiusacademy.dto.LoginRequest;
import com.altiusacademy.dto.RegisterRequest;
import com.altiusacademy.service.AuthService;

import jakarta.validation.Valid;

/**
 * Controlador de autenticación
 * 
 * Maneja login, registro y operaciones de autenticación.
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    /**
     * Login de usuario
     * 
     * @param loginRequest Credenciales del usuario
     * @return Token JWT y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Procesando login para: {}", loginRequest.getEmail());
            
            AuthResponse authResponse = authService.login(loginRequest);
            
            // Respuesta para el frontend
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("token", authResponse.getToken());
            response.put("user", createUserResponse(authResponse));
            
            logger.info("Login exitoso para: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en login para {}: {}", loginRequest.getEmail(), e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Credenciales inválidas");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Registro de nuevo usuario
     * 
     * @param registerRequest Datos del nuevo usuario
     * @return Confirmación de registro
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("Procesando registro para: {}", registerRequest.getEmail());
            
            AuthResponse authResponse = authService.register(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario registrado exitosamente");
            response.put("token", authResponse.getToken());
            response.put("user", createUserResponse(authResponse));
            
            logger.info("Registro exitoso para: {}", registerRequest.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en registro para {}: {}", registerRequest.getEmail(), e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Crea la respuesta del usuario para el frontend
     */
    private Map<String, Object> createUserResponse(AuthResponse authResponse) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", String.valueOf(authResponse.getUserId()));
        user.put("firstName", authResponse.getFirstName());
        user.put("lastName", authResponse.getLastName());
        user.put("email", authResponse.getEmail());
        user.put("role", authResponse.getRole().toString().toLowerCase());
        user.put("institution", authResponse.getInstitution());
        user.put("schoolGrade", authResponse.getSchoolGrade());
        user.put("isActive", true);
        
        return user;
    }
}