import React, { useState } from 'react';
import { X, BarChart3, Download, FileText, Users, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import adminApi from '../../services/adminApi';

interface ReportsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGenerateReport = async (type: string) => {
        setLoading(true);
        setError('');
        setReport(null);

        try {
            const response = await adminApi.generateReport(type);
            console.log('✅ Reporte generado:', response);
            setReport(response.report);
        } catch (err: any) {
            console.error('❌ Error generando reporte:', err);
            setError('Error generando reporte');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!report) return;

        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-${report.reportType}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Reportes del Sistema</h2>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGenerateReport('general')}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Reporte General</h3>
                                        <p className="text-sm text-gray-600">Estadísticas completas del sistema</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGenerateReport('users')}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Users className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Reporte de Usuarios</h3>
                                        <p className="text-sm text-gray-600">Análisis de usuarios por rol</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGenerateReport('institutions')}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Building className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Reporte de Instituciones</h3>
                                        <p className="text-sm text-gray-600">Estado de instituciones</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGenerateReport('activity')}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <BarChart3 className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Reporte de Actividad</h3>
                                        <p className="text-sm text-gray-600">Actividad del sistema</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Generando reporte...</p>
                        </div>
                    )}

                    {report && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Reporte: {report.reportType}
                                    </h3>
                                    <Button
                                        size="sm"
                                        onClick={handleDownloadReport}
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Descargar
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Total Usuarios</p>
                                            <p className="text-2xl font-bold text-gray-900">{report.totalUsers}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Total Instituciones</p>
                                            <p className="text-2xl font-bold text-gray-900">{report.totalInstitutions}</p>
                                        </div>
                                    </div>

                                    {report.usersByRole && (
                                        <div className="bg-white p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Usuarios por Rol</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <p className="text-xs text-gray-600">Estudiantes</p>
                                                    <p className="text-lg font-semibold text-blue-600">{report.usersByRole.students}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Profesores</p>
                                                    <p className="text-lg font-semibold text-green-600">{report.usersByRole.teachers}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Coordinadores</p>
                                                    <p className="text-lg font-semibold text-purple-600">{report.usersByRole.coordinators}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Generado el</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(report.generatedAt).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
