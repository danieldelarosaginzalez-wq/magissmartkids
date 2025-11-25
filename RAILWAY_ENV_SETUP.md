# Configuración de Variables de Entorno en Railway

## Problema Actual
- Frontend: https://frotend-production-aa50.up.railway.app/
- Backend: https://backend-production-8efc.up.railway.app

**Error 502**: El backend no está respondiendo. Esto puede ser por:
1. El backend no ha iniciado correctamente
2. Problemas con la conexión a MySQL
3. Variables de entorno faltantes o incorrectas

## Solución: Configurar Variables de Entorno

### PASO 1: Verificar que MySQL esté corriendo

En Railway Dashboard:
1. Ve a tu proyecto
2. Verifica que el servicio **MySQL** esté activo y corriendo
3. Si no existe, agrégalo: "New" → "Database" → "Add MySQL"

### PASO 2: Backend (backend-production-8efc)

Ve a Railway Dashboard → Proyecto → Servicio Backend → Variables

**Variables REQUERIDAS:**

```bash
# Perfil de Spring Boot
SPRING_PROFILES_ACTIVE=prod

# Puerto (Railway lo asigna automáticamente)
PORT=8090

# CORS - IMPORTANTE: URL del frontend
CORS_ORIGINS=https://frotend-production-aa50.up.railway.app

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_secret_key_muy_segura_aqui_cambiar

# MySQL - Railway las proporciona automáticamente si agregaste MySQL
# Verifica que estas existan (Railway las crea automáticamente):
# MYSQLHOST
# MYSQLPORT  
# MYSQLDATABASE
# MYSQLUSER
# MYSQLPASSWORD
```

**IMPORTANTE**: 
- Si las variables de MySQL no existen, significa que no has vinculado el servicio MySQL
- Para vincular: En el servicio Backend → Settings → "Connect to MySQL service"

### PASO 3: Frontend (frotend-production-aa50)

Ve a Railway Dashboard → Proyecto → Servicio Frontend → Variables

**Variables REQUERIDAS:**

```bash
# URL del backend - CRÍTICO para que el frontend sepa dónde está la API
VITE_API_URL=https://backend-production-8efc.up.railway.app
```

**IMPORTANTE**: Después de agregar la variable, debes hacer **REDEPLOY** del frontend.

### PASO 4: Hacer Redeploy

Después de configurar las variables:

1. **Backend**: Railway Dashboard → Backend Service → Deployments → "Redeploy"
2. **Frontend**: Railway Dashboard → Frontend Service → Deployments → "Redeploy"

### PASO 5: Verificar Logs

**Backend logs** (busca estos mensajes):
```
✅ "Started AltiusAcademyApplication in X seconds"
✅ "Tomcat started on port(s): 8090"
✅ "MySQL connection established"
❌ Si ves "Connection refused" o "Access denied" → problema con MySQL
❌ Si ves "Port already in use" → problema de configuración
```

**Frontend logs** (busca estos mensajes):
```
✅ "nginx: master process"
✅ "Configuration complete"
❌ Si ves errores → revisa el Dockerfile
```

### PASO 6: Probar la Aplicación

1. Abre: https://frotend-production-aa50.up.railway.app/
2. Deberías ver la página de login (no un error 502)
3. Abre la consola del navegador (F12) → Network
4. Verifica que las llamadas API vayan a: `https://backend-production-8efc.up.railway.app`
5. Si ves errores CORS, verifica que `CORS_ORIGINS` esté configurado correctamente en el backend

### PASO 7: Diagnóstico de Errores Comunes

**Error 502 Bad Gateway:**
- El backend no está corriendo
- Verifica los logs del backend
- Verifica que MySQL esté conectado
- Verifica que las variables de entorno estén configuradas

**Error CORS:**
- Verifica que `CORS_ORIGINS` en el backend tenga la URL correcta del frontend
- Debe ser: `https://frotend-production-aa50.up.railway.app` (sin barra final)

**Error de conexión a MySQL:**
- Verifica que el servicio MySQL esté corriendo
- Verifica que las variables MYSQL* estén configuradas
- Verifica que el backend esté vinculado al servicio MySQL

**Frontend muestra página en blanco:**
- Verifica que `VITE_API_URL` esté configurado
- Haz redeploy del frontend después de agregar la variable

## Pasos para Hacer Push a GitHub

Como el problema de autenticación persiste, necesitas:

1. **Abrir GitHub en tu navegador**
2. **Cerrar sesión** de la cuenta danieldelarosaginzalez-wq
3. **Iniciar sesión** con la cuenta ValentinaITDev
4. **En tu terminal**, ejecutar:
   ```cmd
   git push origin valentina
   ```
5. Cuando se abra el navegador para autenticación, asegúrate de estar con la cuenta correcta

## Alternativa: Usar Token de Acceso Personal

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos de `repo`
3. Copia el token
4. En tu terminal:
   ```cmd
   git remote set-url origin https://TU_TOKEN@github.com/ValentinaITDev/AltiusV3.git
   git push origin valentina
   ```

Después del push, restaura la URL original:
```cmd
git remote set-url origin https://github.com/ValentinaITDev/AltiusV3.git
```
