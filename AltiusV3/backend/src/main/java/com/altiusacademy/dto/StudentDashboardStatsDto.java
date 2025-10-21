package com.altiusacademy.dto;

public class StudentDashboardStatsDto {
    private int totalSubjects;
    private int pendingTasks;
    private int completedTasks;
    private double averageGrade;
    private String studyHours;
    private int completedActivities;

    // Constructors
    public StudentDashboardStatsDto() {}

    public StudentDashboardStatsDto(int totalSubjects, int pendingTasks, int completedTasks, 
                                   double averageGrade, String studyHours, int completedActivities) {
        this.totalSubjects = totalSubjects;
        this.pendingTasks = pendingTasks;
        this.completedTasks = completedTasks;
        this.averageGrade = averageGrade;
        this.studyHours = studyHours;
        this.completedActivities = completedActivities;
    }

    // Getters and Setters
    public int getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(int totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public int getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(int pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public int getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(int completedTasks) {
        this.completedTasks = completedTasks;
    }

    public double getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(double averageGrade) {
        this.averageGrade = averageGrade;
    }

    public String getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(String studyHours) {
        this.studyHours = studyHours;
    }

    public int getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(int completedActivities) {
        this.completedActivities = completedActivities;
    }
}