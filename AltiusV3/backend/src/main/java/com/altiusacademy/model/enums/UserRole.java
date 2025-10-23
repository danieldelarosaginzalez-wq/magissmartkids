package com.altiusacademy.model.enums;

public enum UserRole {
    ADMIN("admin"),
    SECRETARY("secretary"),
    COORDINATOR("coordinator"),
    TEACHER("teacher"),
    STUDENT("student"),
    PARENT("parent"),
    SUPER_ADMIN("super_admin");

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