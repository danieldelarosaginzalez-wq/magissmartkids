package com.altiusacademy.dto;

public class DataGenerationRequestDto {
    private Integer teacherCount = 20;
    private Integer studentCount = 20;
    private Boolean generateTasks = true;
    private Boolean generateActivities = true;
    private Boolean generateGrades = true;
    private Long institutionId;
    private Boolean clearExistingData = false;

    // Constructors
    public DataGenerationRequestDto() {}

    public DataGenerationRequestDto(Integer teacherCount, Integer studentCount, Boolean generateTasks,
                                  Boolean generateActivities, Boolean generateGrades, Long institutionId,
                                  Boolean clearExistingData) {
        this.teacherCount = teacherCount;
        this.studentCount = studentCount;
        this.generateTasks = generateTasks;
        this.generateActivities = generateActivities;
        this.generateGrades = generateGrades;
        this.institutionId = institutionId;
        this.clearExistingData = clearExistingData;
    }

    // Getters and Setters
    public Integer getTeacherCount() {
        return teacherCount;
    }

    public void setTeacherCount(Integer teacherCount) {
        this.teacherCount = teacherCount;
    }

    public Integer getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Integer studentCount) {
        this.studentCount = studentCount;
    }

    public Boolean getGenerateTasks() {
        return generateTasks;
    }

    public void setGenerateTasks(Boolean generateTasks) {
        this.generateTasks = generateTasks;
    }

    public Boolean getGenerateActivities() {
        return generateActivities;
    }

    public void setGenerateActivities(Boolean generateActivities) {
        this.generateActivities = generateActivities;
    }

    public Boolean getGenerateGrades() {
        return generateGrades;
    }

    public void setGenerateGrades(Boolean generateGrades) {
        this.generateGrades = generateGrades;
    }

    public Long getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(Long institutionId) {
        this.institutionId = institutionId;
    }

    public Boolean getClearExistingData() {
        return clearExistingData;
    }

    public void setClearExistingData(Boolean clearExistingData) {
        this.clearExistingData = clearExistingData;
    }
}