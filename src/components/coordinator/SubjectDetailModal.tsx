import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Users, FileText, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { coordinatorApi } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface SubjectDetailModalProps {
    subjectId: number;
    subjectName: string;
    onClose: () => void;
}

interface SubjectDetails {
    id: number;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
    grade?: {
        id: number;
        gradeName: string;
        gradeLevel: number;
    };
    teacher?: {
        id: number;
        name: string;
        email: string;
    };
    totalStudents: number;
    totalTasks: number;
    averageGrade: number;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
    subjectId,
    subjectName,
    onClose
}) => {
    const [subject, setSubject] = useState<SubjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSubjectDetails();
    }, [subjectId]);

    const loadSubjectDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📚 Cargando detalles de la materia:', subjectId);
            const response = await coordinatorApi.getSubjectDetails(subjectId);

            if (response.success) {
                setSubject(response.subject);
                console.log('✅ Detalles cargados:', response.subject);
            } else {
                setError('No se pudieron cargar los detalles');
            }
        } catch (err) {
            console.error('❌ Error cargando detalles:', err);
            setError('Error al cargar los detalles de la materia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div
                    className="sticky top-0 text-white p-6 rounded-t-lg"
                    style={{
                        background: subject?.color
                            ? `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}dd 100%)`
                            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Detalles de la Materia</h2>
                            <p className="text-white/90">{subjectName}</p>
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
                                    onClick={loadSubjectDetails}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    Reintentar
                                </Button>
                            </div>
                        </div>
                    ) : subject ? (
                        <div className="space-y-6">
                            {/* Información General */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" style={{ color: subject.color }} />
                                    Información General
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Descripción</p>
                                        <p className="font-medium">{subject.description || 'Sin descripción'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Grado</p>
                                        <p className="font-medium">{subject.grade?.gradeName || 'Sin grado'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Estado</p>
                                        <Badge className={subject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {subject.isActive ? (
                                                <><CheckCircle className="h-3 w-3 inline mr-1" /> Activa</>
                                            ) : (
                                                <><XCircle className="h-3 w-3 inline mr-1" /> Inactiva</>
                                            )}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Color</p>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded border border-gray-300"
                                                style={{ backgroundColor: subject.color }}
                                            ></div>
                                            <span className="font-mono text-sm">{subject.color}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Profesor Asignado */}
                            {subject.teacher ? (
                                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Profesor Asignado
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {subject.teacher.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{subject.teacher.name}</p>
                                            <p className="text-sm text-gray-600">{subject.teacher.email}</p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <User className="h-6 w-6 text-yellow-600" />
                                        <div>
                                            <p className="font-semibold text-yellow-900">Sin Profesor Asignado</p>
                                            <p className="text-sm text-yellow-700">Esta materia necesita un profesor</p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-600 rounded-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Estudiantes</p>
                                            <p className="text-2xl font-bold text-green-600">{subject.totalStudents}</p>
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
                                            <p className="text-2xl font-bold text-purple-600">{subject.totalTasks}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-600 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Promedio</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {subject.averageGrade > 0 ? subject.averageGrade.toFixed(1) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Rendimiento */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Rendimiento de la Materia
                                </h3>
                                <div className="text-center py-8 text-gray-500">
                                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                    <p>Estadísticas de rendimiento próximamente</p>
                                    <p className="text-sm mt-2">Aquí se mostrarán gráficas y análisis detallados</p>
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

export default SubjectDetailModal;
