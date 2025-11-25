@echo off
echo ============================================
echo Subiendo 20,000 usuarios a Railway
echo ============================================
echo.

echo Paso 1: Vinculando proyecto...
railway link

echo.
echo Paso 2: Conectando a MySQL y ejecutando script...
echo.

railway run mysql -h mysql.railway.internal -u root -pzMGpvaACSqBkzpSepGfkVGCuWOdtmBQK railway < insert-20k-users.sql

echo.
echo ============================================
echo Script completado!
echo ============================================
pause
