# Pasos para Deployment en Railway

## ✅ Cambios Realizados Localmente

1. ✅ Creada carpeta `public/` con las imágenes Logo.png y Home.png
2. ✅ Actualizado `index.html` para usar Logo.png como favicon
3. ✅ Actualizado `.gitignore` para permitir la carpeta public
4. ✅ Actualizado `application-prod.properties` con CORS correcto
5. ✅ Commit realizado: "Fix: Agregar carpeta public con imágenes y actualizar favicon"

## 🔴 PENDIENTE: Push a GitHub

**PROBLEMA**: No puedes hacer push porque estás autenticado con la cuenta incorrecta.

**SOLUCIÓN**:
1. Abre tu navegador
2. Ve a GitHub.com
3. Cierra sesión de la cuenta `danieldelarosaginzalez-wq`
4. Inicia sesión con la cuenta `ValentinaITDev`
5. En tu terminal, ejecuta:
   ```cmd
   git push origin valentina
   ```
6. Cuando se abra el navegador para autenticación, asegúrate de estar con ValentinaITDev

## 🔴 PENDIENTE: Configurar Variables de Entorno en Railway

### Backend (backend-production-8efc)

Ve a Railway Dashboard → Backend Service → Variables → Raw Editor

Pega esto:
```bash
SPRING_PROFILES_ACTIVE=prod
PORT=8090
CORS_ORIGINS=https://frotend-production-aa50.up.railway.app
JWT_SECRET=altiusAcademySecretKey2025VerySecureKeyForProduction
```

**IMPORTANTE**: Verifica que estas variables de MySQL existan (Railway las crea automáticamente):
- MYSQLHOST
- MYSQLPORT
- MYSQLDATABASE
- MYSQLUSER
- MYSQLPASSWORD

Si NO existen, ve a Settings → "Connect to MySQL service"

### Frontend (frotend-production-aa50)

Ve a Railway Dashboard → Frontend Service → Variables → Raw Editor

Pega esto:
```bash
VITE_API_URL=https://backend-production-8efc.up.railway.app
```

## 🔴 PENDIENTE: Redeploy en Railway

1. **Backend**: Railway Dashboard → Backend Service → Deployments → "Redeploy"
2. **Frontend**: Railway Dashboard → Frontend Service → Deployments → "Redeploy"

## 🔴 PENDIENTE: Verificar Logs

### Backend Logs (busca estos mensajes):
```
✅ "Started AltiusAcademyApplication"
✅ "Tomcat started on port(s): 8090"
✅ "MySQL connection established"
```

### Frontend Logs (busca estos mensajes):
```
✅ "nginx: master process"
✅ "Configuration complete"
```

## 🔴 PENDIENTE: Probar la Aplicación

1. Abre: https://frotend-production-aa50.up.railway.app/
2. Deberías ver:
   - ✅ El logo de MagicSmartKids
   - ✅ La imagen de fondo (Home.png)
   - ✅ El favicon en la pestaña del navegador
   - ✅ La página de login sin errores 502

3. Abre la consola del navegador (F12) → Network
4. Verifica que NO haya errores 502 o CORS

## Resumen de Problemas Resueltos

1. **Imágenes no se mostraban**: Las imágenes estaban en la raíz en lugar de la carpeta `public/`
2. **Favicon 404**: El index.html buscaba favicon.svg que no existía
3. **CORS incorrecto**: application-prod.properties tenía un placeholder en lugar de la URL real del frontend

## Próximos Pasos Después del Deployment

1. Crear un super admin en la base de datos de producción
2. Probar el login con diferentes roles
3. Verificar que las imágenes se suban correctamente
4. Configurar el dominio personalizado (opcional)
