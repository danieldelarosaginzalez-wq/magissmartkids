package com.altiusacademy.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.repository.mysql.SubjectRepository;

/**
 * Controlador temporal para debugging de materias
 * SOLO PARA DESARROLLO
 */
@RestController
@RequestMapping("/api/debug")
public class DebugSubjectsController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/school-grades")
    public ResponseEntity<?> debugSchoolGrades() {
        try {
            // Obtener todos los school grades
            List<Map<String, Object>> grades = new ArrayList<>();
            
            // Usar una query nativa para obtener los grados
            jakarta.persistence.EntityManager em = entityManager;
            List<Object[]> results = em.createNativeQuery(
                "SELECT id, grade_name, grade_level, description FROM school_grades ORDER BY grade_level, grade_name"
            ).getResultList();
            
            for (Object[] row : results) {
                Map<String, Object> grade = new HashMap<>();
                grade.put("id", row[0]);
                grade.put("gradeName", row[1]);
                grade.put("gradeLevel", row[2]);
                grade.put("description", row[3]);
                grades.add(grade);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("allGrades", grades);
            response.put("total", grades.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @GetMapping("/preescolar-raw/{institutionId}")
    public ResponseEntity<?> debugPreescolarRaw(@PathVariable Long institutionId) {
        try {
            System.out.println("🔍 DEBUG: Obteniendo materias de Preescolar para institución " + institutionId);
            
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);
            System.out.println("📊 Total materias encontradas: " + allSubjects.size());
            
            List<Map<String, Object>> preescolarData = new ArrayList<>();
            for (Subject s : allSubjects) {
                if (s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("subjectId", s.getId());
                    data.put("name", s.getName());
                    data.put("teacherIdInDB", s.getTeacher() != null ? s.getTeacher().getId() : null);
                    data.put("teacherName", s.getTeacher() != null ? 
                        s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName() : "NULL");
                    data.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                    data.put("gradeName", s.getSchoolGrade().getGradeName());
                    
                    System.out.println("📚 " + s.getName() + " | Teacher: " + 
                        (s.getTeacher() != null ? s.getTeacher().getId() : "NULL"));
                    
                    preescolarData.add(data);
                }
            }
            
            System.out.println("✅ Materias de Preescolar encontradas: " + preescolarData.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("preescolarSubjects", preescolarData);
            response.put("total", preescolarData.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error en debug: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
