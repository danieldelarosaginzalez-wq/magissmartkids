import React, { useState } from 'react';
import { FileText, Download, TrendingUp, Users, BookOpen, BarChart3, RefreshCw } from 'lucide-react';
import { coordinatorApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AdvancedReportsPanel: React.FC = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);

    const institutionId = user?.institution?.id ? parseInt(user.institution.id) : 1;

    const reports = [
        {
            id: 'institutional-performance',
            title: 'Rendimiento Institucional',
            description: 'Análisis completo del rendimiento de la institución',
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            action: () => generateReport('institutional-performance')
        },
        {
            id: 'teacher-activity',
            title: 'Actividad de Profesores',
            description: 'Estadísticas de actividad y carga de trabajo',
            icon: Users,
            color: 'from-green-500 to-green-600',
            action: () => generateReport('teacher-activity')
        },
        {
            id: 'student-participation',
            title: 'Participación Estudiantil',
            description: 'Análisis de participación y engagement',
            icon: BookOpen,
            color: 'from-purple-500 to-purple-600',
            action: () => generateReport('student-participation')
        }
    ];

    const generateReport = async (reportType: string) => {
        try {
            setLoading(true);
            setSelectedReport(reportType);

            console.log(`📊 Generando reporte: ${reportType} para institución ${institutionId}`);

            let response;
            switch (reportType) {
                case 'institutional-performance':
                    response = await coordinatorApi.getInstitutionalPerformance(institutionId);
                    break;
                case 'teacher-activity':
                    response = await coordinatorApi.getTeacherActivity(institutionId);
                    break;
                case 'student-participation':
                    response = await coordinatorApi.getStudentParticipation(institutionId);
                    break;
                default:
                    throw new Error('Tipo de reporte no válido');
            }

            console.log('📦 Respuesta del reporte:', response);

            if (response && response.success) {
                setReportData(response);
                console.log('✅ Reporte generado exitosamente');
            } else {
                console.warn('⚠️ Respuesta sin success flag:', response);
                setReportData(response); // Intentar mostrar de todos modos
            }
        } catch (error: any) {
            console.error('❌ Error generando reporte:', error);
            console.error('❌ Error details:', error.response?.data);
            alert(`Error al generar el reporte: ${error.response?.data?.message || error.message}`);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = () => {
        if (!reportData) return;

        // Convertir a JSON y descargar
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-${selectedReport}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        Reportes Avanzados
                    </h2>
                    <p className="text-gray-600 mt-1">Genera reportes detallados de tu institución</p>
                </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map((report) => {
                    const Icon = report.icon;
                    const isSelected = selectedReport === report.id;

                    return (
                        <Card
                            key={report.id}
                            className={`p-6 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
                                }`}
                            onClick={report.action}
                        >
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    report.action();
                                }}
                                disabled={loading}
                                className="w-full"
                                variant={isSelected ? 'default' : 'outline'}
                            >
                                {loading && isSelected ? (
                                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generando...</>
                                ) : (
                                    <><FileText className="h-4 w-4 mr-2" /> Generar</>
                                )}
                            </Button>
                        </Card>
                    );
                })}
            </div>

            {/* Report Results */}
            {reportData && (
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Resultados del Reporte</h3>
                        <Button onClick={exportReport} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar JSON
                        </Button>
                    </div>

                    {/* Institutional Performance */}
                    {selectedReport === 'institutional-performance' && reportData.report && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">{reportData.report.totalTeachers}</p>
                                    <p className="text-sm text-gray-600">Profesores</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">{reportData.report.totalStudents}</p>
                                    <p className="text-sm text-gray-600">Estudiantes</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-purple-600">{reportData.report.totalSubjects}</p>
                                    <p className="text-sm text-gray-600">Materias</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-orange-600">
                                        {reportData.report.averageSubjectsPerTeacher.toFixed(1)}
                                    </p>
                                    <p className="text-sm text-gray-600">Materias/Profesor</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Teacher Activity */}
                    {selectedReport === 'teacher-activity' && reportData.teachers && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 mb-4">
                                Total de profesores: <span className="font-bold">{reportData.total}</span>
                            </p>
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {reportData.teachers.map((teacher: any) => (
                                    <div key={teacher.teacherId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{teacher.teacherName}</p>
                                            <p className="text-sm text-gray-600">{teacher.email}</p>
                                            {teacher.subjects.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Materias: {teacher.subjects.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">{teacher.totalSubjects}</p>
                                            <p className="text-xs text-gray-600">materias</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Participation */}
                    {selectedReport === 'student-participation' && reportData.report && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-blue-600">{reportData.report.totalStudents}</p>
                                    <p className="text-sm text-gray-600">Total Estudiantes</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-green-600">{reportData.report.activeStudents}</p>
                                    <p className="text-sm text-gray-600">Estudiantes Activos</p>
                                </div>
                            </div>

                            {reportData.report.studentsByGrade && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Distribución por Grado</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(reportData.report.studentsByGrade).map(([grade, count]: [string, any]) => (
                                            <div key={grade} className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-lg font-bold text-gray-900">{count}</p>
                                                <p className="text-sm text-gray-600">{grade}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            )}

            {/* Empty State */}
            {!reportData && !loading && (
                <Card className="p-12">
                    <div className="text-center text-gray-500">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">Selecciona un reporte para comenzar</p>
                        <p className="text-sm">Haz clic en una de las tarjetas arriba para generar un reporte</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdvancedReportsPanel;
