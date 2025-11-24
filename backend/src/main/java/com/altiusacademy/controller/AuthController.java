package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.AuthResponse;
import com.altiusacademy.dto.LoginRequest;
import com.altiusacademy.dto.RegisterRequest;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

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

            // Respuesta para el frontend (estructura plana)
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("token", authResponse.getToken());
            response.put("userId", authResponse.getUserId());
            response.put("firstName", authResponse.getFirstName());
            response.put("lastName", authResponse.getLastName());
            response.put("email", authResponse.getEmail());
            response.put("role", authResponse.getRole().toString());
            response.put("institution", authResponse.getInstitution());
            response.put("schoolGrade", authResponse.getSchoolGrade());

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

            // Respuesta para el frontend (estructura plana)
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario registrado exitosamente");
            response.put("token", authResponse.getToken());
            response.put("userId", authResponse.getUserId());
            response.put("firstName", authResponse.getFirstName());
            response.put("lastName", authResponse.getLastName());
            response.put("email", authResponse.getEmail());
            response.put("role", authResponse.getRole().toString());
            response.put("institution", authResponse.getInstitution());
            response.put("schoolGrade", authResponse.getSchoolGrade());

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
     * Verificar si existe un coordinador en el sistema
     * Endpoint público para el proceso de registro
     * 
     * @return Información sobre la existencia de coordinadores
     */
    @GetMapping("/check-coordinator")
    public ResponseEntity<?> checkCoordinatorExists() {
        try {
            logger.info("Verificando existencia de coordinadores en el sistema");

            boolean coordinatorExists = userRepository.existsByRole(UserRole.COORDINATOR);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("coordinatorExists", coordinatorExists);
            response.put("message",
                    coordinatorExists ? "Ya existe un coordinador en el sistema" : "No hay coordinadores registrados");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error verificando coordinador: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al verificar coordinador");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Crear un usuario SUPER_ADMIN
     * Endpoint público para inicialización del sistema
     * 
     * NOTA: En producción, este endpoint debería estar protegido o deshabilitado
     * 
     * @param request Datos del super admin a crear
     * @return Token JWT y datos del usuario creado
     */
    @PostMapping("/create-super-admin")
    public ResponseEntity<?> createSuperAdmin(@Valid @RequestBody RegisterRequest request) {
        try {
            logger.info("Creando usuario SUPER_ADMIN: {}", request.getEmail());

            // Verificar si ya existe un super admin con este email
            if (userRepository.existsByEmail(request.getEmail())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Ya existe un usuario con este email");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Forzar el rol a SUPER_ADMIN
            request.setRole("SUPER_ADMIN");

            AuthResponse authResponse = authService.register(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Super Admin creado exitosamente");
            response.put("token", authResponse.getToken());
            response.put("userId", authResponse.getUserId());
            response.put("firstName", authResponse.getFirstName());
            response.put("lastName", authResponse.getLastName());
            response.put("email", authResponse.getEmail());
            response.put("role", authResponse.getRole().toString());
            response.put("institution", authResponse.getInstitution());
            response.put("schoolGrade", authResponse.getSchoolGrade());

            logger.info("Super Admin creado exitosamente: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creando Super Admin: {}", e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error creando Super Admin: " + e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Verificar autenticación actual
     * Endpoint público para debugging
     * 
     * @return Información sobre el usuario autenticado actual
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();

            Map<String, Object> response = new HashMap<>();

            if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                response.put("authenticated", false);
                response.put("message", "No hay usuario autenticado");
                return ResponseEntity.ok(response);
            }

            org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) authentication
                    .getPrincipal();

            response.put("authenticated", true);
            response.put("username", userDetails.getUsername());
            response.put("authorities", userDetails.getAuthorities().stream()
                    .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                    .toList());

            // Buscar el usuario completo en la base de datos
            userRepository.findByEmail(userDetails.getUsername()).ifPresent(user -> {
                response.put("userId", user.getId());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("role", user.getRole().toString());
                response.put("isActive", user.getIsActive());
            });

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error obteniendo usuario actual: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error obteniendo usuario actual");

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}