package com.altiusacademy.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.GradeTaskDto;
import com.altiusacademy.dto.StudentDto;
import com.altiusacademy.dto.TeacherDashboardStatsDto;
import com.altiusacademy.dto.TeacherSubjectDto;
import com.altiusacademy.dto.TeacherTaskDto;
import com.altiusacademy.model.entity.TaskTemplate;
import com.altiusacademy.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
public class TeacherController {
    
    private static final Logger log = LoggerFactory.getLogger(TeacherController.class);
    
    @Autowired
    private TeacherService teacherService;
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<TeacherDashboardStatsDto> getDashboardStats(Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            TeacherDashboardStatsDto stats = teacherService.getDashboardStats(teacherId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting teacher dashboard stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<List<TeacherSubjectDto>> getTeacherSubjects(Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            List<TeacherSubjectDto> subjects = teacherService.getTeacherSubjects(teacherId);
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            log.error("Error getting teacher subjects: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/tasks")
    public ResponseEntity<TaskTemplate> createTask(@RequestBody TeacherTaskDto taskDto, Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            TaskTemplate task = teacherService.createTask(taskDto, teacherId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/tasks")
    public ResponseEntity<List<TeacherTaskDto>> getTeacherTasks(Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            List<TeacherTaskDto> tasks = teacherService.getTeacherTasks(teacherId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            log.error("Error getting teacher tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<GradeTaskDto>> getGradingTasks(
            @RequestParam Long subjectId,
            @RequestParam String grade,
            Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            List<GradeTaskDto> gradingTasks = teacherService.getGradingTasks(teacherId, subjectId, grade);
            return ResponseEntity.ok(gradingTasks);
        } catch (Exception e) {
            log.error("Error getting grading tasks: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/tasks/{taskId}/grade")
    public ResponseEntity<Void> gradeTask(
            @PathVariable Long taskId,
            @RequestBody GradeTaskDto gradeDto,
            Authentication authentication) {
        try {
            Long teacherId = getUserIdFromAuth(authentication);
            teacherService.gradeTask(taskId, gradeDto, teacherId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error grading task: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getStudentsByGrade(
            @RequestParam String grade,
            Authentication authentication) {
        try {
            List<StudentDto> students = teacherService.getStudentsByGrade(grade);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            log.error("Error getting students by grade: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private Long getUserIdFromAuth(Authentication authentication) {
        // Implementar extracción del ID del usuario desde el token JWT
        // Por ahora retorno un ID fijo para testing
        return 1L; // TODO: Implementar extracción real del JWT
    }
}