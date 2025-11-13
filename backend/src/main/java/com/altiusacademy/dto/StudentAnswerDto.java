package com.altiusacademy.dto;

/**
 * DTO para respuestas de estudiantes en actividades interactivas
 */
public class StudentAnswerDto {
    private String questionId;
    private Object answer;
    private Boolean isCorrect;
    private Integer pointsEarned;
    private Long timeSpentSeconds;
    private Integer attempts;
    
    // Constructors
    public StudentAnswerDto() {}
    
    public StudentAnswerDto(String questionId, Object answer) {
        this.questionId = questionId;
        this.answer = answer;
    }
    
    // Getters and Setters
    public String getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }
    
    public Object getAnswer() {
        return answer;
    }
    
    public void setAnswer(Object answer) {
        this.answer = answer;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Integer getPointsEarned() {
        return pointsEarned;
    }
    
    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }
    
    public Long getTimeSpentSeconds() {
        return timeSpentSeconds;
    }
    
    public void setTimeSpentSeconds(Long timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }
    
    public Integer getAttempts() {
        return attempts;
    }
    
    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }
}