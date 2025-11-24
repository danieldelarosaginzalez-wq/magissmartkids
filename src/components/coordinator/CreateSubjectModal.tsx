import React, { useState, useEffect } from 'react';
import { X, BookOpen, Palette } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { coordinatorApi } from '../../services/api';
import axios from 'axios';

interface CreateSubjectModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface Grade {
    id: number;
    gradeName: string;
    gradeLevel: number;
}

const SUBJECT_COLORS = [
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#8B5CF6', // Púrpura
    '#F59E0B', // Naranja
    '#EF4444', // Rojo
    '#EC4899', // Rosa
    '#14B8A6', // Teal
    '#F97316', // Naranja oscuro
    '#6366F1', // Índigo
    '#84CC16', // Lima
];

export const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
    onClose,
    onSuccess
}) => {
    const { user, token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: SUBJECT_COLORS[0],
        gradeId: '',
        isActive: true
    });

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
            const institutionId = user?.institution?.id || 1;
            const url = `${API_BASE_URL}/coordinator/school-grades?institutionId=${institutionId}`;

            console.log('🔍 Cargando grados desde:', url);
            console.log('🏫 Institution ID:', institutionId);
            console.log('🔑 Token:', token ? 'Presente' : 'Ausente');

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('📦 Respuesta completa:', response);
            console.log('📊 Datos recibidos:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setGrades(response.data);
                console.log('✅ Grados cargados exitosamente:', response.data.length);
                console.log('📋 Grados:', response.data);
            } else {
                console.warn('⚠️ Respuesta de grados no es un array:', response.data);
                setGrades([]);
            }
        } catch (error: any) {
            console.error('❌ Error cargando grados:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error data:', error.response?.data);
            setGrades([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.gradeId) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            setLoading(true);
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

            const payload = {
                name: formData.name,
                description: formData.description,
                color: formData.color,
                schoolGradeId: parseInt(formData.gradeId),
                institutionId: user?.institution?.id ? parseInt(user.institution.id) : 1,
                isActive: formData.isActive
            };

            console.log('📤 Creando materia:', payload);

            const response = await axios.post(`${API_BASE_URL}/coordinator/subjects`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Materia creada:', response.data);
            alert('✅ Materia creada exitosamente');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('❌ Error creando materia:', error);
            alert('❌ Error al crear la materia: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Crear Nueva Materia</h2>
                            <p className="text-blue-100">Agrega una nueva materia a la institución</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Materia *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: Matemáticas, Español, Ciencias..."
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Descripción opcional de la materia..."
                            rows={3}
                        />
                    </div>

                    {/* Grado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grado *
                        </label>
                        <select
                            required
                            value={formData.gradeId}
                            onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Selecciona un grado</option>
                            {Array.isArray(grades) && grades.map((grade) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.gradeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color Identificador
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {SUBJECT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`h-12 rounded-lg transition-all ${formData.color === color
                                        ? 'ring-4 ring-offset-2 ring-blue-500 scale-110'
                                        : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {formData.color === color && (
                                        <div className="flex items-center justify-center">
                                            <Palette className="h-5 w-5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Color seleccionado: <span className="font-mono">{formData.color}</span>
                        </p>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Materia activa
                        </label>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Vista Previa:</p>
                        <div
                            className="flex items-center gap-3 p-4 rounded-lg"
                            style={{ backgroundColor: `${formData.color}20` }}
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: formData.color }}
                            >
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {formData.name || 'Nombre de la materia'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {Array.isArray(grades) && grades.find(g => g.id === parseInt(formData.gradeId))?.gradeName || 'Selecciona un grado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Creando...' : 'Crear Materia'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSubjectModal;
