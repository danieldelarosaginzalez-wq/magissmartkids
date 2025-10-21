package com.altiusacademy.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para tareas tradicionales (MySQL)
 */
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
    private String status;
    
    // Información de materia y profesor
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private Long teacherId;
    private String teacherName;
    
    // Información del estudiante (para profesores)
    private Long studentId;
    private String studentName;
    
    // Entrega
    private String submissionText;
    private String submissionFileUrl;
    private LocalDateTime submittedAt;
    
    // Calificación
    private Double grade;
    private Double maxGrade;
    private String feedback;
    private LocalDateTime gradedAt;
    
    // Auditoría
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public TaskDto() {}
    
    public TaskDto(String title, String description, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }
    
    // Builder pattern
    public static TaskDtoBuilder builder() {
        return new TaskDtoBuilder();
    }
    
    public static class TaskDtoBuilder {
        private Long id;
        private String title;
        private String description;
        private LocalDate dueDate;
        private String priority;
        private String status;
        private Long subjectId;
        private String subjectName;
        private String subjectColor;
        private Long teacherId;
        private String teacherName;
        private Long studentId;
        private String studentName;
        private String submissionText;
        private String submissionFileUrl;
        private LocalDateTime submittedAt;
        private Double score;
        private Double maxScore;
        private String feedback;
        private LocalDateTime gradedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public TaskDtoBuilder id(Long id) { this.id = id; return this; }
        public TaskDtoBuilder title(String title) { this.title = title; return this; }
        public TaskDtoBuilder description(String description) { this.description = description; return this; }
        public TaskDtoBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public TaskDtoBuilder priority(String priority) { this.priority = priority; return this; }
        public TaskDtoBuilder status(String status) { this.status = status; return this; }
        public TaskDtoBuilder subjectId(Long subjectId) { this.subjectId = subjectId; return this; }
        public TaskDtoBuilder subjectName(String subjectName) { this.subjectName = subjectName; return this; }
        public TaskDtoBuilder subjectColor(String subjectColor) { this.subjectColor = subjectColor; return this; }
        public TaskDtoBuilder teacherId(Long teacherId) { this.teacherId = teacherId; return this; }
        public TaskDtoBuilder teacherName(String teacherName) { this.teacherName = teacherName; return this; }
        public TaskDtoBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public TaskDtoBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public TaskDtoBuilder submissionText(String submissionText) { this.submissionText = submissionText; return this; }
        public TaskDtoBuilder submissionFileUrl(String submissionFileUrl) { this.submissionFileUrl = submissionFileUrl; return this; }
        public TaskDtoBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public TaskDtoBuilder score(Double score) { this.score = score; return this; }
        public TaskDtoBuilder maxScore(Double maxScore) { this.maxScore = maxScore; return this; }
        public TaskDtoBuilder feedback(String feedback) { this.feedback = feedback; return this; }
        public TaskDtoBuilder gradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; return this; }
        public TaskDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TaskDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        
        public TaskDto build() {
            TaskDto dto = new TaskDto();
            dto.setId(id);
            dto.setTitle(title);
            dto.setDescription(description);
            dto.setDueDate(dueDate);
            dto.setPriority(priority);
            dto.setStatus(status);
            dto.setSubjectId(subjectId);
            dto.setSubjectName(subjectName);
            dto.setSubjectColor(subjectColor);
            dto.setTeacherId(teacherId);
            dto.setTeacherName(teacherName);
            dto.setStudentId(studentId);
            dto.setStudentName(studentName);
            dto.setSubmissionText(submissionText);
            dto.setSubmissionFileUrl(submissionFileUrl);
            dto.setSubmittedAt(submittedAt);
            dto.setGrade(score);
            dto.setMaxGrade(maxScore);
            dto.setFeedback(feedback);
            dto.setGradedAt(gradedAt);
            dto.setCreatedAt(createdAt);
            dto.setUpdatedAt(updatedAt);
            return dto;
        }
    }
    
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
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    
    public String getSubjectColor() { return subjectColor; }
    public void setSubjectColor(String subjectColor) { this.subjectColor = subjectColor; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }
    
    public String getSubmissionFileUrl() { return submissionFileUrl; }
    public void setSubmissionFileUrl(String submissionFileUrl) { this.submissionFileUrl = submissionFileUrl; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }
    
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
}