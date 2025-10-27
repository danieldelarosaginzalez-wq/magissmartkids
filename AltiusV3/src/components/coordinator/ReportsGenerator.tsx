import React, { useState } from 'react';
import { Download, FileText, Users, BookOpen, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { reportsApi } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface ReportsGeneratorProps {
  institutionId: number;
}

const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({ institutionId }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [showSampleData, setShowSampleData] = useState(false);

  // Datos de muestra para demostración
  const sampleReportData = {
    'subject-performance': {
      title: 'Reporte de Rendimiento por Materia',
      data: [
        { materia: 'Matemáticas', promedio: 4.2, estudiantes: 45, aprobados: 38, reprobados: 7 },
        { materia: 'Física', promedio: 3.8, estudiantes: 42, aprobados: 35, reprobados: 7 },
        { materia: 'Química', promedio: 4.0, estudiantes: 40, aprobados: 36, reprobados: 4 },
        { materia: 'Biología', promedio: 4.3, estudiantes: 38, aprobados: 35, reprobados: 3 },
        { materia: 'Historia', promedio: 3.9, estudiantes: 50, aprobados: 42, reprobados: 8 },
        { materia: 'Inglés', promedio: 4.1, estudiantes: 48, aprobados: 43, reprobados: 5 },
        { materia: 'Español', promedio: 4.4, estudiantes: 52, aprobados: 49, reprobados: 3 }
      ]
    },
    'teacher-activity': {
      title: 'Reporte de Actividad de Profesores',
      data: [
        { profesor: 'María Elena García', materias: 3, estudiantes: 85, tareas: 24, calificadas: 22 },
        { profesor: 'Carlos Alberto Mendoza', materias: 2, estudiantes: 60, tareas: 18, calificadas: 18 },
        { profesor: 'Ana Sofía López', materias: 2, estudiantes: 55, tareas: 16, calificadas: 14 },
        { profesor: 'Roberto Jiménez', materias: 4, estudiantes: 95, tareas: 28, calificadas: 26 }
      ]
    },
    'student-participation': {
      title: 'Reporte de Participación Estudiantil',
      data: [
        { grado: '10° A', estudiantes: 28, activos: 26, tareas_entregadas: 156, promedio: 4.1 },
        { grado: '10° B', estudiantes: 30, activos: 28, tareas_entregadas: 168, promedio: 3.9 },
        { grado: '11° A', estudiantes: 25, activos: 24, tareas_entregadas: 140, promedio: 4.2 },
        { grado: '11° B', estudiantes: 27, activos: 25, tareas_entregadas: 148, promedio: 4.0 }
      ]
    }
  };

  const generateReport = async (reportType: string, exportToExcel: boolean = false) => {
    try {
      setLoading(true);
      
      // Simular generación de reporte con datos de muestra
      setTimeout(() => {
        if (exportToExcel) {
          // Simular descarga de Excel
          const reportData = sampleReportData[reportType as keyof typeof sampleReportData];
          const csvContent = generateCSV(reportData);
          downloadFile(csvContent, `${reportType}-${Date.now()}.csv`, 'text/csv');
          console.log(`Reporte ${reportType} exportado exitosamente`);
        } else {
          // Mostrar datos de muestra
          setShowSampleData(true);
          console.log(`Reporte ${reportType} generado:`, sampleReportData[reportType as keyof typeof sampleReportData]);
        }
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error(`Error generando reporte ${reportType}:`, error);
      setLoading(false);
    }
  };

  const generateCSV = (reportData: any) => {
    if (!reportData || !reportData.data) return '';
    
    const headers = Object.keys(reportData.data[0]).join(',');
    const rows = reportData.data.map((row: any) => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const reportTypes = [
    {
      id: 'subject-performance',
      title: 'Rendimiento por Materia',
      description: 'Análisis detallado del rendimiento académico por materia',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      id: 'teacher-activity',
      title: 'Actividad de Profesores',
      description: 'Estadísticas de actividad y rendimiento de profesores',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'student-participation',
      title: 'Participación Estudiantil',
      description: 'Análisis de participación y engagement de estudiantes',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-orange-600" />
          <span>Generador de Reportes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato
            </label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Período Actual</SelectItem>
                <SelectItem value="previous">Período Anterior</SelectItem>
                <SelectItem value="year">Todo el Año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-6 h-6 ${report.color}`} />
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateReport(report.id, false)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => generateReport(report.id, true)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Generando reporte...</span>
            </div>
          </div>
        )}

        {/* Sample Data Display */}
        {showSampleData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Vista Previa de Datos</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSampleData(false)}
              >
                Cerrar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Total Registros</div>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-green-600">4.1</div>
                <div className="text-sm text-gray-600">Promedio General</div>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <div className="text-sm text-gray-600">Tasa de Éxito</div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              📊 Datos de muestra generados para demostración
            </div>
            <div className="text-xs text-gray-500">
              En producción, aquí se mostrarían los datos reales del reporte seleccionado
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsGenerator;