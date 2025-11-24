import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, Server, Users, Building, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import adminApi from '../../services/adminApi';

interface MonitoringModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MonitoringModal: React.FC<MonitoringModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [monitoring, setMonitoring] = useState<any>(null);
    const [error, setError] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadMonitoring();
        }
    }, [isOpen]);

    useEffect(() => {
        if (autoRefresh && isOpen) {
            const interval = setInterval(loadMonitoring, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, isOpen]);

    const loadMonitoring = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await adminApi.getMonitoringStatus();
            console.log('✅ Estado del monitoreo:', response);
            setMonitoring(response.monitoring);
        } catch (err: any) {
            console.error('❌ Error obteniendo monitoreo:', err);
            setError('Error obteniendo estado del monitoreo');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Monitoreo del Sistema</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="success" className="text-sm">
                                <Activity className="w-4 h-4 mr-1" />
                                Sistema Operacional
                            </Badge>
                            {monitoring && (
                                <span className="text-sm text-gray-600">
                                    Actualizado: {new Date(monitoring.timestamp).toLocaleTimeString('es-ES')}
                                </span>
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
                                onClick={loadMonitoring}
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                        </div>
                    </div>

                    {loading && !monitoring ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando estado del sistema...</p>
                        </div>
                    ) : monitoring ? (
                        <div className="space-y-6">
                            {/* Estado del Sistema */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Server className="w-5 h-5 text-purple-600" />
                                        Estado del Sistema
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <p className="text-lg font-semibold text-green-600 capitalize">
                                                {monitoring.systemStatus}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Uptime</p>
                                            <p className="text-lg font-semibold text-gray-900">{monitoring.uptime}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Uso de Memoria</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {monitoring.memoryUsagePercent}%
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Métricas de Memoria */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                        Métricas de Memoria
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Memoria Utilizada</span>
                                                <span className="font-medium text-gray-900">
                                                    {monitoring.memoryUsedMB} MB / {monitoring.memoryMaxMB} MB
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${monitoring.memoryUsagePercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Usuarios e Instituciones */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            Usuarios
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Usuarios Activos</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {monitoring.activeUsers}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total de Usuarios</span>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {monitoring.totalUsers}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Tasa de Actividad</span>
                                                    <span className="font-medium text-gray-900">
                                                        {Math.round((monitoring.activeUsers / monitoring.totalUsers) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Building className="w-5 h-5 text-orange-600" />
                                            Instituciones
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Instituciones Activas</span>
                                                <span className="text-2xl font-bold text-orange-600">
                                                    {monitoring.activeInstitutions}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total de Instituciones</span>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {monitoring.totalInstitutions}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Tasa de Actividad</span>
                                                    <span className="font-medium text-gray-900">
                                                        {Math.round((monitoring.activeInstitutions / monitoring.totalInstitutions) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="p-6 border-t">
                    <Button onClick={onClose} variant="outline" className="w-full">
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};
