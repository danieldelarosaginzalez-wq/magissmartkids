@echo off
echo ========================================
echo Railway Configuration Checker
echo ========================================
echo.

echo Checking backend configuration...
echo.

echo [1/5] Checking application-prod.properties...
findstr /C:"CORS_ORIGINS" backend\src\main\resources\application-prod.properties
if %ERRORLEVEL% EQU 0 (
    echo ✓ CORS configuration found
) else (
    echo ✗ CORS configuration NOT found
)
echo.

echo [2/5] Checking Dockerfile.backend...
if exist Dockerfile.backend (
    echo ✓ Dockerfile.backend exists
) else (
    echo ✗ Dockerfile.backend NOT found
)
echo.

echo [3/5] Checking Dockerfile.frontend...
if exist Dockerfile.frontend (
    echo ✓ Dockerfile.frontend exists
) else (
    echo ✗ Dockerfile.frontend NOT found
)
echo.

echo [4/5] Checking railway.json files...
if exist railway.json (
    echo ✓ Frontend railway.json exists
) else (
    echo ✗ Frontend railway.json NOT found
)

if exist backend\railway.json (
    echo ✓ Backend railway.json exists
) else (
    echo ✗ Backend railway.json NOT found
)
echo.

echo [5/5] Checking nginx.conf...
if exist nginx.conf (
    echo ✓ nginx.conf exists
) else (
    echo ✗ nginx.conf NOT found
)
echo.

echo ========================================
echo Configuration check complete!
echo ========================================
echo.
echo Next steps:
echo 1. Commit and push your changes to GitHub
echo 2. Configure environment variables in Railway:
echo    - Backend: CORS_ORIGINS, JWT_SECRET, SPRING_PROFILES_ACTIVE
echo    - Frontend: VITE_API_URL
echo 3. Redeploy both services in Railway
echo 4. Check logs for any errors
echo.
pause
