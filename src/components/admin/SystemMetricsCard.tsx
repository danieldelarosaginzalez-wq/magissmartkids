import React, { useState, useEffect } from 'react';
import { Cpu, Server, HardDrive, Network, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import adminApi from '../../services/adminApi';

interface SystemMetrics {
    cpuUsage: number;
    memoryUsagePercent: number;
    diskUsagePercent: number;
    networkTrafficMbps: number;
    systemStatus: string;
}

export const SystemMetricsCard: React.FC = () => {
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMetrics();
        const interval = setInterval(loadMetrics, 30000); // Actualizar cada 30 segundos
        return () => clearInterval(interval);
    }, []);

    const loadMetrics = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getSystemMetrics();
            setMetrics(data as SystemMetrics);
        } catch (error) {
            console.error('Error loading metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUsageColor = (usage: number) => {
        if (usage >= 90) return 'text-red-600';
        if (usage >= 70) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Métricas del Sistema
                </CardTitle>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={loadMetrics}
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {metrics ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* CPU */}
                        <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                            <Cpu className="w-8 h-8 text-blue-600 mb-2" />
                            <span className={`text-2xl font-bold ${getUsageColor(metrics.cpuUsage)}`}>
                                {metrics.cpuUsage}%
                            </span>
                            <span className="text-sm text-gray-600">CPU</span>
                        </div>

                        {/* Memoria */}
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                            <Server className="w-8 h-8 text-green-600 mb-2" />
                            <span className={`text-2xl font-bold ${getUsageColor(metrics.memoryUsagePercent)}`}>
                                {metrics.memoryUsagePercent}%
                            </span>
                            <span className="text-sm text-gray-600">Memoria</span>
                        </div>

                        {/* Disco */}
                        <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                            <HardDrive className="w-8 h-8 text-purple-600 mb-2" />
                            <span className={`text-2xl font-bold ${getUsageColor(metrics.diskUsagePercent)}`}>
                                {metrics.diskUsagePercent}%
                            </span>
                            <span className="text-sm text-gray-600">Disco</span>
                        </div>

                        {/* Red */}
                        <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
                            <Network className="w-8 h-8 text-orange-600 mb-2" />
                            <span className="text-2xl font-bold text-orange-600">
                                {metrics.networkTrafficMbps}
                            </span>
                            <span className="text-sm text-gray-600">MB/s</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Cargando métricas...</p>
                    </div>
                )}

                {metrics && (
                    <div className="mt-4 pt-4 border-t text-center">
                        <span className="text-sm text-gray-600">Estado del Sistema: </span>
                        <span className={`font-semibold ${getStatusColor(metrics.systemStatus)}`}>
                            {metrics.systemStatus === 'operational' ? 'Operacional' :
                                metrics.systemStatus === 'warning' ? 'Advertencia' : 'Crítico'}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
