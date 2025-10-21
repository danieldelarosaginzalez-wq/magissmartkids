package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.SchoolGrade;
import com.altiusacademy.repository.mysql.SchoolGradeRepository;

@RestController
@RequestMapping("/api/school-grades")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class SchoolGradeController {

    @Autowired
    private SchoolGradeRepository schoolGradeRepository;

    // Obtener todos los grados activos
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllActiveGrades() {
        try {
            List<SchoolGrade> grades = schoolGradeRepository.findActiveGradesOrderByLevel();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grades", grades);
            response.put("total", grades.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener los grados: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Crear grados iniciales si no existen
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, Object>> initializeGrades() {
        try {
            // Verificar si ya existen grados
            List<SchoolGrade> existingGrades = schoolGradeRepository.findAll();
            if (!existingGrades.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Los grados ya están inicializados");
                response.put("existing", existingGrades.size());
                return ResponseEntity.ok(response);
            }

            // Crear grados reales del sistema educativo (Preescolar + 1° a 5°)
            String[] gradeNames = {
                "Preescolar", "1°", "2°", "3°", "4°", "5°"
            };
            
            String[] descriptions = {
                "Educación preescolar", "Primer grado de primaria", "Segundo grado de primaria", 
                "Tercer grado de primaria", "Cuarto grado de primaria", "Quinto grado de primaria"
            };

            int created = 0;
            for (int i = 0; i < gradeNames.length; i++) {
                SchoolGrade grade = new SchoolGrade(gradeNames[i], i, descriptions[i]);
                schoolGradeRepository.save(grade);
                created++;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grados inicializados correctamente");
            response.put("created", created);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al inicializar grados: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Obtener grado por ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGradeById(@PathVariable Long id) {
        try {
            return schoolGradeRepository.findById(id)
                .map(grade -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("grade", grade);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener el grado: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Crear nuevo grado
    @PostMapping
    public ResponseEntity<Map<String, Object>> createGrade(@RequestBody SchoolGrade grade) {
        try {
            // Verificar si ya existe un grado con ese nombre
            if (schoolGradeRepository.existsByGradeName(grade.getGradeName())) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Ya existe un grado con ese nombre");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            SchoolGrade savedGrade = schoolGradeRepository.save(grade);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Grado creado correctamente");
            response.put("grade", savedGrade);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al crear el grado: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Actualizar grado
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateGrade(@PathVariable Long id, @RequestBody SchoolGrade grade) {
        try {
            return schoolGradeRepository.findById(id)
                .map(existingGrade -> {
                    existingGrade.setGradeName(grade.getGradeName());
                    existingGrade.setGradeLevel(grade.getGradeLevel());
                    existingGrade.setDescription(grade.getDescription());
                    existingGrade.setIsActive(grade.getIsActive());
                    
                    SchoolGrade updatedGrade = schoolGradeRepository.save(existingGrade);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Grado actualizado correctamente");
                    response.put("grade", updatedGrade);
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al actualizar el grado: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Eliminar grado (desactivar)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteGrade(@PathVariable Long id) {
        try {
            return schoolGradeRepository.findById(id)
                .map(grade -> {
                    grade.setIsActive(false);
                    schoolGradeRepository.save(grade);
                    
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Grado desactivado correctamente");
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al eliminar el grado: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}