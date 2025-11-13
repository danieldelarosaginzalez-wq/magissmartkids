package com.altiusacademy.controller;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.service.TeacherTaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/tasks")
@CrossOrigin(origins = "*")
public class TeacherTaskController {
    
    private final TeacherTaskService teacherTaskService;
    
    public TeacherTaskController(TeacherTaskService teacherTaskService) {
        this.teacherTaskService = teacherTaskService;
    }
    
    @PostMapping
    public ResponseEntity<List<TaskResponse>> createTask(
            @RequestBody TaskCreateRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.createTask(teacherId, request);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getTeacherTasks(teacherId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.getTaskById(taskId, teacherId);
        return ResponseEntity.ok(task);
    }
    
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskCreateRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.updateTask(taskId, teacherId, request);
        return ResponseEntity.ok(task);
    }
    
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        teacherTaskService.deleteTask(taskId, teacherId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{taskId}/grade")
    public ResponseEntity<TaskResponse> gradeTask(
            @PathVariable Long taskId,
            @RequestBody TaskGradeRequest request,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        TaskResponse task = teacherTaskService.gradeTask(taskId, teacherId, request);
        return ResponseEntity.ok(task);
    }
    
    @GetMapping("/submitted")
    public ResponseEntity<List<TaskResponse>> getSubmittedTasks(Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getSubmittedTasks(teacherId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<TaskResponse>> getTasksBySubject(
            @PathVariable Long subjectId,
            Authentication authentication) {
        Long teacherId = extractTeacherId(authentication);
        List<TaskResponse> tasks = teacherTaskService.getTasksBySubject(teacherId, subjectId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<String>> getAvailableGrades() {
        List<String> grades = List.of(
            "Preescolar", "1° A", "1° B", "1° C", "2° A", "2° B", "2° C",
            "3° A", "3° B", "3° C", "4° A", "4° B", "4° C", "5° A", "5° B", "5° C"
        );
        return ResponseEntity.ok(grades);
    }
    
    private Long extractTeacherId(Authentication authentication) {
        // TODO: Extraer el ID real del JWT
        return 1L; // Temporal
    }
}
