# Fix: Error 405 - Frontend no puede conectar con Backend

## Problema
El frontend está intentando hacer peticiones a sí mismo en lugar del backend:
```
POST https://frotend-production-aa50.up.railway.app/api/auth/login 405 (Method Not Allowed)
```

## Solución

### 1. Obtener la URL del Backend en Railway

1. Ve a tu proyecto en Railway
2. Abre el servicio del **backend**
3. Ve a la pestaña **Settings**
4. Copia la URL pública (algo como: `https://backend-production-xxxx.up.railway.app`)

### 2. Configurar Variable de Entorno en el Frontend

1. Ve al servicio del **frontend** en Railway
2. Ve a la pestaña **Variables**
3. Agrega una nueva variable:
   ```
   VITE_API_BASE_URL=https://backend-production-xxxx.up.railway.app/api
   ```
   ⚠️ **IMPORTANTE**: Reemplaza `backend-production-xxxx.up.railway.app` con tu URL real del backend
   ⚠️ **IMPORTANTE**: Agrega `/api` al final de la URL

### 3. Redeploy del Frontend

Después de agregar la variable, Railway debería hacer redeploy automáticamente.
Si no lo hace:
1. Ve a **Deployments**
2. Click en los 3 puntos del último deployment
3. Click en **Redeploy**

### 4. Verificar

Una vez que el frontend se redespliegue:
1. Abre la consola del navegador (F12)
2. Intenta hacer login
3. Deberías ver peticiones a tu backend en lugar del frontend

## Variables de Entorno Necesarias

### Frontend (Railway)
```env
VITE_API_BASE_URL=https://tu-backend.up.railway.app/api
```

### Backend (Railway)
```env
# Ya deberían estar configuradas
DATABASE_URL=mysql://...
JWT_SECRET=tu-secret-key
CORS_ORIGINS=https://tu-frontend.up.railway.app
```

## Verificación de CORS

Si después de esto ves errores de CORS, asegúrate de que en el backend:

1. La variable `CORS_ORIGINS` incluya la URL del frontend:
   ```env
   CORS_ORIGINS=https://frotend-production-aa50.up.railway.app
   ```

2. O configura CORS para permitir todos los orígenes (solo para pruebas):
   ```env
   CORS_ORIGINS=*
   ```

## Notas Adicionales

- El frontend usa `import.meta.env.VITE_API_BASE_URL` para determinar la URL del API
- Si no está configurada, usa `/api` (relativo), lo que causa el error 405
- En producción, SIEMPRE debes configurar `VITE_API_BASE_URL` apuntando al backend
