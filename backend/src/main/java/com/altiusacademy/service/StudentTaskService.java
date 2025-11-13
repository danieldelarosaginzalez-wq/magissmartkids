package com.altiusacademy.service;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentTaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    
    public StudentTaskService(
            TaskRepository taskRepository,
            UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    
    public List<TaskResponse> getStudentTasks(Long studentId) {
        List<Task> tasks = taskRepository.findByStudentId(studentId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getPendingTasks(Long studentId) {
        List<Task> tasks = taskRepository.findByStudentIdAndStatus(studentId, Task.TaskStatus.PENDING);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getSubmittedTasks(Long studentId) {
        List<Task> tasks = taskRepository.findByStudentIdAndStatus(studentId, Task.TaskStatus.SUBMITTED);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getGradedTasks(Long studentId) {
        List<Task> tasks = taskRepository.findByStudentIdAndStatus(studentId, Task.TaskStatus.GRADED);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TaskResponse getTaskById(Long taskId, Long studentId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (task.getStudent() == null || !task.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("No tienes permiso para ver esta tarea");
        }
        
        return convertToResponse(task);
    }
    
    @Transactional
    public TaskResponse submitTask(Long taskId, Long studentId, TaskSubmissionRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (task.getStudent() == null || !task.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("No tienes permiso para entregar esta tarea");
        }
        
        if (task.getStatus() == Task.TaskStatus.GRADED) {
            throw new RuntimeException("Esta tarea ya ha sido calificada");
        }
        
        task.setSubmissionText(request.getSubmissionText());
        task.setSubmissionFileUrl(request.getSubmissionFileUrl());
        task.setSubmittedAt(LocalDateTime.now());
        task.setStatus(Task.TaskStatus.SUBMITTED);
        
        return convertToResponse(taskRepository.save(task));
    }
    
    @Transactional
    public TaskResponse updateSubmission(Long taskId, Long studentId, TaskSubmissionRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (task.getStudent() == null || !task.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("No tienes permiso para actualizar esta tarea");
        }
        
        if (task.getStatus() == Task.TaskStatus.GRADED) {
            throw new RuntimeException("No puedes modificar una tarea ya calificada");
        }
        
        task.setSubmissionText(request.getSubmissionText());
        task.setSubmissionFileUrl(request.getSubmissionFileUrl());
        task.setSubmittedAt(LocalDateTime.now());
        
        return convertToResponse(taskRepository.save(task));
    }
    
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setPriority(task.getPriority().name());
        response.setStatus(task.getStatus().name());
        response.setTaskType(task.getTaskType().name());
        
        if (task.getSubject() != null) {
            response.setSubjectId(task.getSubject().getId());
            response.setSubjectName(task.getSubject().getName());
        }
        
        if (task.getTeacher() != null) {
            response.setTeacherId(task.getTeacher().getId());
            response.setTeacherName(task.getTeacher().getFullName());
        }
        
        if (task.getStudent() != null) {
            response.setStudentId(task.getStudent().getId());
            response.setStudentName(task.getStudent().getFullName());
        }
        
        response.setGrade(task.getGrade());
        response.setSubmissionText(task.getSubmissionText());
        response.setSubmissionFileUrl(task.getSubmissionFileUrl());
        response.setSubmittedAt(task.getSubmittedAt());
        response.setScore(task.getScore());
        response.setMaxGrade(task.getMaxGrade());
        response.setFeedback(task.getFeedback());
        response.setGradedAt(task.getGradedAt());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        
        response.setAllowedFormats(task.getAllowedFormats());
        response.setMaxFiles(task.getMaxFiles());
        response.setMaxSizeMb(task.getMaxSizeMb());
        response.setActivityConfig(task.getActivityConfig());
        response.setMaxScore(task.getMaxScore());
        
        return response;
    }
}
