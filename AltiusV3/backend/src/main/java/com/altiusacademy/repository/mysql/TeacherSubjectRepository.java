package com.altiusacademy.repository.mysql;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.TeacherSubject;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    
    List<TeacherSubject> findByTeacherId(Long teacherId);
    
    List<TeacherSubject> findByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
    
    @Query("SELECT ts FROM TeacherSubject ts JOIN FETCH ts.subject WHERE ts.teacherId = :teacherId")
    List<TeacherSubject> findByTeacherIdWithSubject(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(DISTINCT u.id) FROM User u " +
           "JOIN u.schoolGrade sg " +
           "WHERE sg.gradeName = :grade AND u.role = 'STUDENT'")
    Long countStudentsByGrade(@Param("grade") String grade);
    
    boolean existsByTeacherIdAndSubjectIdAndGrade(Long teacherId, Long subjectId, String grade);
    
    // Métodos adicionales para CoordinatorService
    @Query("SELECT s.name FROM TeacherSubject ts JOIN ts.subject s WHERE ts.teacherId = :teacherId")
    List<String> findSubjectNamesByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT ts FROM TeacherSubject ts WHERE ts.subjectId = :subjectId")
    List<TeacherSubject> findBySubjectId(@Param("subjectId") Long subjectId);
}