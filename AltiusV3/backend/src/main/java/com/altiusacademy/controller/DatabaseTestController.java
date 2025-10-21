package com.altiusacademy.controller;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/database-test")
@CrossOrigin(origins = "*")
public class DatabaseTestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Contar usuarios por rol
            Map<String, Long> userCounts = new HashMap<>();
            for (UserRole role : UserRole.values()) {
                userCounts.put(role.name(), userRepository.countByRole(role));
            }
            
            long totalUsers = userRepository.count();
            
            response.put("status", "CONNECTED");
            response.put("message", "Base de datos MySQL conectada correctamente");
            response.put("timestamp", LocalDateTime.now());
            response.put("totalUsers", totalUsers);
            response.put("usersByRole", userCounts);
            response.put("database", "MySQL - AltiusV3");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error conectando a la base de datos: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/create-test-user")
    public ResponseEntity<Map<String, Object>> createTestUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verificar si ya existe un usuario de prueba
            Optional<User> existingUser = userRepository.findByEmail("test@altiusacademy.com");
            
            if (existingUser.isPresent()) {
                response.put("status", "EXISTS");
                response.put("message", "Usuario de prueba ya existe");
                response.put("user", createUserResponse(existingUser.get()));
                return ResponseEntity.ok(response);
            }
            
            // Crear nuevo usuario de prueba
            User testUser = new User();
            testUser.setEmail("test@altiusacademy.com");
            testUser.setPassword("$2a$10$dummyHashedPassword"); // En producción usar BCrypt
            testUser.setFirstName("Usuario");
            testUser.setLastName("Prueba");
            testUser.setRole(UserRole.ADMIN);
            testUser.setPhone("123-456-7890");
            testUser.setIsActive(true);
            testUser.setEmailVerified(true);
            
            User savedUser = userRepository.save(testUser);
            
            response.put("status", "CREATED");
            response.put("message", "Usuario de prueba creado exitosamente");
            response.put("user", createUserResponse(savedUser));
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error creando usuario de prueba: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userRepository.findAll();
            
            response.put("status", "SUCCESS");
            response.put("message", "Usuarios obtenidos correctamente");
            response.put("count", users.size());
            response.put("users", users.stream().map(this::createUserResponse).toList());
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error obteniendo usuarios: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/delete-test-user")
    public ResponseEntity<Map<String, Object>> deleteTestUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> testUser = userRepository.findByEmail("test@altiusacademy.com");
            
            if (testUser.isPresent()) {
                userRepository.delete(testUser.get());
                response.put("status", "DELETED");
                response.put("message", "Usuario de prueba eliminado exitosamente");
            } else {
                response.put("status", "NOT_FOUND");
                response.put("message", "Usuario de prueba no encontrado");
            }
            
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error eliminando usuario de prueba: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/create-sample-users")
    public ResponseEntity<Map<String, Object>> createSampleUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Crear usuarios de muestra para cada rol
            User[] sampleUsers = {
                createSampleUser("admin@altius.com", "Admin", "Sistema", UserRole.ADMIN),
                createSampleUser("secretary@altius.com", "María", "Secretaria", UserRole.SECRETARY),
                createSampleUser("coordinator@altius.com", "Carlos", "Coordinador", UserRole.COORDINATOR),
                createSampleUser("teacher@altius.com", "Ana", "Profesora", UserRole.TEACHER),
                createSampleUser("student@altius.com", "Juan", "Estudiante", UserRole.STUDENT),
                createSampleUser("parent@altius.com", "Pedro", "Padre", UserRole.PARENT)
            };
            
            int created = 0;
            int existing = 0;
            
            for (User user : sampleUsers) {
                if (!userRepository.existsByEmail(user.getEmail())) {
                    userRepository.save(user);
                    created++;
                } else {
                    existing++;
                }
            }
            
            response.put("status", "SUCCESS");
            response.put("message", "Usuarios de muestra procesados");
            response.put("created", created);
            response.put("existing", existing);
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error creando usuarios de muestra: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(500).body(response);
        }
    }

    private User createSampleUser(String email, String firstName, String lastName, UserRole role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("$2a$10$dummyHashedPassword"); // En producción usar BCrypt
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setIsActive(true);
        user.setEmailVerified(true);
        user.setPhone("555-0" + (100 + role.ordinal()));
        return user;
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("fullName", user.getFullName());
        userMap.put("role", user.getRole());
        userMap.put("phone", user.getPhone());
        userMap.put("isActive", user.getIsActive());
        userMap.put("emailVerified", user.getEmailVerified());
        userMap.put("createdAt", user.getCreatedAt());
        userMap.put("updatedAt", user.getUpdatedAt());
        return userMap;
    }
}