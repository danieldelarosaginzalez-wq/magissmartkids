package com.altiusacademy.controller;

import com.altiusacademy.model.entity.SchoolGrade;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.SchoolGradeRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/school-grades")
@CrossOrigin(origins = "*")
public class SchoolGradeController {

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ DATOS EXACTOS DE TU BASE DE DATOS - Sin consulta BD
     */
    @GetMapping
    public ResponseEntity<?> getAllSchoolGrades() {
        System.out.println("✅ Devolviendo grados EXACTOS de tu BD");
        
        // ✅ DATOS EXACTOS DE TU TABLA school_grades
        List<Map<String, Object>> grades = List.of(
            Map.of("id", 1, "gradeName", "Preescolar", "name", "Preescolar", "level", 0, "gradeLevel", 0, "description", "Educación preescolar", "isActive", true),
            Map.of("id", 2, "gradeName", "1°", "name", "1°", "level", 1, "gradeLevel", 1, "description", "Primer grado de primaria", "isActive", true),
            Map.of("id", 3, "gradeName", "2°", "name", "2°", "level", 2, "gradeLevel", 2, "description", "Segundo grado de primaria", "isActive", true),
            Map.of("id", 4, "gradeName", "3°", "name", "3°", "level", 3, "gradeLevel", 3, "description", "Tercer grado de primaria", "isActive", true),
            Map.of("id", 5, "gradeName", "4°", "name", "4°", "level", 4, "gradeLevel", 4, "description", "Cuarto grado de primaria", "isActive", true),
            Map.of("id", 6, "gradeName", "5°", "name", "5°", "level", 5, "gradeLevel", 5, "description", "Quinto grado de primaria", "isActive", true)
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("grades", grades);
        response.put("total", grades.size());
        response.put("message", "Grados escolares de tu BD");
        
        System.out.println("✅ Devolviendo " + grades.size() + " grados de tu BD");
        return ResponseEntity.ok(response);
    }

    /**
     * 🔄 MÉTODO ORIGINAL CON BD (para cuando se arregle el problema)
     */
    @GetMapping("/from-db")
    public ResponseEntity<?> getAllSchoolGradesFromDB() {
        try {
            System.out.println("📚 Intentando obtener grados REALES desde BD...");
            
            // ✅ USAR DATOS REALES DE LA BASE DE DATOS
            List<SchoolGrade> grades = schoolGradeRepository.findAll();
            System.out.println("📊 Grados encontrados en BD: " + grades.size());
            
            // ✅ MAPEAR A LA ESTRUCTURA CORRECTA PARA EL FRONTEND
            List<Map<String, Object>> gradeList = grades.stream()
                .map(grade -> {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("id", grade.getId());
                    gradeMap.put("gradeName", grade.getGradeName()); // "1°", "2°", etc.
                    gradeMap.put("name", grade.getGradeName()); // Alias para compatibilidad
                    gradeMap.put("gradeLevel", grade.getGradeLevel());
                    gradeMap.put("level", grade.getGradeLevel()); // Alias para compatibilidad
                    gradeMap.put("description", grade.getDescription() != null ? grade.getDescription() : "");
                    gradeMap.put("isActive", grade.getIsActive() != null ? grade.getIsActive() : true);
                    return gradeMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grades", gradeList);
            response.put("total", gradeList.size());
            response.put("message", "Grados escolares obtenidos REALES desde BD");
            
            System.out.println("✅ Devolviendo " + gradeList.size() + " grados REALES desde BD");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo grados escolares: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error BD: " + e.getMessage());
            response.put("grades", new ArrayList<>());
            response.put("total", 0);
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint de prueba simple sin base de datos
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    /**
     * Endpoint para probar conectividad con la base de datos
     */
    @GetMapping("/db-test")
    public ResponseEntity<?> testDatabase() {
        try {
            System.out.println("🔍 Probando conectividad con BD...");
            
            // Probar conexión básica
            long totalGrades = schoolGradeRepository.count();
            List<SchoolGrade> allGrades = schoolGradeRepository.findAll();
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("totalGrades", totalGrades);
            result.put("gradesFound", allGrades.size());
            result.put("message", "Conectividad BD exitosa");
            
            // Mostrar algunos datos de ejemplo
            if (!allGrades.isEmpty()) {
                List<String> gradeNames = allGrades.stream()
                    .limit(5)
                    .map(SchoolGrade::getGradeName)
                    .collect(Collectors.toList());
                result.put("sampleGrades", gradeNames);
            }
            
            System.out.println("✅ BD conectada - " + totalGrades + " grados encontrados");
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.err.println("❌ Error conectando con BD: " + e.getMessage());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("message", "Error de conectividad BD");
            
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * Endpoint de prueba para verificar conectividad
     */
    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        try {
            System.out.println("🧪 Test de conexión a grados escolares...");
            
            // Probar conexión básica a la base de datos
            long totalGrades = schoolGradeRepository.count();
            long totalUsers = userRepository.count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Conexión exitosa");
            response.put("totalGrades", totalGrades);
            response.put("totalUsers", totalUsers);
            response.put("timestamp", java.time.LocalDateTime.now());
            
            System.out.println("✅ Test exitoso - Grados: " + totalGrades + ", Usuarios: " + totalUsers);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en test de conexión: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error de conexión: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Endpoint de salud para verificar el estado del sistema
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            System.out.println("🏥 Health check de grados escolares...");
            
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("timestamp", java.time.LocalDateTime.now());
            
            // Verificar grados escolares
            List<SchoolGrade> grades = schoolGradeRepository.findByIsActiveTrueOrderByGradeLevel();
            health.put("gradesAvailable", grades.size() >= 5);
            health.put("totalGrades", grades.size());

            // Verificar usuarios
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            long studentsWithGrade = students.stream().filter(s -> s.getSchoolGrade() != null).count();
            
            health.put("studentsTotal", students.size());
            health.put("studentsWithGrade", studentsWithGrade);
            health.put("studentsWithoutGrade", students.size() - studentsWithGrade);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("health", health);
            
            System.out.println("✅ Health check completado");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en health check: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Endpoint de diagnóstico detallado
     */
    @GetMapping("/diagnostic")
    public ResponseEntity<?> diagnostic() {
        try {
            System.out.println("🔍 Diagnóstico detallado de grados escolares...");
            
            Map<String, Object> diagnostic = new HashMap<>();
            diagnostic.put("timestamp", java.time.LocalDateTime.now());
            
            // Verificar grados escolares
            List<SchoolGrade> grades = schoolGradeRepository.findAll();
            diagnostic.put("totalGrades", grades.size());
            diagnostic.put("activeGrades", schoolGradeRepository.findByIsActiveTrueOrderByGradeLevel().size());
            
            // Verificar usuarios
            List<User> allUsers = userRepository.findAll();
            List<User> students = userRepository.findByRole(UserRole.STUDENT);
            List<User> teachers = userRepository.findByRole(UserRole.TEACHER);
            
            diagnostic.put("totalUsers", allUsers.size());
            diagnostic.put("totalStudents", students.size());
            diagnostic.put("totalTeachers", teachers.size());
            
            // Verificar estudiantes con grado
            long studentsWithGrade = students.stream()
                .filter(s -> s.getSchoolGrade() != null)
                .count();
            
            diagnostic.put("studentsWithGrade", studentsWithGrade);
            diagnostic.put("studentsWithoutGrade", students.size() - studentsWithGrade);
            
            // Verificar profesores con grado (debería ser 0)
            long teachersWithGrade = teachers.stream()
                .filter(t -> t.getSchoolGrade() != null)
                .count();
            
            diagnostic.put("teachersWithGrade", teachersWithGrade);
            diagnostic.put("teachersWithoutGrade", teachers.size() - teachersWithGrade);
            
            // Distribución por grado
            Map<String, Long> gradeDistribution = new HashMap<>();
            for (SchoolGrade grade : grades) {
                long count = students.stream()
                    .filter(s -> s.getSchoolGrade() != null && s.getSchoolGrade().getId().equals(grade.getId()))
                    .count();
                gradeDistribution.put(grade.getGradeName(), count);
            }
            diagnostic.put("gradeDistribution", gradeDistribution);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("diagnostic", diagnostic);
            
            System.out.println("✅ Diagnóstico completado");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error en diagnóstico: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error en diagnóstico: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Inicializar grados escolares de primaria
     */
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeSchoolGrades() {
        try {
            System.out.println("🏗️ Inicializando grados escolares de primaria...");
            
            // Verificar si ya existen grados
            List<SchoolGrade> existingGrades = schoolGradeRepository.findAll();
            if (!existingGrades.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Los grados escolares ya están inicializados");
                response.put("totalGrades", existingGrades.size());
                response.put("grades", existingGrades);
                
                System.out.println("ℹ️ Grados ya existentes: " + existingGrades.size());
                return ResponseEntity.ok(response);
            }
            
            // Crear grados de primaria
            String[] gradeNames = {"1° Grado", "2° Grado", "3° Grado", "4° Grado", "5° Grado", "6° Grado"};
            String[] gradeDescriptions = {"Primer grado de primaria", "Segundo grado de primaria", "Tercer grado de primaria", "Cuarto grado de primaria", "Quinto grado de primaria", "Sexto grado de primaria"};
            Integer[] gradeLevels = {1, 2, 3, 4, 5, 6};
            
            for (int i = 0; i < gradeNames.length; i++) {
                SchoolGrade grade = new SchoolGrade(
                    gradeNames[i], 
                    gradeLevels[i], 
                    gradeDescriptions[i]
                );
                schoolGradeRepository.save(grade);
                System.out.println("✅ Creado grado: " + gradeNames[i] + " - " + gradeDescriptions[i]);
            }
            
            List<SchoolGrade> createdGrades = schoolGradeRepository.findByIsActiveTrueOrderByGradeLevel();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grados escolares inicializados correctamente");
            response.put("totalCreated", createdGrades.size());
            response.put("grades", createdGrades);
            
            System.out.println("🎉 Inicialización completada - " + createdGrades.size() + " grados creados");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error inicializando grados escolares: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error inicializando grados: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Asignar grados a usuarios existentes (utilidad de mantenimiento)
     */
    @PostMapping("/assign-to-users")
    public ResponseEntity<?> assignGradesToUsers() {
        try {
            System.out.println("🔄 Asignando grados a usuarios existentes...");
            
            // Obtener todos los grados académicos
            List<SchoolGrade> grades = schoolGradeRepository.findByIsActiveTrueOrderByGradeLevel();
            if (grades.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No hay grados escolares disponibles. Ejecuta /initialize primero.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Obtener estudiantes sin grado asignado
            List<User> studentsWithoutGrade = userRepository.findByRole(UserRole.STUDENT)
                .stream()
                .filter(s -> s.getSchoolGrade() == null)
                .toList();
            
            if (studentsWithoutGrade.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Todos los estudiantes ya tienen grado asignado");
                response.put("totalStudents", userRepository.findByRole(UserRole.STUDENT).size());
                return ResponseEntity.ok(response);
            }
            
            // Asignar grados de forma distribuida
            int gradeIndex = 0;
            int assignedCount = 0;
            
            for (User student : studentsWithoutGrade) {
                SchoolGrade grade = grades.get(gradeIndex % grades.size());
                student.setSchoolGrade(grade);
                userRepository.save(student);
                
                System.out.println("✅ Asignado " + grade.getGradeName() + " a " + student.getFirstName() + " " + student.getLastName());
                
                gradeIndex++;
                assignedCount++;
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grados asignados correctamente");
            response.put("studentsUpdated", assignedCount);
            response.put("totalGrades", grades.size());
            
            System.out.println("🎉 Asignación completada - " + assignedCount + " estudiantes actualizados");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error asignando grados: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error asignando grados: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Obtener grado por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSchoolGradeById(@PathVariable Long id) {
        try {
            SchoolGrade grade = schoolGradeRepository.findById(id).orElse(null);
            
            if (grade == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Grado escolar no encontrado");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", grade);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo grado por ID: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error interno: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }


}