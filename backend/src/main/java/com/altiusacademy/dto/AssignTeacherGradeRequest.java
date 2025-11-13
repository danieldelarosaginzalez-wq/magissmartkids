package com.altiusacademy.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AssignTeacherGradeRequest {
    
    @NotNull(message = "El ID del profesor es requerido")
    private Long teacherId;

    @NotNull(message = "El nivel del grado es requerido")
    @Min(value = 0, message = "El grado debe ser al menos 0 (Preescolar)")
    @Max(value = 5, message = "El grado no puede ser mayor a 5 (Quinto)")
    private Integer gradeLevel;

    @NotNull(message = "La sección es requerida")
    @Pattern(regexp = "[A-D]", message = "La sección debe ser A, B, C o D")
    private String section;

    @NotNull(message = "El ID de la institución es requerido")
    private Long institutionId;

    private String academicYear;

    // Constructors
    public AssignTeacherGradeRequest() {}

    public AssignTeacherGradeRequest(Long teacherId, Integer gradeLevel, String section, Long institutionId) {
        this.teacherId = teacherId;
        this.gradeLevel = gradeLevel;
        this.section = section;
        this.institutionId = institutionId;
    }

    // Getters and Setters
    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public Integer getGradeLevel() {
        return gradeLevel;
    }

    public void setGradeLevel(Integer gradeLevel) {
        this.gradeLevel = gradeLevel;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Long getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(Long institutionId) {
        this.institutionId = institutionId;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}
