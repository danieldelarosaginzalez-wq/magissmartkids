package com.altiusacademy.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.repository.mysql.SubjectRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    
    // Endpoint de debug público (temporal)
    @GetMapping("/api/debug/preescolar-raw/{institutionId}")
    public ResponseEntity<?> debugPreescolarPublic(@PathVariable Long institutionId) {
        try {
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);
            
            List<Map<String, Object>> preescolarData = new ArrayList<>();
            for (Subject s : allSubjects) {
                if (s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("subjectId", s.getId());
                    data.put("name", s.getName());
                    data.put("teacherIdInDB", s.getTeacher() != null ? s.getTeacher().getId() : "NULL");
                    data.put("teacherName", s.getTeacher() != null ? 
                        s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName() : "NULL");
                    data.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                    data.put("gradeName", s.getSchoolGrade().getGradeName());
                    preescolarData.add(data);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("preescolarSubjects", preescolarData);
            response.put("total", preescolarData.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<?> getSubjectsByInstitution(@PathVariable Long institutionId) {
        try {
            System.out.println("🔍 Buscando materias para institución: " + institutionId);
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);
            System.out.println("📊 Total materias encontradas: " + subjects.size());
            
            List<Map<String, Object>> subjectList = subjects.stream().map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("description", subject.getDescription());
                subjectMap.put("color", subject.getColor());
                subjectMap.put("isActive", subject.getIsActive());
                
                // Log para debug
                System.out.println("📚 Materia: " + subject.getName() + 
                    " | Teacher ID: " + (subject.getTeacher() != null ? subject.getTeacher().getId() : "NULL") +
                    " | Grade Level: " + (subject.getSchoolGrade() != null ? subject.getSchoolGrade().getGradeLevel() : "NULL"));
                
                if (subject.getSchoolGrade() != null) {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("id", subject.getSchoolGrade().getId());
                    gradeMap.put("gradeName", subject.getSchoolGrade().getGradeName());
                    gradeMap.put("gradeLevel", subject.getSchoolGrade().getGradeLevel());
                    subjectMap.put("schoolGrade", gradeMap);
                }
                
                if (subject.getTeacher() != null) {
                    Map<String, Object> teacherMap = new HashMap<>();
                    teacherMap.put("id", subject.getTeacher().getId());
                    teacherMap.put("firstName", subject.getTeacher().getFirstName());
                    teacherMap.put("lastName", subject.getTeacher().getLastName());
                    teacherMap.put("email", subject.getTeacher().getEmail());
                    subjectMap.put("teacher", teacherMap);
                } else {
                    System.out.println("⚠️ Materia sin profesor: " + subject.getName());
                }
                
                return subjectMap;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjectList);
            response.put("total", subjectList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getSubjectsByTeacher(@PathVariable Long teacherId) {
        try {
            List<Subject> subjects = subjectRepository.findByTeacherId(teacherId);
            
            List<Map<String, Object>> subjectList = subjects.stream().map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("description", subject.getDescription());
                subjectMap.put("color", subject.getColor());
                subjectMap.put("isActive", subject.getIsActive());
                
                if (subject.getSchoolGrade() != null) {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("id", subject.getSchoolGrade().getId());
                    gradeMap.put("gradeName", subject.getSchoolGrade().getGradeName());
                    gradeMap.put("gradeLevel", subject.getSchoolGrade().getGradeLevel());
                    subjectMap.put("schoolGrade", gradeMap);
                }
                
                return subjectMap;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjectList);
            response.put("total", subjectList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/raw/{institutionId}")
    public ResponseEntity<?> debugRawData(@PathVariable Long institutionId) {
        try {
            // Obtener materias de Preescolar directamente
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);
            
            List<Map<String, Object>> preescolarData = new ArrayList<>();
            for (Subject s : allSubjects) {
                if (s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("subjectId", s.getId());
                    data.put("name", s.getName());
                    data.put("teacherIdInDB", s.getTeacher() != null ? s.getTeacher().getId() : "NULL");
                    data.put("teacherName", s.getTeacher() != null ? 
                        s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName() : "NULL");
                    data.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                    data.put("gradeName", s.getSchoolGrade().getGradeName());
                    preescolarData.add(data);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("preescolarSubjects", preescolarData);
            response.put("total", preescolarData.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/preescolar/{institutionId}")
    public ResponseEntity<?> debugPreescolar(@PathVariable Long institutionId) {
        try {
            List<Subject> preescolarSubjects = subjectRepository.findByInstitutionId(institutionId)
                .stream()
                .filter(s -> s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> debug = preescolarSubjects.stream().map(s -> {
                Map<String, Object> info = new HashMap<>();
                info.put("id", s.getId());
                info.put("name", s.getName());
                info.put("teacherId", s.getTeacher() != null ? s.getTeacher().getId() : null);
                info.put("teacherName", s.getTeacher() != null ? 
                    s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName() : "NULL");
                info.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                info.put("gradeName", s.getSchoolGrade().getGradeName());
                return info;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("totalPreescolar", preescolarSubjects.size());
            response.put("subjects", debug);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/stats/institution/{institutionId}")
    public ResponseEntity<?> getSubjectStats(@PathVariable Long institutionId) {
        try {
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);
            
            long totalSubjects = subjects.size();
            long activeSubjects = subjects.stream().filter(s -> s.getIsActive()).count();
            long subjectsWithTeacher = subjects.stream().filter(s -> s.getTeacher() != null).count();
            long subjectsWithoutTeacher = totalSubjects - subjectsWithTeacher;
            
            // Agrupar por grado
            Map<String, Long> subjectsByGrade = subjects.stream()
                .filter(s -> s.getSchoolGrade() != null)
                .collect(Collectors.groupingBy(
                    s -> s.getSchoolGrade().getGradeName(),
                    Collectors.counting()
                ));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalSubjects", totalSubjects);
            response.put("activeSubjects", activeSubjects);
            response.put("subjectsWithTeacher", subjectsWithTeacher);
            response.put("subjectsWithoutTeacher", subjectsWithoutTeacher);
            response.put("subjectsByGrade", subjectsByGrade);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
