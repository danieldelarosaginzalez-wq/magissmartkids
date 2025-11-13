import React, { useState } from 'react';
import { Settings, Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Layout from '../components/Layout';

const InitializationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const assignUsersToInstitution = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/init/assign-users-to-institution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        loadStats(); // Recargar estadísticas
      } else {
        setError(data.message || 'Error al asignar usuarios');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/init/user-stats');
      const data = await response.json();

      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    Inicialización del Sistema
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Configuración inicial de usuarios e instituciones
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          {stats && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Estadísticas Actuales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total de Usuarios</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Con Institución</p>
                  <p className="text-2xl font-bold text-green-600">{stats.usersWithInstitution}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Sin Institución</p>
                  <p className="text-2xl font-bold text-red-600">{stats.usersWithoutInstitution}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Asignar Usuarios a Institución
            </h2>
            <p className="text-gray-600 mb-6">
              Este proceso asignará todos los usuarios sin institución a la institución por defecto (ID: 1).
              Los usuarios que ya tienen una institución asignada no serán modificados.
            </p>

            <Button
              onClick={assignUsersToInstitution}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Asignar Usuarios a Institución</span>
                </>
              )}
            </Button>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    ¡Proceso Completado!
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <p><strong>Institución:</strong> {result.institution?.name}</p>
                    <p><strong>Total de usuarios:</strong> {result.totalUsers}</p>
                    <p><strong>Usuarios actualizados:</strong> {result.updated}</p>
                    <p><strong>Usuarios omitidos:</strong> {result.skipped}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Card */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Error
                  </h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  ⚠️ Advertencia
                </h3>
                <p className="text-sm text-yellow-800">
                  Esta página es solo para desarrollo. Deshabilitar en producción.
                  Los cambios realizados son permanentes en la base de datos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InitializationPage;
