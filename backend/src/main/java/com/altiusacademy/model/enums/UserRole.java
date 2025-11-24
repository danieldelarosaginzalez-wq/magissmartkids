package com.altiusacademy.model.enums;

public enum UserRole {
    SUPER_ADMIN("super_admin"),
    ADMIN("admin"),
    COORDINATOR("coordinator"),
    TEACHER("teacher"),
    STUDENT("student");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserRole fromString(String value) {
        for (UserRole role : UserRole.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + value);
    }
}