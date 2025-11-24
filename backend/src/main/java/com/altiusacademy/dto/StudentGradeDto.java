package com.altiusacademy.dto;

import java.time.LocalDate;

public class StudentGradeDto {
    
    private String id;
    private String subject;
    private String taskName;
    private Double grade;
    private Double maxGrade;
    private LocalDate date;
    private String teacherName;
    private LocalDate dueDate;
    private String priority;
    private Integer points;
    private String taskType;
    
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
    
    public StudentGradeDto(String id, String subject, String taskName, Double grade, Double maxGrade, 
                          LocalDate date, String teacherName, LocalDate dueDate, String priority, 
                          Integer points, String taskType) {
        this.id = id;
        this.subject = subject;
        this.taskName = taskName;
        this.grade = grade;
        this.maxGrade = maxGrade;
        this.date = date;
        this.teacherName = teacherName;
        this.dueDate = dueDate;
        this.priority = priority;
        this.points = points;
        this.taskType = taskType;
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
    
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
}