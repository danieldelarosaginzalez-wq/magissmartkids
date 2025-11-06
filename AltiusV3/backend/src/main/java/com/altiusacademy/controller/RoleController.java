package com.altiusacademy.controller;

import com.altiusacademy.model.enums.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")

public class RoleController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRoles() {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> roles = new HashMap<>();
        
        // Mapeo de roles del enum a nombres en español para el frontend
        roles.put("ESTUDIANTE", "Estudiante");
        roles.put("PROFESOR", "Profesor");
        roles.put("COORDINADOR", "Coordinador");
        roles.put("SUPER_ADMIN", "Super Administrador");
        
        response.put("success", true);
        response.put("roles", roles);
        
        return ResponseEntity.ok(response);
    }
}