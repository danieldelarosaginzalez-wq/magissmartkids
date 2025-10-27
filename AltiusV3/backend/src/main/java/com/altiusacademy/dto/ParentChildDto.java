package com.altiusacademy.dto;

import java.util.List;

public class ParentChildDto {
    private String id;
    private String firstName;
    private String lastName;
    private String grade;
    private double averageGrade;
    private List<ParentSubjectDto> subjects;
    
    public ParentChildDto() {}
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public double getAverageGrade() {
        return averageGrade;
    }
    
    public void setAverageGrade(double averageGrade) {
        this.averageGrade = averageGrade;
    }
    
    public List<ParentSubjectDto> getSubjects() {
        return subjects;
    }
    
    public void setSubjects(List<ParentSubjectDto> subjects) {
        this.subjects = subjects;
    }
}