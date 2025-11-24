import React, { useState, useEffect } from 'react';
import { X, BookOpen, Users, FileText, TrendingUp, Mail, CheckCircle, XCircle } from 'lucide-react';
import { coordinatorApi } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TeacherDetailModalProps {
    teacherId: number;
    teacherName: string;
    onClose: () => void;
}

interface TeacherStats {
    teacherId: number;
    teacherName: string;
    email: string;
    isActive: boolean;
    totalSubjects: number;
    totalStudents: number;
    subjects: Array<{
        id: number;
        name: string;
        grade: string;
        color: string;
    }>;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
    teacherId,
    teacherName,
    onClose
}) => {
    const [stats, setStats] = useState<TeacherStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeacherStats();
    }, [teacherId]);

    const loadTeacherStats = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📊 Cargando estadísticas del profesor:', teacherId);
            const response = await coordinatorApi.getTeacherStats(teacherId);

            if (response.success) {
                setStats(response.stats);
                console.log('✅ Estadísticas cargadas:', response.stats);
            } else {
                setError('No se pudieron cargar las estadísticas');
            }
        } catch (err) {
            console.error('❌ Error cargando estadísticas:', err);
            setError('Error al cargar las estadísticas del profesor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Detalles del Profesor</h2>
                            <p className="text-blue-100">{teacherName}</p>
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
                                    onClick={loadTeacherStats}
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
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Información General
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{stats.email}</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-600 rounded-lg">
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Materias</p>
                                            <p className="text-2xl font-bold text-blue-600">{stats.totalSubjects}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-600 rounded-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Estudiantes</p>
                                            <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-600 rounded-lg">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Tareas</p>
                                            <p className="text-2xl font-bold text-purple-600">0</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Materias */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                    Materias Asignadas ({stats.subjects.length})
                                </h3>
                                {stats.subjects.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                        <p>No tiene materias asignadas</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {stats.subjects.map((subject) => (
                                            <div
                                                key={subject.id}
                                                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                                style={{ backgroundColor: `${subject.color}10` }}
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                                    style={{ backgroundColor: subject.color }}
                                                >
                                                    <BookOpen className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{subject.name}</p>
                                                    <p className="text-sm text-gray-600">{subject.grade}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Rendimiento */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Rendimiento
                                </h3>
                                <div className="text-center py-8 text-gray-500">
                                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p>Estadísticas de rendimiento próximamente</p>
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

export default TeacherDetailModal;
