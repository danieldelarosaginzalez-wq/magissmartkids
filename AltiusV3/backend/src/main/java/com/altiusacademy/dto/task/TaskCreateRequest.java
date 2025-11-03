package com.altiusacademy.dto.task;

import java.time.LocalDate;
import java.util.List;

public class TaskCreateRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority; // LOW, MEDIUM, HIGH
    private String taskType; // MULTIMEDIA, INTERACTIVE
    private Long subjectId;
    private Long taskTemplateId;
    private List<Long> studentIds; // Para asignar a estudiantes específicos
    private List<String> grades; // Para asignar a grados completos
    
    // Configuración multimedia
    private List<String> allowedFormats;
    private Integer maxFiles;
    private Integer maxSizeMb;
    
    // Configuración interactiva
    private String activityConfig;
    private Integer maxScore;
    private Double maxGrade;
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public Long getTaskTemplateId() { return taskTemplateId; }
    public void setTaskTemplateId(Long taskTemplateId) { this.taskTemplateId = taskTemplateId; }
    
    public List<Long> getStudentIds() { return studentIds; }
    public void setStudentIds(List<Long> studentIds) { this.studentIds = studentIds; }
    
    public List<String> getGrades() { return grades; }
    public void setGrades(List<String> grades) { this.grades = grades; }
    
    public List<String> getAllowedFormats() { return allowedFormats; }
    public void setAllowedFormats(List<String> allowedFormats) { this.allowedFormats = allowedFormats; }
    
    public Integer getMaxFiles() { return maxFiles; }
    public void setMaxFiles(Integer maxFiles) { this.maxFiles = maxFiles; }
    
    public Integer getMaxSizeMb() { return maxSizeMb; }
    public void setMaxSizeMb(Integer maxSizeMb) { this.maxSizeMb = maxSizeMb; }
    
    public String getActivityConfig() { return activityConfig; }
    public void setActivityConfig(String activityConfig) { this.activityConfig = activityConfig; }
    
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    
    public Double getMaxGrade() { return maxGrade; }
    public void setMaxGrade(Double maxGrade) { this.maxGrade = maxGrade; }
}
