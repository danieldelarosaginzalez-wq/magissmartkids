package com.altiusacademy.dto;

import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.SchoolGrade;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Institution institution;
    private SchoolGrade schoolGrade;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, String firstName, String lastName, UserRole role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public AuthResponse(String token, Long userId, String email, String firstName, String lastName, UserRole role, Institution institution) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.institution = institution;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Institution getInstitution() {
        return institution;
    }

    public void setInstitution(Institution institution) {
        this.institution = institution;
    }

    public SchoolGrade getSchoolGrade() {
        return schoolGrade;
    }

    public void setSchoolGrade(SchoolGrade schoolGrade) {
        this.schoolGrade = schoolGrade;
    }
}