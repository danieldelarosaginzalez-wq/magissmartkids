package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired private SubjectRepository subjectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private InstitutionRepository institutionRepository;

    // Listar todas las materias (para debugging)
    @GetMapping
    public ResponseEntity<?> getAllSubjects() {
        try {
            System.out.println("📚 Obteniendo TODAS las materias");
            List<Subject> subjects = subjectRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjects);
            response.put("total", subjects.size());
            
            System.out.println("✅ Total de materias en BD: " + subjects.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo todas las materias: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Listar materias por institución
    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<?> getSubjectsByInstitution(@PathVariable Long institutionId) {
        try {
            System.out.println("📚 Obteniendo materias para institución: " + institutionId);
            List<Subject> subjects = subjectRepository.findActiveSubjectsByInstitution(institutionId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjects);
            response.put("total", subjects.size());
            
            System.out.println("✅ Encontradas " + subjects.size() + " materias");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo materias: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Listar materias del profesor autenticado
    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getTeacherSubjects(Authentication authentication) {
        try {
            System.out.println("👩‍🏫 Obteniendo materias del profesor: " + authentication.getName());
            
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            List<Subject> subjects = subjectRepository.findActiveSubjectsByTeacher(teacher.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjects);
            response.put("total", subjects.size());
            response.put("teacher", teacher.getFirstName() + " " + teacher.getLastName());
            
            System.out.println("✅ Profesor tiene " + subjects.size() + " materias");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo materias del profesor: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al cargar materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Crear nueva materia (solo profesores)
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createSubject(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("➕ Creando nueva materia");
            
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
            
            Subject subject = new Subject();
            subject.setName((String) request.get("name"));
            subject.setDescription((String) request.get("description"));
            subject.setTeacher(teacher);
            subject.setInstitution(teacher.getInstitution());
            subject.setIsActive(true);
            
            Subject savedSubject = subjectRepository.save(subject);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subject", savedSubject);
            response.put("message", "Materia creada exitosamente");
            
            System.out.println("✅ Materia creada: " + savedSubject.getName());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error creando materia: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al crear materia: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Actualizar materia
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("✏️ Actualizando materia ID: " + id);
            
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<Subject> subjectOpt = subjectRepository.findById(id);
            if (subjectOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Materia no encontrada");
                return ResponseEntity.notFound().build();
            }
            
            Subject subject = subjectOpt.get();
            User teacher = teacherOpt.get();
            
            // Verificar que el profesor sea el dueño de la materia
            if (!subject.getTeacher().getId().equals(teacher.getId())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No tienes permisos para editar esta materia");
                return ResponseEntity.status(403).body(response);
            }
            
            // Actualizar campos
            if (request.containsKey("name")) {
                subject.setName((String) request.get("name"));
            }
            if (request.containsKey("description")) {
                subject.setDescription((String) request.get("description"));
            }
            
            Subject updatedSubject = subjectRepository.save(subject);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subject", updatedSubject);
            response.put("message", "Materia actualizada exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error actualizando materia: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al actualizar materia: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Eliminar materia (desactivar)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id, Authentication authentication) {
        try {
            System.out.println("🗑️ Eliminando materia ID: " + id);
            
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<Subject> subjectOpt = subjectRepository.findById(id);
            if (subjectOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Materia no encontrada");
                return ResponseEntity.notFound().build();
            }
            
            Subject subject = subjectOpt.get();
            User teacher = teacherOpt.get();
            
            // Verificar que el profesor sea el dueño de la materia
            if (!subject.getTeacher().getId().equals(teacher.getId())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No tienes permisos para eliminar esta materia");
                return ResponseEntity.status(403).body(response);
            }
            
            // Desactivar en lugar de eliminar
            subject.setIsActive(false);
            subjectRepository.save(subject);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Materia eliminada exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error eliminando materia: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al eliminar materia: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}