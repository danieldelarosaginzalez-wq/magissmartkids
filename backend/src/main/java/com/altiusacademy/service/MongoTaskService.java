package com.altiusacademy.service;

import com.altiusacademy.model.document.TaskDocument;
import com.altiusacademy.repository.mongo.MongoTaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MongoTaskService {

    private final MongoTaskRepository taskRepository;

    public MongoTaskService(MongoTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Optional<TaskDocument> getTaskDocument(Long taskId) {
        return taskRepository.findByTaskId(taskId);
    }

    public TaskDocument createTaskDocument(Long taskId) {
        TaskDocument doc = new TaskDocument();
        doc.setTaskId(taskId);
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(doc);
    }

    public TaskDocument updateTaskDocument(TaskDocument document) {
        document.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(document);
    }

    public void deleteTaskDocument(Long taskId) {
        taskRepository.findByTaskId(taskId).ifPresent(taskRepository::delete);
    }
}
