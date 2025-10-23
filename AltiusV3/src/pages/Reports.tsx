import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Filter, TrendingUp, Users, BookOpen, Award, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { useAuthStore } from '../stores/authStore';

const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);
  const [institutionStats, setInstitutionStats] = useState<any>({});
  const [gradeStats, setGradeStats] = useState<any[]>([]);
  const [subjectStats, setSubjectStats] = useState<any[]>([]);
  const [teacherStats, setTeacherStats] = useState<any[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Load institution stats
      const institutionResponse = await fetch(`/api/super-admin/institutions/stats?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (institutionResponse.ok) {
        const data = await institutionResponse.json();
        setInstitutionStats(data.stats || {});
        setGradeStats(data.gradeStats || []);
        setSubjectStats(data.subjectStats || []);
        setTeacherStats(data.teacherStats || []);
        setMonthlyProgress(data.monthlyProgress || []);
      } else {
        console.error('Failed to load reports');
        setInstitutionStats({});
        setGradeStats([]);
        setSubjectStats([]);
        setTeacherStats([]);
        setMonthlyProgress([]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setInstitutionStats({});
      setGradeStats([]);
      setSubjectStats([]);
      setTeacherStats([]);
      setMonthlyProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const getImprovementColor = (improvement: string) => {
    const value = parseFloat(improvement.replace('+', ''));
    if (value >= 1.0) return 'text-green-600';
    if (value >= 0.5) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const exportReport = (type: string) => {
    // Aquí iría la lógica para exportar reportes
    console.log(`Exportando reporte: ${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes Académicos 📊</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento académico institucional
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadReports}
            disabled={loading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Período Actual</SelectItem>
              <SelectItem value="previous">Período Anterior</SelectItem>
              <SelectItem value="year">Todo el Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </Button>
          <Button className="flex items-center space-x-2" onClick={() => exportReport('general')}>
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Institution Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : (institutionStats.totalStudents || 0)}
              </p>
              <p className="text-sm text-gray-600">Estudiantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : (institutionStats.totalTeachers || 0)}
              </p>
              <p className="text-sm text-gray-600">Profesores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : (institutionStats.averageGrade || 0)}
              </p>
              <p className="text-sm text-gray-600">Promedio</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : (institutionStats.improvement || '+0%')}
              </p>
              <p className="text-sm text-gray-600">Mejora</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : (institutionStats.activeAssignments || 0)}
              </p>
              <p className="text-sm text-gray-600">Tareas Activas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : `${institutionStats.completionRate || 0}%`}
              </p>
              <p className="text-sm text-gray-600">Completado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="grades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="grades">Por Grado</TabsTrigger>
          <TabsTrigger value="subjects">Por Materia</TabsTrigger>
          <TabsTrigger value="teachers">Profesores</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="comparative">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Rendimiento por Grado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Grado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Estudiantes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Profesores</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Antes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Después</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Mejora</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Completado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeStats.map((grade, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{grade.grade}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{grade.students}</td>
                        <td className="py-3 px-4 text-gray-600">{grade.teachers}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{grade.averageBefore}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{grade.averageAfter}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getImprovementColor(grade.improvement)}`}>
                            {grade.improvement}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="success">{grade.completionRate}%</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" onClick={() => exportReport(`grade-${grade.grade}`)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span>Rendimiento por Materia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Materia</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Estudiantes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Profesores</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Antes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Después</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Mejora</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tareas</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Completado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectStats.map((subject, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{subject.subject}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{subject.students}</td>
                        <td className="py-3 px-4 text-gray-600">{subject.teachers}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{subject.averageBefore}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{subject.averageAfter}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getImprovementColor(subject.improvement)}`}>
                            {subject.improvement}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{subject.assignments}</td>
                        <td className="py-3 px-4">
                          <Badge variant="success">{subject.completionRate}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Desempeño de Profesores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherStats.map((teacher, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">
                          {teacher.subjects.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          Promedio: {teacher.averageGrade}
                        </Badge>
                        <p className={`text-sm font-medium ${getImprovementColor(teacher.improvement)}`}>
                          {teacher.improvement}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Estudiantes:</span>
                        <span className="ml-1 font-medium">{teacher.students}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tareas:</span>
                        <span className="ml-1 font-medium">{teacher.assignments}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completado:</span>
                        <span className="ml-1 font-medium">{teacher.completionRate}%</span>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Progreso Mensual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{month.month}</h4>
                        <p className="text-sm text-gray-600">
                          {month.assignments} tareas • {month.completion}% completado
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-lg">
                        {month.average}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span>Análisis Comparativo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Mejora por Materia</h4>
                    {subjectStats.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{subject.subject}</span>
                          <span className={`text-sm font-medium ${getImprovementColor(subject.improvement)}`}>
                            {subject.improvement}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(parseFloat(subject.improvement.replace('+', '')) / 1.5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Mejora por Grado</h4>
                    {gradeStats.map((grade, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{grade.grade}</span>
                          <span className={`text-sm font-medium ${getImprovementColor(grade.improvement)}`}>
                            {grade.improvement}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(parseFloat(grade.improvement.replace('+', '')) / 1.5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;