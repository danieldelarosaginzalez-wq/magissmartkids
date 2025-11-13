package com.altiusacademy.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para intentos de actividades interactivas
 */
public class ActivityAttemptDto {
    private String id;
    private String activityId;
    private String activityTitle;
    private Long studentId;
    private String studentName;
    private Integer attemptNumber;
    private String status;
    
    // Respuestas
    private List<StudentAnswerDto> answers;
    
    // Resultados
    private Double score;
    private Double maxScore;
    private Double percentage;
    private Boolean passed;
    
    // Tiempo
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer timeSpentMinutes;
    
    // Feedback
    private String feedback;
    private AnalyticsDto analytics;
    
    // Clase interna para analytics
    public static class AnalyticsDto {
        private List<String> struggledQuestions;
        private List<String> masteredQuestions;
        private Double averageTimePerQuestion;
        
        // Getters and Setters
        public List<String> getStruggledQuestions() { return struggledQuestions; }
        public void setStruggledQuestions(List<String> struggledQuestions) { this.struggledQuestions = struggledQuestions; }
        
        public List<String> getMasteredQuestions() { return masteredQuestions; }
        public void setMasteredQuestions(List<String> masteredQuestions) { this.masteredQuestions = masteredQuestions; }
        
        public Double getAverageTimePerQuestion() { return averageTimePerQuestion; }
        public void setAverageTimePerQuestion(Double averageTimePerQuestion) { this.averageTimePerQuestion = averageTimePerQuestion; }
    }
    
    // Constructors
    public ActivityAttemptDto() {}
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getActivityId() { return activityId; }
    public void setActivityId(String activityId) { this.activityId = activityId; }
    
    public String getActivityTitle() { return activityTitle; }
    public void setActivityTitle(String activityTitle) { this.activityTitle = activityTitle; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public Integer getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(Integer attemptNumber) { this.attemptNumber = attemptNumber; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<StudentAnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<StudentAnswerDto> answers) { this.answers = answers; }
    
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    
    public Double getMaxScore() { return maxScore; }
    public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getTimeSpentMinutes() { return timeSpentMinutes; }
    public void setTimeSpentMinutes(Integer timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public AnalyticsDto getAnalytics() { return analytics; }
    public void setAnalytics(AnalyticsDto analytics) { this.analytics = analytics; }
}