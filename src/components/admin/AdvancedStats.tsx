import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { MapPin, TrendingUp, Award, Users, FileText, CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import adminApi from '../../services/adminApi';

export const AdvancedStats: React.FC = () => {
    const [institutionsByRegion, setInstitutionsByRegion] = useState<any>(null);
    const [monthlyActivity, setMonthlyActivity] = useState<any>(null);
    const [academicPerformance, setAcademicPerformance] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdvancedStats();
    }, []);

    const loadAdvancedStats = async () => {
        setLoading(true);
        try {
            console.log('📊 Cargando estadísticas avanzadas...');

            const [regionsData, activityData, performanceData] = await Promise.all([
                adminApi.getInstitutionsByRegion().catch(err => {
                    console.error('❌ Error en getInstitutionsByRegion:', err);
                    return { success: false, data: {}, error: err.message };
                }),
                adminApi.getMonthlyActivity().catch(err => {
                    console.error('❌ Error en getMonthlyActivity:', err);
                    return { success: false, data: {}, error: err.message };
                }),
                adminApi.getAcademicPerformance().catch(err => {
                    console.error('❌ Error en getAcademicPerformance:', err);
                    return { success: false, data: {}, error: err.message };
                }),
            ]);

            console.log('✅ Datos recibidos:', {
                regions: regionsData,
                activity: activityData,
                performance: performanceData
            });

            // Extraer los datos correctamente de la respuesta
            const regionsResult = regionsData?.data || regionsData || {};
            const activityResult = activityData?.data || activityData || {};
            const performanceResult = performanceData?.data || performanceData || {};

            console.log('📊 Datos procesados:', {
                regions: regionsResult,
                activity: activityResult,
                performance: performanceResult
            });

            setInstitutionsByRegion(regionsResult);
            setMonthlyActivity({
                newRegistrations: activityResult.newRegistrations || 0,
                tasksCreated: activityResult.tasksCreated || 0,
                gradesSubmitted: activityResult.gradesSubmitted || 0,
                reportsGenerated: activityResult.reportsGenerated || 0
            });
            setAcademicPerformance({
                averageGrade: performanceResult.averageGrade || 0,
                approvalRate: performanceResult.approvalRate || 0,
                attendanceRate: performanceResult.attendanceRate || 0
            });

            console.log('✅ Estadísticas avanzadas cargadas exitosamente');
        } catch (error: any) {
            console.error('❌ Error loading advanced stats:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });

            // Establecer datos vacíos en caso de error
            setInstitutionsByRegion({});
            setMonthlyActivity({
                newRegistrations: 0,
                tasksCreated: 0,
                gradesSubmitted: 0,
                reportsGenerated: 0
            });
            setAcademicPerformance({
                averageGrade: 0,
                approvalRate: 0,
                attendanceRate: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Datos para el gráfico de pie
    const pieChartData = institutionsByRegion ? {
        labels: Object.keys(institutionsByRegion),
        datasets: [
            {
                data: Object.values(institutionsByRegion),
                backgroundColor: [
                    '#3B82F6', // Azul
                    '#10B981', // Verde
                    '#F59E0B', // Naranja
                    '#EF4444', // Rojo
                    '#8B5CF6', // Púrpura
                ],
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    } : null;

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-48 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de recarga */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">📊 Estadísticas Avanzadas</h2>
                <Button
                    onClick={loadAdvancedStats}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Cargando...' : 'Actualizar'}
                </Button>
            </div>

            {/* Instituciones por Ubicación */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Instituciones por Ubicación
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {institutionsByRegion && Object.keys(institutionsByRegion).length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-64">
                                {pieChartData && <Pie data={pieChartData} options={pieChartOptions} />}
                            </div>
                            <div className="space-y-3">
                                {Object.entries(institutionsByRegion).map(([region, count]: [string, any]) => (
                                    <div key={region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-gray-900">{region}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No hay datos de instituciones por ubicación</p>
                            <p className="text-sm mt-2">Las instituciones aparecerán aquí cuando se registren con su dirección</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actividad Mensual */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Actividad Mensual
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                <span className="text-sm text-gray-600">Nuevos Registros</span>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                                +{monthlyActivity?.newRegistrations || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-6 h-6 text-green-600" />
                                <span className="text-sm text-gray-600">Tareas Creadas</span>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                                +{monthlyActivity?.tasksCreated || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                                <span className="text-sm text-gray-600">Calificaciones</span>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                                +{monthlyActivity?.gradesSubmitted || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-6 h-6 text-orange-600" />
                                <span className="text-sm text-gray-600">Reportes Generados</span>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">
                                +{monthlyActivity?.reportsGenerated || 0}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rendimiento Académico */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        Rendimiento Académico
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">Promedio General</p>
                            <p className="text-4xl font-bold text-yellow-600">
                                {academicPerformance?.averageGrade?.toFixed(1) || '0.0'}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Escala de 1.0 a 5.0</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">Aprobación</p>
                            <p className="text-4xl font-bold text-green-600">
                                {academicPerformance?.approvalRate?.toFixed(0) || '0'}%
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Estudiantes aprobados</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-2">Asistencia</p>
                            <p className="text-4xl font-bold text-blue-600">
                                {academicPerformance?.attendanceRate?.toFixed(0) || '0'}%
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Promedio de asistencia</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
