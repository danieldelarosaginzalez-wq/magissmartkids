# 🚂 Setup Rápido en Railway

Guía paso a paso para desplegar Altius Academy en Railway en menos de 15 minutos.

## 🎯 Resumen Rápido

Railway detectará automáticamente los Dockerfiles y desplegará:
- **Backend**: Spring Boot + MySQL + MongoDB
- **Frontend**: React + Vite + Nginx

## 📝 Checklist Pre-Despliegue

- [ ] Código commiteado en Git
- [ ] Cuenta en Railway creada
- [ ] Repositorio conectado a Railway
- [ ] Variables de entorno preparadas

## 🚀 Pasos de Despliegue

### 1️⃣ Crear Proyecto en Railway

```bash
# Opción A: Desde la web
1. Ve a https://railway.app
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

# Opción B: Desde CLI (opcional)
npm i -g @railway/cli
railway login
railway init
railway up
```

### 2️⃣ Agregar MySQL

```
1. En tu proyecto → "+ New"
2. Selecciona "Database" → "MySQL"
3. Railway crea automáticamente:
   - MYSQL_URL
   - MYSQL_USER
   - MYSQL_PASSWORD
   - MYSQL_DATABASE
```

### 3️⃣ Agregar MongoDB

```
1. Click "+ New"
2. Selecciona "Database" → "MongoDB"
3. Railway crea automáticamente:
   - MONGO_URL
```

### 4️⃣ Desplegar Backend

```
1. Click "+ New" → "GitHub Repo"
2. Selecciona tu repositorio
3. Railway detecta Dockerfile.backend automáticamente
```

**Variables de Entorno del Backend:**

```env
# Database (usa referencias de Railway)
DATABASE_URL=${{MySQL.MYSQL_URL}}
MYSQL_USER=${{MySQL.MYSQL_USER}}
MYSQL_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# MongoDB
MONGODB_URI=${{MongoDB.MONGO_URL}}

# JWT (genera una clave segura)
JWT_SECRET=<genera-una-clave-aleatoria-aqui>
JWT_EXPIRATION=86400000

# CORS (actualiza después con tu dominio de frontend)
CORS_ORIGINS=https://tu-frontend.railway.app,http://localhost:5173

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Email (opcional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-password-de-aplicacion
```

**Configuración del Backend:**
```
Settings → Build:
  - Root Directory: /
  - Dockerfile Path: Dockerfile.backend
  
Settings → Deploy:
  - Health Check Path: /actuator/health
  - Health Check Timeout: 100
```

### 5️⃣ Desplegar Frontend

```
1. Click "+ New" → "GitHub Repo"
2. Selecciona tu repositorio nuevamente
3. Railway detecta Dockerfile.frontend automáticamente
```

**Variables de Entorno del Frontend:**

```env
# API URL (usa la URL pública del backend)
VITE_API_URL=https://tu-backend.railway.app
```

**Configuración del Frontend:**
```
Settings → Build:
  - Root Directory: /
  - Dockerfile Path: Dockerfile.frontend
  
Settings → Deploy:
  - Health Check Path: /health
  - Health Check Timeout: 30
```

### 6️⃣ Conectar Frontend y Backend

```
1. Ve al servicio Backend
2. Settings → Networking → Generate Domain
3. Copia la URL (ej: https://altius-backend-production.up.railway.app)
4. Ve al servicio Frontend
5. Variables → VITE_API_URL → Pega la URL del backend
6. Variables → CORS_ORIGINS en Backend → Agrega la URL del frontend
7. Redeploy ambos servicios
```

## ✅ Verificación

### Backend Health Check
```bash
curl https://tu-backend.railway.app/actuator/health

# Respuesta esperada:
# {"status":"UP"}
```

### Frontend
```bash
# Abrir en navegador
https://tu-frontend.railway.app
```

## 🔐 Generar JWT Secret Seguro

```bash
# En Linux/Mac
openssl rand -base64 64

# En Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))

# Online
https://generate-secret.vercel.app/64
```

## 📊 Monitoreo

Railway proporciona automáticamente:
- ✅ Logs en tiempo real
- ✅ Métricas de CPU/RAM
- ✅ Health checks
- ✅ Alertas de errores
- ✅ Rollback automático

## 🐛 Troubleshooting Rápido

### Backend no inicia
```bash
# 1. Ver logs en Railway
# 2. Verificar que MySQL y MongoDB estén UP
# 3. Verificar variables de entorno
# 4. Verificar DATABASE_URL tiene el formato correcto
```

### Frontend no conecta
```bash
# 1. Verificar VITE_API_URL en frontend
# 2. Verificar CORS_ORIGINS en backend incluye URL del frontend
# 3. Verificar que backend esté público (tiene dominio generado)
```

### Error de CORS
```bash
# En Backend, agregar a CORS_ORIGINS:
CORS_ORIGINS=https://tu-frontend.railway.app,http://localhost:5173
```

### Base de datos no conecta
```bash
# Usar referencias de Railway en lugar de URLs hardcodeadas:
DATABASE_URL=${{MySQL.MYSQL_URL}}
MONGODB_URI=${{MongoDB.MONGO_URL}}
```

## 🔄 Actualizar Despliegue

```bash
# Railway redespliega automáticamente en cada push
git add .
git commit -m "Actualización"
git push origin main

# Railway detecta el push y redespliega
```

## 💰 Costos Estimados

**Plan Hobby** ($5/mes + uso):
- MySQL: ~$5-8/mes
- MongoDB: ~$5-8/mes  
- Backend: ~$5-8/mes
- Frontend: ~$2-5/mes

**Total estimado**: $17-29/mes

**Plan Pro** ($20/mes + uso):
- Mejor para producción
- Más recursos
- Soporte prioritario

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Guía Completa](./DEPLOYMENT.md)

## 🆘 Comandos Útiles

```bash
# Ver logs
railway logs

# Ver variables
railway variables

# Conectar a base de datos
railway connect mysql
railway connect mongodb

# Abrir dashboard
railway open
```

## ✨ Tips

1. **Usa referencias de Railway** para variables entre servicios: `${{MySQL.MYSQL_URL}}`
2. **Genera dominios públicos** para backend y frontend en Settings → Networking
3. **Configura health checks** para auto-restart en caso de fallas
4. **Revisa logs** regularmente para detectar problemas temprano
5. **Usa .env.example** como plantilla, nunca subas .env a Git

---

¿Problemas? Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) para la guía completa.
