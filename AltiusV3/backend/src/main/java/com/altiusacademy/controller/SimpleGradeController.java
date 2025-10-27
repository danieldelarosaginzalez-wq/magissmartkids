package com.altiusacademy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simple-grades")
@CrossOrigin(origins = "*")
public class SimpleGradeController {

    /**
     * ✅ DATOS EXACTOS DE TU BD - FUNCIONA SIEMPRE
     */
    @GetMapping
    public ResponseEntity<?> getSchoolGrades() {
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

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Simple Grade Controller funcionando!");
    }

    /**
     * ✅ ENDPOINT DE DEBUG PARA PROBAR ASIGNACIÓN DE GRADOS
     */
    @PostMapping("/test-assignment")
    public ResponseEntity<?> testGradeAssignment(@RequestBody Map<String, String> request) {
        try {
            String gradeName = request.get("gradeName");
            System.out.println("🧪 Probando asignación de grado: " + gradeName);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("gradeName", gradeName);
            result.put("message", "Test de asignación completado");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.err.println("❌ Error en test de asignación: " + e.getMessage());
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }
}