import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Award,
    Users,
    BookOpen,
    Target,
    BarChart3,
    RefreshCw,
    Download,
    Filter
} from 'lucide-react';
import api from '../../services/api';

interface GradePerformance {
    grade: string;
    averageScore: number;
    totalStudents: number;
    passRate: number;
    atRiskStudents: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
}

interface SubjectPerformance {
    subjectName: string;
    teacherName: string;
    averageScore: number;
    completionRate: number;
    studentsCount: number;
}

interface Alert {
    id: number;
    type: 'critical' | 'warning' | 'info';
    message: string;
    studentName?: string;
    grade?: string;
    timestamp: string;
}

export default function AcademicAnalytics() {
    const [loading, setLoading] = useState(true);
    const [gradePerformance, setGradePerformance] = useState<GradePerformance[]>([]);
    const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
    const [showAlerts, setShowAlerts] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [selectedPeriod]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const [gradesRes, subjectsRes, alertsRes] = await Promise.all([
                api.get(`/coordinator/analytics/grades?period=${selectedPeriod}`),
                api.get(`/coordinator/analytics/subjects?period=${selectedPeriod}`),
                api.get('/coordinator/analytics/alerts')
            ]);

            setGradePerformance(gradesRes.data.grades || []);
            setSubjectPerformance(subjectsRes.data.subjects || []);
            setAlerts(alertsRes.data.alerts || []);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return <TrendingUp className="h-5 w-5 text-green-600" />;
        if (trend === 'down') return <TrendingDown className="h-5 w-5 text-red-600" />;
        return <div className="h-5 w-5" />;
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'critical': return 'bg-red-100 border-red-300 text-red-800';
            case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default: return 'bg-blue-100 border-blue-300 text-blue-800';
        }
    };

    const exportReport = () => {
        // Generar reporte en CSV
        const csvContent = [
            ['Grado', 'Promedio', 'Estudiantes', 'Tasa Aprobación', 'En Riesgo'],
            ...gradePerformance.map(g => [
                g.grade,
                g.averageScore.toFixed(2),
                g.totalStudents,
                `${g.passRate}%`,
                g.atRiskStudents
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-academico-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con controles */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="h-7 w-7 text-primary" />
                        Análisis de Rendimiento Académico
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Monitoreo en tiempo real del desempeño institucional
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                        {(['week', 'month', 'semester'] as const).map((period) => (
                            <Button
                                key={period}
                                variant={selectedPeriod === period ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedPeriod(period)}
                            >
                                {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Semestre'}
                            </Button>
                        ))}
                    </div>
                    <Button
                        onClick={exportReport}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                    <Button
                        onClick={loadAnalytics}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Promedio General</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {(gradePerformance.reduce((acc, g) => acc + g.averageScore, 0) / gradePerformance.length || 0).toFixed(2)}
                                </p>
                            </div>
                            <Award className="h-10 w-10 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tasa de Aprobación</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {(gradePerformance.reduce((acc, g) => acc + g.passRate, 0) / gradePerformance.length || 0).toFixed(0)}%
                                </p>
                            </div>
                            <Target className="h-10 w-10 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Estudiantes en Riesgo</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {gradePerformance.reduce((acc, g) => acc + g.atRiskStudents, 0)}
                                </p>
                            </div>
                            <AlertTriangle className="h-10 w-10 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Estudiantes</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {gradePerformance.reduce((acc, g) => acc + g.totalStudents, 0)}
                                </p>
                            </div>
                            <Users className="h-10 w-10 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rendimiento por Grado */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Rendimiento por Grado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {gradePerformance.map((grade) => (
                                <div
                                    key={grade.grade}
                                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="text-lg font-bold text-primary">{grade.grade}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{grade.grade}</h4>
                                                <p className="text-sm text-gray-600">{grade.totalStudents} estudiantes</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(grade.trend)}
                                            <span className={`text-sm font-medium ${grade.trend === 'up' ? 'text-green-600' :
                                                    grade.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                {grade.trendPercentage > 0 ? '+' : ''}{grade.trendPercentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-600">Promedio</p>
                                            <p className="text-lg font-bold text-gray-900">{grade.averageScore.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Aprobación</p>
                                            <p className="text-lg font-bold text-green-600">{grade.passRate}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">En Riesgo</p>
                                            <p className="text-lg font-bold text-orange-600">{grade.atRiskStudents}</p>
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="mt-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${grade.averageScore >= 4.0 ? 'bg-green-500' :
                                                        grade.averageScore >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${(grade.averageScore / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Rendimiento por Materia */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Top Materias por Rendimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {subjectPerformance
                                .sort((a, b) => b.averageScore - a.averageScore)
                                .slice(0, 8)
                                .map((subject, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{subject.subjectName}</p>
                                                <p className="text-xs text-gray-600">{subject.teacherName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">{subject.averageScore.toFixed(2)}</p>
                                                <p className="text-xs text-gray-600">{subject.completionRate}% completado</p>
                                            </div>
                                            <Badge className={
                                                subject.averageScore >= 4.5 ? 'bg-green-100 text-green-800' :
                                                    subject.averageScore >= 4.0 ? 'bg-blue-100 text-blue-800' :
                                                        subject.averageScore >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                            }>
                                                {subject.averageScore >= 4.5 ? 'Excelente' :
                                                    subject.averageScore >= 4.0 ? 'Bueno' :
                                                        subject.averageScore >= 3.0 ? 'Regular' : 'Bajo'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sistema de Alertas */}
            {showAlerts && alerts.length > 0 && (
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                Alertas y Notificaciones ({alerts.length})
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAlerts(false)}
                            >
                                Ocultar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {alerts.slice(0, 5).map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-medium">{alert.message}</p>
                                            {alert.studentName && (
                                                <p className="text-sm mt-1">
                                                    Estudiante: <span className="font-semibold">{alert.studentName}</span>
                                                    {alert.grade && ` - ${alert.grade}`}
                                                </p>
                                            )}
                                            <p className="text-xs mt-2 opacity-75">
                                                {new Date(alert.timestamp).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
