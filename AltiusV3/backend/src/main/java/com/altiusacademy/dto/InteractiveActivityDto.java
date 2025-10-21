package com.altiusacademy.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO para actividades interactivas (MongoDB)
 */
public class InteractiveActivityDto {
    private String id;
    private String title;
    private String description;
    private String activityType;
    private String difficultyLevel;
    private Integer estimatedDurationMinutes;
    
    // Referencias a MySQL
    private Long subjectId;
    private String subjectName;
    private String subjectColor;
    private Long teacherId;
    private String teacherName;
    
    // Contenido
    private ActivityContentDto content;
    private ActivityConfigDto config;
    private List<QuestionDto> questions;
    private List<MultimediaResourceDto> multimedia;
    private ScoringRulesDto scoringRules;
    
    // Metadatos
    private Boolean isActive;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Información del progreso del estudiante (si aplica)
    private Integer attemptCount;
    private Double bestScore;
    private Boolean completed;
    
    // Clases internas para DTOs
    public static class ActivityContentDto {
        private String instructions;
        private String backgroundInfo;
        private Map<String, Object> customFields;
        
        // Getters and Setters
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        
        public String getBackgroundInfo() { return backgroundInfo; }
        public void setBackgroundInfo(String backgroundInfo) { this.backgroundInfo = backgroundInfo; }
        
        public Map<String, Object> getCustomFields() { return customFields; }
        public void setCustomFields(Map<String, Object> customFields) { this.customFields = customFields; }
    }
    
    public static class ActivityConfigDto {
        private Integer timeLimit;
        private Integer maxAttempts;
        private Boolean shuffleQuestions;
        private Boolean showFeedback;
        private Boolean allowReview;
        
        // Getters and Setters
        public Integer getTimeLimit() { return timeLimit; }
        public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }
        
        public Integer getMaxAttempts() { return maxAttempts; }
        public void setMaxAttempts(Integer maxAttempts) { this.maxAttempts = maxAttempts; }
        
        public Boolean getShuffleQuestions() { return shuffleQuestions; }
        public void setShuffleQuestions(Boolean shuffleQuestions) { this.shuffleQuestions = shuffleQuestions; }
        
        public Boolean getShowFeedback() { return showFeedback; }
        public void setShowFeedback(Boolean showFeedback) { this.showFeedback = showFeedback; }
        
        public Boolean getAllowReview() { return allowReview; }
        public void setAllowReview(Boolean allowReview) { this.allowReview = allowReview; }
    }
    
    public static class QuestionDto {
        private String id;
        private String text;
        private String type;
        private List<OptionDto> options;
        private Object correctAnswer;
        private String explanation;
        private Integer points;
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public List<OptionDto> getOptions() { return options; }
        public void setOptions(List<OptionDto> options) { this.options = options; }
        
        public Object getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(Object correctAnswer) { this.correctAnswer = correctAnswer; }
        
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
    }
    
    public static class OptionDto {
        private String id;
        private String text;
        private String imageUrl;
        private Boolean isCorrect;
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    }
    
    public static class MultimediaResourceDto {
        private String id;
        private String type;
        private String url;
        private String title;
        private String description;
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class ScoringRulesDto {
        private Integer totalPoints;
        private Double passingScore;
        private Boolean penalizeWrongAnswers;
        
        // Getters and Setters
        public Integer getTotalPoints() { return totalPoints; }
        public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
        
        public Double getPassingScore() { return passingScore; }
        public void setPassingScore(Double passingScore) { this.passingScore = passingScore; }
        
        public Boolean getPenalizeWrongAnswers() { return penalizeWrongAnswers; }
        public void setPenalizeWrongAnswers(Boolean penalizeWrongAnswers) { this.penalizeWrongAnswers = penalizeWrongAnswers; }
    }
    
    // Constructors
    public InteractiveActivityDto() {}
    
    // Getters and Setters principales
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    
    public String getSubjectColor() { return subjectColor; }
    public void setSubjectColor(String subjectColor) { this.subjectColor = subjectColor; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    
    public ActivityContentDto getContent() { return content; }
    public void setContent(ActivityContentDto content) { this.content = content; }
    
    public ActivityConfigDto getConfig() { return config; }
    public void setConfig(ActivityConfigDto config) { this.config = config; }
    
    public List<QuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }
    
    public List<MultimediaResourceDto> getMultimedia() { return multimedia; }
    public void setMultimedia(List<MultimediaResourceDto> multimedia) { this.multimedia = multimedia; }
    
    public ScoringRulesDto getScoringRules() { return scoringRules; }
    public void setScoringRules(ScoringRulesDto scoringRules) { this.scoringRules = scoringRules; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
    
    public Double getBestScore() { return bestScore; }
    public void setBestScore(Double bestScore) { this.bestScore = bestScore; }
    
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}