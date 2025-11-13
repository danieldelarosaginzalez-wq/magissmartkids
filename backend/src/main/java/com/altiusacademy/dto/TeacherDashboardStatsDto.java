package com.altiusacademy.dto;

import java.util.List;

public class TeacherDashboardStatsDto {
    private int totalMaterias;
    private int totalEstudiantes;
    private int tareasPendientesCorreccion;
    private double promedioGeneral;
    private List<TeacherTaskDto> proximasEntregas;
    private List<TeacherTaskDto> actividadesRecientes;
    
    // Constructors
    public TeacherDashboardStatsDto() {}
    
    public TeacherDashboardStatsDto(int totalMaterias, int totalEstudiantes, 
                                   int tareasPendientesCorreccion, double promedioGeneral,
                                   List<TeacherTaskDto> proximasEntregas,
                                   List<TeacherTaskDto> actividadesRecientes) {
        this.totalMaterias = totalMaterias;
        this.totalEstudiantes = totalEstudiantes;
        this.tareasPendientesCorreccion = tareasPendientesCorreccion;
        this.promedioGeneral = promedioGeneral;
        this.proximasEntregas = proximasEntregas;
        this.actividadesRecientes = actividadesRecientes;
    }
    
    // Builder pattern
    public static TeacherDashboardStatsDtoBuilder builder() {
        return new TeacherDashboardStatsDtoBuilder();
    }
    
    public static class TeacherDashboardStatsDtoBuilder {
        private int totalMaterias;
        private int totalEstudiantes;
        private int tareasPendientesCorreccion;
        private double promedioGeneral;
        private List<TeacherTaskDto> proximasEntregas;
        private List<TeacherTaskDto> actividadesRecientes;
        
        public TeacherDashboardStatsDtoBuilder totalMaterias(int totalMaterias) { 
            this.totalMaterias = totalMaterias; return this; 
        }
        public TeacherDashboardStatsDtoBuilder totalEstudiantes(int totalEstudiantes) { 
            this.totalEstudiantes = totalEstudiantes; return this; 
        }
        public TeacherDashboardStatsDtoBuilder tareasPendientesCorreccion(int tareasPendientesCorreccion) { 
            this.tareasPendientesCorreccion = tareasPendientesCorreccion; return this; 
        }
        public TeacherDashboardStatsDtoBuilder promedioGeneral(double promedioGeneral) { 
            this.promedioGeneral = promedioGeneral; return this; 
        }
        public TeacherDashboardStatsDtoBuilder proximasEntregas(List<TeacherTaskDto> proximasEntregas) { 
            this.proximasEntregas = proximasEntregas; return this; 
        }
        public TeacherDashboardStatsDtoBuilder actividadesRecientes(List<TeacherTaskDto> actividadesRecientes) { 
            this.actividadesRecientes = actividadesRecientes; return this; 
        }
        
        public TeacherDashboardStatsDto build() {
            return new TeacherDashboardStatsDto(totalMaterias, totalEstudiantes, tareasPendientesCorreccion, 
                                              promedioGeneral, proximasEntregas, actividadesRecientes);
        }
    }
    
    // Getters and Setters
    public int getTotalMaterias() { return totalMaterias; }
    public void setTotalMaterias(int totalMaterias) { this.totalMaterias = totalMaterias; }
    
    public int getTotalEstudiantes() { return totalEstudiantes; }
    public void setTotalEstudiantes(int totalEstudiantes) { this.totalEstudiantes = totalEstudiantes; }
    
    public int getTareasPendientesCorreccion() { return tareasPendientesCorreccion; }
    public void setTareasPendientesCorreccion(int tareasPendientesCorreccion) { 
        this.tareasPendientesCorreccion = tareasPendientesCorreccion; 
    }
    
    public double getPromedioGeneral() { return promedioGeneral; }
    public void setPromedioGeneral(double promedioGeneral) { this.promedioGeneral = promedioGeneral; }
    
    public List<TeacherTaskDto> getProximasEntregas() { return proximasEntregas; }
    public void setProximasEntregas(List<TeacherTaskDto> proximasEntregas) { 
        this.proximasEntregas = proximasEntregas; 
    }
    
    public List<TeacherTaskDto> getActividadesRecientes() { return actividadesRecientes; }
    public void setActividadesRecientes(List<TeacherTaskDto> actividadesRecientes) { 
        this.actividadesRecientes = actividadesRecientes; 
    }
}