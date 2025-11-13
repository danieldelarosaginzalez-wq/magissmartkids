package com.altiusacademy.dto;

import java.time.LocalDateTime;
import java.util.List;

public class StudentParticipationReportDto {
    private String gradeName;
    private String subjectName;
    private Integer totalStudents;
    private Integer activeStudents;
    private Double participationRate;
    private Double averageGrade;
    private List<StudentParticipationDto> studentParticipations;
    private List<SubjectParticipationDto> subjectParticipations;
    
    // Constructors
    public StudentParticipationReportDto() {}
    
    public StudentParticipationReportDto(String gradeName, String subjectName) {
        this.gradeName = gradeName;
        this.subjectName = subjectName;
    }
    
    // Getters and Setters
    public String getGradeName() {
        return gradeName;
    }
    
    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }
    
    public String getSubjectName() {
        return subjectName;
    }
    
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
    
    public Integer getTotalStudents() {
        return totalStudents;
    }
    
    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }
    
    public Integer getActiveStudents() {
        return activeStudents;
    }
    
    public void setActiveStudents(Integer activeStudents) {
        this.activeStudents = activeStudents;
    }
    
    public Double getParticipationRate() {
        return participationRate;
    }
    
    public void setParticipationRate(Double participationRate) {
        this.participationRate = participationRate;
    }
    
    public Double getAverageGrade() {
        return averageGrade;
    }
    
    public void setAverageGrade(Double averageGrade) {
        this.averageGrade = averageGrade;
    }
    
    public List<StudentParticipationDto> getStudentParticipations() {
        return studentParticipations;
    }
    
    public void setStudentParticipations(List<StudentParticipationDto> studentParticipations) {
        this.studentParticipations = studentParticipations;
    }
    
    public List<SubjectParticipationDto> getSubjectParticipations() {
        return subjectParticipations;
    }
    
    public void setSubjectParticipations(List<SubjectParticipationDto> subjectParticipations) {
        this.subjectParticipations = subjectParticipations;
    }
    
    // Nested DTOs
    public static class StudentParticipationDto {
        private String studentName;
        private String studentEmail;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer interactiveActivities;
        private Integer completedActivities;
        private Double averageGrade;
        private Double participationRate;
        private LocalDateTime lastActivity;
        
        public StudentParticipationDto() {}
        
        public StudentParticipationDto(String studentName, String studentEmail) {
            this.studentName = studentName;
            this.studentEmail = studentEmail;
        }
        
        public String getStudentName() {
            return studentName;
        }
        
        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }
        
        public String getStudentEmail() {
            return studentEmail;
        }
        
        public void setStudentEmail(String studentEmail) {
            this.studentEmail = studentEmail;
        }
        
        public Integer getTotalTasks() {
            return totalTasks;
        }
        
        public void setTotalTasks(Integer totalTasks) {
            this.totalTasks = totalTasks;
        }
        
        public Integer getCompletedTasks() {
            return completedTasks;
        }
        
        public void setCompletedTasks(Integer completedTasks) {
            this.completedTasks = completedTasks;
        }
        
        public Integer getInteractiveActivities() {
            return interactiveActivities;
        }
        
        public void setInteractiveActivities(Integer interactiveActivities) {
            this.interactiveActivities = interactiveActivities;
        }
        
        public Integer getCompletedActivities() {
            return completedActivities;
        }
        
        public void setCompletedActivities(Integer completedActivities) {
            this.completedActivities = completedActivities;
        }
        
        public Double getAverageGrade() {
            return averageGrade;
        }
        
        public void setAverageGrade(Double averageGrade) {
            this.averageGrade = averageGrade;
        }
        
        public Double getParticipationRate() {
            return participationRate;
        }
        
        public void setParticipationRate(Double participationRate) {
            this.participationRate = participationRate;
        }
        
        public LocalDateTime getLastActivity() {
            return lastActivity;
        }
        
        public void setLastActivity(LocalDateTime lastActivity) {
            this.lastActivity = lastActivity;
        }
    }
    
    public static class SubjectParticipationDto {
        private String subjectName;
        private String teacherName;
        private Integer totalStudents;
        private Integer activeStudents;
        private Integer totalTasks;
        private Integer totalActivities;
        private Double averageGrade;
        private Double participationRate;
        
        public SubjectParticipationDto() {}
        
        public SubjectParticipationDto(String subjectName, String teacherName) {
            this.subjectName = subjectName;
            this.teacherName = teacherName;
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
        
        public Integer getTotalStudents() {
            return totalStudents;
        }
        
        public void setTotalStudents(Integer totalStudents) {
            this.totalStudents = totalStudents;
        }
        
        public Integer getActiveStudents() {
            return activeStudents;
        }
        
        public void setActiveStudents(Integer activeStudents) {
            this.activeStudents = activeStudents;
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
        
        public Double getAverageGrade() {
            return averageGrade;
        }
        
        public void setAverageGrade(Double averageGrade) {
            this.averageGrade = averageGrade;
        }
        
        public Double getParticipationRate() {
            return participationRate;
        }
        
        public void setParticipationRate(Double participationRate) {
            this.participationRate = participationRate;
        }
    }
}