package com.altiusacademy.dto;

import java.time.LocalDate;
import java.util.List;

public class ReportRequestDto {
    private String reportType; // "SUBJECT_PERFORMANCE", "TEACHER_ACTIVITY", "STUDENT_PARTICIPATION"
    private String format; // "PDF", "EXCEL"
    private LocalDate startDate;
    private LocalDate endDate;
    private Long institutionId;
    private List<Long> subjectIds;
    private List<Long> gradeIds;
    private List<Long> teacherIds;
    
    // Constructors
    public ReportRequestDto() {}
    
    public ReportRequestDto(String reportType, String format, LocalDate startDate, LocalDate endDate, Long institutionId) {
        this.reportType = reportType;
        this.format = format;
        this.startDate = startDate;
        this.endDate = endDate;
        this.institutionId = institutionId;
    }
    
    // Getters and Setters
    public String getReportType() {
        return reportType;
    }
    
    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
    
    public String getFormat() {
        return format;
    }
    
    public void setFormat(String format) {
        this.format = format;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Long getInstitutionId() {
        return institutionId;
    }
    
    public void setInstitutionId(Long institutionId) {
        this.institutionId = institutionId;
    }
    
    public List<Long> getSubjectIds() {
        return subjectIds;
    }
    
    public void setSubjectIds(List<Long> subjectIds) {
        this.subjectIds = subjectIds;
    }
    
    public List<Long> getGradeIds() {
        return gradeIds;
    }
    
    public void setGradeIds(List<Long> gradeIds) {
        this.gradeIds = gradeIds;
    }
    
    public List<Long> getTeacherIds() {
        return teacherIds;
    }
    
    public void setTeacherIds(List<Long> teacherIds) {
        this.teacherIds = teacherIds;
    }
}