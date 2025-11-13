package com.altiusacademy.dto;

public class TeacherGradeDto {
    private Long id;
    private Long teacherId;
    private String teacherName;
    private Integer gradeLevel;
    private String section;
    private String fullGradeName; // "1A", "2B", etc.
    private Long institutionId;
    private String institutionName;
    private Boolean isActive;
    private String academicYear;

    // Constructors
    public TeacherGradeDto() {}

    public TeacherGradeDto(Long id, Long teacherId, String teacherName, Integer gradeLevel, 
                          String section, Long institutionId, String institutionName, 
                          Boolean isActive, String academicYear) {
        this.id = id;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.gradeLevel = gradeLevel;
        this.section = section;
        this.fullGradeName = gradeLevel + section;
        this.institutionId = institutionId;
        this.institutionName = institutionName;
        this.isActive = isActive;
        this.academicYear = academicYear;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Integer getGradeLevel() {
        return gradeLevel;
    }

    public void setGradeLevel(Integer gradeLevel) {
        this.gradeLevel = gradeLevel;
        this.fullGradeName = gradeLevel + (section != null ? section : "");
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
        this.fullGradeName = (gradeLevel != null ? gradeLevel : "") + section;
    }

    public String getFullGradeName() {
        return fullGradeName;
    }

    public void setFullGradeName(String fullGradeName) {
        this.fullGradeName = fullGradeName;
    }

    public Long getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(Long institutionId) {
        this.institutionId = institutionId;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}
