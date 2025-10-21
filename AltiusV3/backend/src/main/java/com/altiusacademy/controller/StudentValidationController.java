package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;

@RestController
@RequestMapping("/api/student-validation")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class StudentValidationController {

    @Autowired
    private UserRepository userRepository;

    // Validar si un estudiante existe por email
    @GetMapping("/validate-student")
    public ResponseEntity<Map<String, Object>> validateStudent(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🔍 Validando estudiante con email: " + email);
            
            // Buscar usuario por email
            Optional<User> userOptional = userRepository.findByEmail(email);
            System.out.println("📊 Usuario encontrado: " + userOptional.isPresent());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Verificar que sea un estudiante
                System.out.println("🔍 Usuario encontrado: " + user.getEmail() + " con rol: " + user.getRole());
                if ("STUDENT".equalsIgnoreCase(user.getRole().toString())) {
                    Institution institution = user.getInstitution();
                    
                    response.put("success", true);
                    response.put("exists", true);
                    response.put("student", Map.of(
                        "id", user.getId(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "email", user.getEmail()
                    ));
                    
                    if (institution != null) {
                        response.put("institution", Map.of(
                            "id", institution.getId(),
                            "name", institution.getName(),
                            "nit", institution.getNit(),
                            "address", institution.getAddress() != null ? institution.getAddress() : ""
                        ));
                    } else {
                        response.put("institution", null);
                        response.put("message", "El estudiante no tiene institución asignada");
                    }
                } else {
                    // El usuario existe pero no es estudiante
                    response.put("success", true);
                    response.put("exists", false);
                    response.put("message", "El correo pertenece a un usuario que no es estudiante");
                }
            } else {
                // El usuario no existe
                response.put("success", true);
                response.put("exists", false);
                response.put("message", "No se encontró un estudiante con ese correo electrónico");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("exists", false);
            response.put("message", "Error al validar el estudiante: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Validar múltiples estudiantes
    @PostMapping("/validate-multiple")
    public ResponseEntity<Map<String, Object>> validateMultipleStudents(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> emails = (java.util.List<String>) request.get("emails");
            
            if (emails == null || emails.isEmpty()) {
                response.put("success", false);
                response.put("message", "No se proporcionaron correos para validar");
                return ResponseEntity.badRequest().body(response);
            }

            java.util.List<Map<String, Object>> validationResults = new java.util.ArrayList<>();
            
            for (String email : emails) {
                Map<String, Object> studentResult = new HashMap<>();
                studentResult.put("email", email);
                
                Optional<User> userOptional = userRepository.findByEmail(email);
                
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    
                    if ("STUDENT".equalsIgnoreCase(user.getRole().toString())) {
                        Institution institution = user.getInstitution();
                        
                        studentResult.put("exists", true);
                        studentResult.put("student", Map.of(
                            "id", user.getId(),
                            "firstName", user.getFirstName(),
                            "lastName", user.getLastName(),
                            "email", user.getEmail()
                        ));
                        
                        if (institution != null) {
                            studentResult.put("institution", Map.of(
                                "id", institution.getId(),
                                "name", institution.getName(),
                                "nit", institution.getNit(),
                                "address", institution.getAddress() != null ? institution.getAddress() : ""
                            ));
                        } else {
                            studentResult.put("institution", null);
                        }
                    } else {
                        studentResult.put("exists", false);
                        studentResult.put("message", "No es estudiante");
                    }
                } else {
                    studentResult.put("exists", false);
                    studentResult.put("message", "Usuario no encontrado");
                }
                
                validationResults.add(studentResult);
            }
            
            response.put("success", true);
            response.put("results", validationResults);
            response.put("total", validationResults.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al validar los estudiantes: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Obtener información básica de un estudiante
    @GetMapping("/student-info")
    public ResponseEntity<Map<String, Object>> getStudentInfo(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                if ("STUDENT".equalsIgnoreCase(user.getRole().toString())) {
                    response.put("success", true);
                    response.put("student", Map.of(
                        "id", user.getId(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "email", user.getEmail(),
                        "fullName", user.getFirstName() + " " + user.getLastName()
                    ));
                } else {
                    response.put("success", false);
                    response.put("message", "El usuario no es un estudiante");
                }
            } else {
                response.put("success", false);
                response.put("message", "Estudiante no encontrado");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener información del estudiante: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}