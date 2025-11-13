package com.altiusacademy.model.document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Modelo MongoDB para intentos de actividades interactivas
 * Almacena respuestas, progreso y resultados de estudiantes
 */
@Document(collection = "activity_attempts")
public class ActivityAttempt {
    
    @Id
    private String id;
    
    @Field("activity_id")
    private String activityId; // Referencia a InteractiveActivity
    
    @Field("student_id")
    private Long studentId; // Referencia a MySQL User
    
    @Field("attempt_number")
    private Integer attemptNumber = 1;
    
    @Field("status")
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
    
    // Respuestas del estudiante
    @Field("answers")
    private List<StudentAnswer> answers;
    
    // Resultados
    @Field("score")
    private Double score;
    
    @Field("max_score")
    private Double maxScore;
    
    @Field("percentage")
    private Double percentage;
    
    @Field("passed")
    private Boolean passed;
    
    // Tiempo
    @Field("started_at")
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Field("completed_at")
    private LocalDateTime completedAt;
    
    @Field("time_spent_minutes")
    private Integer timeSpentMinutes;
    
    // Feedback y análisis
    @Field("feedback")
    private String feedback;
    
    @Field("detailed_results")
    private Map<String, Object> detailedResults;
    
    @Field("analytics")
    private AttemptAnalytics analytics;
    
    // Enums
    public enum AttemptStatus {
        IN_PROGRESS, COMPLETED, ABANDONED, EXPIRED
    }
    
    // Clases internas
    public static class StudentAnswer {
        private String questionId;
        private Object answer;
        private Boolean isCorrect;
        private Integer pointsEarned;
        private Long timeSpentSeconds;
        private Integer attempts;
        
        // Getters and Setters
        public String getQuestionId() { return questionId; }
        public void setQuestionId(String questionId) { this.questionId = questionId; }
        
        public Object getAnswer() { return answer; }
        public void setAnswer(Object answer) { this.answer = answer; }
        
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        
        public Integer getPointsEarned() { return pointsEarned; }
        public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
        
        public Long getTimeSpentSeconds() { return timeSpentSeconds; }
        public void setTimeSpentSeconds(Long timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
        
        public Integer getAttempts() { return attempts; }
        public void setAttempts(Integer attempts) { this.attempts = attempts; }
    }
    
    public static class AttemptAnalytics {
        private Map<String, Integer> questionTypePerformance;
        private List<String> struggledQuestions;
        private List<String> masteredQuestions;
        private Double averageTimePerQuestion;
        private Map<String, Object> learningInsights;
        
        // Getters and Setters
        public Map<String, Integer> getQuestionTypePerformance() { return questionTypePerformance; }
        public void setQuestionTypePerformance(Map<String, Integer> questionTypePerformance) { this.questionTypePerformance = questionTypePerformance; }
        
        public List<String> getStruggledQuestions() { return struggledQuestions; }
        public void setStruggledQuestions(List<String> struggledQuestions) { this.struggledQuestions = struggledQuestions; }
        
        public List<String> getMasteredQuestions() { return masteredQuestions; }
        public void setMasteredQuestions(List<String> masteredQuestions) { this.masteredQuestions = masteredQuestions; }
        
        public Double getAverageTimePerQuestion() { return averageTimePerQuestion; }
        public void setAverageTimePerQuestion(Double averageTimePerQuestion) { this.averageTimePerQuestion = averageTimePerQuestion; }
        
        public Map<String, Object> getLearningInsights() { return learningInsights; }
        public void setLearningInsights(Map<String, Object> learningInsights) { this.learningInsights = learningInsights; }
    }
    
    // Constructors
    public ActivityAttempt() {}
    
    public ActivityAttempt(String activityId, Long studentId) {
        this.activityId = activityId;
        this.studentId = studentId;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getActivityId() { return activityId; }
    public void setActivityId(String activityId) { this.activityId = activityId; }
    
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    
    public Integer getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(Integer attemptNumber) { this.attemptNumber = attemptNumber; }
    
    public AttemptStatus getStatus() { return status; }
    public void setStatus(AttemptStatus status) { this.status = status; }
    
    public List<StudentAnswer> getAnswers() { return answers; }
    public void setAnswers(List<StudentAnswer> answers) { this.answers = answers; }
    
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
    
    public Map<String, Object> getDetailedResults() { return detailedResults; }
    public void setDetailedResults(Map<String, Object> detailedResults) { this.detailedResults = detailedResults; }
    
    public AttemptAnalytics getAnalytics() { return analytics; }
    public void setAnalytics(AttemptAnalytics analytics) { this.analytics = analytics; }
}