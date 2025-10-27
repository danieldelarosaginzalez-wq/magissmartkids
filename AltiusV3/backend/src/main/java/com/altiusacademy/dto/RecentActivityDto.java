package com.altiusacademy.dto;

import java.time.LocalDateTime;

public class RecentActivityDto {
    private Long id;
    private String activityType;
    private String description;
    private String userName;
    private String userRole;
    private LocalDateTime timestamp;
    private String subjectName;
    private String gradeName;
    private String details;
    private String status;

    // Constructors
    public RecentActivityDto() {}

    public RecentActivityDto(Long id, String activityType, String description, String userName,
                           String userRole, LocalDateTime timestamp, String subjectName,
                           String gradeName, String details, String status) {
        this.id = id;
        this.activityType = activityType;
        this.description = description;
        this.userName = userName;
        this.userRole = userRole;
        this.timestamp = timestamp;
        this.subjectName = subjectName;
        this.gradeName = gradeName;
        this.details = details;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

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

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}