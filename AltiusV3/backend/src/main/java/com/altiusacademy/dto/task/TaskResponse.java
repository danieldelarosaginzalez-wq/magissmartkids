package com.altiusacademy.dto.task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
    private String status;
    private String taskType;
    
    private Long subjectId;
    private String subjectName;
    private Long teacherId;
    private String teacherName;
    private Long studentId;
    private String studentName;
    private String grade;
    
    private String submissionText;
    private String submissionFileUrl;
    private LocalDateTime submittedAt;
    
    private Double score;
    private Double maxGrade;
    private String feedback;
    private LocalDateTime gradedAt;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Configuración
    private String allowedFormats;
    private Integer maxFiles;
    private Integer maxSizeMb;
    private String activityConfig;
    private Integer maxScore;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }
    
    public String getSubmissionFileUrl() { return submissionFileUrl; }
    public void setSubmissionFileUrl(String submissionFileUrl) { this.submissionFileUrl = submissionFileUrl; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    
    public Double getMaxGrade() { return maxGrade; }
    public void setMaxGrade(Double maxGrade) { this.maxGrade = maxGrade; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getAllowedFormats() { return allowedFormats; }
    public void setAllowedFormats(String allowedFormats) { this.allowedFormats = allowedFormats; }
    
    public Integer getMaxFiles() { return maxFiles; }
    public void setMaxFiles(Integer maxFiles) { this.maxFiles = maxFiles; }
    
    public Integer getMaxSizeMb() { return maxSizeMb; }
    public void setMaxSizeMb(Integer maxSizeMb) { this.maxSizeMb = maxSizeMb; }
    
    public String getActivityConfig() { return activityConfig; }
    public void setActivityConfig(String activityConfig) { this.activityConfig = activityConfig; }
    
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
}
