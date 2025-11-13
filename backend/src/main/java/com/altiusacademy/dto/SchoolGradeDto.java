package com.altiusacademy.dto;

import java.time.LocalDateTime;

public class SchoolGradeDto {
    private Long id;
    private String gradeName;
    private Integer gradeLevel;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public SchoolGradeDto() {}
    
    public SchoolGradeDto(Long id, String gradeName, Integer gradeLevel, String description, Boolean isActive) {
        this.id = id;
        this.gradeName = gradeName;
        this.gradeLevel = gradeLevel;
        this.description = description;
        this.isActive = isActive;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getGradeName() {
        return gradeName;
    }
    
    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }
    
    public Integer getGradeLevel() {
        return gradeLevel;
    }
    
    public void setGradeLevel(Integer gradeLevel) {
        this.gradeLevel = gradeLevel;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}