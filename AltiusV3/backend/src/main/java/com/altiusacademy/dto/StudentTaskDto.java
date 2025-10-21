package com.altiusacademy.dto;

import java.time.LocalDate;

public class StudentTaskDto {
    private String id;
    private String subject;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
    private String status;
    
    // Nuevos campos para el sistema unificado
    private String taskType; // "multimedia" o "interactive"
    private String[] allowedFormats; // Para tareas multimedia
    private Integer maxFiles;
    private Integer maxSizeMb;
    private String activityConfig; // Para tareas interactivas (JSON)
    private Integer maxScore;
    private Boolean hasSubmission; // Si ya tiene entrega
    private String submissionStatus; // Estado de la entrega

    // Constructors
    public StudentTaskDto() {}

    public StudentTaskDto(String id, String subject, String title, String description, 
                         LocalDate dueDate, String priority, String status) {
        this.id = id;
        this.subject = subject;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
    
    // Constructor completo
    public StudentTaskDto(String id, String subject, String title, String description, 
                         LocalDate dueDate, String priority, String status, String taskType,
                         String[] allowedFormats, Integer maxFiles, Integer maxSizeMb,
                         String activityConfig, Integer maxScore, Boolean hasSubmission, String submissionStatus) {
        this(id, subject, title, description, dueDate, priority, status);
        this.taskType = taskType;
        this.allowedFormats = allowedFormats;
        this.maxFiles = maxFiles;
        this.maxSizeMb = maxSizeMb;
        this.activityConfig = activityConfig;
        this.maxScore = maxScore;
        this.hasSubmission = hasSubmission;
        this.submissionStatus = submissionStatus;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    
    public String[] getAllowedFormats() { return allowedFormats; }
    public void setAllowedFormats(String[] allowedFormats) { this.allowedFormats = allowedFormats; }
    
    public Integer getMaxFiles() { return maxFiles; }
    public void setMaxFiles(Integer maxFiles) { this.maxFiles = maxFiles; }
    
    public Integer getMaxSizeMb() { return maxSizeMb; }
    public void setMaxSizeMb(Integer maxSizeMb) { this.maxSizeMb = maxSizeMb; }
    
    public String getActivityConfig() { return activityConfig; }
    public void setActivityConfig(String activityConfig) { this.activityConfig = activityConfig; }
    
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    
    public Boolean getHasSubmission() { return hasSubmission; }
    public void setHasSubmission(Boolean hasSubmission) { this.hasSubmission = hasSubmission; }
    
    public String getSubmissionStatus() { return submissionStatus; }
    public void setSubmissionStatus(String submissionStatus) { this.submissionStatus = submissionStatus; }
}