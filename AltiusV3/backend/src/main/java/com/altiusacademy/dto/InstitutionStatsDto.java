package com.altiusacademy.dto;

import java.util.Map;

public class InstitutionStatsDto {
    private Long totalTeachers;
    private Long totalStudents;
    private Long totalSubjects;
    private Long totalGrades;
    private Long activeTasks;
    private Long completedTasks;
    private Double averagePerformance;
    private Map<String, Long> gradeDistribution;
    private Map<String, Double> subjectAverages;
    private Long totalActivities;
    private Long pendingSubmissions;

    // Constructors
    public InstitutionStatsDto() {}

    public InstitutionStatsDto(Long totalTeachers, Long totalStudents, Long totalSubjects, 
                              Long totalGrades, Long activeTasks, Long completedTasks,
                              Double averagePerformance, Map<String, Long> gradeDistribution,
                              Map<String, Double> subjectAverages, Long totalActivities,
                              Long pendingSubmissions) {
        this.totalTeachers = totalTeachers;
        this.totalStudents = totalStudents;
        this.totalSubjects = totalSubjects;
        this.totalGrades = totalGrades;
        this.activeTasks = activeTasks;
        this.completedTasks = completedTasks;
        this.averagePerformance = averagePerformance;
        this.gradeDistribution = gradeDistribution;
        this.subjectAverages = subjectAverages;
        this.totalActivities = totalActivities;
        this.pendingSubmissions = pendingSubmissions;
    }

    // Getters and Setters
    public Long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(Long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(Long totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public Long getTotalGrades() {
        return totalGrades;
    }

    public void setTotalGrades(Long totalGrades) {
        this.totalGrades = totalGrades;
    }

    public Long getActiveTasks() {
        return activeTasks;
    }

    public void setActiveTasks(Long activeTasks) {
        this.activeTasks = activeTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Double getAveragePerformance() {
        return averagePerformance;
    }

    public void setAveragePerformance(Double averagePerformance) {
        this.averagePerformance = averagePerformance;
    }

    public Map<String, Long> getGradeDistribution() {
        return gradeDistribution;
    }

    public void setGradeDistribution(Map<String, Long> gradeDistribution) {
        this.gradeDistribution = gradeDistribution;
    }

    public Map<String, Double> getSubjectAverages() {
        return subjectAverages;
    }

    public void setSubjectAverages(Map<String, Double> subjectAverages) {
        this.subjectAverages = subjectAverages;
    }

    public Long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(Long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Long getPendingSubmissions() {
        return pendingSubmissions;
    }

    public void setPendingSubmissions(Long pendingSubmissions) {
        this.pendingSubmissions = pendingSubmissions;
    }
}