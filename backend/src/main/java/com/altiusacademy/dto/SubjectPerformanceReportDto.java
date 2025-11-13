package com.altiusacademy.dto;

import java.util.List;

public class SubjectPerformanceReportDto {
    private String subjectName;
    private String gradeName;
    private String teacherName;
    private Integer totalStudents;
    private Integer activeStudents;
    private Integer totalTasks;
    private Integer completedTasks;
    private Double averageGrade;
    private Double completionRate;
    private List<StudentPerformanceDto> studentPerformances;
    private List<TaskPerformanceDto> taskPerformances;
    
    // Constructors
    public SubjectPerformanceReportDto() {}
    
    public SubjectPerformanceReportDto(String subjectName, String gradeName, String teacherName) {
        this.subjectName = subjectName;
        this.gradeName = gradeName;
        this.teacherName = teacherName;
    }
    
    // Getters and Setters
    public String getSubjectName() {
        return subjectName;
    }
    
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
    
    public String getGradeName() {
        return gradeName;
    }
    
    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
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
    
    public Integer getCompletedTasks() {
        return completedTasks;
    }
    
    public void setCompletedTasks(Integer completedTasks) {
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
    
    public List<StudentPerformanceDto> getStudentPerformances() {
        return studentPerformances;
    }
    
    public void setStudentPerformances(List<StudentPerformanceDto> studentPerformances) {
        this.studentPerformances = studentPerformances;
    }
    
    public List<TaskPerformanceDto> getTaskPerformances() {
        return taskPerformances;
    }
    
    public void setTaskPerformances(List<TaskPerformanceDto> taskPerformances) {
        this.taskPerformances = taskPerformances;
    }
    
    // Nested DTOs
    public static class StudentPerformanceDto {
        private String studentName;
        private String studentEmail;
        private Integer completedTasks;
        private Integer totalTasks;
        private Double averageGrade;
        private Double completionRate;
        
        // Constructors, getters and setters
        public StudentPerformanceDto() {}
        
        public StudentPerformanceDto(String studentName, String studentEmail) {
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
        
        public Integer getCompletedTasks() {
            return completedTasks;
        }
        
        public void setCompletedTasks(Integer completedTasks) {
            this.completedTasks = completedTasks;
        }
        
        public Integer getTotalTasks() {
            return totalTasks;
        }
        
        public void setTotalTasks(Integer totalTasks) {
            this.totalTasks = totalTasks;
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
    }
    
    public static class TaskPerformanceDto {
        private String taskTitle;
        private String taskType;
        private Integer totalSubmissions;
        private Integer completedSubmissions;
        private Double averageGrade;
        private Double completionRate;
        
        // Constructors, getters and setters
        public TaskPerformanceDto() {}
        
        public TaskPerformanceDto(String taskTitle, String taskType) {
            this.taskTitle = taskTitle;
            this.taskType = taskType;
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
        
        public Integer getTotalSubmissions() {
            return totalSubmissions;
        }
        
        public void setTotalSubmissions(Integer totalSubmissions) {
            this.totalSubmissions = totalSubmissions;
        }
        
        public Integer getCompletedSubmissions() {
            return completedSubmissions;
        }
        
        public void setCompletedSubmissions(Integer completedSubmissions) {
            this.completedSubmissions = completedSubmissions;
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
    }
}