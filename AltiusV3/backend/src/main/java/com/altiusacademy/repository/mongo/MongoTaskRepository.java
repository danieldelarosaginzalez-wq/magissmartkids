package com.altiusacademy.repository.mongo;

import com.altiusacademy.model.document.TaskDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MongoTaskRepository extends MongoRepository<TaskDocument, String> {
    
    Optional<TaskDocument> findByTaskId(Long taskId);
    
    List<TaskDocument> findByTaskIdIn(List<Long> taskIds);
}
