package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.repository.mysql.InstitutionRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * Controlador para debugging de autenticación
 */
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/auth-info")
    public ResponseEntity<?> getAuthInfo(Authentication authentication, 
                                         jakarta.servlet.http.HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        // Información de headers
        Map<String, String> headers = new HashMap<>();
        java.util.Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }
        response.put("headers", headers);
        
        // Información de autenticación
        if (authentication == null) {
            response.put("authenticated", false);
            response.put("message", "No hay autenticación");
            System.out.println("❌ DEBUG - No hay autenticación");
            System.out.println("📋 DEBUG - Headers recibidos: " + headers);
            return ResponseEntity.ok(response);
        }
        
        response.put("authenticated", true);
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList());
        response.put("principal", authentication.getPrincipal().toString());
        
        System.out.println("✅ DEBUG - Usuario: " + authentication.getName());
        System.out.println("✅ DEBUG - Roles: " + authentication.getAuthorities());
        System.out.println("📋 DEBUG - Headers recibidos: " + headers);
        
        return ResponseEntity.ok(response);
    }
}
