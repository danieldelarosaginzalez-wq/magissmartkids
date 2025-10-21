package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.AcademicGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicGradeRepository extends JpaRepository<AcademicGrade, Long> {
    List<AcademicGrade> findByIsActiveTrueOrderByLevel();
    Optional<AcademicGrade> findByName(String name);
    Optional<AcademicGrade> findByLevel(Integer level);
}
