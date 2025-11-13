package com.altiusacademy.controller;

import com.altiusacademy.model.entity.SchoolGrade;
import com.altiusacademy.repository.mysql.SchoolGradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador unificado de grados escolares
 * 
 * Maneja tanto grados desde BD como datos estáticos de fallback.
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@RestController
@RequestMapping("/api")
public class GradeController {

    private static final Logger logger = LoggerFactory.getLogger(GradeController.class);

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;

    /**
     * Grados desde base de datos
     */
    @GetMapping("/school-grades")
    public ResponseEntity<?> getSchoolGrades() {
        try {
            logger.info("Obteniendo grados desde BD");
            
            List<SchoolGrade> grades = schoolGradeRepository.findByIsActiveTrueOrderByGradeLevel();
            
            List<Map<String, Object>> gradeList = grades.stream()
                .map(this::mapGradeToResponse)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(createSuccessResponse(gradeList));
            
        } catch (Exception e) {
            logger.error("Error obteniendo grados desde BD: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("Error obteniendo grados"));
        }
    }

    /**
     * Grados estáticos (fallback)
     */
    @GetMapping("/simple-grades")
    public ResponseEntity<?> getSimpleGrades() {
        logger.info("Obteniendo grados estáticos");
        
        List<Map<String, Object>> grades = getStaticGrades();
        return ResponseEntity.ok(createSuccessResponse(grades));
    }

    /**
     * Grado por ID
     */
    @GetMapping("/school-grades/{id}")
    public ResponseEntity<?> getGradeById(@PathVariable Long id) {
        try {
            SchoolGrade grade = schoolGradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado no encontrado"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grade", grade);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error obteniendo grado {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("Grado no encontrado"));
        }
    }

    // Métodos auxiliares
    private Map<String, Object> mapGradeToResponse(SchoolGrade grade) {
        Map<String, Object> gradeMap = new HashMap<>();
        gradeMap.put("id", grade.getId());
        gradeMap.put("gradeName", grade.getGradeName());
        gradeMap.put("name", grade.getGradeName());
        gradeMap.put("gradeLevel", grade.getGradeLevel());
        gradeMap.put("level", grade.getGradeLevel());
        gradeMap.put("description", grade.getDescription() != null ? grade.getDescription() : "");
        gradeMap.put("isActive", grade.getIsActive() != null ? grade.getIsActive() : true);
        return gradeMap;
    }

    private List<Map<String, Object>> getStaticGrades() {
        return List.of(
            Map.of("id", 1, "gradeName", "Preescolar", "name", "Preescolar", "level", 0, "gradeLevel", 0, "description", "Educación preescolar", "isActive", true),
            Map.of("id", 2, "gradeName", "1°", "name", "1°", "level", 1, "gradeLevel", 1, "description", "Primer grado", "isActive", true),
            Map.of("id", 3, "gradeName", "2°", "name", "2°", "level", 2, "gradeLevel", 2, "description", "Segundo grado", "isActive", true),
            Map.of("id", 4, "gradeName", "3°", "name", "3°", "level", 3, "gradeLevel", 3, "description", "Tercer grado", "isActive", true),
            Map.of("id", 5, "gradeName", "4°", "name", "4°", "level", 4, "gradeLevel", 4, "description", "Cuarto grado", "isActive", true),
            Map.of("id", 6, "gradeName", "5°", "name", "5°", "level", 5, "gradeLevel", 5, "description", "Quinto grado", "isActive", true)
        );
    }

    private Map<String, Object> createSuccessResponse(List<Map<String, Object>> grades) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("grades", grades);
        response.put("total", grades.size());
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("grades", List.of());
        response.put("total", 0);
        return response;
    }
}