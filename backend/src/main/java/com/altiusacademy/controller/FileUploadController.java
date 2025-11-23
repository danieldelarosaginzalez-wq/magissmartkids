package com.altiusacademy.controller;

import com.altiusacademy.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {
    
    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "tasks") String folder) {
        try {
            log.info("Recibiendo archivo: {} ({})", file.getOriginalFilename(), file.getSize());
            
            String filePath = fileStorageService.storeFile(file, folder);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileName", file.getOriginalFilename());
            response.put("filePath", filePath);
            response.put("fileUrl", filePath);
            response.put("fileSize", file.getSize());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error subiendo archivo: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping(value = "/download/**", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request) {
        try {
            String uri = request.getRequestURI();
            String fullPath = uri.replace("/api/files/download/", "");
            
            // Limpiar cualquier prefijo duplicado
            fullPath = fullPath.replaceAll("^/api/files/download/", "");
            
            log.info("URI original: {}", uri);
            log.info("Ruta limpia: {}", fullPath);
            
            Path filePath = Paths.get("uploads", fullPath).normalize();
            log.info("Ruta absoluta: {}", filePath.toAbsolutePath());
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                String fileName = filePath.getFileName().toString();
                String contentType = determineContentType(fileName);
                log.info("Archivo encontrado, tipo: {}", contentType);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                        .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                        .body(resource);
            }
            
            log.error("Archivo no existe o no es legible: {}", filePath.toAbsolutePath());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            log.error("Error descargando archivo", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/delete/{folder}/{fileName:.+}")
    public ResponseEntity<?> deleteFile(
            @PathVariable String folder,
            @PathVariable String fileName) {
        try {
            String filePath = folder + "/" + fileName;
            fileStorageService.deleteFile(filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Archivo eliminado correctamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error eliminando archivo: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        
        switch (extension) {
            case "pdf":
                return "application/pdf";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "doc":
                return "application/msword";
            default:
                return "application/octet-stream";
        }
    }
}
