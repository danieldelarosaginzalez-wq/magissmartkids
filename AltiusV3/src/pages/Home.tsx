import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BarChart3,
  Star,
  ArrowRight,
  Play,
  Award
} from 'lucide-react';
import MagicLogoText from '../components/ui/MagicLogoText';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';


const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 backdrop-blur-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/Logo.png"
                alt="MagicSmartKids"
                className="h-12 w-auto cursor-pointer hover:scale-105 transition-transform duration-300"
              />
              <MagicLogoText size="sm" layout="inline" showHoverEffects={false} className="hidden md:block" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="hover:scale-105 transition-all duration-300">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button className="hover:scale-105 transition-all duration-300">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - FONDO SUAVE CON ANIMACIONES */}
      <section className="bg-[#00368F]/5 relative overflow-hidden animate-fade-in">
        {/* Imagen de fondo sutil */}
        <div className="absolute inset-0 bg-[url('/Home.png')] bg-cover bg-center opacity-5"></div>
        
        {/* Animaciones de fondo más visibles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-4 h-4 bg-[#F5A623] rounded-full top-10 left-20 animate-pulse animate-magic-float"></div>
          <div className="absolute w-6 h-6 bg-[#00C764] rounded-full top-40 right-32 animate-bounce animate-magic-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute w-3 h-3 bg-[#2E5BFF] rounded-full bottom-20 left-40 animate-ping animate-magic-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute w-5 h-5 bg-[#FF6B35] rounded-full top-60 left-60 animate-pulse animate-magic-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute w-2 h-2 bg-[#1494DE] rounded-full bottom-40 right-20 animate-bounce animate-magic-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-gray-800 animate-slide-in-left">
              <div className="mb-6">
                <MagicLogoText size="2xl" className="mb-4" />
              </div>
              <h1 className="text-4xl font-heading mb-6 leading-tight">
                Aprendizaje
                <span className="text-[#F5A623]"> Mágico</span>
              </h1>
              <p className="text-xl mb-8 font-body text-gray-600 leading-relaxed">
                Plataforma educativa que transforma el aprendizaje en una experiencia
                mágica e interactiva para niños inteligentes. Actividades divertidas,
                seguimiento personalizado y progreso visible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-[#00368F] text-white hover:bg-[#002a6b] flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105">
                    <Play className="w-5 h-5" />
                    <span className="font-body">Comenzar Gratis</span>
                  </Button>
                </Link>
                <Button size="lg" className="bg-transparent text-[#00368F] border border-[#00368F] hover:bg-[#00368F] hover:text-white flex items-center space-x-2 transition-all duration-500 hover:scale-105 hover:shadow-lg">
                  <Play className="w-5 h-5" />
                  <span className="font-body">Ver Demo</span>
                </Button>
              </div>
            </div>
            {/* IMAGEN - Recta normalmente, se mueve al hover */}
            <div className="relative animate-slide-in-right">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:rotate-3 hover:scale-105 transition-all duration-500">
                <img 
                  src="/home.png"
                  alt="MagicSmartKids - Aprendizaje mágico para niños"
                  className="w-full h-auto object-cover transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Separador mágico */}
      <div className="magic-separator"></div>

      {/* Stats Section */}
      <section className="py-16 bg-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-[#00368F] mb-4">
              Resultados Mágicos que Hablan por Sí Solos
            </h2>
            <p className="text-lg font-body text-gray-600">
              Miles de niños han descubierto la magia del aprendizaje
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00368F] mb-2 transition-all hover:scale-110 hover:text-[#002a6b] cursor-default duration-300">15,847</div>
                  <p className="text-gray-600">Estudiantes Activos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00C764] mb-2 transition-all hover:scale-110 hover:text-[#008f4a] cursor-default duration-300">1,203</div>
                  <p className="text-gray-600">Profesores</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF6B35] mb-2 transition-all hover:scale-110 hover:text-[#e55a2b] cursor-default duration-300">89%</div>
                  <p className="text-gray-600">Mejora Promedio</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '1s'}}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1494DE] mb-2 transition-all hover:scale-110 hover:text-[#0f7bc7] cursor-default duration-300">456</div>
                  <p className="text-gray-600">Instituciones</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Separador mágico */}
      <div className="magic-separator"></div>

      {/* Features Section - Fondo verde muy suave */}
      <section className="py-16 bg-[#00C764]/5 relative overflow-hidden animate-fade-in-up" style={{animationDelay: '1.2s'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-[#00368F] mb-4">
              Todo lo que Necesitas para el Aprendizaje Mágico
            </h2>
            <p className="text-lg font-body text-gray-600">
              Herramientas mágicas diseñadas específicamente para niños inteligentes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#00368F]/20" style={{animationDelay: '1.4s'}}>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-[#00368F] group-hover:animate-magic-wiggle" />
                </div>
                <CardTitle className="font-heading group-hover:text-[#00368F] transition-colors duration-300">Actividades Mágicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
                  Cuestionarios interactivos, juegos educativos y actividades divertidas.
                  Diseñados para hacer el aprendizaje una experiencia mágica y memorable.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#00C764]/20" style={{animationDelay: '1.6s'}}>
              <CardHeader>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="w-6 h-6 text-[#00C764] group-hover:animate-magic-wiggle" />
                </div>
                <CardTitle className="font-heading group-hover:text-[#00C764] transition-colors duration-300">Progreso Mágico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
                  Seguimiento personalizado del crecimiento de cada niño.
                  Reportes visuales mágicos para padres y educadores.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#FF6B35]/20" style={{animationDelay: '1.8s'}}>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                  <Users className="w-6 h-6 text-[#FF6B35] group-hover:animate-magic-wiggle" />
                </div>
                <CardTitle className="font-heading group-hover:text-[#FF6B35] transition-colors duration-300">Mundo Mágico Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
                  Plataforma integral para estudiantes, padres, profesores y coordinadores.
                  Cada usuario tiene su propio espacio mágico personalizado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Separador mágico */}
      <div className="magic-separator"></div>

      {/* Testimonial Section */}
      <section className="py-16 bg-white animate-fade-in-up" style={{animationDelay: '2s'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-[#00368F] mb-4">
              Lo que Dicen Nuestras Familias Mágicas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up hover:border-[#00368F]/20" style={{animationDelay: '2.2s'}}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400 hover:animate-magic-wiggle" />
                  ))}
                </div>
                <p className="text-gray-600 font-body mb-4">
                  "Mi hija descubrió la magia del aprendizaje. Pasó de 2.5 a 4.1 en matemáticas en solo tres meses.
                  Las actividades son tan divertidas que no quiere parar de aprender."
                </p>
                <div className="font-semibold text-gray-900">
                  María González - Madre de familia
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up hover:border-[#00C764]/20" style={{animationDelay: '2.4s'}}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400 hover:animate-magic-wiggle" />
                  ))}
                </div>
                <p className="text-gray-600 font-body mb-4">
                  "Como educador, MagicSmartKids me permite crear experiencias mágicas de aprendizaje
                  y ver cómo cada niño florece. Los reportes visuales son increíbles."
                </p>
                <div className="font-semibold text-gray-900">
                  Prof. Carlos Rodríguez - Institución Educativa San José
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Separador mágico */}
      <div className="magic-separator"></div>

      {/* CTA Section - COLOR SÓLIDO PROFESIONAL */}
      <section className="py-16 bg-[#00368F] relative overflow-hidden animate-fade-in-up" style={{animationDelay: '2.6s'}}>
        {/* Elementos decorativos sutiles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-8 h-8 text-white animate-magic-float">✨</div>
          <div className="absolute top-40 right-32 w-6 h-6 text-white animate-magic-float" style={{animationDelay: '1s'}}>🪄</div>
          <div className="absolute bottom-32 left-16 w-4 h-4 text-white animate-magic-float" style={{animationDelay: '2s'}}>💫</div>
          <div className="absolute bottom-20 right-20 w-6 h-6 text-white animate-magic-float" style={{animationDelay: '3s'}}>⭐</div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading text-white mb-4">
              Comienza la Aventura Mágica del Aprendizaje Hoy
            </h2>
            <p className="text-xl font-body text-blue-100 mb-8">
              Únete a miles de niños que ya han descubierto la magia de aprender
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-[#00368F] hover:bg-gray-50 flex items-center space-x-2 mx-auto shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
              >
                <Award className="w-5 h-5" />
                <span className="font-body">Empezar la Magia</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

{/* Separador mágico */}
<div className="magic-separator"></div>

