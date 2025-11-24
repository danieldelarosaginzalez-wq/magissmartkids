-- Tabla para almacenar métricas del sistema
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    
    -- Métricas de CPU
    cpu_usage INT,
    available_processors INT,
    
    -- Métricas de Memoria
    memory_usage_percent INT,
    memory_used_mb BIGINT,
    memory_max_mb BIGINT,
    
    -- Métricas de Disco
    disk_usage_percent INT,
    disk_used_gb BIGINT,
    disk_total_gb BIGINT,
    
    -- Métricas de Red
    network_traffic_mbps INT,
    active_connections BIGINT,
    
    -- Métricas de Rendimiento
    response_time_ms INT,
    requests_per_minute INT,
    
    -- Estado del Sistema
    system_status VARCHAR(50) DEFAULT 'operational',
    uptime_hours DOUBLE,
    
    INDEX idx_timestamp (timestamp),
    INDEX idx_system_status (system_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios de la tabla
ALTER TABLE system_metrics COMMENT = 'Almacena métricas del sistema para monitoreo y análisis';
