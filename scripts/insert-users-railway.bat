@echo off
echo ============================================
echo Insertando 20,000 usuarios en Railway MySQL
echo ============================================
echo.

REM Credenciales de Railway
set MYSQL_HOST=hopper.proxy.rlwy.net
set MYSQL_PORT=27465
set MYSQL_USER=root
set MYSQL_PASSWORD=zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK
set MYSQL_DATABASE=railway

echo Conectando a Railway MySQL...
echo Host: %MYSQL_HOST%
echo Port: %MYSQL_PORT%
echo Database: %MYSQL_DATABASE%
echo.

REM Ejecutar el script SQL
mysql -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASSWORD% %MYSQL_DATABASE% < insert-20k-users.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo ✅ Script ejecutado exitosamente!
    echo ============================================
    echo.
    echo Verificando usuarios insertados...
    echo.
    
    REM Verificar los usuarios insertados
    mysql -h %MYSQL_HOST% -P %MYSQL_PORT% -u %MYSQL_USER% -p%MYSQL_PASSWORD% %MYSQL_DATABASE% -e "SELECT role, COUNT(*) as total FROM users GROUP BY role;"
    
    echo.
    echo ============================================
    echo Total de usuarios en la base de datos
    echo ============================================
) else (
    echo.
    echo ============================================
    echo ❌ Error al ejecutar el script
    echo ============================================
    echo.
    echo Verifica que:
    echo 1. MySQL esté instalado en tu sistema
    echo 2. Las credenciales sean correctas
    echo 3. El archivo insert-20k-users.sql exista
)

pause
