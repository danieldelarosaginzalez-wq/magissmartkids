package com.altiusacademy.model.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Documento MongoDB para contenido multimedia de tareas
 * Almacena archivos, evidencias, y contenido no estructurado
 */
@Document(collection = "task")
public class TaskDocument {
    
    @Id
    private String id;
    
    private Long taskId; // Referencia a la tarea en MySQL
    
    // Archivos multimedia
    private List<MediaFile> files;
    
    // Contenido adicional
    private Map<String, Object> metadata;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Clase interna para archivos
    public static class MediaFile {
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
        private LocalDateTime uploadedAt;
        
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        
        public LocalDateTime getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    
    public List<MediaFile> getFiles() { return files; }
    public void setFiles(List<MediaFile> files) { this.files = files; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
