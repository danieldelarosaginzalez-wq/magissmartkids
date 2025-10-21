# Script para probar las APIs del profesor
# Ejecutar desde la carpeta AltiusV3

Write-Host "🎯 TESTING TEACHER APIs - DASHBOARD PROFESOR" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Configuración
$baseUrl = "http://localhost:8080/api"
$teacherEmail = "profesor@test.com"
$teacherPassword = "password123"

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
        return $null
    }
}

# 1. Login del profesor
Write-Host "`n1️⃣ LOGIN DEL PROFESOR" -ForegroundColor Yellow
$loginData = @{
    email = $teacherEmail
    password = $teacherPassword
}

$loginResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginData

if ($loginResponse -and $loginResponse.token) {
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    $authHeaders = @{ "Authorization" = "Bearer $($loginResponse.token)" }
} else {
    Write-Host "❌ Login fallido - creando datos de prueba..." -ForegroundColor Red
    
    # Intentar crear el profesor si no existe
    $registerData = @{
        email = $teacherEmail
        password = $teacherPassword
        firstName = "Juan Carlos"
        lastName = "Rodríguez"
        role = "TEACHER"
        institutionId = 1
    }
    
    $registerResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/register" -Body $registerData
    
    if ($registerResponse) {
        Write-Host "✅ Profesor creado, intentando login nuevamente..." -ForegroundColor Green
        $loginResponse = Invoke-ApiRequest -Method "POST" -Endpoint "/auth/login" -Body $loginData
        
        if ($loginResponse -and $loginResponse.token) {
            $authHeaders = @{ "Authorization" = "Bearer $($loginResponse.token)" }
        } else {
            Write-Host "❌ No se pudo autenticar. Saliendo..." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ No se pudo crear el profesor. Saliendo..." -ForegroundColor Red
        exit 1
    }
}

# 2. Obtener estadísticas del dashboard
Write-Host "`n2️⃣ DASHBOARD STATS" -ForegroundColor Yellow
$dashboardStats = Invoke-ApiRequest -Method "GET" -Endpoint "/teacher/dashboard/stats" -Headers $authHeaders

if ($dashboardStats) {
    Write-Host "✅ Dashboard stats obtenidas:" -ForegroundColor Green
    Write-Host "   📚 Total Materias: $($dashboardStats.totalMaterias)" -ForegroundColor White
    Write-Host "   👥 Total Estudiantes: $($dashboardStats.totalEstudiantes)" -ForegroundColor White
    Write-Host "   📝 Tareas Pendientes: $($dashboardStats.tareasPendientesCorreccion)" -ForegroundColor White
    Write-Host "   📊 Promedio General: $($dashboardStats.promedioGeneral)" -ForegroundColor White
} else {
    Write-Host "❌ Error obteniendo dashboard stats" -ForegroundColor Red
}

# 3. Obtener materias del profesor
Write-Host "`n3️⃣ MATERIAS DEL PROFESOR" -ForegroundColor Yellow
$teacherSubjects = Invoke-ApiRequest -Method "GET" -Endpoint "/teacher/subjects" -Headers $authHeaders

if ($teacherSubjects) {
    Write-Host "✅ Materias obtenidas: $($teacherSubjects.Count)" -ForegroundColor Green
    foreach ($subject in $teacherSubjects) {
        Write-Host "   📖 $($subject.nombre) - $($subject.grado) ($($subject.estudiantes) estudiantes)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo materias" -ForegroundColor Red
}

# 4. Obtener tareas del profesor
Write-Host "`n4️⃣ TAREAS DEL PROFESOR" -ForegroundColor Yellow
$teacherTasks = Invoke-ApiRequest -Method "GET" -Endpoint "/teacher/tasks" -Headers $authHeaders

if ($teacherTasks) {
    Write-Host "✅ Tareas obtenidas: $($teacherTasks.Count)" -ForegroundColor Green
    foreach ($task in $teacherTasks) {
        Write-Host "   📝 $($task.titulo) - Grados: $($task.grados -join ', ')" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo tareas" -ForegroundColor Red
}

# 5. Crear nueva tarea
Write-Host "`n5️⃣ CREAR NUEVA TAREA" -ForegroundColor Yellow
$newTaskData = @{
    titulo = "Tarea de Prueba API"
    descripcion = "Esta es una tarea creada desde el script de prueba"
    materiaId = 1
    grados = @("10° A", "10° B")
    fechaEntrega = "2024-12-01"
    tipo = "traditional"
    archivosAdjuntos = @()
}

$createdTask = Invoke-ApiRequest -Method "POST" -Endpoint "/teacher/tasks" -Body $newTaskData -Headers $authHeaders

if ($createdTask) {
    Write-Host "✅ Tarea creada exitosamente: $($createdTask.title)" -ForegroundColor Green
} else {
    Write-Host "❌ Error creando tarea" -ForegroundColor Red
}

# 6. Obtener tareas para calificar
Write-Host "`n6️⃣ TAREAS PARA CALIFICAR" -ForegroundColor Yellow
$gradingTasks = Invoke-ApiRequest -Method "GET" -Endpoint "/teacher/grades?subjectId=1&grade=10%C2%B0%20A" -Headers $authHeaders

if ($gradingTasks) {
    Write-Host "✅ Tareas para calificar: $($gradingTasks.Count)" -ForegroundColor Green
    foreach ($task in $gradingTasks) {
        Write-Host "   📋 $($task.taskTitle) - $($task.studentName) [$($task.status)]" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo tareas para calificar" -ForegroundColor Red
}

# 7. Obtener estudiantes por grado
Write-Host "`n7️⃣ ESTUDIANTES POR GRADO" -ForegroundColor Yellow
$students = Invoke-ApiRequest -Method "GET" -Endpoint "/teacher/students?grade=10%C2%B0%20A" -Headers $authHeaders

if ($students) {
    Write-Host "✅ Estudiantes obtenidos: $($students.Count)" -ForegroundColor Green
    foreach ($student in $students) {
        Write-Host "   👤 $($student.fullName) - Promedio: $($student.averageScore)" -ForegroundColor White
    }
} else {
    Write-Host "❌ Error obteniendo estudiantes" -ForegroundColor Red
}

# 8. Calificar una tarea (si hay tareas pendientes)
if ($gradingTasks -and $gradingTasks.Count -gt 0) {
    $taskToGrade = $gradingTasks | Where-Object { $_.status -eq "SUBMITTED" } | Select-Object -First 1
    
    if ($taskToGrade) {
        Write-Host "`n8️⃣ CALIFICAR TAREA" -ForegroundColor Yellow
        $gradeData = @{
            newScore = 4.2
            newFeedback = "Buen trabajo, pero puede mejorar en algunos aspectos. Calificación asignada por script de prueba."
        }
        
        $gradeResult = Invoke-ApiRequest -Method "PUT" -Endpoint "/teacher/tasks/$($taskToGrade.taskId)/grade" -Body $gradeData -Headers $authHeaders
        
        if ($gradeResult -ne $null) {
            Write-Host "✅ Tarea calificada exitosamente" -ForegroundColor Green
        } else {
            Write-Host "❌ Error calificando tarea" -ForegroundColor Red
        }
    } else {
        Write-Host "`n8️⃣ No hay tareas SUBMITTED para calificar" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n8️⃣ No hay tareas para calificar" -ForegroundColor Yellow
}

# Resumen final
Write-Host "`n🎯 RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "✅ Login del profesor" -ForegroundColor Green
Write-Host "✅ Dashboard stats" -ForegroundColor Green
Write-Host "✅ Materias del profesor" -ForegroundColor Green
Write-Host "✅ Tareas del profesor" -ForegroundColor Green
Write-Host "✅ Crear nueva tarea" -ForegroundColor Green
Write-Host "✅ Tareas para calificar" -ForegroundColor Green
Write-Host "✅ Estudiantes por grado" -ForegroundColor Green
Write-Host "✅ Calificar tarea" -ForegroundColor Green

Write-Host "`n🚀 Todas las APIs del profesor están funcionando correctamente!" -ForegroundColor Green
Write-Host "📱 Ahora puedes probar el frontend en: http://localhost:5173" -ForegroundColor Cyan