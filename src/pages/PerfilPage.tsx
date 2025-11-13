import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import { useAuthStore } from '../stores/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Users, 
  School, 
  Edit, 
  Camera,
  BookOpen,
  Award,
  Clock,
  Heart
} from 'lucide-react';

const PerfilPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  // 📊 DATOS REALES DEL USUARIO + COMPLEMENTOS FICTICIOS
  const studentProfile = {
    // Información básica del estudiante (REAL de la base de datos)
    firstName: user?.firstName || 'Estudiante',
    lastName: user?.lastName || 'Estudiante',
    email: user?.email || `${(user?.firstName || 'estudiante').toLowerCase()}.${(user?.lastName || 'estudiante').toLowerCase()}@colegio.edu.co`,
    phone: '(+57) 300 123 4567', // Ficticio
    birthDate: '2015-03-15', // Ficticio
    age: 10, // Ficticio
    address: 'Calle 123 #45-67, Barrio Los Rosales, Bogotá', // Ficticio
    
    // Información académica (REAL + Ficticio)
    studentId: user?.id?.toString() || '2025001234',
    grade: user?.schoolGrade?.gradeName || '5° A',
    academicYear: '2025',
    enrollmentDate: user?.createdAt || '2020-02-01',
    institution: user?.institution?.name || 'Colegio San José de la Montaña',
    
    // Información familiar (Basada en el apellido del estudiante)
    parents: [
      {
        name: `Carlos ${user?.lastName || 'Vargas'}`,
        relationship: 'Padre',
        phone: '(+57) 301 987 6543',
        email: `carlos.${(user?.lastName || 'vargas').toLowerCase()}@email.com`,
        occupation: 'Ingeniero de Sistemas'
      },
      {
        name: `María Elena ${user?.lastName || 'Rodríguez'}`,
        relationship: 'Madre',
        phone: '(+57) 302 456 7890',
        email: `maria.${(user?.lastName || 'rodriguez').toLowerCase()}@email.com`,
        occupation: 'Doctora Pediatra'
      }
    ],
    
    // Contacto de emergencia
    emergencyContact: {
      name: `Ana ${user?.lastName || 'Vargas'} (Tía)`,
      phone: '(+57) 304 111 2233',
      relationship: 'Tía materna'
    },
    
    // Información médica básica
    medicalInfo: {
      bloodType: 'O+',
      allergies: 'Ninguna conocida',
      medications: 'Ninguna',
      medicalInsurance: 'EPS Sanitas'
    },
    
    // Estadísticas académicas
    stats: {
      currentAverage: 4.3,
      totalSubjects: 5,
      completedTasks: 12,
      pendingTasks: 3,
      attendanceRate: 98.5,
      behaviorGrade: 'Excelente'
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Información personal y académica"
        icon={User}
        action={
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal - Información Personal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Información Básica */}
          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {studentProfile.firstName} {studentProfile.lastName}
                  </h2>
                  <p className="text-gray-600 mb-2">Estudiante de {studentProfile.grade}</p>
                  <Badge className="bg-green-100 text-green-800">
                    Estudiante Activo
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Correo Electrónico</p>
                    <p className="font-medium">{studentProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium">{studentProfile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                    <p className="font-medium">{new Date(studentProfile.birthDate).toLocaleDateString()} ({studentProfile.age} años)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Código Estudiante</p>
                    <p className="font-medium">{studentProfile.studentId}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{studentProfile.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Académica */}
          <Card>
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-green-600" />
                Información Académica
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Grado Actual</p>
                    <p className="font-medium">{studentProfile.grade}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Año Académico</p>
                    <p className="font-medium">{studentProfile.academicYear}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <School className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Institución</p>
                    <p className="font-medium">{studentProfile.institution}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Ingreso</p>
                    <p className="font-medium">{new Date(studentProfile.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas Académicas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{studentProfile.stats.currentAverage}</div>
                  <div className="text-sm text-gray-600">Promedio</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{studentProfile.stats.totalSubjects}</div>
                  <div className="text-sm text-gray-600">Materias</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{studentProfile.stats.attendanceRate}%</div>
                  <div className="text-sm text-gray-600">Asistencia</div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Heart className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-sm font-bold text-yellow-600">{studentProfile.stats.behaviorGrade}</div>
                  <div className="text-sm text-gray-600">Comportamiento</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Familiar */}
          <Card>
            <CardHeader className="bg-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Información Familiar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {studentProfile.parents.map((parent, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{parent.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {parent.relationship}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {parent.occupation}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{parent.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{parent.email}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Contacto de Emergencia */}
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Contacto de Emergencia</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">{studentProfile.emergencyContact.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{studentProfile.emergencyContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{studentProfile.emergencyContact.relationship}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral - Información Médica y Acciones */}
        <div className="space-y-6">
          
          {/* Información Médica */}
          <Card>
            <CardHeader className="bg-red-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Sangre</p>
                  <Badge className="bg-red-100 text-red-800 font-bold">
                    {studentProfile.medicalInfo.bloodType}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Alergias</p>
                  <p className="text-sm font-medium">{studentProfile.medicalInfo.allergies}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Medicamentos</p>
                  <p className="text-sm font-medium">{studentProfile.medicalInfo.medications}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">EPS/Seguro Médico</p>
                  <p className="text-sm font-medium">{studentProfile.medicalInfo.medicalInsurance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Actualizar Información
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Cambiar Foto
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Actualizar Contactos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Actividad */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tarea completada - Matemáticas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Nueva calificación - Español</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Actividad interactiva iniciada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Perfil actualizado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;