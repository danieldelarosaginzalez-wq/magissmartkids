# Script para probar las APIs del estudiante corregidas
# Ejecutar desde la carpeta AltiusV3

Write-Host "🎯 TESTING STUDENT APIs - ERRORES 500 CORREGIDOS" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Configuración
$baseUrl = "http://localhost:8080/api"

# Función para hacer requests
function Invoke-ApiRequest {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    $url = "$baseUrl$Endpoint"
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $url -Method $Method -Body $jsonBody -ContentType "application/json" -Headers $Headers
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -Headers $Headers
        }
        return $response
    } catch {
        Write-Host "❌ Error en $Method $Endpoint : $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        return $null
    }
}

# 1. Probar Dashboard Stats
Write-Host "`n1️⃣ DASHBOARD STATS" -ForegroundColor Yellow
$dashboardStats = Invoke-ApiRequest -Method "GET" -Endpoint "/students/dashboard/stats"

if ($dashboardStats) {
    Write-Host "✅ Dashboard stats obtenidas:" -ForegroundColor Green
    Write-Host "   📚 Total Materias: $($dashboardStats.totalSubjects)" -ForegroundColor White
    Write-Host "   📝 Tareas Pendientes: $($dashboardStats.pendingTasks)" -ForegroundColor White
    Write-Host "   ✅ Tareas Completadas: $($dashboardStats.completedTasks)" -ForegroundColor White
    Write-Host "   📊 Promedio: $($dashboardStats.averageGrade)" -ForegroundColor White
    Write-Host "   ⏰ Horas de Estudio: $($dashboardStats.studyHours)" -ForegroundColor White
    Write-Host "   🎯 Actividades Completadas: $($dashboardStats.completedActivities)" -ForegroundColor White
} else {
    Write-Host "❌ Error obteniendo dashboard stats" -ForegroundColor Red
}

# 2. Probar Tasks
Write-Host "`n2️⃣ TAREAS DEL ESTUDIANTE" -ForegroundColor Yellow
$tasks = Invoke-ApiRequest -Method "GET" -Endpoint "/students/tasks?status=pending"

if ($tasks) {
    Write-Host "✅ Tareas obtenidas: $($tasks.Count)" -ForegroundColor Green
    foreach ($task in $tasks) {
        Write-Host "   📝 $($task.subject): $($task.title) - $($task.status)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo tareas" -ForegroundColor Red
}

# 3. Probar Subjects Progress
Write-Host "`n3️⃣ PROGRESO DE MATERIAS" -ForegroundColor Yellow
$subjects = Invoke-ApiRequest -Method "GET" -Endpoint "/students/subjects/progress"

if ($subjects) {
    Write-Host "✅ Materias obtenidas: $($subjects.Count)" -ForegroundColor Green
    foreach ($subject in $subjects) {
        Write-Host "   📖 $($subject.name): $($subject.progress)% - Nota: $($subject.grade)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo progreso de materias" -ForegroundColor Red
}

# 4. Probar Recent Grades
Write-Host "`n4️⃣ CALIFICACIONES RECIENTES" -ForegroundColor Yellow
$grades = Invoke-ApiRequest -Method "GET" -Endpoint "/students/grades/recent?limit=3"

if ($grades) {
    Write-Host "✅ Calificaciones obtenidas: $($grades.Count)" -ForegroundColor Green
    foreach ($grade in $grades) {
        Write-Host "   📊 $($grade.subject): $($grade.taskName) - $($grade.grade)/$($grade.maxGrade)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo calificaciones recientes" -ForegroundColor Red
}

# 5. Probar Health Check
Write-Host "`n5️⃣ HEALTH CHECK" -ForegroundColor Yellow
$health = Invoke-ApiRequest -Method "GET" -Endpoint "/health"

if ($health) {
    Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
} else {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
}

# Resumen final
Write-Host "`n🎯 RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

$successCount = 0
if ($dashboardStats) { $successCount++ }
if ($tasks) { $successCount++ }
if ($subjects) { $successCount++ }
if ($grades) { $successCount++ }
if ($health) { $successCount++ }

Write-Host "✅ APIs funcionando: $successCount/5" -ForegroundColor Green

if ($successCount -eq 5) {
    Write-Host "`n🚀 ¡TODAS LAS APIs DEL ESTUDIANTE ESTÁN FUNCIONANDO!" -ForegroundColor Green
    Write-Host "📱 Ahora puedes probar el frontend en: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "🎯 Las rutas del estudiante deberían cargar sin errores 500" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Algunas APIs aún tienen problemas. Revisa los logs del backend." -ForegroundColor Yellow
}

Write-Host "`n📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Si todas las APIs funcionan, probar el frontend" -ForegroundColor White
Write-Host "2. Si hay errores, revisar logs del backend Spring Boot" -ForegroundColor White
Write-Host "3. Verificar que el puerto 8080 esté libre" -ForegroundColor White
Write-Host "4. Asegurarse de que la base de datos esté corriendo" -ForegroundColor White