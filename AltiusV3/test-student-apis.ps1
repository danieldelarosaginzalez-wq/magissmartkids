# Script para probar las APIs del estudiante
Write-Host "🧪 PROBANDO APIS DEL ESTUDIANTE" -ForegroundColor Green

# Configuración
$baseUrl = "http://localhost:8080/api"
$testEmail = "student@test.com"
$testPassword = "password123"

Write-Host "📡 Probando conexión al backend..." -ForegroundColor Yellow

try {
    # 1. Probar login para obtener token
    Write-Host "🔐 1. Probando login..." -ForegroundColor Cyan
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        $token = $loginResponse.token
        Write-Host "✅ Login exitoso! Token obtenido." -ForegroundColor Green
        
        # Headers con autorización
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        # 2. Probar estadísticas del dashboard
        Write-Host "📊 2. Probando /students/dashboard/stats..." -ForegroundColor Cyan
        try {
            $statsResponse = Invoke-RestMethod -Uri "$baseUrl/students/dashboard/stats" -Method GET -Headers $headers
            Write-Host "✅ Estadísticas obtenidas:" -ForegroundColor Green
            Write-Host "   - Materias: $($statsResponse.totalSubjects)" -ForegroundColor White
            Write-Host "   - Tareas pendientes: $($statsResponse.pendingTasks)" -ForegroundColor White
            Write-Host "   - Promedio: $($statsResponse.averageGrade)" -ForegroundColor White
        } catch {
            Write-Host "❌ Error en estadísticas: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 3. Probar tareas
        Write-Host "📝 3. Probando /students/tasks..." -ForegroundColor Cyan
        try {
            $tasksResponse = Invoke-RestMethod -Uri "$baseUrl/students/tasks?status=pending" -Method GET -Headers $headers
            Write-Host "✅ Tareas obtenidas: $($tasksResponse.Count) tareas" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error en tareas: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 4. Probar materias
        Write-Host "📚 4. Probando /students/subjects/progress..." -ForegroundColor Cyan
        try {
            $subjectsResponse = Invoke-RestMethod -Uri "$baseUrl/students/subjects/progress" -Method GET -Headers $headers
            Write-Host "✅ Materias obtenidas: $($subjectsResponse.Count) materias" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error en materias: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 5. Probar notas
        Write-Host "📈 5. Probando /students/grades/recent..." -ForegroundColor Cyan
        try {
            $gradesResponse = Invoke-RestMethod -Uri "$baseUrl/students/grades/recent?limit=5" -Method GET -Headers $headers
            Write-Host "✅ Notas obtenidas: $($gradesResponse.Count) notas" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error en notas: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login falló: $($loginResponse.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que el backend esté corriendo en puerto 8080" -ForegroundColor Yellow
}

Write-Host "`n🏁 Prueba completada!" -ForegroundColor Green