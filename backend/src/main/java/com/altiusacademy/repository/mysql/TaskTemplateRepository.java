package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.TaskTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskTemplateRepository extends JpaRepository<TaskTemplate, Long> {
    
    List<TaskTemplate> findByTeacherId(Long teacherId);
    
    List<TaskTemplate> findByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
    
    @Query("SELECT tt FROM TaskTemplate tt WHERE tt.teacherId = :teacherId AND tt.dueDate >= :fromDate")
    List<TaskTemplate> findUpcomingTasksByTeacher(@Param("teacherId") Long teacherId, @Param("fromDate") LocalDate fromDate);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.taskTemplate.id = :templateId AND t.score IS NULL")
    Long countPendingGradingByTemplate(@Param("templateId") Long templateId);
}