package com.altiusacademy.controller;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@RestController
@RequestMapping("/api/generator")
public class UserGeneratorController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstitutionRepository institutionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final List<String> NOMBRES = Arrays.asList(
        "Aarón", "Abel", "Adela", "Adrián", "Alba", "Alejandro", "Alicia", "Alma", "Alonso", "Amaya",
        "Ana", "Andrés", "Ángel", "Antonia", "Ariadna", "Armando", "Arturo", "Asier", "Augusto", "Begoña",
        "Benjamín", "Blanca", "Bruno", "Camila", "Carla", "Carlos", "Carmen", "Catalina", "César", "Clara",
        "Cristian", "Cristina", "Daniel", "Daniela", "David", "Diego", "Eduardo", "Elena", "Elisa", "Eloy",
        "Emilia", "Emilio", "Enrique", "Ernesto", "Esmeralda", "Esteban", "Eva", "Fabián", "Felipe", "Fernanda",
        "Fernando", "Francisco", "Gabriel", "Gael", "Gerardo", "Gonzalo", "Guillermo", "Héctor", "Helena", "Hugo",
        "Ignacio", "Iker", "Irene", "Isabel", "Iván", "Javier", "Jimena", "Joaquín", "Jorge", "José",
        "Juan", "Julia", "Julio", "Laura", "Leonor", "Leticia", "Lucas", "Lucía", "Luis", "Manuel",
        "Marco", "Marcos", "María", "Marina", "Mario", "Martín", "Mateo", "Miguel", "Mónica", "Nadia",
        "Natalia", "Nicolás", "Noelia", "Óscar", "Pablo", "Patricia", "Paula", "Pedro", "Rafael", "Raquel"
    );

    private static final List<String> APELLIDOS = Arrays.asList(
        "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Martín", "Gómez",
        "Ruiz", "Hernández", "Jiménez", "Díaz", "Álvarez", "Moreno", "Muñoz", "Alonso", "Gutiérrez", "Romero",
        "Navarro", "Torres", "Domínguez", "Gil", "Vázquez", "Serrano", "Ramos", "Blanco", "Suárez", "Molina",
        "Morales", "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Núñez", "Iglesias",
        "Medina", "Garrido", "Cortés", "Castillo", "Santos", "Lozano", "Guerrero", "Prieto", "Calvo", "Crespo",
        "León", "Méndez", "Flores", "Peña", "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco", "Díez",
        "Caballero", "Reyes", "Nieto", "Aguilar", "Pascual", "Santana", "Herrero", "Montero", "López", "Hidalgo",
        "Giménez", "Vidal", "Mora", "Ibáñez", "Santiago", "Duran", "Benítez", "Ferrer", "Arias", "Carmona",
        "Roman", "Pastor", "Soto", "Sáez", "Márquez", "Velasco", "Sierra", "Soler", "Rojas", "Esteban",
        "Parra", "Bravo", "Gallardo", "Pardo", "Rivas", "Otero", "Luque", "Galán", "Montes", "Rivero"
    );

    private static final List<Long> INSTITUTION_IDS = Arrays.asList(1L, 6L, 7L, 8L, 9L, 10L);

    @PostMapping("/generate-users")
    public ResponseEntity<?> generateUsers(
            @RequestParam(defaultValue = "50") int studentCount,
            @RequestParam(defaultValue = "20") int teacherCount) {
        
        try {
            System.out.println("🎲 Generando " + studentCount + " estudiantes y " + teacherCount + " profesores...");
            
            Map<String, Object> response = new HashMap<>();
            List<User> generatedStudents = new ArrayList<>();
            List<User> generatedTeachers = new ArrayList<>();
            
            // Verificar que existan las instituciones
            List<Institution> institutions = institutionRepository.findAllById(INSTITUTION_IDS);
            if (institutions.isEmpty()) {
                throw new RuntimeException("No se encontraron instituciones con los IDs especificados");
            }
            
            System.out.println("✅ Instituciones encontradas: " + institutions.size());
            
            // Generar estudiantes
            for (int i = 0; i < studentCount; i++) {
                User student = generateRandomUser(UserRole.STUDENT, institutions);
                if (student != null) {
                    generatedStudents.add(student);
                }
            }
            
            // Generar profesores
            for (int i = 0; i < teacherCount; i++) {
                User teacher = generateRandomUser(UserRole.TEACHER, institutions);
                if (teacher != null) {
                    generatedTeachers.add(teacher);
                }
            }
            
            System.out.println("✅ Generados " + generatedStudents.size() + " estudiantes y " + 
                             generatedTeachers.size() + " profesores");
            
            response.put("success", true);
            response.put("studentsGenerated", generatedStudents.size());
            response.put("teachersGenerated", generatedTeachers.size());
            response.put("totalGenerated", generatedStudents.size() + generatedTeachers.size());
            response.put("message", "Usuarios generados exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error generando usuarios: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al generar usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    private User generateRandomUser(UserRole role, List<Institution> institutions) {
        try {
            Random random = new Random();
            
            // Seleccionar nombre y apellido aleatorios
            String nombre = NOMBRES.get(random.nextInt(NOMBRES.size()));
            String apellido = APELLIDOS.get(random.nextInt(APELLIDOS.size()));
            
            // Crear email en formato nombre.apellido@test.com
            String email = normalizeForEmail(nombre) + "." + normalizeForEmail(apellido) + "@test.com";
            
            // Verificar si el email ya existe, si es así, agregar un número
            int counter = 1;
            while (userRepository.existsByEmail(email)) {
                email = normalizeForEmail(nombre) + "." + normalizeForEmail(apellido) + counter + "@test.com";
                counter++;
            }
            
            // Seleccionar institución aleatoria
            Institution institution = institutions.get(random.nextInt(institutions.size()));
            
            // Crear usuario
            User user = new User();
            user.setEmail(email);
            user.setFirstName(nombre);
            user.setLastName(apellido);
            user.setPassword(passwordEncoder.encode("123456")); // Encriptar con BCrypt
            user.setRole(role);
            user.setInstitution(institution);
            user.setIsActive(true);
            user.setEmailVerified(false);
            
            // Si es estudiante, asignar un grado escolar aleatorio de la institución
            // Los grados son: Preescolar, Primero, Segundo, Tercero, Cuarto, Quinto
            if (role == UserRole.STUDENT) {
                // Por ahora no asignamos grado, se puede hacer después manualmente
                // o crear un método para asignar grados automáticamente
                System.out.println("ℹ️ Estudiante creado sin grado asignado (se puede asignar después)");
            }
            
            // Guardar en base de datos
            User saved = userRepository.save(user);
            
            System.out.println("✅ Usuario creado: " + email + " - " + role + " - Institución: " + institution.getName());
            
            return saved;
            
        } catch (Exception e) {
            System.err.println("❌ Error creando usuario: " + e.getMessage());
            return null;
        }
    }

    /**
     * Normaliza un nombre para usarlo en email (quita acentos y convierte a minúsculas)
     */
    private String normalizeForEmail(String text) {
        String normalized = text.toLowerCase()
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
            .replace("ñ", "n")
            .replace("ü", "u")
            .replace(" ", "");
        return normalized;
    }

    /**
     * Endpoint para limpiar usuarios generados (útil para testing)
     */
    @DeleteMapping("/clean-generated-users")
    public ResponseEntity<?> cleanGeneratedUsers() {
        try {
            System.out.println("🧹 Limpiando usuarios generados...");
            
            // Eliminar usuarios con email que termine en @test.com
            List<User> testUsers = userRepository.findAll().stream()
                .filter(u -> u.getEmail().endsWith("@test.com"))
                .collect(Collectors.toList());
            
            userRepository.deleteAll(testUsers);
            
            System.out.println("✅ Eliminados " + testUsers.size() + " usuarios de prueba");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("deletedCount", testUsers.size());
            response.put("message", "Usuarios de prueba eliminados exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error limpiando usuarios: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al limpiar usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
