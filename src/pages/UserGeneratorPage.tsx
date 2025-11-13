import React, { useState } from 'react';
import { Users, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

const UserGeneratorPage: React.FC = () => {
  const [studentCount, setStudentCount] = useState(50);
  const [teacherCount, setTeacherCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      console.log('🎲 Generando usuarios...');
      
      const response = await api.post(`/generator/generate-users?studentCount=${studentCount}&teacherCount=${teacherCount}`);
      
      console.log('✅ Usuarios generados:', response.data);
      setResult(response.data);
      
    } catch (error: any) {
      console.error('❌ Error generando usuarios:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al generar usuarios'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClean = async () => {
    if (!confirm('¿Estás seguro de eliminar todos los usuarios de prueba (@test.com)?')) {
      return;
    }
    
    try {
      setLoading(true);
      setResult(null);
      
      console.log('🧹 Limpiando usuarios...');
      
      const response = await api.delete('/generator/clean-generated-users');
      
      console.log('✅ Usuarios eliminados:', response.data);
      setResult(response.data);
      
    } catch (error: any) {
      console.error('❌ Error limpiando usuarios:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al limpiar usuarios'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generador de Usuarios</h1>
              <p className="text-gray-600">Crea usuarios de prueba con nombres y apellidos españoles</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Estudiantes
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={studentCount}
                  onChange={(e) => setStudentCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Profesores
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={teacherCount}
                  onChange={(e) => setTeacherCount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Información */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Los usuarios se crearán con formato: <code className="bg-blue-100 px-1 rounded">nombre.apellido@test.com</code></li>
                <li>• Contraseña para todos: <code className="bg-blue-100 px-1 rounded">123456</code></li>
                <li>• Se distribuirán aleatoriamente entre las instituciones: 1, 6, 7, 8, 9, 10</li>
                <li>• Los estudiantes se crean sin grado asignado (asignar después manualmente)</li>
                <li>• Grados disponibles: Preescolar, Primero, Segundo, Tercero, Cuarto, Quinto</li>
                <li>• Si el email ya existe, se agregará un número al final</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerate}
                disabled={loading || studentCount < 1 || teacherCount < 1}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Generar Usuarios
                  </>
                )}
              </Button>

              <Button
                onClick={handleClean}
                disabled={loading}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Limpiar Usuarios de Prueba
              </Button>
            </div>

            {/* Resultado */}
            {result && (
              <div className={`rounded-lg p-6 ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.success ? '✅ Éxito' : '❌ Error'}
                </h3>
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
                {result.success && result.studentsGenerated !== undefined && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.studentsGenerated}</div>
                      <div className="text-sm text-gray-600">Estudiantes</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-indigo-600">{result.teachersGenerated}</div>
                      <div className="text-sm text-gray-600">Profesores</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.totalGenerated}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                  </div>
                )}
                {result.success && result.deletedCount !== undefined && (
                  <div className="mt-4 bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{result.deletedCount}</div>
                    <div className="text-sm text-gray-600">Usuarios eliminados</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGeneratorPage;
