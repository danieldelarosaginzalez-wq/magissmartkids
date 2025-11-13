package com.altiusacademy.service;

import com.altiusacademy.dto.task.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherTaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TaskTemplateRepository taskTemplateRepository;
    private final ObjectMapper objectMapper;
    
    public TeacherTaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            TaskTemplateRepository taskTemplateRepository,
            ObjectMapper objectMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.taskTemplateRepository = taskTemplateRepository;
        this.objectMapper = objectMapper;
    }
    
    @Transactional
    public List<TaskResponse> createTask(Long teacherId, TaskCreateRequest request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        
        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        }
        
        TaskTemplate template = null;
        if (request.getTaskTemplateId() != null) {
            template = taskTemplateRepository.findById(request.getTaskTemplateId())
                    .orElse(null);
        }
        
        List<User> students = new ArrayList<>();
        
        // Obtener estudiantes por IDs específicos
        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {
            students = userRepository.findAllById(request.getStudentIds());
        }
        
        // Si no hay estudiantes específicos, buscar por grados
        if (students.isEmpty() && request.getGrades() != null && !request.getGrades().isEmpty()) {
            // Crear una tarea por grado (sin estudiante específico)
            students.add(null);
        }
        
        // Si no hay estudiantes, crear una tarea sin asignar
        if (students.isEmpty()) {
            students.add(null);
        }
        
        List<Task> createdTasks = new ArrayList<>();
        
        // Si hay múltiples grados, crear una tarea por grado
        List<String> gradesToAssign = request.getGrades() != null && !request.getGrades().isEmpty() 
            ? request.getGrades() 
            : List.of((String) null);
        
        for (String grade : gradesToAssign) {
            for (User student : students) {
                Task task = new Task();
                task.setTitle(request.getTitle());
                task.setDescription(request.getDescription());
                task.setDueDate(request.getDueDate());
                task.setTeacher(teacher);
                task.setStudent(student);
                task.setSubject(subject);
                task.setTaskTemplate(template);
                task.setGrade(grade);
                
                if (request.getPriority() != null) {
                    task.setPriority(Task.TaskPriority.valueOf(request.getPriority()));
                }
                
                if (request.getTaskType() != null) {
                    task.setTaskType(Task.TaskType.valueOf(request.getTaskType()));
                }
                
                // Configuración multimedia
                if (request.getAllowedFormats() != null) {
                    try {
                        task.setAllowedFormats(objectMapper.writeValueAsString(request.getAllowedFormats()));
                    } catch (Exception e) {
                        task.setAllowedFormats("[]");
                    }
                }
                task.setMaxFiles(request.getMaxFiles());
                task.setMaxSizeMb(request.getMaxSizeMb());
                
                // Configuración interactiva
                task.setActivityConfig(request.getActivityConfig());
                task.setMaxScore(request.getMaxScore());
                
                if (request.getMaxGrade() != null) {
                    task.setMaxGrade(request.getMaxGrade());
                }
                
                createdTasks.add(taskRepository.save(task));
            }
        }
        
        return createdTasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getTeacherTasks(Long teacherId) {
        List<Task> tasks = taskRepository.findByTeacherId(teacherId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TaskResponse getTaskById(Long taskId, Long teacherId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para ver esta tarea");
        }
        
        return convertToResponse(task);
    }
    
    @Transactional
    public TaskResponse updateTask(Long taskId, Long teacherId, TaskCreateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para editar esta tarea");
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        
        if (request.getPriority() != null) {
            task.setPriority(Task.TaskPriority.valueOf(request.getPriority()));
        }
        
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            task.setSubject(subject);
        }
        
        return convertToResponse(taskRepository.save(task));
    }
    
    @Transactional
    public void deleteTask(Long taskId, Long teacherId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta tarea");
        }
        
        taskRepository.delete(task);
    }
    
    @Transactional
    public TaskResponse gradeTask(Long taskId, Long teacherId, TaskGradeRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        if (!task.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("No tienes permiso para calificar esta tarea");
        }
        
        if (task.getStatus() != Task.TaskStatus.SUBMITTED) {
            throw new RuntimeException("La tarea no ha sido entregada");
        }
        
        task.setScore(request.getScore());
        task.setFeedback(request.getFeedback());
        task.setGradedAt(LocalDateTime.now());
        task.setStatus(Task.TaskStatus.GRADED);
        
        return convertToResponse(taskRepository.save(task));
    }
    
    public List<TaskResponse> getSubmittedTasks(Long teacherId) {
        List<Task> tasks = taskRepository.findByTeacherIdAndStatus(teacherId, Task.TaskStatus.SUBMITTED);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TaskResponse> getTasksBySubject(Long teacherId, Long subjectId) {
        List<Task> tasks = taskRepository.findByTeacherIdAndSubjectId(teacherId, subjectId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
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
