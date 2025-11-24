package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.SystemMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SystemMetricsRepository extends JpaRepository<SystemMetrics, Long> {

    /**
     * Obtener las métricas más recientes
     */
    Optional<SystemMetrics> findFirstByOrderByTimestampDesc();

    /**
     * Obtener métricas en un rango de tiempo
     */
    List<SystemMetrics> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);

    /**
     * Obtener las últimas N métricas
     */
    List<SystemMetrics> findTop24ByOrderByTimestampDesc();

    /**
     * Calcular promedio de uso de CPU en las últimas horas
     */
    @Query("SELECT AVG(m.cpuUsage) FROM SystemMetrics m WHERE m.timestamp >= :since")
    Double getAverageCpuUsageSince(@Param("since") LocalDateTime since);

    /**
     * Calcular promedio de uso de memoria en las últimas horas
     */
    @Query("SELECT AVG(m.memoryUsagePercent) FROM SystemMetrics m WHERE m.timestamp >= :since")
    Double getAverageMemoryUsageSince(@Param("since") LocalDateTime since);

    /**
     * Eliminar métricas antiguas (más de 7 días)
     */
    @Modifying
    @Query("DELETE FROM SystemMetrics m WHERE m.timestamp < :timestamp")
    void deleteByTimestampBefore(@Param("timestamp") LocalDateTime timestamp);
}
