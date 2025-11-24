#!/bin/bash

# Script de despliegue para Railway
# Este script ayuda a preparar y verificar el proyecto antes del despliegue

set -e

echo "🚀 Preparando despliegue en Railway..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 1. Verificar que estamos en la rama correcta
echo "📋 Verificando rama de Git..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_warning "No estás en la rama main/master. Rama actual: $CURRENT_BRANCH"
    read -p "¿Continuar de todas formas? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "Rama verificada: $CURRENT_BRANCH"

# 2. Verificar que no hay cambios sin commitear
echo "📋 Verificando cambios pendientes..."
if [[ -n $(git status -s) ]]; then
    print_warning "Hay cambios sin commitear:"
    git status -s
    read -p "¿Deseas commitear estos cambios? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Mensaje del commit: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        print_success "Cambios commiteados"
    fi
fi

# 3. Verificar archivos necesarios
echo "📋 Verificando archivos de despliegue..."
REQUIRED_FILES=(
    "Dockerfile.backend"
    "Dockerfile.frontend"
    "docker-compose.yml"
    "nginx.conf"
    ".env.example"
    "railway.json"
    "railway.frontend.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file existe"
    else
        print_error "$file no encontrado"
        exit 1
    fi
done

# 4. Verificar que existe .env.example pero no .env en git
echo "📋 Verificando variables de entorno..."
if [ -f ".env.example" ]; then
    print_success ".env.example existe"
else
    print_error ".env.example no encontrado"
    exit 1
fi

if git ls-files --error-unmatch .env 2>/dev/null; then
    print_error ".env está en git (no debería estarlo)"
    exit 1
else
    print_success ".env no está en git"
fi

# 5. Verificar estructura del backend
echo "📋 Verificando estructura del backend..."
if [ -f "backend/pom.xml" ]; then
    print_success "pom.xml encontrado"
else
    print_error "backend/pom.xml no encontrado"
    exit 1
fi

if [ -f "backend/src/main/resources/application.properties" ]; then
    print_success "application.properties encontrado"
else
    print_error "application.properties no encontrado"
    exit 1
fi

if [ -f "backend/src/main/resources/application-prod.properties" ]; then
    print_success "application-prod.properties encontrado"
else
    print_warning "application-prod.properties no encontrado (se recomienda tenerlo)"
fi

# 6. Verificar estructura del frontend
echo "📋 Verificando estructura del frontend..."
if [ -f "package.json" ]; then
    print_success "package.json encontrado"
else
    print_error "package.json no encontrado"
    exit 1
fi

if [ -f "vite.config.ts" ]; then
    print_success "vite.config.ts encontrado"
else
    print_error "vite.config.ts no encontrado"
    exit 1
fi

# 7. Test de build local (opcional)
echo ""
read -p "¿Deseas probar el build localmente con Docker? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Construyendo imágenes Docker..."
    
    echo "Building backend..."
    docker build -f Dockerfile.backend -t altius-backend:test .
    print_success "Backend build exitoso"
    
    echo "Building frontend..."
    docker build -f Dockerfile.frontend -t altius-frontend:test .
    print_success "Frontend build exitoso"
    
    echo ""
    read -p "¿Deseas iniciar los contenedores con docker-compose? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ ! -f ".env" ]; then
            print_warning "No existe archivo .env, copiando desde .env.example"
            cp .env.example .env
            print_warning "Por favor edita .env con tus credenciales antes de continuar"
            exit 1
        fi
        docker-compose up -d
        print_success "Contenedores iniciados"
        echo ""
        echo "Servicios disponibles en:"
        echo "  - Frontend: http://localhost"
        echo "  - Backend: http://localhost:8090"
        echo "  - MySQL: localhost:3306"
        echo "  - MongoDB: localhost:27017"
        echo ""
        echo "Para ver logs: docker-compose logs -f"
        echo "Para detener: docker-compose down"
    fi
fi

# 8. Push a Git
echo ""
read -p "¿Deseas hacer push a Git? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin $CURRENT_BRANCH
    print_success "Push exitoso a $CURRENT_BRANCH"
fi

echo ""
echo "✅ Preparación completada!"
echo ""
echo "📚 Próximos pasos:"
echo "1. Ve a Railway: https://railway.app"
echo "2. Crea un nuevo proyecto"
echo "3. Conecta tu repositorio de GitHub"
echo "4. Agrega servicios: MySQL, MongoDB, Backend, Frontend"
echo "5. Configura las variables de entorno según DEPLOYMENT.md"
echo ""
echo "Para más detalles, consulta DEPLOYMENT.md"
