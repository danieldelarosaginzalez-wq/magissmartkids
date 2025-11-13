package com.altiusacademy.dto;

/**
 * DTO para entrega de tareas
 */
public class TaskSubmissionDto {
    private String submissionText;
    private String submissionFileUrl;
    
    // Constructors
    public TaskSubmissionDto() {}
    
    public TaskSubmissionDto(String submissionText, String submissionFileUrl) {
        this.submissionText = submissionText;
        this.submissionFileUrl = submissionFileUrl;
    }
    
    // Getters and Setters
    public String getSubmissionText() {
        return submissionText;
    }
    
    public void setSubmissionText(String submissionText) {
        this.submissionText = submissionText;
    }
    
    public String getSubmissionFileUrl() {
        return submissionFileUrl;
    }
    
    public void setSubmissionFileUrl(String submissionFileUrl) {
        this.submissionFileUrl = submissionFileUrl;
    }
}