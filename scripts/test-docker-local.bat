@echo off
REM Script para probar el sistema localmente con Docker en Windows

echo.
echo ========================================
echo   Probando sistema con Docker
echo ========================================
echo.

REM Verificar Docker
echo [1/6] Verificando Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no esta instalado
    echo Por favor instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [OK] Docker instalado
echo.

docker-compose --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker Compose no esta instalado
    pause
    exit /b 1
)
echo [OK] Docker Compose instalado
echo.

REM Verificar archivo .env
echo [2/6] Verificando archivo .env...
if not exist ".env" (
    echo ADVERTENCIA: No existe archivo .env
    echo Copiando .env.example a .env...
    copy .env.example .env
    echo.
    echo Por favor edita .env con tus credenciales antes de continuar
    echo Presiona cualquier tecla cuando hayas editado el archivo...
    pause
)
echo [OK] Archivo .env existe
echo.

REM Detener contenedores existentes
echo [3/6] Deteniendo contenedores existentes...
docker-compose down -v 2>nul
echo [OK] Contenedores detenidos
echo.

REM Limpiar imagenes antiguas (opcional)
set /p CLEAN="Deseas limpiar imagenes antiguas? (S/N): "
if /i "%CLEAN%"=="S" (
    docker system prune -f
    echo [OK] Imagenes antiguas limpiadas
)
echo.

REM Build de las imagenes
echo [4/6] Construyendo imagenes...
echo Esto puede tomar varios minutos...
docker-compose build --no-cache
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build fallo
    pause
    exit /b 1
)
echo [OK] Imagenes construidas
echo.

REM Iniciar servicios
echo [5/6] Iniciando servicios...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudieron iniciar los servicios
    pause
    exit /b 1
)
echo [OK] Servicios iniciados
echo.

REM Esperar a que los servicios esten listos
echo [6/6] Esperando a que los servicios esten listos...
timeout /t 15 /nobreak >nul
echo.

REM Verificar estado de los servicios
echo Estado de los servicios:
docker-compose ps
echo.

REM Health checks
echo Verificando health checks...
echo.

REM MySQL
echo Verificando MySQL...
docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MySQL esta funcionando
) else (
    echo [ADVERTENCIA] MySQL puede necesitar mas tiempo
)

REM MongoDB
echo Verificando MongoDB...
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" --quiet 2>nul | findstr "ok" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB esta funcionando
) else (
    echo [ADVERTENCIA] MongoDB puede necesitar mas tiempo
)

REM Backend (esperar hasta 60 segundos)
echo Verificando Backend (puede tomar hasta 60 segundos)...
set BACKEND_OK=0
for /L %%i in (1,1,12) do (
    curl -s http://localhost:8090/actuator/health 2>nul | findstr "UP" >nul
    if !ERRORLEVEL! EQU 0 (
        set BACKEND_OK=1
        goto :backend_ready
    )
    timeout /t 5 /nobreak >nul
)
:backend_ready
if %BACKEND_OK% EQU 1 (
    echo [OK] Backend esta funcionando
) else (
    echo [ADVERTENCIA] Backend puede necesitar mas tiempo
)

REM Frontend
echo Verificando Frontend...
curl -s http://localhost/health 2>nul | findstr "healthy" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend esta funcionando
) else (
    echo [ADVERTENCIA] Frontend puede necesitar mas tiempo
)
echo.

REM Mostrar logs recientes
echo Logs recientes:
echo ========================================
docker-compose logs --tail=20
echo ========================================
echo.

REM Informacion de acceso
echo ========================================
echo   Sistema iniciado exitosamente!
echo ========================================
echo.
echo Acceso a servicios:
echo   Frontend:  http://localhost
echo   Backend:   http://localhost:8090
echo   API Docs:  http://localhost:8090/swagger-ui.html
echo   Health:    http://localhost:8090/actuator/health
echo.
echo Bases de datos:
echo   MySQL:     localhost:3306
echo   MongoDB:   localhost:27017
echo.
echo Comandos utiles:
echo   Ver logs:           docker-compose logs -f
echo   Ver logs backend:   docker-compose logs -f backend
echo   Ver logs frontend:  docker-compose logs -f frontend
echo   Reiniciar:          docker-compose restart
echo   Detener:            docker-compose down
echo   Detener y limpiar:  docker-compose down -v
echo.
pause
