package com.altiusacademy.dto;

public class StudentSubjectDto {
    private String id;
    private String name;
    private int progress;
    private double grade;
    private String color;

    // Constructors
    public StudentSubjectDto() {}

    public StudentSubjectDto(String id, String name, int progress, double grade, String color) {
        this.id = id;
        this.name = name;
        this.progress = progress;
        this.grade = grade;
        this.color = color;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}