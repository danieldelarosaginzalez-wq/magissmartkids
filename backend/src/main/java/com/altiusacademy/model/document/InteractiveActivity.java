package com.altiusacademy.model.document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Modelo MongoDB para actividades interactivas
 * Datos flexibles: contenido multimedia, configuraciones dinámicas, preguntas complejas
 */
@Document(collection = "interactive_activities")
public class InteractiveActivity {
    
    @Id
    private String id;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("activity_type")
    private ActivityType activityType;
    
    @Field("subject_id")
    private Long subjectId; // Referencia a MySQL Subject
    
    @Field("teacher_id")
    private Long teacherId; // Referencia a MySQL User
    
    @Field("institution_id")
    private Long institutionId; // Referencia a MySQL Institution
    
    @Field("school_grade_id")
    private Long schoolGradeId; // Referencia a MySQL SchoolGrade
    
    // Contenido flexible
    @Field("content")
    private ActivityContent content;
    
    @Field("config")
    private ActivityConfig config;
    
    @Field("questions")
    private List<Question> questions;
    
    @Field("multimedia")
    private List<MultimediaResource> multimedia;
    
    @Field("scoring_rules")
    private ScoringRules scoringRules;
    
    // Metadatos
    @Field("is_active")
    private Boolean isActive = true;
    
    @Field("difficulty_level")
    private DifficultyLevel difficultyLevel = DifficultyLevel.MEDIUM;
    
    @Field("estimated_duration_minutes")
    private Integer estimatedDurationMinutes;
    
    @Field("tags")
    private List<String> tags;
    
    // Auditoría
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum ActivityType {
        MULTIPLE_CHOICE,
        DRAG_DROP,
        MATCH_LINES,
        SHORT_ANSWER,
        VIDEO_INTERACTIVE,
        SIMULATION,
        QUIZ,
        PUZZLE
    }
    
    public enum DifficultyLevel {
        EASY, MEDIUM, HARD, EXPERT
    }
    
    // Clases internas para estructura flexible
    public static class ActivityContent {
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
    
    public static class ActivityConfig {
        private Integer timeLimit; // en minutos
        private Integer maxAttempts;
        private Boolean shuffleQuestions;
        private Boolean showFeedback;
        private Boolean allowReview;
        private Map<String, Object> customSettings;
        
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
        
        public Map<String, Object> getCustomSettings() { return customSettings; }
        public void setCustomSettings(Map<String, Object> customSettings) { this.customSettings = customSettings; }
    }
    
    public static class Question {
        private String id;
        private String text;
        private QuestionType type;
        private List<Option> options;
        private Object correctAnswer;
        private String explanation;
        private Integer points;
        private Map<String, Object> metadata;
        
        public enum QuestionType {
            SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT_INPUT, DRAG_DROP, MATCH
        }
        
        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        
        public QuestionType getType() { return type; }
        public void setType(QuestionType type) { this.type = type; }
        
        public List<Option> getOptions() { return options; }
        public void setOptions(List<Option> options) { this.options = options; }
        
        public Object getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(Object correctAnswer) { this.correctAnswer = correctAnswer; }
        
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
        
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }
    
    public static class Option {
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
    
    public static class MultimediaResource {
        private String id;
        private String type; // image, video, audio, document
        private String url;
        private String title;
        private String description;
        private Map<String, Object> metadata;
        
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
        
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }
    
    public static class ScoringRules {
        private Integer totalPoints;
        private Double passingScore;
        private Map<String, Integer> pointsPerQuestionType;
        private Boolean penalizeWrongAnswers;
        
        // Getters and Setters
        public Integer getTotalPoints() { return totalPoints; }
        public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
        
        public Double getPassingScore() { return passingScore; }
        public void setPassingScore(Double passingScore) { this.passingScore = passingScore; }
        
        public Map<String, Integer> getPointsPerQuestionType() { return pointsPerQuestionType; }
        public void setPointsPerQuestionType(Map<String, Integer> pointsPerQuestionType) { this.pointsPerQuestionType = pointsPerQuestionType; }
        
        public Boolean getPenalizeWrongAnswers() { return penalizeWrongAnswers; }
        public void setPenalizeWrongAnswers(Boolean penalizeWrongAnswers) { this.penalizeWrongAnswers = penalizeWrongAnswers; }
    }
    
    // Constructors
    public InteractiveActivity() {}
    
    public InteractiveActivity(String title, ActivityType activityType, Long teacherId) {
        this.title = title;
        this.activityType = activityType;
        this.teacherId = teacherId;
    }
    
    // Getters and Setters principales
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ActivityType getActivityType() { return activityType; }
    public void setActivityType(ActivityType activityType) { this.activityType = activityType; }
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public Long getInstitutionId() { return institutionId; }
    public void setInstitutionId(Long institutionId) { this.institutionId = institutionId; }
    
    public Long getSchoolGradeId() { return schoolGradeId; }
    public void setSchoolGradeId(Long schoolGradeId) { this.schoolGradeId = schoolGradeId; }
    
    public ActivityContent getContent() { return content; }
    public void setContent(ActivityContent content) { this.content = content; }
    
    public ActivityConfig getConfig() { return config; }
    public void setConfig(ActivityConfig config) { this.config = config; }
    
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    
    public List<MultimediaResource> getMultimedia() { return multimedia; }
    public void setMultimedia(List<MultimediaResource> multimedia) { this.multimedia = multimedia; }
    
    public ScoringRules getScoringRules() { return scoringRules; }
    public void setScoringRules(ScoringRules scoringRules) { this.scoringRules = scoringRules; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public DifficultyLevel getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(DifficultyLevel difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}