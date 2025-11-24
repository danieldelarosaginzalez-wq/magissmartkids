#!/bin/bash

# Script para probar el sistema localmente con Docker
# Útil antes de desplegar a Railway

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "🐳 Probando sistema con Docker localmente..."

# 1. Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    exit 1
fi
print_success "Docker instalado"

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    exit 1
fi
print_success "Docker Compose instalado"

# 2. Verificar archivo .env
if [ ! -f ".env" ]; then
    print_warning "No existe archivo .env"
    echo "Copiando .env.example a .env..."
    cp .env.example .env
    print_warning "Por favor edita .env con tus credenciales"
    exit 1
fi
print_success "Archivo .env existe"

# 3. Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down -v 2>/dev/null || true
print_success "Contenedores detenidos"

# 4. Limpiar imágenes antiguas (opcional)
read -p "¿Deseas limpiar imágenes antiguas? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f
    print_success "Imágenes antiguas limpiadas"
fi

# 5. Build de las imágenes
echo "🔨 Construyendo imágenes..."
docker-compose build --no-cache
print_success "Imágenes construidas"

# 6. Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose up -d
print_success "Servicios iniciados"

# 7. Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# 8. Verificar estado de los servicios
echo "📊 Estado de los servicios:"
docker-compose ps

# 9. Health checks
echo ""
echo "🏥 Verificando health checks..."

# MySQL
echo -n "MySQL: "
if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
    print_success "OK"
else
    print_error "FAIL"
fi

# MongoDB
echo -n "MongoDB: "
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" --quiet 2>/dev/null | grep -q "ok"; then
    print_success "OK"
else
    print_error "FAIL"
fi

# Backend (esperar hasta 60 segundos)
echo -n "Backend: "
BACKEND_READY=false
for i in {1..12}; do
    if curl -s http://localhost:8090/actuator/health | grep -q "UP"; then
        BACKEND_READY=true
        break
    fi
    sleep 5
done

if [ "$BACKEND_READY" = true ]; then
    print_success "OK"
else
    print_error "FAIL (puede necesitar más tiempo)"
fi

# Frontend
echo -n "Frontend: "
if curl -s http://localhost/health | grep -q "healthy"; then
    print_success "OK"
else
    print_error "FAIL"
fi

# 10. Mostrar logs recientes
echo ""
echo "📋 Logs recientes:"
docker-compose logs --tail=20

# 11. Información de acceso
echo ""
echo "✅ Sistema iniciado!"
echo ""
echo "🌐 Acceso a servicios:"
echo "  Frontend:  http://localhost"
echo "  Backend:   http://localhost:8090"
echo "  API Docs:  http://localhost:8090/swagger-ui.html"
echo "  Health:    http://localhost:8090/actuator/health"
echo ""
echo "🗄️ Bases de datos:"
echo "  MySQL:     localhost:3306"
echo "  MongoDB:   localhost:27017"
echo ""
echo "📊 Comandos útiles:"
echo "  Ver logs:           docker-compose logs -f"
echo "  Ver logs backend:   docker-compose logs -f backend"
echo "  Ver logs frontend:  docker-compose logs -f frontend"
echo "  Reiniciar:          docker-compose restart"
echo "  Detener:            docker-compose down"
echo "  Detener y limpiar:  docker-compose down -v"
echo ""
