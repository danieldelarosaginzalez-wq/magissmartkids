package com.altiusacademy.dto;

public class StudentSubjectDto {
    private String id;
    private String name;
    private int progress;
    private double grade;
    private String color;
    private int totalTasks;
    private int completedTasks;
    private String teacherName;
    private String teacherEmail;

    // Constructors
    public StudentSubjectDto() {}

    public StudentSubjectDto(String id, String name, int progress, double grade, String color) {
        this.id = id;
        this.name = name;
        this.progress = progress;
        this.grade = grade;
        this.color = color;
    }

    public StudentSubjectDto(String id, String name, int progress, double grade, String color, 
                            int totalTasks, int completedTasks, String teacherName, String teacherEmail) {
        this.id = id;
        this.name = name;
        this.progress = progress;
        this.grade = grade;
        this.color = color;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.teacherName = teacherName;
        this.teacherEmail = teacherEmail;
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

    public int getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(int totalTasks) {
        this.totalTasks = totalTasks;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(int completedTasks) {
        this.completedTasks = completedTasks;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getTeacherEmail() {
        return teacherEmail;
    }

    public void setTeacherEmail(String teacherEmail) {
        this.teacherEmail = teacherEmail;
    }
}