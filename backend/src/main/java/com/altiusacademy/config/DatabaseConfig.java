package com.altiusacademy.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuración dual para MySQL (JPA) y MongoDB
 * MySQL: Datos estructurados (usuarios, tareas, calificaciones)
 * MongoDB: Datos flexibles (actividades interactivas, contenido multimedia)
 * 
 * NOTA: La configuración principal está en AltiusAcademyApplication.java
 * Esta clase se mantiene para configuraciones adicionales si son necesarias
 */
@Configuration
public class DatabaseConfig {
    
    // MySQL se configura automáticamente con application.properties
    // MongoDB se configura automáticamente con spring.data.mongodb.*
    // Las anotaciones @EnableJpaRepositories y @EnableMongoRepositories
    // están en la clase principal AltiusAcademyApplication.java
    
}