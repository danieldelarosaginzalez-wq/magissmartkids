package com.altiusacademy.dto;

public class ParentSubjectDto {
    private String name;
    private double grade;
    
    public ParentSubjectDto() {}
    
    public ParentSubjectDto(String name, double grade) {
        this.name = name;
        this.grade = grade;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public double getGrade() {
        return grade;
    }
    
    public void setGrade(double grade) {
        this.grade = grade;
    }
}