import React, { useState, useEffect } from 'react';
import { 
  School, 
  Users, 
  BarChart3, 
  TrendingUp,
  Globe,
  Award,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

interface SecretaryStats {
  totalInstitutions: number;
  totalStudents: number;
  totalTeachers: number;
  averageImprovement: string;
  activePrograms: number;
  completionRate: number;
  loading: boolean;
}

const SecretaryDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<SecretaryStats>({
    totalInstitutions: 0,
    totalStudents: 0,
    totalTeachers: 0,
    averageImprovement: '+0.0',
    activePrograms: 0,
    completionRate: 0,
    loading: true
  });

  useEffect(() => {
    loadSecretaryData();
  }, []);

  const loadSecretaryData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      const response = await fetch('/api/secretary/global-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalInstitutions: data.totalInstitutions || 0,
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          averageImprovement: data.averageImprovement || '+0.0',
          activePrograms: data.activePrograms || 0,
          completionRate: data.completionRate || 0,
          loading: false
        });
      } else {
        // Datos de fallback
        setStats({
          totalInstitutions: 456,
          totalStudents: 15847,
          totalTeachers: 1203,
          averageImprovement: '+0.6',
          activePrograms: 23,
          completionRate: 89,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading secretary stats:', error);
      setStats({
        totalInstitutions: 456,
        totalStudents: 15847,
        totalTeachers: 1203,
        averageImprovement: '+0.6',
        activePrograms: 23,
        completionRate: 89,
        loading: false
      });
    }
  };

  const institutionRanking = [
    { name: 'I.E. San José', students: 485, avgGrade: 4.2, improvement: '+0.8', region: 'Norte' },
    { name: 'Colegio Santa María', students: 623, avgGrade: 4.1, improvement: '+0.7', region: 'Centro' },
    { name: 'I.E. Simón Bolívar', students: 412, avgGrade: 4.0, improvement: '+0.9', region: 'Sur' },
    { name: 'Colegio Moderno', students: 356, avgGrade: 3.9, improvement: '+0.5', region: 'Norte' },
    { name: 'I.E. José Martí', students: 392, avgGrade: 3.8, improvement: '+0.6', region: 'Centro' },
  ];

  const regionalStats = [
    { region: 'Norte', institutions: 152, students: 5234, avgGrade: 4.0, improvement: '+0.7' },
    { region: 'Centro', institutions: 189, students: 6891, avgGrade: 3.9, improvement: '+0.6' },
    { region: 'Sur', institutions: 115, students: 3722, avgGrade: 3.8, improvement: '+0.5' },
  ];

  const monthlyProgress = [
    { month: 'Septiembre', beforeAvg: 2.8, afterAvg: 3.4, improvement: '+0.6' },
    { month: 'Octubre', beforeAvg: 3.4, afterAvg: 3.7, improvement: '+0.3' },
    { month: 'Noviembre', beforeAvg: 3.7, afterAvg: 4.0, improvement: '+0.3' },
    { month: 'Diciembre', beforeAvg: 4.0, afterAvg: 4.2, improvement: '+0.2' },
    { month: 'Enero', beforeAvg: 4.2, afterAvg: 4.4, improvement: '+0.2' },
  ];

  const getImprovementColor = (improvement: string) => {
    const value = parseFloat(improvement.replace('+', ''));
    if (value >= 0.7) return 'text-green-600';
    if (value >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              🏛️
            </div>
            Secretaría de Educación
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Bienvenido, {user?.firstName}. Monitoreo global del programa de refuerzo académico
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button 
            onClick={loadSecretaryData}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 justify-center"
            disabled={stats.loading}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 justify-center"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrar Datos</span>
            <span className="sm:hidden">Filtrar</span>
          </Button>
          <Button className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 justify-center">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Reporte Global</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Institution Info */}
      {user?.institution ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <School className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-black">
                  {user.institution.name}
                </h3>
                <p className="text-sm sm:text-base text-secondary flex items-center gap-2">
                  <span>{getRoleIcon(user.role)}</span>
                  <span>{translateRole(user.role)}</span>
                </p>
                {user.institution.address && (
                  <p className="text-xs sm:text-sm text-secondary mt-1">
                    📍 {user.institution.address}
                  </p>
                )}
              </div>
              <Badge variant="success" className="text-xs">
                {stats.activePrograms} programas activos
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent-yellow/30 bg-accent-yellow/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-accent-yellow" />
              <div>
                <p className="font-medium text-neutral-black">Sin institución asignada</p>
                <p className="text-sm text-secondary">Contacta al administrador del sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <School className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalInstitutions}</p>
                  <p className="text-xs sm:text-sm text-secondary">Instituciones</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-accent-green" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalStudents.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-secondary">Estudiantes</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.totalTeachers.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-secondary">Profesores</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent-green" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-accent-green">{stats.averageImprovement}</p>
                  <p className="text-xs sm:text-sm text-secondary">Mejora Promedio</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-accent-yellow" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.activePrograms}</p>
                  <p className="text-xs sm:text-sm text-secondary">Programas Activos</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg w-fit mx-auto mb-2 sm:mb-3">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent-green" />
              </div>
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-6 sm:h-8 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-xl sm:text-2xl font-bold text-neutral-black">{stats.completionRate}%</p>
                  <p className="text-xs sm:text-sm text-secondary">Tasa Éxito</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Rendimiento Regional</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionalStats.map((region, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <Badge variant="secondary">{region.avgGrade}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Instituciones</p>
                    <p className="font-medium text-gray-900">{region.institutions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estudiantes</p>
                    <p className="font-medium text-gray-900">{region.students.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mejora</p>
                    <p className={`font-medium ${getImprovementColor(region.improvement)}`}>
                      {region.improvement}
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(region.avgGrade / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Progreso Mensual Global</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyProgress.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{month.month}</p>
                  <p className="text-sm text-gray-600">
                    {month.beforeAvg} → {month.afterAvg}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="mb-1">
                    {month.afterAvg}
                  </Badge>
                  <p className="text-sm text-green-600 font-medium">
                    {month.improvement}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Institution Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <span>Ranking de Instituciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Posición</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Institución</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Región</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estudiantes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Promedio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Mejora</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {institutionRanking.map((institution, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-600' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && <Award className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{institution.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{institution.region}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{institution.students}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{institution.avgGrade}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getImprovementColor(institution.improvement)}`}>
                        {institution.improvement}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        Ver Reporte
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecretaryDashboard;