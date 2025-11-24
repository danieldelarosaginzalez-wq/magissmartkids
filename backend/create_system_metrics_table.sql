-- Script SQL para crear la tabla de métricas del sistema
-- Ejecutar este script si no estás usando Flyway o necesitas crear la tabla manualmente

USE altius_academy;

-- Eliminar tabla si existe (solo para desarrollo)
-- DROP TABLE IF EXISTS system_metrics;

-- Crear tabla de métricas del sistema
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    
    -- Métricas de CPU
    cpu_usage INT COMMENT 'Porcentaje de uso de CPU',
    available_processors INT COMMENT 'Número de procesadores disponibles',
    
    -- Métricas de Memoria
    memory_usage_percent INT COMMENT 'Porcentaje de uso de memoria',
    memory_used_mb BIGINT COMMENT 'Memoria utilizada en MB',
    memory_max_mb BIGINT COMMENT 'Memoria máxima disponible en MB',
    
    -- Métricas de Disco
    disk_usage_percent INT COMMENT 'Porcentaje de uso de disco',
    disk_used_gb BIGINT COMMENT 'Espacio de disco utilizado en GB',
    disk_total_gb BIGINT COMMENT 'Espacio total de disco en GB',
    
    -- Métricas de Red
    network_traffic_mbps INT COMMENT 'Tráfico de red en Mbps',
    active_connections BIGINT COMMENT 'Número de conexiones activas',
    
    -- Métricas de Rendimiento
    response_time_ms INT COMMENT 'Tiempo de respuesta promedio en ms',
    requests_per_minute INT COMMENT 'Solicitudes por minuto',
    
    -- Estado del Sistema
    system_status VARCHAR(50) DEFAULT 'operational' COMMENT 'Estado del sistema: operational, warning, critical',
    uptime_hours DOUBLE COMMENT 'Tiempo de actividad en horas',
    
    -- Índices para mejorar el rendimiento
    INDEX idx_timestamp (timestamp),
    INDEX idx_system_status (system_status),
    INDEX idx_timestamp_status (timestamp, system_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Almacena métricas del sistema para monitoreo y análisis de rendimiento';

-- Verificar que la tabla se creó correctamente
SELECT 'Tabla system_metrics creada exitosamente' AS resultado;

-- Mostrar estructura de la tabla
DESCRIBE system_metrics;

-- Insertar una métrica de prueba (opcional)
INSERT INTO system_metrics (
    timestamp,
    cpu_usage,
    available_processors,
    memory_usage_percent,
    memory_used_mb,
    memory_max_mb,
    disk_usage_percent,
    disk_used_gb,
    disk_total_gb,
    network_traffic_mbps,
    active_connections,
    response_time_ms,
    requests_per_minute,
    system_status,
    uptime_hours
) VALUES (
    NOW(),
    25,
    8,
    60,
    2048,
    4096,
    45,
    90,
    200,
    75,
    42,
    25,
    150,
    'operational',
    168.5
);

-- Verificar que se insertó correctamente
SELECT * FROM system_metrics ORDER BY timestamp DESC LIMIT 1;

-- Consultas útiles para verificar el funcionamiento

-- Ver todas las métricas
-- SELECT * FROM system_metrics ORDER BY timestamp DESC;

-- Ver métricas de las últimas 24 horas
-- SELECT * FROM system_metrics 
-- WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
-- ORDER BY timestamp DESC;

-- Ver promedio de CPU y memoria
-- SELECT 
--     AVG(cpu_usage) as avg_cpu,
--     AVG(memory_usage_percent) as avg_memory,
--     COUNT(*) as total_records
-- FROM system_metrics
-- WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Ver métricas por estado del sistema
-- SELECT 
--     system_status,
--     COUNT(*) as count,
--     AVG(cpu_usage) as avg_cpu,
--     AVG(memory_usage_percent) as avg_memory
-- FROM system_metrics
-- GROUP BY system_status;

-- Eliminar métricas antiguas (más de 7 días)
-- DELETE FROM system_metrics WHERE timestamp < DATE_SUB(NOW(), INTERVAL 7 DAY);
