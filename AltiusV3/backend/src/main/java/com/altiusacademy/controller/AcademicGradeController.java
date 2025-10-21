package com.altiusacademy.controller;

import com.altiusacademy.model.entity.AcademicGrade;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.AcademicGradeRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-grades")
@CrossOrigin(origins = "*")
public class AcademicGradeController {

    @Autowired
    private AcademicGradeRepository academicGradeRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Obtener todos los grados académicos activos
     * Si no existen grados, los inicializa automáticamente
     */
    @GetMapping
    public ResponseEntity<?> getAllAcademicGrades() {
        try {
            System.out.println("📚 Obteniendo grados académicos...");
            
            List<AcademicGrade> grades = academicGradeRepository.findByIsActiveTrueOrderByLevel();
            
            // Si no hay grados, inicializarlos automáticamente
            if (grades.isEmpty()) {
                System.out.println("⚠️ No hay grados académicos, inicializando automáticamente...");
                ResponseEntity<?> initResult = initializeAcademicGrades();
                
                if (initResult.getStatusCode().is2xxSuccessful()) {
                    grades = academicGradeRepository.findByIsActiveTrueOrderByLevel();
                    System.out.println("✅ Grados inicializados automáticamente: " + grades.size());
                } else {
                    System.err.println("❌ Error en inicialización automática");
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grades", grades);
            response.put("total", grades.size());
            
            System.out.println("✅ Encontrados " + grades.size() + " grados académicos");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo grados académicos: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar grados académicos: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint de prueba para verificar conectividad
     */
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            System.out.println("🧪 Test endpoint llamado - verificando conexión a BD...");
            
            // Probar conexión básica a la base de datos
            long totalGrades = academicGradeRepository.count();
            long totalUsers = userRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Endpoint de grados académicos funcionando correctamente");
            response.put("timestamp", System.currentTimeMillis());
            response.put("databaseConnection", "OK");
            response.put("totalGrades", totalGrades);
            response.put("totalUsers", totalUsers);
            
            System.out.println("✅ Test exitoso - BD conectada, Grados: " + totalGrades + ", Usuarios: " + totalUsers);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en test endpoint: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error en test endpoint: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            response.put("databaseConnection", "ERROR");
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint de salud del sistema - Verificar integridad completa
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            Map<String, Object> health = new HashMap<>();
            
            // Verificar grados académicos
            List<AcademicGrade> grades = academicGradeRepository.findByIsActiveTrueOrderByLevel();
            health.put("gradesAvailable", grades.size() >= 5);
            health.put("totalGrades", grades.size());
            
            // Verificar usuarios
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            long studentsWithGrade = students.stream().filter(s -> s.getAcademicGrade() != null).count();
            
            health.put("studentsTotal", students.size());
            health.put("studentsWithGrade", studentsWithGrade);
            health.put("studentsHealthy", studentsWithGrade > 0);
            
            // Estado general
            boolean systemHealthy = grades.size() >= 5 && studentsWithGrade > 0;
            health.put("systemHealthy", systemHealthy);
            health.put("timestamp", System.currentTimeMillis());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("health", health);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Health check failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Diagnóstico completo del sistema de grados académicos
     */
    @GetMapping("/diagnostic")
    public ResponseEntity<?> diagnosticEndpoint() {
        try {
            System.out.println("🔍 Ejecutando diagnóstico de grados académicos...");
            
            Map<String, Object> diagnostic = new HashMap<>();
            
            // Verificar grados académicos
            List<AcademicGrade> grades = academicGradeRepository.findAll();
            diagnostic.put("totalGrades", grades.size());
            diagnostic.put("activeGrades", academicGradeRepository.findByIsActiveTrueOrderByLevel().size());
            
            // Verificar usuarios
            List<User> allUsers = userRepository.findAll();
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            List<User> teachers = userRepository.findByRole(UserRole.TEACHER);
            
            diagnostic.put("totalUsers", allUsers.size());
            diagnostic.put("totalStudents", students.size());
            diagnostic.put("totalTeachers", teachers.size());
            
            // Verificar estudiantes con grado
            long studentsWithGrade = students.stream()
                .filter(s -> s.getAcademicGrade() != null)
                .count();
            
            diagnostic.put("studentsWithGrade", studentsWithGrade);
            diagnostic.put("studentsWithoutGrade", students.size() - studentsWithGrade);
            
            // Verificar profesores con grado (debería ser 0)
            long teachersWithGrade = teachers.stream()
                .filter(t -> t.getAcademicGrade() != null)
                .count();
            
            diagnostic.put("teachersWithGrade", teachersWithGrade);
            diagnostic.put("teachersWithoutGrade", teachers.size() - teachersWithGrade);
            
            // Estado general
            boolean isHealthy = grades.size() >= 5 && 
                               studentsWithGrade > 0 && 
                               teachersWithGrade == 0;
            
            diagnostic.put("systemHealthy", isHealthy);
            diagnostic.put("recommendations", new String[]{
                isHealthy ? "Sistema funcionando correctamente" : "Sistema requiere configuración",
                grades.size() < 5 ? "Ejecutar /initialize para crear grados" : "Grados académicos OK",
                studentsWithGrade == 0 ? "Ejecutar /assign-to-users para asignar grados" : "Asignación de grados OK",
                teachersWithGrade > 0 ? "Corregir profesores con grado asignado" : "Profesores sin grado OK"
            });
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("diagnostic", diagnostic);
            
            System.out.println("✅ Diagnóstico completado - Sistema saludable: " + isHealthy);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en diagnóstico: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error en diagnóstico: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Inicializar grados académicos de primaria (1° a 5°)
     * Este endpoint se puede llamar una vez para poblar la base de datos
     */
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeAcademicGrades() {
        try {
            System.out.println("🏗️ Inicializando grados académicos de primaria...");
            
            // Verificar si ya existen grados
            List<AcademicGrade> existingGrades = academicGradeRepository.findAll();
            if (!existingGrades.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Los grados académicos ya están inicializados");
                response.put("grades", existingGrades);
                return ResponseEntity.ok(response);
            }
            
            // Crear grados de primaria
            String[] gradeNames = {"1°", "2°", "3°", "4°", "5°"};
            String[] gradeDescriptions = {
                "Primer Grado", "Segundo Grado", "Tercer Grado", 
                "Cuarto Grado", "Quinto Grado"
            };
            
            for (int i = 0; i < gradeNames.length; i++) {
                AcademicGrade grade = new AcademicGrade(
                    gradeNames[i], 
                    gradeDescriptions[i], 
                    i + 1
                );
                academicGradeRepository.save(grade);
                System.out.println("✅ Creado grado: " + gradeNames[i] + " - " + gradeDescriptions[i]);
            }
            
            List<AcademicGrade> createdGrades = academicGradeRepository.findByIsActiveTrueOrderByLevel();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grados académicos inicializados exitosamente");
            response.put("grades", createdGrades);
            response.put("total", createdGrades.size());
            
            System.out.println("🎉 Grados académicos inicializados: " + createdGrades.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error inicializando grados académicos: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al inicializar grados académicos: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Asignar grados académicos a usuarios existentes
     * Solo asigna grados a estudiantes, profesores quedan sin grado
     */
    @PostMapping("/assign-to-users")
    public ResponseEntity<?> assignGradesToUsers() {
        try {
            System.out.println("👥 Asignando grados académicos a usuarios...");
            
            // Obtener todos los grados académicos
            List<AcademicGrade> grades = academicGradeRepository.findByIsActiveTrueOrderByLevel();
            if (grades.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No hay grados académicos disponibles. Ejecute /initialize primero.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Obtener todos los estudiantes
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            System.out.println("📚 Encontrados " + students.size() + " estudiantes");
            
            int assignedCount = 0;
            
            // Asignar grados de forma distribuida
            for (User student : students) {
                if (student.getAcademicGrade() == null) {
                    // Asignar grado basado en el ID del usuario para distribución uniforme
                    int gradeIndex = (int) (student.getId() % grades.size());
                    AcademicGrade assignedGrade = grades.get(gradeIndex);
                    
                    student.setAcademicGrade(assignedGrade);
                    userRepository.save(student);
                    
                    System.out.println("✅ " + student.getFirstName() + " " + student.getLastName() + 
                                     " asignado a " + assignedGrade.getName());
                    assignedCount++;
                }
            }
            
            // Asegurar que profesores y coordinadores NO tengan grado
            List<User> teachers = userRepository.findByRole(UserRole.TEACHER);
            List<User> coordinators = userRepository.findByRole(UserRole.COORDINATOR);
            
            for (User teacher : teachers) {
                if (teacher.getAcademicGrade() != null) {
                    teacher.setAcademicGrade(null);
                    userRepository.save(teacher);
                    System.out.println("🔄 Profesor " + teacher.getFirstName() + " sin grado específico");
                }
            }
            
            for (User coordinator : coordinators) {
                if (coordinator.getAcademicGrade() != null) {
                    coordinator.setAcademicGrade(null);
                    userRepository.save(coordinator);
                    System.out.println("🔄 Coordinador " + coordinator.getFirstName() + " sin grado específico");
                }
            }
            
            // Estadísticas finales
            Map<String, Integer> gradeStats = new HashMap<>();
            for (AcademicGrade grade : grades) {
                List<User> studentsInGrade = userRepository.findByAcademicGradeAndRole(grade, UserRole.STUDENT);
                gradeStats.put(grade.getName(), studentsInGrade.size());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grados asignados exitosamente");
            response.put("studentsAssigned", assignedCount);
            response.put("totalStudents", students.size());
            response.put("gradeDistribution", gradeStats);
            
            System.out.println("🎉 Asignación completada: " + assignedCount + " estudiantes");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error asignando grados: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al asignar grados: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}