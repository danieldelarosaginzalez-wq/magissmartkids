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
  promedioGeneral: number;
  tareasCompletadas: number;
  promedioMatematicas: number;
  promedioCiencias: number;
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
  const [selectedGrade, setSelectedGrade] = useState('Cuarto C');
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, [selectedGrade]);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/predictions/student-performance?grade=${encodeURIComponent(selectedGrade)}`);
      setPredictions(response.data);
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
                          {pred.tareasCompletadas} tareas completadas
                        </p>
                      </div>
                    </div>
                    {getRiskBadge(pred.riesgo)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Promedios */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-800">
                        {pred.promedioGeneral.toFixed(2)}
                      </p>
                      <p className="text-xs text-blue-600">Promedio General</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-800">
                        {pred.promedioMatematicas.toFixed(2)}
                      </p>
                      <p className="text-xs text-purple-600">Matemáticas</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-800">
                        {pred.promedioCiencias.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600">Ciencias</p>
                    </div>
                  </div>

                  {/* Recomendación */}
                  <div className={`p-4 rounded-lg border-l-4 ${
                    pred.riesgo === 'ALTO' ? 'bg-red-50 border-red-500' :
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
