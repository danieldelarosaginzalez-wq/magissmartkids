package com.altiusacademy.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TeacherTaskDto {
    private Long id;
    private String titulo;
    private String descripcion;
    private Long materiaId;
    private List<String> grados;
    private LocalDate fechaEntrega;
    private String tipo;
    private List<String> archivosAdjuntos;
    private LocalDateTime fechaCreacion;
    
    // Constructors
    public TeacherTaskDto() {}
    
    public TeacherTaskDto(Long id, String titulo, String descripcion, Long materiaId,
                         List<String> grados, LocalDate fechaEntrega, String tipo,
                         List<String> archivosAdjuntos, LocalDateTime fechaCreacion) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.materiaId = materiaId;
        this.grados = grados;
        this.fechaEntrega = fechaEntrega;
        this.tipo = tipo;
        this.archivosAdjuntos = archivosAdjuntos;
        this.fechaCreacion = fechaCreacion;
    }
    
    // Builder pattern
    public static TeacherTaskDtoBuilder builder() {
        return new TeacherTaskDtoBuilder();
    }
    
    public static class TeacherTaskDtoBuilder {
        private Long id;
        private String titulo;
        private String descripcion;
        private Long materiaId;
        private List<String> grados;
        private LocalDate fechaEntrega;
        private String tipo;
        private List<String> archivosAdjuntos;
        private LocalDateTime fechaCreacion;
        
        public TeacherTaskDtoBuilder id(Long id) { this.id = id; return this; }
        public TeacherTaskDtoBuilder titulo(String titulo) { this.titulo = titulo; return this; }
        public TeacherTaskDtoBuilder descripcion(String descripcion) { this.descripcion = descripcion; return this; }
        public TeacherTaskDtoBuilder materiaId(Long materiaId) { this.materiaId = materiaId; return this; }
        public TeacherTaskDtoBuilder grados(List<String> grados) { this.grados = grados; return this; }
        public TeacherTaskDtoBuilder fechaEntrega(LocalDate fechaEntrega) { this.fechaEntrega = fechaEntrega; return this; }
        public TeacherTaskDtoBuilder tipo(String tipo) { this.tipo = tipo; return this; }
        public TeacherTaskDtoBuilder archivosAdjuntos(List<String> archivosAdjuntos) { this.archivosAdjuntos = archivosAdjuntos; return this; }
        public TeacherTaskDtoBuilder fechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; return this; }
        
        public TeacherTaskDto build() {
            return new TeacherTaskDto(id, titulo, descripcion, materiaId, grados, fechaEntrega, tipo, archivosAdjuntos, fechaCreacion);
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public List<String> getGrados() { return grados; }
    public void setGrados(List<String> grados) { this.grados = grados; }
    
    public LocalDate getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDate fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public List<String> getArchivosAdjuntos() { return archivosAdjuntos; }
    public void setArchivosAdjuntos(List<String> archivosAdjuntos) { this.archivosAdjuntos = archivosAdjuntos; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}