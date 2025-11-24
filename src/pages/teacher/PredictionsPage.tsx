import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AlertTriangle, TrendingUp, CheckCircle, RefreshCw, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

interface Prediction {
  nombre: string;
  promedioNotas: number;
  tareasCalificadas: number;
  tareasSinCalificar: number;
  tareasSinEntregar: number;
  porcentajeEntrega: number;
  resultado: string;
  riesgo: string;
  recomendacion: string;
}

interface PredictionResponse {
  grado: string;
  totalEstudiantes: number;
  predicciones: Prediction[];
  estadisticas: {
    aprobados: number;
    enRiesgo: number;
    reprobados: number;
  };
  modelo: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    loadAvailableGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      loadPredictions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrade]);

  const loadAvailableGrades = async () => {
    try {
      const response = await api.get('/teacher/subjects');
      const subjects = response.data.subjects || [];
      const grades = subjects.map((s: any) => s.grade as string).filter((g: string) => g && g !== 'Sin grado');
      const uniqueGrades: string[] = Array.from(new Set(grades));
      setAvailableGrades(uniqueGrades);
      if (uniqueGrades.length > 0) {
        setSelectedGrade(uniqueGrades[0] as string);
      }
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/predictions/student-performance?grade=${encodeURIComponent(selectedGrade)}`);

      // Eliminar duplicados de predicciones basándose en el nombre del estudiante
      if (response.data && response.data.predicciones) {
        const uniquePredictions = response.data.predicciones.reduce((acc: Prediction[], current: Prediction) => {
          const exists = acc.find(item => item.nombre === current.nombre);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setPredictions({
          ...response.data,
          predicciones: uniquePredictions,
          totalEstudiantes: uniquePredictions.length
        });
      } else {
        setPredictions(response.data);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      alert('Error al cargar las predicciones');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (riesgo: string) => {
    switch (riesgo) {
      case 'ALTO':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🔴 Riesgo Alto</Badge>;
      case 'MEDIO':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🟡 Riesgo Medio</Badge>;
      case 'BAJO':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Riesgo Bajo</Badge>;
      default:
        return <Badge variant="secondary">{riesgo}</Badge>;
    }
  };

  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'APROBADO':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'EN_RIESGO':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'REPROBADO':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Predicciones con IA"
          description="Análisis predictivo del rendimiento estudiantil usando Machine Learning"
          icon={TrendingUp}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predicciones con IA"
        description="Análisis predictivo del rendimiento estudiantil usando Machine Learning (WEKA)"
        icon={TrendingUp}
        action={
          <Button
            onClick={loadPredictions}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Selector de grado */}
      {availableGrades.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Seleccionar Grado:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableGrades.map((grade) => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? 'default' : 'outline'}
                    onClick={() => setSelectedGrade(grade)}
                    size="sm"
                  >
                    {grade}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {predictions && (
        <>
          {/* Estadísticas generales */}
          {predictions.estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-secondary-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary">Total Estudiantes</p>
                      <p className="text-3xl font-bold text-neutral-black">{predictions.totalEstudiantes}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">Aprobados</p>
                      <p className="text-3xl font-bold text-green-800">{predictions.estadisticas.aprobados}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-700">En Riesgo</p>
                      <p className="text-3xl font-bold text-yellow-800">{predictions.estadisticas.enRiesgo}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Reprobados</p>
                      <p className="text-3xl font-bold text-red-800">{predictions.estadisticas.reprobados}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lista de predicciones */}
          <div className="grid grid-cols-1 gap-4">
            {predictions.predicciones.map((pred, index) => (
              <Card key={index} className="border-secondary-200 hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getResultIcon(pred.resultado)}
                      <div>
                        <CardTitle className="text-lg font-bold text-neutral-black">
                          {pred.nombre}
                        </CardTitle>
                        <p className="text-sm text-secondary mt-1">
                          {pred.tareasCalificadas} tareas calificadas • {pred.tareasSinEntregar} sin entregar
                        </p>
                      </div>
                    </div>
                    {getRiskBadge(pred.riesgo)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Métricas */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-800">
                        {pred.promedioNotas?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-xs text-blue-600">Promedio</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-800">
                        {pred.tareasCalificadas || 0}
                      </p>
                      <p className="text-xs text-green-600">Calificadas</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-800">
                        {pred.tareasSinCalificar || 0}
                      </p>
                      <p className="text-xs text-yellow-600">Sin Calificar</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-800">
                        {pred.tareasSinEntregar || 0}
                      </p>
                      <p className="text-xs text-red-600">Sin Entregar</p>
                    </div>
                  </div>

                  {/* Porcentaje de entrega */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Porcentaje de Entrega</span>
                      <span className="text-sm font-bold text-gray-900">{pred.porcentajeEntrega?.toFixed(1) || '0.0'}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${(pred.porcentajeEntrega || 0) >= 70 ? 'bg-green-500' :
                          (pred.porcentajeEntrega || 0) >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: `${Math.min(pred.porcentajeEntrega || 0, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Recomendación */}
                  <div className={`p-4 rounded-lg border-l-4 ${pred.riesgo === 'ALTO' ? 'bg-red-50 border-red-500' :
                    pred.riesgo === 'MEDIO' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                    <p className="text-sm font-semibold mb-1">Recomendación:</p>
                    <p className="text-sm">{pred.recomendacion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modelo WEKA */}
          <Card className="border-secondary-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Modelo de Machine Learning (J48 - Árbol de Decisión)</CardTitle>
                <Button
                  onClick={() => setShowModel(!showModel)}
                  variant="outline"
                  size="sm"
                >
                  {showModel ? 'Ocultar' : 'Ver'} Modelo
                </Button>
              </div>
            </CardHeader>
            {showModel && (
              <CardContent>
                <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {predictions.modelo}
                </pre>
              </CardContent>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
