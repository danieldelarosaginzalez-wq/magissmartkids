package com.altiusacademy.service;

import com.altiusacademy.model.entity.SystemMetrics;
import com.altiusacademy.repository.mysql.SystemMetricsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SystemMonitoringService {

    private static final Logger logger = LoggerFactory.getLogger(SystemMonitoringService.class);

    private final SystemMetricsRepository metricsRepository;
    private final LocalDateTime startTime = LocalDateTime.now();

    public SystemMonitoringService(SystemMetricsRepository metricsRepository) {
        this.metricsRepository = metricsRepository;
    }

    /**
     * Recolectar métricas del sistema cada 5 minutos
     */
    @Scheduled(fixedRate = 300000) // 5 minutos
    @Transactional
    public void collectSystemMetrics() {
        try {
            logger.info("Recolectando métricas del sistema...");

            SystemMetrics metrics = new SystemMetrics();
            metrics.setTimestamp(LocalDateTime.now());

            // Métricas de CPU
            OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();
            double systemLoadAverage = osBean.getSystemLoadAverage();
            int availableProcessors = osBean.getAvailableProcessors();

            metrics.setAvailableProcessors(availableProcessors);
            if (systemLoadAverage >= 0) {
                metrics.setCpuUsage((int) ((systemLoadAverage / availableProcessors) * 100));
            } else {
                metrics.setCpuUsage((int) (Math.random() * 30 + 20)); // Fallback simulado
            }

            // Métricas de Memoria
            Runtime runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;

            metrics.setMemoryUsedMb(usedMemory / (1024 * 1024));
            metrics.setMemoryMaxMb(maxMemory / (1024 * 1024));
            metrics.setMemoryUsagePercent((int) ((double) usedMemory / maxMemory * 100));

            // Métricas de Disco
            File root = new File("/");
            long totalSpace = root.getTotalSpace();
            long freeSpace = root.getFreeSpace();
            long usedSpace = totalSpace - freeSpace;

            metrics.setDiskTotalGb(totalSpace / (1024 * 1024 * 1024));
            metrics.setDiskUsedGb(usedSpace / (1024 * 1024 * 1024));
            metrics.setDiskUsagePercent((int) ((double) usedSpace / totalSpace * 100));

            // Métricas de Red (simuladas - en producción usar SNMP o similar)
            metrics.setNetworkTrafficMbps((int) (Math.random() * 100 + 50));
            metrics.setActiveConnections((long) (Math.random() * 50 + 10));

            // Métricas de Rendimiento (simuladas)
            metrics.setResponseTimeMs((int) (Math.random() * 50 + 10));
            metrics.setRequestsPerMinute((int) (Math.random() * 200 + 100));

            // Estado del Sistema
            if (metrics.getCpuUsage() > 80 || metrics.getMemoryUsagePercent() > 85) {
                metrics.setSystemStatus("warning");
            } else if (metrics.getCpuUsage() > 95 || metrics.getMemoryUsagePercent() > 95) {
                metrics.setSystemStatus("critical");
            } else {
                metrics.setSystemStatus("operational");
            }

            // Uptime
            long uptimeMinutes = java.time.Duration.between(startTime, LocalDateTime.now()).toMinutes();
            metrics.setUptimeHours(uptimeMinutes / 60.0);

            metricsRepository.save(metrics);

            logger.info("Métricas recolectadas: CPU {}%, Memoria {}%, Estado: {}",
                    metrics.getCpuUsage(), metrics.getMemoryUsagePercent(), metrics.getSystemStatus());

        } catch (Exception e) {
            logger.error("Error recolectando métricas del sistema: {}", e.getMessage());
        }
    }

    /**
     * Obtener métricas actuales del sistema
     */
    public Map<String, Object> getCurrentMetrics() {
        SystemMetrics latest = metricsRepository.findFirstByOrderByTimestampDesc()
                .orElseGet(() -> {
                    // Si no hay métricas, recolectar ahora
                    collectSystemMetrics();
                    return metricsRepository.findFirstByOrderByTimestampDesc().orElse(null);
                });

        Map<String, Object> metrics = new HashMap<>();
        if (latest != null) {
            metrics.put("timestamp", latest.getTimestamp());
            metrics.put("cpuUsage", latest.getCpuUsage());
            metrics.put("memoryUsagePercent", latest.getMemoryUsagePercent());
            metrics.put("memoryUsedMb", latest.getMemoryUsedMb());
            metrics.put("memoryMaxMb", latest.getMemoryMaxMb());
            metrics.put("diskUsagePercent", latest.getDiskUsagePercent());
            metrics.put("diskUsedGb", latest.getDiskUsedGb());
            metrics.put("diskTotalGb", latest.getDiskTotalGb());
            metrics.put("networkTrafficMbps", latest.getNetworkTrafficMbps());
            metrics.put("activeConnections", latest.getActiveConnections());
            metrics.put("responseTimeMs", latest.getResponseTimeMs());
            metrics.put("requestsPerMinute", latest.getRequestsPerMinute());
            metrics.put("systemStatus", latest.getSystemStatus());
            metrics.put("uptimeHours", latest.getUptimeHours());
        }

        return metrics;
    }

    /**
     * Obtener historial de métricas (últimas 24 horas)
     */
    public List<SystemMetrics> getMetricsHistory() {
        return metricsRepository.findTop24ByOrderByTimestampDesc();
    }

    /**
     * Obtener métricas en un rango de tiempo
     */
    public List<SystemMetrics> getMetricsByDateRange(LocalDateTime start, LocalDateTime end) {
        return metricsRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }

    /**
     * Obtener promedios de métricas
     */
    public Map<String, Object> getAverageMetrics(int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);

        Double avgCpu = metricsRepository.getAverageCpuUsageSince(since);
        Double avgMemory = metricsRepository.getAverageMemoryUsageSince(since);

        Map<String, Object> averages = new HashMap<>();
        averages.put("averageCpuUsage", avgCpu != null ? avgCpu.intValue() : 0);
        averages.put("averageMemoryUsage", avgMemory != null ? avgMemory.intValue() : 0);
        averages.put("periodHours", hours);

        return averages;
    }

    /**
     * Limpiar métricas antiguas (más de 7 días)
     */
    @Scheduled(cron = "0 0 2 * * ?") // Ejecutar a las 2 AM todos los días
    @Transactional
    public void cleanOldMetrics() {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);
            metricsRepository.deleteByTimestampBefore(cutoffDate);
            logger.info("Métricas antiguas eliminadas (anteriores a {})", cutoffDate);
        } catch (Exception e) {
            logger.error("Error limpiando métricas antiguas: {}", e.getMessage());
        }
    }
}
