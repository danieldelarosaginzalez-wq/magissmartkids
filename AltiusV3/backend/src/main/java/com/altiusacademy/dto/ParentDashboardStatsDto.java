package com.altiusacademy.dto;

public class ParentDashboardStatsDto {
    private int totalChildren;
    private int totalSubjects;
    private double averageGrade;
    private int upcomingTasks;
    
    public ParentDashboardStatsDto() {}
    
    public ParentDashboardStatsDto(int totalChildren, int totalSubjects, double averageGrade, int upcomingTasks) {
        this.totalChildren = totalChildren;
        this.totalSubjects = totalSubjects;
        this.averageGrade = averageGrade;
        this.upcomingTasks = upcomingTasks;
    }
    
    // Getters and Setters
    public int getTotalChildren() {
        return totalChildren;
    }
    
    public void setTotalChildren(int totalChildren) {
        this.totalChildren = totalChildren;
    }
    
    public int getTotalSubjects() {
        return totalSubjects;
    }
    
    public void setTotalSubjects(int totalSubjects) {
        this.totalSubjects = totalSubjects;
    }
    
    public double getAverageGrade() {
        return averageGrade;
    }
    
    public void setAverageGrade(double averageGrade) {
        this.averageGrade = averageGrade;
    }
    
    public int getUpcomingTasks() {
        return upcomingTasks;
    }
    
    public void setUpcomingTasks(int upcomingTasks) {
        this.upcomingTasks = upcomingTasks;
    }
}