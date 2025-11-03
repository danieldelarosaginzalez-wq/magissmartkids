package com.altiusacademy.controller;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.service.StudentTaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/tasks")
@CrossOrigin(origins = "*")
public class StudentTaskController {
    
    private final StudentTaskService studentTaskService;
    
    public StudentTaskController(StudentTaskService studentTaskService) {
        this.studentTaskService = studentTaskService;
    }
    
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        List<TaskResponse> tasks = studentTaskService.getStudentTasks(studentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<TaskResponse>> getPendingTasks(Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        List<TaskResponse> tasks = studentTaskService.getPendingTasks(studentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/submitted")
    public ResponseEntity<List<TaskResponse>> getSubmittedTasks(Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        List<TaskResponse> tasks = studentTaskService.getSubmittedTasks(studentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/graded")
    public ResponseEntity<List<TaskResponse>> getGradedTasks(Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        List<TaskResponse> tasks = studentTaskService.getGradedTasks(studentId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        TaskResponse task = studentTaskService.getTaskById(taskId, studentId);
        return ResponseEntity.ok(task);
    }
    
    @PostMapping("/{taskId}/submit")
    public ResponseEntity<TaskResponse> submitTask(
            @PathVariable Long taskId,
            @RequestBody TaskSubmissionRequest request,
            Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        TaskResponse task = studentTaskService.submitTask(taskId, studentId, request);
        return ResponseEntity.ok(task);
    }
    
    @PutMapping("/{taskId}/submission")
    public ResponseEntity<TaskResponse> updateSubmission(
            @PathVariable Long taskId,
            @RequestBody TaskSubmissionRequest request,
            Authentication authentication) {
        Long studentId = extractStudentId(authentication);
        TaskResponse task = studentTaskService.updateSubmission(taskId, studentId, request);
        return ResponseEntity.ok(task);
    }
    
    private Long extractStudentId(Authentication authentication) {
        // TODO: Extraer el ID real del JWT
        return 1L; // Temporal
    }
}
