import React, { useState, useEffect } from 'react';
import { X, User, Mail, GraduationCap, CheckCircle, XCircle, FileText, Trophy, TrendingUp, Clock } from 'lucide-react';
import { coordinatorApi } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface StudentDetailModalProps {
    studentId: number;
    studentName: string;
    onClose: () => void;
}

interface StudentStats {
    studentId: number;
    studentName: string;
    email: string;
    isActive: boolean;
    grade: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    averageGrade: number;
    completionRate: number;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
    studentId,
    studentName,
    onClose
}) => {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStudentStats();
    }, [studentId]);

    const loadStudentStats = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📊 Cargando estadísticas del estudiante:', studentId);
            const response = await coordinatorApi.getStudentStats(studentId);

            if (response.success) {
                setStats(response.stats);
                console.log('✅ Estadísticas cargadas:', response.stats);
            } else {
                setError('No se pudieron cargar las estadísticas');
            }
        } catch (err) {
            console.error('❌ Error cargando estadísticas:', err);
            setError('Error al cargar las estadísticas del estudiante');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Detalles del Estudiante</h2>
                            <p className="text-purple-100">{studentName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 font-semibold mb-2">❌ Error</p>
                                <p className="text-sm text-red-500">{error}</p>
                                <Button
                                    onClick={loadStudentStats}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    Reintentar
                                </Button>
                            </div>
                        </div>
                    ) : stats ? (
                        <div className="space-y-6">
                            {/* Información General */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-purple-600" />
                                    Información General
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{stats.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Grado</p>
                                            <p className="font-medium">{stats.grade}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {stats.isActive ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <Badge className={stats.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                {stats.isActive ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-600 rounded-lg">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Tareas</p>
                                            <p className="text-2xl font-bold text-blue-600">{stats.totalTasks}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-600 rounded-lg">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Completadas</p>
                                            <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-yellow-600 rounded-lg">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Pendientes</p>
                                            <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-600 rounded-lg">
                                            <Trophy className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Promedio</p>
                                            <p className="text-2xl font-bold text-purple-600">{stats.averageGrade.toFixed(1)}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Progreso */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Progreso General
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Tasa de Completación</span>
                                            <span className="text-sm font-bold text-gray-900">{stats.completionRate.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${stats.completionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                                            <p className="text-sm text-gray-600">Tareas Completadas</p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                            <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                                            <p className="text-sm text-gray-600">Tareas Pendientes</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Rendimiento por Materia */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-purple-600" />
                                    Rendimiento por Materia
                                </h3>
                                <div className="text-center py-8 text-gray-500">
                                    <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p>Detalles por materia próximamente</p>
                                </div>
                            </Card>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-lg border-t">
                    <div className="flex justify-end gap-3">
                        <Button onClick={onClose} variant="outline">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;
