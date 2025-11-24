@echo off
REM Script de despliegue para Railway en Windows
REM Este script ayuda a preparar y verificar el proyecto antes del despliegue

echo.
echo ========================================
echo   Preparando despliegue en Railway
echo ========================================
echo.

REM Verificar que estamos en la rama correcta
echo [1/8] Verificando rama de Git...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Rama actual: %CURRENT_BRANCH%

if not "%CURRENT_BRANCH%"=="main" if not "%CURRENT_BRANCH%"=="master" (
    echo ADVERTENCIA: No estas en la rama main/master
    set /p CONTINUE="Continuar de todas formas? (S/N): "
    if /i not "%CONTINUE%"=="S" exit /b 1
)
echo [OK] Rama verificada
echo.

REM Verificar cambios pendientes
echo [2/8] Verificando cambios pendientes...
git status -s > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] No hay cambios pendientes
) else (
    echo ADVERTENCIA: Hay cambios sin commitear
    git status -s
    set /p COMMIT="Deseas commitear estos cambios? (S/N): "
    if /i "%COMMIT%"=="S" (
        git add .
        set /p COMMIT_MSG="Mensaje del commit: "
        git commit -m "%COMMIT_MSG%"
        echo [OK] Cambios commiteados
    )
)
echo.

REM Verificar archivos necesarios
echo [3/8] Verificando archivos de despliegue...
set FILES_OK=1

if not exist "Dockerfile.backend" (
    echo [ERROR] Dockerfile.backend no encontrado
    set FILES_OK=0
)
if not exist "Dockerfile.frontend" (
    echo [ERROR] Dockerfile.frontend no encontrado
    set FILES_OK=0
)
if not exist "docker-compose.yml" (
    echo [ERROR] docker-compose.yml no encontrado
    set FILES_OK=0
)
if not exist "nginx.conf" (
    echo [ERROR] nginx.conf no encontrado
    set FILES_OK=0
)
if not exist ".env.example" (
    echo [ERROR] .env.example no encontrado
    set FILES_OK=0
)

if %FILES_OK% EQU 0 (
    echo [ERROR] Faltan archivos necesarios
    exit /b 1
)
echo [OK] Todos los archivos necesarios existen
echo.

REM Verificar estructura del backend
echo [4/8] Verificando estructura del backend...
if not exist "backend\pom.xml" (
    echo [ERROR] backend\pom.xml no encontrado
    exit /b 1
)
if not exist "backend\src\main\resources\application.properties" (
    echo [ERROR] application.properties no encontrado
    exit /b 1
)
echo [OK] Estructura del backend verificada
echo.

REM Verificar estructura del frontend
echo [5/8] Verificando estructura del frontend...
if not exist "package.json" (
    echo [ERROR] package.json no encontrado
    exit /b 1
)
if not exist "vite.config.ts" (
    echo [ERROR] vite.config.ts no encontrado
    exit /b 1
)
echo [OK] Estructura del frontend verificada
echo.

REM Test de build local (opcional)
echo [6/8] Test de build local
set /p BUILD_LOCAL="Deseas probar el build localmente con Docker? (S/N): "
if /i "%BUILD_LOCAL%"=="S" (
    echo Construyendo imagen del backend...
    docker build -f Dockerfile.backend -t altius-backend:test .
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build del backend fallo
        exit /b 1
    )
    echo [OK] Backend build exitoso
    
    echo Construyendo imagen del frontend...
    docker build -f Dockerfile.frontend -t altius-frontend:test .
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build del frontend fallo
        exit /b 1
    )
    echo [OK] Frontend build exitoso
    
    set /p START_COMPOSE="Deseas iniciar los contenedores con docker-compose? (S/N): "
    if /i "%START_COMPOSE%"=="S" (
        if not exist ".env" (
            echo ADVERTENCIA: No existe archivo .env
            echo Copiando .env.example a .env...
            copy .env.example .env
            echo Por favor edita .env con tus credenciales antes de continuar
            pause
            exit /b 1
        )
        docker-compose up -d
        echo [OK] Contenedores iniciados
        echo.
        echo Servicios disponibles en:
        echo   - Frontend: http://localhost
        echo   - Backend: http://localhost:8090
        echo   - MySQL: localhost:3306
        echo   - MongoDB: localhost:27017
        echo.
        echo Para ver logs: docker-compose logs -f
        echo Para detener: docker-compose down
    )
)
echo.

REM Push a Git
echo [7/8] Push a Git
set /p PUSH_GIT="Deseas hacer push a Git? (S/N): "
if /i "%PUSH_GIT%"=="S" (
    git push origin %CURRENT_BRANCH%
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Push fallo
        exit /b 1
    )
    echo [OK] Push exitoso a %CURRENT_BRANCH%
)
echo.

REM Resumen final
echo [8/8] Preparacion completada!
echo.
echo ========================================
echo   Proximos pasos:
echo ========================================
echo 1. Ve a Railway: https://railway.app
echo 2. Crea un nuevo proyecto
echo 3. Conecta tu repositorio de GitHub
echo 4. Agrega servicios: MySQL, MongoDB, Backend, Frontend
echo 5. Configura las variables de entorno segun DEPLOYMENT.md
echo.
echo Para mas detalles, consulta DEPLOYMENT.md o RAILWAY_SETUP.md
echo.
pause
