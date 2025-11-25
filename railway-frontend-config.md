# Configuración del Frontend en Railway

## Pasos para configurar correctamente:

### 1. En Railway Dashboard
- Ve al servicio de frontend
- Click en **Settings** → **Build**
- Configura:
  - **Builder**: Dockerfile
  - **Dockerfile Path**: `Dockerfile.frontend`
  - **Build Command**: (dejar vacío)

### 2. Variables de Entorno Requeridas
En **Settings** → **Variables**, agrega:

```
VITE_API_URL=https://[TU-BACKEND-URL].railway.app
```

Reemplaza `[TU-BACKEND-URL]` con la URL pública de tu servicio backend.

### 3. Networking
- Ve a **Settings** → **Networking**
- Click en **Generate Domain** para obtener una URL pública
- Copia la URL generada

### 4. Actualizar CORS en Backend
Una vez tengas la URL del frontend, ve al servicio backend:
- **Settings** → **Variables**
- Agrega o actualiza:
```
CORS_ORIGINS=https://[TU-FRONTEND-URL].railway.app
```

### 5. Redeploy
- Haz click en el botón de redeploy en el servicio frontend
- Debería usar el Dockerfile correcto ahora

## Verificación
El frontend NO debe intentar conectarse a MySQL. Si ves logs de "Waiting for MySQL", significa que está usando el Dockerfile incorrecto.
