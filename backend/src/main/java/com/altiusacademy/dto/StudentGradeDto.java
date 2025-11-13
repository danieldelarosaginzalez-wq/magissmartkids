package com.altiusacademy.dto;

import java.time.LocalDate;

public class StudentGradeDto {
    
    private String id;
    private String subject;
    private String taskName;
    private Double grade;
    private Double maxGrade;
    private LocalDate date;
    
    // Constructors
    public StudentGradeDto() {}
    
    public StudentGradeDto(String id, String subject, String taskName, Double grade, Double maxGrade, LocalDate date) {
        this.id = id;
        this.subject = subject;
        this.taskName = taskName;
        this.grade = grade;
        this.maxGrade = maxGrade;
        this.date = date;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }
    
    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }
    
    public Double getMaxGrade() { return maxGrade; }
    public void setMaxGrade(Double maxGrade) { this.maxGrade = maxGrade; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}