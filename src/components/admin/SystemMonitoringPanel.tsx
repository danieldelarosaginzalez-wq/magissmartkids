import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, Server, Users, Building, RefreshCw, Cpu, HardDrive, Network, Zap, TrendingUp, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import adminApi from '../../services/adminApi';

interface SystemMonitoringPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SystemMetrics {
    timestamp: string;
    cpuUsage: number;
    memoryUsagePercent: number;
    memoryUsedMb: number;
    memoryMaxMb: number;
    diskUsagePercent: number;
    diskUsedGb: number;
    diskTotalGb: number;
    networkTrafficMbps: number;
    activeConnections: number;
    responseTimeMs: number;
    requestsPerMinute: number;
    systemStatus: string;
    uptimeHours: number;
}

export const SystemMonitoringPanel: React.FC<SystemMonitoringPanelProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [error, setError] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadMetrics();
        }
    }, [isOpen]);

    useEffect(() => {
        if (autoRefresh && isOpen) {
            const interval = setInterval(loadMetrics, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, isOpen]);

    const loadMetrics = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await adminApi.getSystemMetrics();
            console.log('✅ Respuesta completa del API:', response);

            // Extraer los datos correctamente según la estructura del backend
            const metricsData = response.data || response;
            console.log('📊 Datos de métricas extraídos:', metricsData);

            // Mapear los datos al formato esperado
            const formattedMetrics: SystemMetrics = {
                timestamp: metricsData.timestamp || new Date().toISOString(),
                cpuUsage: Math.round(metricsData.cpuUsage || 0),
                memoryUsagePercent: Math.round(metricsData.memoryUsagePercent || 0),
                memoryUsedMb: Math.round(metricsData.memoryUsedMB || metricsData.memoryUsedMb || 0),
                memoryMaxMb: Math.round(metricsData.memoryMaxMB || metricsData.memoryMaxMb || 0),
                diskUsagePercent: Math.round(metricsData.diskUsagePercent || 0),
                diskUsedGb: parseFloat((metricsData.diskUsedGB || metricsData.diskUsedGb || 0).toFixed(2)),
                diskTotalGb: parseFloat((metricsData.diskTotalGB || metricsData.diskTotalGb || 0).toFixed(2)),
                networkTrafficMbps: parseFloat((metricsData.networkTrafficMbps || 0).toFixed(2)),
                activeConnections: metricsData.activeConnections || 0,
                responseTimeMs: Math.round(metricsData.responseTimeMs || 0),
                requestsPerMinute: metricsData.requestsPerMinute || 0,
                systemStatus: metricsData.systemStatus || 'operational',
                uptimeHours: parseFloat((metricsData.uptimeHours || 0).toFixed(2))
            };

            console.log('✅ Métricas formateadas:', formattedMetrics);
            setMetrics(formattedMetrics);
        } catch (err: any) {
            console.error('❌ Error obteniendo métricas:', err);
            setError('Error obteniendo métricas del sistema');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getUsageColor = (usage: number) => {
        if (usage >= 90) return 'bg-red-600';
        if (usage >= 70) return 'bg-yellow-500';
        return 'bg-green-600';
    };

    const formatUptime = (hours: number) => {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.floor(hours % 24);
        return `${days}d ${remainingHours}h`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Panel de Monitoreo del Sistema</h2>
                            <p className="text-sm text-gray-600">Monitoreo en tiempo real de recursos y rendimiento</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {metrics && (
                                <>
                                    <Badge className={`text-sm border ${getStatusColor(metrics.systemStatus)}`}>
                                        <Activity className="w-4 h-4 mr-1" />
                                        {metrics.systemStatus === 'operational' ? 'Operacional' :
                                            metrics.systemStatus === 'warning' ? 'Advertencia' : 'Crítico'}
                                    </Badge>
                                    <span className="text-sm text-gray-600">
                                        Actualizado: {new Date(metrics.timestamp).toLocaleTimeString('es-ES')}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={autoRefresh ? 'bg-green-50 border-green-300' : ''}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                            </Button>
                            <Button
                                size="sm"
                                onClick={loadMetrics}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>

                    {loading && !metrics ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando métricas del sistema...</p>
                        </div>
                    ) : metrics ? (
                        <div className="space-y-6">
                            {/* Métricas Principales */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* CPU */}
                                <Card className="border-2 border-blue-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Cpu className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600">{metrics.cpuUsage}%</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">CPU</p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(metrics.cpuUsage)}`}
                                                style={{ width: `${metrics.cpuUsage}%` }}
                                            ></div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Memoria */}
                                <Card className="border-2 border-green-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Server className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="text-2xl font-bold text-green-600">{metrics.memoryUsagePercent}%</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Memoria</p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(metrics.memoryUsagePercent)}`}
                                                style={{ width: `${metrics.memoryUsagePercent}%` }}
                                            ></div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Disco */}
                                <Card className="border-2 border-purple-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <HardDrive className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <span className="text-2xl font-bold text-purple-600">{metrics.diskUsagePercent}%</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Disco</p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(metrics.diskUsagePercent)}`}
                                                style={{ width: `${metrics.diskUsagePercent}%` }}
                                            ></div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Red */}
                                <Card className="border-2 border-orange-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Network className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">{metrics.networkTrafficMbps}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Red</p>
                                        <p className="text-xs text-gray-500 mt-1">MB/s</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detalles de Recursos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Memoria Detallada */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Server className="w-5 h-5 text-green-600" />
                                            Uso de Memoria
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Memoria Utilizada</span>
                                                <span className="font-semibold text-gray-900">{metrics.memoryUsedMb} MB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Memoria Máxima</span>
                                                <span className="font-semibold text-gray-900">{metrics.memoryMaxMb} MB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Memoria Disponible</span>
                                                <span className="font-semibold text-gray-900">
                                                    {metrics.memoryMaxMb - metrics.memoryUsedMb} MB
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Disco Detallado */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <HardDrive className="w-5 h-5 text-purple-600" />
                                            Uso de Disco
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Espacio Utilizado</span>
                                                <span className="font-semibold text-gray-900">{metrics.diskUsedGb} GB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Espacio Total</span>
                                                <span className="font-semibold text-gray-900">{metrics.diskTotalGb} GB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Espacio Disponible</span>
                                                <span className="font-semibold text-gray-900">
                                                    {metrics.diskTotalGb - metrics.diskUsedGb} GB
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Métricas de Rendimiento */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        Rendimiento del Sistema
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-yellow-600" />
                                                <p className="text-sm text-gray-600">Tiempo de Respuesta</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{metrics.responseTimeMs}ms</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-4 h-4 text-green-600" />
                                                <p className="text-sm text-gray-600">Solicitudes/min</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{metrics.requestsPerMinute}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <p className="text-sm text-gray-600">Conexiones Activas</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{metrics.activeConnections}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                <p className="text-sm text-gray-600">Uptime</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{formatUptime(metrics.uptimeHours)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="p-6 border-t">
                    <Button onClick={onClose} variant="outline" className="w-full">
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};