{/* Features Section - Fondo verde muy suave */}
<section className="py-16 bg-[#00C764]/5 relative overflow-hidden animate-fade-in-up" style={{animationDelay: '1.2s'}}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-heading text-[#00368F] mb-4">
        Todo lo que Necesitas para el Aprendizaje Mágico
      </h2>
      <p className="text-lg font-body text-gray-600">
        Herramientas mágicas diseñadas específicamente para niños inteligentes
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#00368F]/20" style={{animationDelay: '1.4s'}}>
        <CardHeader>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
            <BookOpen className="w-6 h-6 text-[#00368F] group-hover:animate-magic-wiggle" />
          </div>
          <CardTitle className="font-heading group-hover:text-[#00368F] transition-colors duration-300">Actividades Mágicas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
            Cuestionarios interactivos, juegos educativos y actividades divertidas.
            Diseñados para hacer el aprendizaje una experiencia mágica y memorable.
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#00C764]/20" style={{animationDelay: '1.6s'}}>
        <CardHeader>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
            <BarChart3 className="w-6 h-6 text-[#00C764] group-hover:animate-magic-wiggle" />
          </div>
          <CardTitle className="font-heading group-hover:text-[#00C764] transition-colors duration-300">Progreso Mágico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
            Seguimiento personalizado del crecimiento de cada niño.
            Reportes visuales mágicos para padres y educadores.
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-fade-in-up hover:border-[#FF6B35]/20" style={{animationDelay: '1.8s'}}>
        <CardHeader>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
            <Users className="w-6 h-6 text-[#FF6B35] group-hover:animate-magic-wiggle" />
          </div>
          <CardTitle className="font-heading group-hover:text-[#FF6B35] transition-colors duration-300">Mundo Mágico Completo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 font-body group-hover:text-gray-800 transition-colors duration-300">
            Plataforma integral para estudiantes, padres, profesores y coordinadores.
            Cada usuario tiene su propio espacio mágico personalizado.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

{/* Separador mágico */}
<div className="magic-separator"></div>

{/* Testimonial Section */}
<section className="py-16 bg-white animate-fade-in-up" style={{animationDelay: '2s'}}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-heading text-[#00368F] mb-4">
        Lo que Dicen Nuestras Familias Mágicas
      </h2>
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up hover:border-[#00368F]/20" style={{animationDelay: '2.2s'}}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400 hover:animate-magic-wiggle" />
            ))}
          </div>
          <p className="text-gray-600 font-body mb-4">
            "Mi hija descubrió la magia del aprendizaje. Pasó de 2.5 a 4.1 en matemáticas en solo tres meses.
            Las actividades son tan divertidas que no quiere parar de aprender."
          </p>
          <div className="font-semibold text-gray-900">
            María González - Madre de familia
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl hover:scale-105 transition-all duration-500 animate-fade-in-up hover:border-[#00C764]/20" style={{animationDelay: '2.4s'}}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-400 hover:animate-magic-wiggle" />
            ))}
          </div>
          <p className="text-gray-600 font-body mb-4">
            "Como educador, MagicSmartKids me permite crear experiencias mágicas de aprendizaje
            y ver cómo cada niño florece. Los reportes visuales son increíbles."
          </p>
          <div className="font-semibold text-gray-900">
            Prof. Carlos Rodríguez - Institución Educativa San José
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

