package com.altiusacademy.dto;

public class SubjectStatsDto {
    private Long subjectId;
    private String subjectName;
    private String teacherName;
    private Long totalStudents;
    private Long totalTasks;
    private Long completedTasks;
    private Double averageGrade;
    private Double completionRate;
    private Long totalActivities;
    private String gradeName;
    private Long gradeId;

    // Constructors
    public SubjectStatsDto() {}

    public SubjectStatsDto(Long subjectId, String subjectName, String teacherName,
                          Long totalStudents, Long totalTasks, Long completedTasks,
                          Double averageGrade, Double completionRate, Long totalActivities,
                          String gradeName, Long gradeId) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.teacherName = teacherName;
        this.totalStudents = totalStudents;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.averageGrade = averageGrade;
        this.completionRate = completionRate;
        this.totalActivities = totalActivities;
        this.gradeName = gradeName;
        this.gradeId = gradeId;
    }

    // Getters and Setters
    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Double getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(Double averageGrade) {
        this.averageGrade = averageGrade;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(Long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public Long getGradeId() {
        return gradeId;
    }

    public void setGradeId(Long gradeId) {
        this.gradeId = gradeId;
    }
}