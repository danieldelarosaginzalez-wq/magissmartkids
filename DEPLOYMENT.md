# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar Altius Academy en Railway usando Docker.

## 📋 Prerequisitos

- Cuenta en [Railway](https://railway.app)
- Git instalado
- Docker instalado (para pruebas locales)

## 🏗️ Arquitectura del Despliegue

El sistema se despliega en 4 servicios separados en Railway:

1. **MySQL Database** - Base de datos relacional
2. **MongoDB** - Base de datos NoSQL para actividades
3. **Backend API** - Spring Boot (Java 21)
4. **Frontend** - React + Vite + Nginx

## 📦 Paso 1: Preparar el Repositorio

```bash
# Asegúrate de que todos los archivos estén commiteados
git add .
git commit -m "Preparar para despliegue en Railway"
git push origin main
```

## 🚂 Paso 2: Crear Proyecto en Railway

1. Ve a [Railway](https://railway.app) y crea una cuenta
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

## 🗄️ Paso 3: Configurar MySQL

1. En tu proyecto Railway, click en "+ New"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente las variables:
   - `MYSQL_URL`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## 🍃 Paso 4: Configurar MongoDB

1. Click en "+ New"
2. Selecciona "Database" → "MongoDB"
3. Railway creará automáticamente:
   - `MONGO_URL`

## ⚙️ Paso 5: Desplegar Backend

1. Click en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio
3. Railway detectará automáticamente el `Dockerfile.backend`
4. Configura las variables de entorno:

```env
# Database
DATABASE_URL=${{MySQL.MYSQL_URL}}
MYSQL_USER=${{MySQL.MYSQL_USER}}
MYSQL_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# MongoDB
MONGODB_URI=${{MongoDB.MONGO_URL}}

# JWT (genera una clave segura)
JWT_SECRET=tu-clave-super-secreta-cambiar-en-produccion
JWT_EXPIRATION=86400000

# CORS (actualiza con tu dominio de frontend)
CORS_ORIGINS=https://tu-frontend.railway.app

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-password-de-aplicacion

# Spring Profile
SPRING_PROFILES_ACTIVE=prod
```

5. En "Settings":
   - Root Directory: `/`
   - Dockerfile Path: `Dockerfile.backend`
   - Health Check Path: `/actuator/health`

## 🎨 Paso 6: Desplegar Frontend

1. Click en "+ New" → "GitHub Repo"
2. Selecciona tu repositorio nuevamente
3. Configura las variables de entorno:

```env
VITE_API_URL=https://tu-backend.railway.app
```

4. En "Settings":
   - Root Directory: `/`
   - Dockerfile Path: `Dockerfile.frontend`
   - Health Check Path: `/health`

## 🔗 Paso 7: Conectar los Servicios

1. Ve al servicio Backend
2. En "Settings" → "Networking"
3. Copia la URL pública (ej: `https://tu-backend.railway.app`)
4. Ve al servicio Frontend
5. Actualiza la variable `VITE_API_URL` con la URL del backend
6. Redeploy el frontend

## ✅ Paso 8: Verificar el Despliegue

### Backend
```bash
# Health check
curl https://tu-backend.railway.app/actuator/health

# Debería responder:
# {"status":"UP"}
```

### Frontend
```bash
# Abrir en navegador
https://tu-frontend.railway.app
```

## 🧪 Pruebas Locales con Docker

Antes de desplegar, puedes probar localmente:

```bash
# 1. Crear archivo .env con tus variables
cp .env.example .env

# 2. Editar .env con tus credenciales

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f

# 5. Verificar servicios
docker-compose ps

# 6. Detener servicios
docker-compose down
```

### Acceder a los servicios locales:
- Frontend: http://localhost
- Backend: http://localhost:8090
- MySQL: localhost:3306
- MongoDB: localhost:27017

## 🔧 Comandos Útiles de Docker

```bash
# Rebuild sin cache
docker-compose build --no-cache

# Ver logs de un servicio específico
docker-compose logs -f backend

# Entrar a un contenedor
docker-compose exec backend sh

# Limpiar todo
docker-compose down -v
docker system prune -a
```

## 🔐 Seguridad en Producción

### Variables Críticas a Cambiar:

1. **JWT_SECRET**: Genera una clave segura
```bash
# Generar clave aleatoria
openssl rand -base64 64
```

2. **Passwords de Base de Datos**: Usa contraseñas fuertes

3. **CORS_ORIGINS**: Solo tu dominio de frontend

4. **Email**: Usa credenciales de aplicación, no tu password personal

## 📊 Monitoreo

Railway proporciona:
- Logs en tiempo real
- Métricas de CPU/RAM
- Health checks automáticos
- Alertas de errores

### Endpoints de Monitoreo:

```bash
# Health check
GET /actuator/health

# Métricas
GET /actuator/metrics

# Info de la aplicación
GET /actuator/info
```

## 🐛 Troubleshooting

### Backend no inicia:
1. Verifica logs en Railway
2. Confirma que MySQL y MongoDB estén UP
3. Verifica variables de entorno
4. Revisa el health check path

### Frontend no conecta al Backend:
1. Verifica CORS_ORIGINS en backend
2. Confirma VITE_API_URL en frontend
3. Asegúrate que backend esté público

### Base de datos no conecta:
1. Verifica que los servicios estén en la misma red
2. Usa las variables de Railway (${{MySQL.MYSQL_URL}})
3. Revisa los logs de conexión

## 🔄 Actualizar el Despliegue

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "Actualización"
git push origin main

# 2. Railway detectará el push y redesplegará automáticamente
```

## 💰 Costos Estimados

Railway ofrece:
- **Plan Hobby**: $5/mes + uso
- **Plan Pro**: $20/mes + uso

Estimado para este proyecto:
- MySQL: ~$5-10/mes
- MongoDB: ~$5-10/mes
- Backend: ~$5-10/mes
- Frontend: ~$2-5/mes

**Total**: ~$17-35/mes

## 📚 Recursos Adicionales

- [Documentación Railway](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Consulta esta guía
3. Revisa la documentación de Railway
4. Contacta al equipo de desarrollo
