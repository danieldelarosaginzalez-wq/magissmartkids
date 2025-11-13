package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    // Repositorio básico - métodos automáticos de JPA
}