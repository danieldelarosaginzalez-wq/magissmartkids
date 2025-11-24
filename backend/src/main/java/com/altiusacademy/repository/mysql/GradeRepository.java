package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    // Buscar calificaciones por estudiante
    List<Grade> findByStudentId(Long studentId);

    // Calcular promedio general de todos los estudiantes
    @Query("SELECT AVG(g.score / g.maxScore * 5.0) FROM Grade g WHERE g.score IS NOT NULL AND g.maxScore > 0")
    Double calculateAverageGrade();

    // Contar estudiantes aprobados (nota >= 3.0 en escala de 5.0)
    @Query("SELECT COUNT(DISTINCT g.student.id) FROM Grade g WHERE (g.score / g.maxScore * 5.0) >= 3.0")
    Long countPassingStudents();

    // Contar total de estudiantes con calificaciones
    @Query("SELECT COUNT(DISTINCT g.student.id) FROM Grade g")
    Long countTotalStudentsWithGrades();
}
