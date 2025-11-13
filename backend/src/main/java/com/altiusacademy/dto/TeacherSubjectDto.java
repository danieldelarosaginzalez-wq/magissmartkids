package com.altiusacademy.dto;

public class TeacherSubjectDto {
    private String id;
    private String nombre;
    private String grado;
    private int estudiantes;
    private double progresoPromedio;
    private String color;
    
    // Constructors
    public TeacherSubjectDto() {}
    
    public TeacherSubjectDto(String id, String nombre, String grado, int estudiantes, 
                           double progresoPromedio, String color) {
        this.id = id;
        this.nombre = nombre;
        this.grado = grado;
        this.estudiantes = estudiantes;
        this.progresoPromedio = progresoPromedio;
        this.color = color;
    }
    
    // Builder pattern
    public static TeacherSubjectDtoBuilder builder() {
        return new TeacherSubjectDtoBuilder();
    }
    
    public static class TeacherSubjectDtoBuilder {
        private String id;
        private String nombre;
        private String grado;
        private int estudiantes;
        private double progresoPromedio;
        private String color;
        
        public TeacherSubjectDtoBuilder id(String id) { this.id = id; return this; }
        public TeacherSubjectDtoBuilder nombre(String nombre) { this.nombre = nombre; return this; }
        public TeacherSubjectDtoBuilder grado(String grado) { this.grado = grado; return this; }
        public TeacherSubjectDtoBuilder estudiantes(int estudiantes) { this.estudiantes = estudiantes; return this; }
        public TeacherSubjectDtoBuilder progresoPromedio(double progresoPromedio) { this.progresoPromedio = progresoPromedio; return this; }
        public TeacherSubjectDtoBuilder color(String color) { this.color = color; return this; }
        
        public TeacherSubjectDto build() {
            return new TeacherSubjectDto(id, nombre, grado, estudiantes, progresoPromedio, color);
        }
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getGrado() { return grado; }
    public void setGrado(String grado) { this.grado = grado; }
    
    public int getEstudiantes() { return estudiantes; }
    public void setEstudiantes(int estudiantes) { this.estudiantes = estudiantes; }
    
    public double getProgresoPromedio() { return progresoPromedio; }
    public void setProgresoPromedio(double progresoPromedio) { this.progresoPromedio = progresoPromedio; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}