package com.altiusacademy.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TeacherActivityReportDto {
    private String teacherName;
    private String teacherEmail;
    private List<String> subjects;
    private List<String> grades;
    private Integer totalTasks;
    private Integer totalActivities;
    private Integer totalStudents;
    private Double averageGradeGiven;
    private LocalDateTime lastActivity;
    private List<TaskActivityDto> recentTasks;
    private List<GradingActivityDto> recentGrading;
    
    // Constructors
    public TeacherActivityReportDto() {}
    
    public TeacherActivityReportDto(String teacherName, String teacherEmail) {
        this.teacherName = teacherName;
        this.teacherEmail = teacherEmail;
    }
    
    // Getters and Setters
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
    
    public List<String> getSubjects() {
        return subjects;
    }
    
    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }
    
    public List<String> getGrades() {
        return grades;
    }
    
    public void setGrades(List<String> grades) {
        this.grades = grades;
    }
    
    public Integer getTotalTasks() {
        return totalTasks;
    }
    
    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }
    
    public Integer getTotalActivities() {
        return totalActivities;
    }
    
    public void setTotalActivities(Integer totalActivities) {
        this.totalActivities = totalActivities;
    }
    
    public Integer getTotalStudents() {
        return totalStudents;
    }
    
    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }
    
    public Double getAverageGradeGiven() {
        return averageGradeGiven;
    }
    
    public void setAverageGradeGiven(Double averageGradeGiven) {
        this.averageGradeGiven = averageGradeGiven;
    }
    
    public LocalDateTime getLastActivity() {
        return lastActivity;
    }
    
    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
    
    public List<TaskActivityDto> getRecentTasks() {
        return recentTasks;
    }
    
    public void setRecentTasks(List<TaskActivityDto> recentTasks) {
        this.recentTasks = recentTasks;
    }
    
    public List<GradingActivityDto> getRecentGrading() {
        return recentGrading;
    }
    
    public void setRecentGrading(List<GradingActivityDto> recentGrading) {
        this.recentGrading = recentGrading;
    }
    
    // Nested DTOs
    public static class TaskActivityDto {
        private String taskTitle;
        private String taskType;
        private String subjectName;
        private LocalDateTime createdAt;
        private Integer submissions;
        
        public TaskActivityDto() {}
        
        public TaskActivityDto(String taskTitle, String taskType, String subjectName, LocalDateTime createdAt) {
            this.taskTitle = taskTitle;
            this.taskType = taskType;
            this.subjectName = subjectName;
            this.createdAt = createdAt;
        }
        
        public String getTaskTitle() {
            return taskTitle;
        }
        
        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }
        
        public String getTaskType() {
            return taskType;
        }
        
        public void setTaskType(String taskType) {
            this.taskType = taskType;
        }
        
        public String getSubjectName() {
            return subjectName;
        }
        
        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public Integer getSubmissions() {
            return submissions;
        }
        
        public void setSubmissions(Integer submissions) {
            this.submissions = submissions;
        }
    }
    
    public static class GradingActivityDto {
        private String studentName;
        private String taskTitle;
        private Double grade;
        private LocalDateTime gradedAt;
        
        public GradingActivityDto() {}
        
        public GradingActivityDto(String studentName, String taskTitle, Double grade, LocalDateTime gradedAt) {
            this.studentName = studentName;
            this.taskTitle = taskTitle;
            this.grade = grade;
            this.gradedAt = gradedAt;
        }
        
        public String getStudentName() {
            return studentName;
        }
        
        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }
        
        public String getTaskTitle() {
            return taskTitle;
        }
        
        public void setTaskTitle(String taskTitle) {
            this.taskTitle = taskTitle;
        }
        
        public Double getGrade() {
            return grade;
        }
        
        public void setGrade(Double grade) {
            this.grade = grade;
        }
        
        public LocalDateTime getGradedAt() {
            return gradedAt;
        }
        
        public void setGradedAt(LocalDateTime gradedAt) {
            this.gradedAt = gradedAt;
        }
    }
}