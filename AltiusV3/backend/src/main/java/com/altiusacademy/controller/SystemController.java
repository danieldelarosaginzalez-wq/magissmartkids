package com.altiusacademy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador del sistema
 * 
 * Maneja endpoints de información del sistema, health checks y página principal.
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@RestController
public class SystemController {

    /**
     * Página principal
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🎓 Backend API");
        response.put("status", "RUNNING");
        response.put("timestamp", LocalDateTime.now());
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("Health Check", "/api/health");
        endpoints.put("Users", "/api/users");
        endpoints.put("Login", "/api/auth/login (POST)");
        endpoints.put("Register", "/api/auth/register (POST)");
        endpoints.put("API Documentation", "/swagger-ui.html");
        
        response.put("available_endpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check principal
     */
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Health check MySQL
     */
    @GetMapping("/api/health/mysql")
    public ResponseEntity<Map<String, Object>> healthMySQL() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "UP");
            response.put("database", "MySQL");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }

    /**
     * Health check MongoDB
     */
    @GetMapping("/api/health/mongodb")
    public ResponseEntity<Map<String, Object>> healthMongoDB() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "UP");
            response.put("database", "MongoDB");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }

    /**
     * Página de error
     */
    @GetMapping("/error")
    public ResponseEntity<Map<String, Object>> error() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🎓 Backend");
        response.put("error", "Endpoint not found");
        response.put("suggestion", "Try /api/health or /swagger-ui.html");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
}