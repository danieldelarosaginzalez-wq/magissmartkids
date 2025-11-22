package com.altiusacademy.repository.mysql;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStudentAndStatus(User student, Task.TaskStatus status);
    List<Task> findByStudentOrderByDueDateAsc(User student);
    List<Task> findByTeacherOrderByCreatedAtDesc(User teacher);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.student = :student AND t.status = :status")
    Long countByStudentAndStatus(@Param("student") User student, @Param("status") Task.TaskStatus status);

    @Query("SELECT AVG(t.score) FROM Task t WHERE t.student = :student AND t.score IS NOT NULL")
    Double getAverageScoreByStudent(@Param("student") User student);

    // Simple methods for UnifiedTaskService
    List<Task> findByStudentId(Long studentId);
    List<Task> findByTeacherId(Long teacherId);
    
    // Buscar tareas por grado (ej. "1° A")
    List<Task> findByGrade(String grade);
    
    // Tareas que no tienen grado asignado (visibles para todos)
    List<Task> findByGradeIsNull();
    @Query("SELECT t FROM Task t JOIN t.subject s WHERE s.institution.nit = :institutionNit")
    List<Task> findByInstitutionNit(@Param("institutionNit") String institutionNit);
    
    // TEMPORALMENTE COMENTADO - MÉTODOS PROBLEMÁTICOS
    // List<Task> findByStudent(User student);
    // List<Task> findByStudentAndSubject(User student, com.altiusacademy.model.entity.Subject subject);
    // List<Task> findByStudentAndSubjectAndStatus(User student, com.altiusacademy.model.entity.Subject subject, Task.TaskStatus status);
    // List<Task> findByStudentAndStatusOrderByDueDate(User student, Task.TaskStatus status);
    // List<Task> findByStudentAndStatusOrderByGradedAtDesc(User student, Task.TaskStatus status);
    
    // Methods for TeacherService
    @Query(value = "SELECT COUNT(*) FROM task_submissions ts JOIN tasks t ON ts.task_id = t.id WHERE t.teacher_id = :teacherId AND ts.status = 'SUBMITTED'", nativeQuery = true)
    Long countPendingGradingByTeacher(@Param("teacherId") Long teacherId);
    
    @Query(value = "SELECT AVG(ts.score) FROM task_submissions ts JOIN tasks t ON ts.task_id = t.id WHERE t.teacher_id = :teacherId AND ts.score IS NOT NULL", nativeQuery = true)
    Double getAverageScoreByTeacher(@Param("teacherId") Long teacherId);
    
    @Query("SELECT AVG(t.score) FROM Task t WHERE t.teacher.id = :teacherId AND t.subject.id = :subjectId AND t.grade = :grade AND t.score IS NOT NULL")
    Double getAverageProgressByTeacherAndSubjectAndGrade(@Param("teacherId") Long teacherId, @Param("subjectId") Long subjectId, @Param("grade") String grade);
    
    @Query("SELECT t FROM Task t WHERE t.teacher.id = :teacherId AND t.subject.id = :subjectId AND t.grade = :grade")
    List<Task> findByTeacherAndSubjectAndGrade(@Param("teacherId") Long teacherId, @Param("subjectId") Long subjectId, @Param("grade") String grade);
    
    // Métodos adicionales para TeacherTaskService y StudentTaskService
    List<Task> findByTeacherIdAndStatus(Long teacherId, Task.TaskStatus status);
    List<Task> findByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
    List<Task> findByStudentIdAndStatus(Long studentId, Task.TaskStatus status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.subject.id = :subjectId AND t.grade = :grade AND t.status = 'GRADED'")
    Long countCompletedBySubjectAndGrade(@Param("subjectId") Long subjectId, @Param("grade") String grade);
    
    @Query("SELECT AVG(t.score) FROM Task t WHERE t.subject.id = :subjectId AND t.grade = :grade AND t.score IS NOT NULL")
    Double getAverageScoreBySubjectAndGrade(@Param("subjectId") Long subjectId, @Param("grade") String grade);
    
    @Query("SELECT t FROM Task t WHERE t.teacher.id = :teacherId AND t.subject.id = :subjectId AND t.grade = :grade ORDER BY t.createdAt DESC")
    List<Task> findByTeacherIdAndSubjectIdAndGrade(@Param("teacherId") Long teacherId, @Param("subjectId") Long subjectId, @Param("grade") String grade);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.taskTemplate.id = :templateId AND t.status IN :statuses")
    Long countByTaskTemplateIdAndStatusIn(@Param("templateId") Long templateId, @Param("statuses") List<Task.TaskStatus> statuses);
    
    @Query("SELECT t FROM Task t WHERE t.taskTemplate.id = :templateId")
    List<Task> findByTaskTemplateId(@Param("templateId") Long templateId);
    
    // Buscar tareas por grado y profesor (para que los estudiantes vean las tareas de su grado)
    @Query("SELECT t FROM Task t WHERE t.grade = :grade AND t.teacher.id = :teacherId ORDER BY t.createdAt DESC")
    List<Task> findByGradeAndTeacherId(@Param("grade") String grade, @Param("teacherId") Long teacherId);
    
    // Buscar todas las tareas de un grado (sin importar el profesor)
    @Query("SELECT t FROM Task t WHERE t.grade = :grade ORDER BY t.createdAt DESC")
    List<Task> findByGradeOrderByCreatedAtDesc(@Param("grade") String grade);
    
    // Contar tareas por grado
    @Query("SELECT COUNT(t) FROM Task t WHERE t.grade = :grade")
    long countByGrade(@Param("grade") String grade);
    
    // Buscar tareas recientes por ID de profesor
    @Query("SELECT t FROM Task t WHERE t.teacher.id = :teacherId ORDER BY t.createdAt DESC")
    List<Task> findByTeacherIdOrderByCreatedAtDesc(@Param("teacherId") Long teacherId);
}