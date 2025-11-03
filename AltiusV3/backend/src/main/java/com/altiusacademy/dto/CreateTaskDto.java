package com.altiusacademy.dto;

import java.time.LocalDate;

public class CreateTaskDto {
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
    private String taskType; // MULTIMEDIA o INTERACTIVE
    private Long subjectId;
    private String subjectName;
    private String grade; // Grado específico (ej: "5° A", "3° B")
    private Long gradeId; // ID del grado escolar
    private Long studentId; // ID del estudiante asignado
    private Double maxGrade;
    
    // Para tareas multimedia
    private String allowedFormats; // JSON array como string: ["jpg", "png", "pdf"]
    private Integer maxFiles;
    private Integer maxSizeMb;
    
    // Para tareas interactivas
    private String activityConfig; // JSON config para quizzes/actividades
    private Integer maxScore;
    
    // Constructors
    public CreateTaskDto() {}
    
    public CreateTaskDto(String title, String description, LocalDate dueDate, String priority,
                        String taskType, Long subjectId, String subjectName, String grade) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.taskType = taskType;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.grade = grade;
    }
    
    // Getters and Setters
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
    
    public Long getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
    
    public String getTaskType() {
        return taskType;
    }
    
    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }
    
    public String getSubjectName() {
        return subjectName;
    }
    
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public Double getMaxGrade() {
        return maxGrade;
    }
    
    public void setMaxGrade(Double maxGrade) {
        this.maxGrade = maxGrade;
    }
    
    public String getAllowedFormats() {
        return allowedFormats;
    }
    
    public void setAllowedFormats(String allowedFormats) {
        this.allowedFormats = allowedFormats;
    }
    
    public Integer getMaxFiles() {
        return maxFiles;
    }
    
    public void setMaxFiles(Integer maxFiles) {
        this.maxFiles = maxFiles;
    }
    
    public Integer getMaxSizeMb() {
        return maxSizeMb;
    }
    
    public void setMaxSizeMb(Integer maxSizeMb) {
        this.maxSizeMb = maxSizeMb;
    }
    
    public String getActivityConfig() {
        return activityConfig;
    }
    
    public void setActivityConfig(String activityConfig) {
        this.activityConfig = activityConfig;
    }
    
    public Integer getMaxScore() {
        return maxScore;
    }
    
    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }
    
    public Long getGradeId() {
        return gradeId;
    }
    
    public void setGradeId(Long gradeId) {
        this.gradeId = gradeId;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}