{/* Separador mágico */}
<div className="magic-separator"></div>

{/* CTA Section - COLOR SÓLIDO PROFESIONAL */}
<section className="py-16 bg-[#00368F] relative overflow-hidden animate-fade-in-up" style={{animationDelay: '2.6s'}}>
  {/* Elementos decorativos sutiles */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-20 w-8 h-8 text-white animate-magic-float">✨</div>
    <div className="absolute top-40 right-32 w-6 h-6 text-white animate-magic-float" style={{animationDelay: '1s'}}>🪄</div>
    <div className="absolute bottom-32 left-16 w-4 h-4 text-white animate-magic-float" style={{animationDelay: '2s'}}>💫</div>
    <div className="absolute bottom-20 right-20 w-6 h-6 text-white animate-magic-float" style={{animationDelay: '3s'}}>⭐</div>
  </div>
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-heading text-white mb-4">
        Comienza la Aventura Mágica del Aprendizaje Hoy
      </h2>
      <p className="text-xl font-body text-blue-100 mb-8">
        Únete a miles de niños que ya han descubierto la magia de aprender
      </p>
      <Link to="/register">
        <Button
          size="lg"
          className="bg-white text-[#00368F] hover:bg-gray-50 flex items-center space-x-2 mx-auto shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
        >
          <Award className="w-5 h-5" />
          <span className="font-body">Empezar la Magia</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  </div>
</section>

{/* Footer - Diseño sutil y unificado */}
<footer className="bg-gray-50 border-t border-gray-200 py-8 animate-fade-in-up" style={{animationDelay: '2.8s'}}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <img
          src="/Logo.png"
          alt="MagicSmartKids"
          className="h-8 w-auto hover:scale-105 transition-transform duration-300"
        />
        <MagicLogoText size="md" layout="inline" showHoverEffects={false} />
      </div>
      <p className="text-gray-600 mb-4 font-body">
        Plataforma educativa mágica para niños inteligentes
      </p>
      
      {/* Enlaces funcionales */}
      <div className="flex items-center justify-center gap-6 text-sm mb-4">
        <Link
          to="/login"
          className="text-gray-600 hover:text-[#00368F] transition-colors duration-300 hover:scale-105 transform"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="text-gray-600 hover:text-[#00368F] transition-colors duration-300 hover:scale-105 transform"
        >
          Registrarse
        </Link>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-500 text-sm font-body">
          2025 MagicSmartKids. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</footer>
</div>
);
};

export default Home;