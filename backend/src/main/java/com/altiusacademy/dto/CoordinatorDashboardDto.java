package com.altiusacademy.dto;

import java.util.List;
import java.util.Map;

public class CoordinatorDashboardDto {
    private InstitutionStatsDto institutionStats;
    private List<TeacherSummaryDto> recentTeachers;
    private List<StudentSummaryDto> recentStudents;
    private List<SubjectStatsDto> subjectPerformance;
    private List<RecentActivityDto> recentActivities;
    private Map<String, Object> quickActions;

    // Constructors
    public CoordinatorDashboardDto() {}

    public CoordinatorDashboardDto(InstitutionStatsDto institutionStats, 
                                 List<TeacherSummaryDto> recentTeachers,
                                 List<StudentSummaryDto> recentStudents,
                                 List<SubjectStatsDto> subjectPerformance,
                                 List<RecentActivityDto> recentActivities,
                                 Map<String, Object> quickActions) {
        this.institutionStats = institutionStats;
        this.recentTeachers = recentTeachers;
        this.recentStudents = recentStudents;
        this.subjectPerformance = subjectPerformance;
        this.recentActivities = recentActivities;
        this.quickActions = quickActions;
    }

    // Getters and Setters
    public InstitutionStatsDto getInstitutionStats() {
        return institutionStats;
    }

    public void setInstitutionStats(InstitutionStatsDto institutionStats) {
        this.institutionStats = institutionStats;
    }

    public List<TeacherSummaryDto> getRecentTeachers() {
        return recentTeachers;
    }

    public void setRecentTeachers(List<TeacherSummaryDto> recentTeachers) {
        this.recentTeachers = recentTeachers;
    }

    public List<StudentSummaryDto> getRecentStudents() {
        return recentStudents;
    }

    public void setRecentStudents(List<StudentSummaryDto> recentStudents) {
        this.recentStudents = recentStudents;
    }

    public List<SubjectStatsDto> getSubjectPerformance() {
        return subjectPerformance;
    }

    public void setSubjectPerformance(List<SubjectStatsDto> subjectPerformance) {
        this.subjectPerformance = subjectPerformance;
    }

    public List<RecentActivityDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<RecentActivityDto> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public Map<String, Object> getQuickActions() {
        return quickActions;
    }

    public void setQuickActions(Map<String, Object> quickActions) {
        this.quickActions = quickActions;
    }
}