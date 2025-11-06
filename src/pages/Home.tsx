import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';


const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Altius Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Refuerzo Académico 
                <span className="text-blue-200"> Inteligente</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Plataforma educativa diseñada para estudiantes de primaria. 
                Mejora el rendimiento académico con actividades interactivas, 
                seguimiento personalizado y reportes detallados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Comenzar Gratis</span>
                  </Button>
                </Link>
                <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Ver Demo</span>
                  </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Matemáticas</p>
                      <p className="text-sm text-gray-600">Progreso: 85%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Antes: 2.8</span>
                    <span className="text-green-600 font-semibold">Después: 4.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resultados que Hablan por Sí Solos
            </h2>
            <p className="text-lg text-gray-600">
              Miles de estudiantes han mejorado su rendimiento académico
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15,847</div>
                  <p className="text-gray-600">Estudiantes Activos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1,203</div>
                  <p className="text-gray-600">Profesores</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                  <p className="text-gray-600">Mejora Promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">456</div>
                  <p className="text-gray-600">Instituciones</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que Necesitas para el Éxito Académico
            </h2>
            <p className="text-lg text-gray-600">
              Herramientas diseñadas específicamente para estudiantes de primaria
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Actividades Interactivas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cuestionarios de opción múltiple, verdadero/falso y completar espacios. 
                  Diseñados para hacer el aprendizaje divertido y efectivo.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Seguimiento Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitoreo detallado del progreso antes y después del refuerzo. 
                  Reportes visuales para profesores y coordinadores.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Gestión Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dashboard para todos los roles: estudiantes, profesores, coordinadores 
                  y super administradores. Cada uno con sus funcionalidades específicas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Mi hija mejoró notablemente en matemáticas. Pasó de 2.5 a 4.1 en solo tres meses. 
                  La plataforma es muy fácil de usar y las actividades son entretenidas."
                </p>
                <div className="font-semibold text-gray-900">
                  María González - Madre de familia
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Como profesor, puedo crear actividades fácilmente y hacer seguimiento 
                  detallado del progreso de cada estudiante. Los reportes son excelentes."
                </p>
                <div className="font-semibold text-gray-900">
                  Prof. Carlos Rodríguez - Institución Educativa San José
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Comienza a Mejorar el Rendimiento Académico Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de estudiantes que ya están alcanzando sus metas académicas
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-gray-100 flex items-center space-x-2 mx-auto"
              >
                <Award className="w-5 h-5" />
                <span>Empezar Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-black text-neutral-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo y descripción */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-neutral-white" />
                </div>
                <span className="text-xl font-bold">Altius Academy</span>
              </div>
              <p className="text-secondary text-center sm:text-left text-sm">
                Plataforma educativa de refuerzo académico
              </p>
            </div>
            
            {/* Enlaces funcionales */}
            <div className="flex items-center gap-6 text-sm">
              <Link 
                to="/login" 
                className="text-secondary hover:text-primary transition-colors duration-300"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="text-secondary hover:text-primary transition-colors duration-300"
              >
                Registrarse
              </Link>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-secondary-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-secondary text-sm">
              © 2025 Altius Academy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;