import React, { useState, useEffect } from 'react';
import { BookOpen, User, GraduationCap, Eye } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';
import SubjectDetailModal from './SubjectDetailModal';

interface Subject {
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  schoolGrade?: {
    id: number;
    gradeName: string;
    gradeLevel: number;
    section: string;
  };
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SubjectsSectionProps {
  limit?: number;
}

const SubjectsSection: React.FC<SubjectsSectionProps> = ({ limit = 10 }) => {
  const { user, token } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    withTeacher: 0,
    withoutTeacher: 0
  });
  const [showSubjectDetail, setShowSubjectDetail] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    console.log('🎯 SubjectsSection montado, cargando materias...');
    console.log('👤 Usuario:', user);
    console.log('🏫 Institución ID:', user?.institution?.id);
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const institutionId = user?.institution?.id || 1;

      // Verificar que tenemos token
      if (!token) {
        console.error('❌ No hay token disponible');
        setError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      console.log('🔍 Cargando materias para institución:', institutionId);
      console.log('🔑 Token disponible:', token ? `${token.substring(0, 20)}...` : 'NO');

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Cargar materias usando axios directamente
      const subjectsRes = await axios.get(`${API_BASE_URL}/subjects/institution/${institutionId}`, config);
      console.log('✅ Materias recibidas:', subjectsRes.data);
      const subjectsData = subjectsRes.data.subjects || [];
      setSubjects(subjectsData);

      // Cargar estadísticas
      const statsRes = await axios.get(`${API_BASE_URL}/subjects/stats/institution/${institutionId}`, config);
      console.log('✅ Estadísticas recibidas:', statsRes.data);
      if (statsRes.data.success) {
        setStats({
          total: statsRes.data.totalSubjects || 0,
          withTeacher: statsRes.data.subjectsWithTeacher || 0,
          withoutTeacher: statsRes.data.subjectsWithoutTeacher || 0
        });
      }

      setError(null);
    } catch (error) {
      console.error('❌ Error cargando materias:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', error.response?.data);
        setError(`Error ${error.response?.status}: ${error.response?.statusText || 'Error al cargar materias'}`);
      } else {
        setError('Error desconocido al cargar materias');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-center py-4 text-blue-600">
          <p>⏳ Cargando materias...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">❌ Error al cargar materias</p>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={loadSubjects}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.withTeacher}</p>
          <p className="text-xs text-green-600">Con Profesor</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.withoutTeacher}</p>
          <p className="text-xs text-amber-600">Sin Profesor</p>
        </div>
      </div>

      {/* Lista de materias */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {subjects.slice(0, limit).map((subject) => (
          <div
            key={subject.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: `${subject.color}10` }}
          >
            {/* Icono con color de la materia */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: subject.color }}
            >
              <BookOpen className="h-5 w-5" />
            </div>

            {/* Información de la materia */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 truncate">{subject.name}</p>
                {subject.schoolGrade && (
                  <span className="px-2 py-0.5 bg-white rounded text-xs font-medium text-gray-600">
                    {subject.schoolGrade.gradeName}
                  </span>
                )}
              </div>

              {subject.teacher ? (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">
                    {subject.teacher.firstName} {subject.teacher.lastName}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-amber-600 mt-1">Sin profesor asignado</p>
              )}
            </div>

            {/* Indicador de estado */}
            <div className={`w-2 h-2 rounded-full ${subject.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No hay materias registradas</p>
        </div>
      )}

      {/* Modal de Detalles */}
      {showSubjectDetail && (
        <SubjectDetailModal
          subjectId={showSubjectDetail.id}
          subjectName={showSubjectDetail.name}
          onClose={() => setShowSubjectDetail(null)}
        />
      )}
    </div>
  );
};

export default SubjectsSection;
