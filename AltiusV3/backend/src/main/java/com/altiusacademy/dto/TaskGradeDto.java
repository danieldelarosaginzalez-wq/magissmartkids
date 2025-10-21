package com.altiusacademy.dto;

/**
 * DTO para calificación de tareas
 */
public class TaskGradeDto {
    private Double grade;
    private Double maxGrade;
    private String feedback;
    
    // Constructors
    public TaskGradeDto() {}
    
    public TaskGradeDto(Double grade, Double maxGrade, String feedback) {
        this.grade = grade;
        this.maxGrade = maxGrade;
        this.feedback = feedback;
    }
    
    // Getters and Setters
    public Double getGrade() {
        return grade;
    }
    
    public void setGrade(Double grade) {
        this.grade = grade;
    }
    
    public Double getMaxGrade() {
        return maxGrade;
    }
    
    public void setMaxGrade(Double maxGrade) {
        this.maxGrade = maxGrade;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}