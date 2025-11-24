package com.altiusacademy.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad para almacenar métricas del sistema
 */
@Entity
@Table(name = "system_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Métricas de CPU
    @Column(name = "cpu_usage")
    private Integer cpuUsage;

    @Column(name = "available_processors")
    private Integer availableProcessors;

    // Métricas de Memoria
    @Column(name = "memory_usage_percent")
    private Integer memoryUsagePercent;

    @Column(name = "memory_used_mb")
    private Long memoryUsedMb;

    @Column(name = "memory_max_mb")
    private Long memoryMaxMb;

    // Métricas de Disco
    @Column(name = "disk_usage_percent")
    private Integer diskUsagePercent;

    @Column(name = "disk_used_gb")
    private Long diskUsedGb;

    @Column(name = "disk_total_gb")
    private Long diskTotalGb;

    // Métricas de Red
    @Column(name = "network_traffic_mbps")
    private Integer networkTrafficMbps;

    @Column(name = "active_connections")
    private Long activeConnections;

    // Métricas de Rendimiento
    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(name = "requests_per_minute")
    private Integer requestsPerMinute;

    // Estado del Sistema
    @Column(name = "system_status")
    private String systemStatus; // operational, warning, critical

    @Column(name = "uptime_hours")
    private Double uptimeHours;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        if (systemStatus == null) {
            systemStatus = "operational";
        }
    }
}
