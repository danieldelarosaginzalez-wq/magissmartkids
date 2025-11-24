# 🚀 Altius Academy - Guía de Despliegue

Sistema completo de despliegue para Altius Academy en Railway con Docker.

## 📁 Estructura del Proyecto

```
altius-academy/
├── backend/                      # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile.backend
├── src/                          # React Frontend
│   ├── components/
│   ├── pages/
│   └── services/
├── docker-compose.yml            # Orquestación local
├── Dockerfile.backend            # Imagen Docker del backend
├── Dockerfile.frontend           # Imagen Docker del frontend
├── nginx.conf                    # Configuración de Nginx
├── railway.json                  # Config de Railway (backend)
├── railway.frontend.json         # Config de Railway (frontend)
├── .env.example                  # Template de variables
├── DEPLOYMENT.md                 # Guía completa de despliegue
├── RAILWAY_SETUP.md              # Setup rápido de Railway
└── scripts/
    ├── deploy-railway.bat        # Script de despliegue (Windows)
    ├── deploy-railway.sh         # Script de despliegue (Linux/Mac)
    ├── test-docker-local.bat     # Test local (Windows)
    └── test-docker-local.sh      # Test local (Linux/Mac)
```

## 🎯 Opciones de Despliegue

### 1️⃣ Despliegue en Railway (Recomendado)

Railway es una plataforma PaaS que simplifica el despliegue de aplicaciones.

**Ventajas:**
- ✅ Despliegue automático desde Git
- ✅ Bases de datos gestionadas (MySQL, MongoDB)
- ✅ SSL/HTTPS automático
- ✅ Escalado automático
- ✅ Logs y monitoreo integrados
- ✅ Variables de entorno seguras

**Guías:**
- [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) - Setup rápido (15 minutos)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía completa y detallada

**Costo estimado:** $17-35/mes

### 2️⃣ Despliegue Local con Docker

Para desarrollo y pruebas locales.

**Windows:**
```cmd
cd scripts
test-docker-local.bat
```

**Linux/Mac:**
```bash
cd scripts
chmod +x test-docker-local.sh
./test-docker-local.sh
```

### 3️⃣ Despliegue Manual

Si prefieres configurar todo manualmente:

1. **Backend:**
   - Java 21
   - MySQL 8.0
   - MongoDB 7.0
   - Maven 3.9+

2. **Frontend:**
   - Node.js 20+
   - npm o yarn
   - Nginx (producción)

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │
│  React + Vite   │
│  (Port 80)      │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   Backend API   │
│  Spring Boot    │
│  (Port 8090)    │
└────┬───────┬────┘
     │       │
     │       │
┌────▼───┐ ┌─▼──────┐
│ MySQL  │ │ MongoDB│
│ (3306) │ │ (27017)│
└────────┘ └────────┘
```

## 🔧 Configuración Rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/altius-academy.git
cd altius-academy
```

### 2. Configurar variables de entorno

```bash
# Copiar template
cp .env.example .env

# Editar con tus credenciales
# Windows: notepad .env
# Linux/Mac: nano .env
```

### 3. Probar localmente

```bash
# Windows
scripts\test-docker-local.bat

# Linux/Mac
./scripts/test-docker-local.sh
```

### 4. Desplegar en Railway

```bash
# Windows
scripts\deploy-railway.bat

# Linux/Mac
./scripts/deploy-railway.sh
```

## 📋 Variables de Entorno Requeridas

### Backend

```env
# Database
DATABASE_URL=jdbc:mysql://host:3306/AltiusV3
MYSQL_USER=usuario
MYSQL_PASSWORD=password

# MongoDB
MONGODB_URI=mongodb://host:27017/altiusV3

# JWT
JWT_SECRET=tu-clave-super-secreta
JWT_EXPIRATION=86400000

# CORS
CORS_ORIGINS=https://tu-frontend.com

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-password
```

### Frontend

```env
VITE_API_URL=https://tu-backend.railway.app
```

## 🧪 Testing

### Test Local Completo

```bash
# 1. Iniciar servicios
docker-compose up -d

# 2. Verificar health checks
curl http://localhost:8090/actuator/health
curl http://localhost/health

# 3. Ver logs
docker-compose logs -f

# 4. Detener servicios
docker-compose down
```

### Test de Build

```bash
# Backend
docker build -f Dockerfile.backend -t altius-backend:test .

# Frontend
docker build -f Dockerfile.frontend -t altius-frontend:test .
```

## 📊 Monitoreo

### Endpoints de Health Check

- **Backend:** `https://tu-backend.railway.app/actuator/health`
- **Frontend:** `https://tu-frontend.railway.app/health`

### Métricas

- **Backend:** `https://tu-backend.railway.app/actuator/metrics`
- **Railway Dashboard:** Logs, CPU, RAM en tiempo real

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Ver logs
docker-compose logs backend

# Verificar conexión a base de datos
docker-compose exec backend sh
# Dentro del contenedor:
curl http://mysql:3306
```

### Frontend no conecta al Backend

1. Verificar `VITE_API_URL` en variables de entorno
2. Verificar `CORS_ORIGINS` en backend incluye URL del frontend
3. Verificar que backend esté público en Railway

### Error de CORS

```env
# En backend, agregar origen del frontend
CORS_ORIGINS=https://tu-frontend.railway.app,http://localhost:5173
```

### Base de datos no conecta

```bash
# Verificar que los servicios estén en la misma red
docker-compose ps

# Verificar variables de entorno
docker-compose exec backend env | grep DATABASE
```

## 📚 Documentación Adicional

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía completa de despliegue
- [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) - Setup rápido de Railway
- [Docker Docs](https://docs.docker.com/)
- [Railway Docs](https://docs.railway.app/)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] Cambiar `JWT_SECRET` a una clave aleatoria segura
- [ ] Usar contraseñas fuertes para bases de datos
- [ ] Configurar `CORS_ORIGINS` solo con dominios permitidos
- [ ] No subir `.env` a Git (usar `.env.example`)
- [ ] Usar HTTPS en producción
- [ ] Configurar rate limiting
- [ ] Habilitar logs de auditoría

### Generar JWT Secret Seguro

```bash
# Linux/Mac
openssl rand -base64 64

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 💰 Costos Estimados

### Railway (Recomendado)

**Plan Hobby** ($5/mes + uso):
- MySQL: ~$5-8/mes
- MongoDB: ~$5-8/mes
- Backend: ~$5-8/mes
- Frontend: ~$2-5/mes
- **Total:** ~$17-29/mes

**Plan Pro** ($20/mes + uso):
- Mejor para producción
- Más recursos
- Soporte prioritario

### Alternativas

- **Heroku:** ~$25-50/mes
- **AWS:** ~$30-100/mes (más complejo)
- **DigitalOcean:** ~$20-40/mes
- **VPS Manual:** ~$10-20/mes (requiere más configuración)

## 🆘 Soporte

### Recursos

- [Railway Discord](https://discord.gg/railway)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/railway)
- [GitHub Issues](https://github.com/tu-usuario/altius-academy/issues)

### Contacto

- Email: support@altiusacademy.com
- Documentación: https://docs.altiusacademy.com

## 📝 Changelog

### v1.0.0 (2024-11-23)
- ✅ Configuración inicial de Docker
- ✅ Integración con Railway
- ✅ Scripts de despliegue automatizados
- ✅ Documentación completa
- ✅ Health checks y monitoreo

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles.

---

**¿Listo para desplegar?** Sigue la [Guía de Setup Rápido](./RAILWAY_SETUP.md) 🚀
