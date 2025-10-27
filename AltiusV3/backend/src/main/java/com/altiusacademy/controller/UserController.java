package com.altiusacademy.controller;

import com.altiusacademy.dto.UserUpdateRequest;
import com.altiusacademy.dto.PasswordUpdateRequest;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.dto.RegisterRequest;
import com.altiusacademy.service.AuthService;
import com.altiusacademy.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private StudentService studentService;

    /**
     * Listar todos los usuarios - Solo coordinadores
     */
    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getAllUsers() {
        try {
            System.out.println("📋 Listando todos los usuarios");
            
            List<User> users = userRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuarios obtenidos correctamente");
            response.put("users", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error listando usuarios: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener usuarios por rol - Solo coordinadores
     */
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            System.out.println("👥 Obteniendo usuarios por rol: " + role);
            
            // Convertir rol del frontend al enum
            UserRole userRole = convertRoleFromFrontend(role);
            List<User> users = userRepository.findByRole(userRole);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuarios obtenidos correctamente");
            response.put("users", users);
            response.put("role", role);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuarios por rol: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Crear nuevo usuario - Solo coordinadores
     */
    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("➕ Creando nuevo usuario: " + registerRequest.getEmail());
            
            // Usar el servicio de autenticación para crear el usuario
            var authResponse = authService.register(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario creado correctamente");
            response.put("user", Map.of(
                "id", authResponse.getUserId(),
                "email", authResponse.getEmail(),
                "firstName", authResponse.getFirstName(),
                "lastName", authResponse.getLastName(),
                "role", authResponse.getRole()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error creando usuario: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR') or @userRepository.findById(#id).orElse(null)?.email == authentication.name")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            System.out.println("🔍 Obteniendo usuario por ID: " + id);
            
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuario: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Actualizar usuario - Solo coordinadores o el mismo usuario
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR') or @userRepository.findById(#id).orElse(null)?.email == authentication.name")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            System.out.println("✏️ Actualizando usuario ID: " + id);
            
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            
            // Actualizar campos permitidos
            if (updates.containsKey("firstName")) {
                user.setFirstName((String) updates.get("firstName"));
            }
            if (updates.containsKey("lastName")) {
                user.setLastName((String) updates.get("lastName"));
            }
            if (updates.containsKey("phone")) {
                user.setPhone((String) updates.get("phone"));
            }
            if (updates.containsKey("isActive")) {
                user.setIsActive((Boolean) updates.get("isActive"));
            }
            
            // Solo coordinadores pueden cambiar roles
            if (updates.containsKey("role")) {
                System.out.println("🔄 Cambiando rol de usuario a: " + updates.get("role"));
                UserRole newRole = convertRoleFromFrontend((String) updates.get("role"));
                user.setRole(newRole);
            }
            
            User updatedUser = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario actualizado correctamente");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error actualizando usuario: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al actualizar usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Eliminar usuario - Solo coordinadores
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            System.out.println("🗑️ Eliminando usuario ID: " + id);
            
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.notFound().build();
            }
            
            userRepository.deleteById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario eliminado correctamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error eliminando usuario: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al eliminar usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ========== ENDPOINTS ESPECÍFICOS PARA GESTIÓN DE ESTUDIANTES ==========
    
    /**
     * Listar estudiantes de la institución del profesor - Solo profesores
     */
    @GetMapping("/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getStudentsByInstitution(Authentication authentication) {
        try {
            System.out.println("📚 Profesor obteniendo estudiantes de su institución");
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<User> students = studentService.getStudentsByInstitution(teacher.getInstitution().getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudiantes obtenidos correctamente");
            response.put("students", students);
            response.put("total", students.size());
            response.put("institution", teacher.getInstitution().getName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo estudiantes: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estudiantes: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Crear nuevo estudiante - Solo profesores
     */
    @PostMapping("/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, Object> studentData, Authentication authentication) {
        try {
            System.out.println("➕ Profesor creando nuevo estudiante");
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Crear objeto User para el estudiante
            User student = new User();
            student.setFirstName((String) studentData.get("firstName"));
            student.setLastName((String) studentData.get("lastName"));
            student.setEmail((String) studentData.get("email"));
            student.setPhone((String) studentData.get("phone"));
            student.setPassword((String) studentData.get("password"));
            
            User createdStudent = studentService.createStudent(student, teacher.getInstitution().getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudiante creado correctamente");
            response.put("student", Map.of(
                "id", createdStudent.getId(),
                "firstName", createdStudent.getFirstName(),
                "lastName", createdStudent.getLastName(),
                "email", createdStudent.getEmail(),
                "phone", createdStudent.getPhone() != null ? createdStudent.getPhone() : "",
                "role", "STUDENT",
                "institution", createdStudent.getInstitution().getName()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error creando estudiante: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Actualizar estudiante - Solo profesores
     */
    @PutMapping("/students/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Map<String, Object> studentData, Authentication authentication) {
        try {
            System.out.println("✏️ Profesor actualizando estudiante ID: " + id);
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Crear objeto User con los datos actualizados
            User updatedData = new User();
            updatedData.setFirstName((String) studentData.get("firstName"));
            updatedData.setLastName((String) studentData.get("lastName"));
            updatedData.setEmail((String) studentData.get("email"));
            updatedData.setPhone((String) studentData.get("phone"));
            if (studentData.containsKey("password") && !((String) studentData.get("password")).isEmpty()) {
                updatedData.setPassword((String) studentData.get("password"));
            }
            
            User updatedStudent = studentService.updateStudent(id, updatedData, teacher.getInstitution().getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudiante actualizado correctamente");
            response.put("student", Map.of(
                "id", updatedStudent.getId(),
                "firstName", updatedStudent.getFirstName(),
                "lastName", updatedStudent.getLastName(),
                "email", updatedStudent.getEmail(),
                "phone", updatedStudent.getPhone() != null ? updatedStudent.getPhone() : "",
                "role", "STUDENT",
                "institution", updatedStudent.getInstitution().getName()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error actualizando estudiante: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Eliminar estudiante - Solo profesores
     */
    @DeleteMapping("/students/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id, Authentication authentication) {
        try {
            System.out.println("🗑️ Profesor eliminando estudiante ID: " + id);
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            studentService.deleteStudent(id, teacher.getInstitution().getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudiante eliminado correctamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error eliminando estudiante: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ========== ENDPOINTS ESPECÍFICOS PARA COORDINADOR ==========
    
    /**
     * Listar todos los profesores - Solo coordinadores
     */
    @GetMapping("/teachers")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getAllTeachers() {
        try {
            System.out.println("👩‍🏫 Obteniendo todos los profesores");
            
            List<User> teachers = userRepository.findByRole(UserRole.TEACHER);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profesores obtenidos correctamente");
            response.put("teachers", teachers);
            response.put("total", teachers.size());
            
            System.out.println("✅ Encontrados " + teachers.size() + " profesores");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo profesores: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener profesores: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Listar todos los estudiantes - Solo coordinadores
     */
    @GetMapping("/students/all")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getAllStudents() {
        try {
            System.out.println("👨‍🎓 Obteniendo todos los estudiantes");
            
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudiantes obtenidos correctamente");
            response.put("students", students);
            response.put("total", students.size());
            
            System.out.println("✅ Encontrados " + students.size() + " estudiantes");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo estudiantes: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estudiantes: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Convertir roles del frontend al enum UserRole
     */
    private UserRole convertRoleFromFrontend(String frontendRole) {
        String role = frontendRole.toUpperCase();
        switch (role) {
            case "STUDENT":
                return UserRole.STUDENT;
            case "TEACHER":
                return UserRole.TEACHER;
            case "COORDINATOR":
                return UserRole.COORDINATOR;
            case "PARENT":
                return UserRole.PARENT;
            case "SECRETARY":
                return UserRole.SECRETARY;
            case "ADMIN":
                return UserRole.ADMIN;
            default:
                throw new RuntimeException("Rol no válido: " + frontendRole);
        }
    }
}