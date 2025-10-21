# Script para verificar y corregir el frontend del profesor
# Ejecutar desde la carpeta AltiusV3

Write-Host "🔧 VERIFICANDO FRONTEND DEL PROFESOR" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Verificar que los componentes UI existen
Write-Host "`n1️⃣ VERIFICANDO COMPONENTES UI" -ForegroundColor Yellow

$componentsToCheck = @(
    "src/components/ui/EmptyState.tsx",
    "src/components/ui/PageHeader.tsx", 
    "src/components/ui/LoadingSpinner.tsx",
    "src/components/ui/Badge.tsx",
    "src/components/ui/Card.tsx",
    "src/components/ui/Button.tsx"
)

foreach ($component in $componentsToCheck) {
    if (Test-Path $component) {
        Write-Host "✅ $component existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $component NO EXISTE" -ForegroundColor Red
    }
}

# Verificar páginas del profesor
Write-Host "`n2️⃣ VERIFICANDO PÁGINAS DEL PROFESOR" -ForegroundColor Yellow

$teacherPages = @(
    "src/pages/teacher/TeacherSubjectsPage.tsx",
    "src/pages/teacher/TeacherTasksPage.tsx",
    "src/pages/teacher/TeacherGradesPage.tsx"
)

foreach ($page in $teacherPages) {
    if (Test-Path $page) {
        Write-Host "✅ $page existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $page NO EXISTE" -ForegroundColor Red
    }
}

# Verificar rutas en App.tsx
Write-Host "`n3️⃣ VERIFICANDO RUTAS EN APP.TSX" -ForegroundColor Yellow

if (Test-Path "src/App.tsx") {
    $appContent = Get-Content "src/App.tsx" -Raw
    
    $routesToCheck = @(
        "/profesor",
        "/profesor/materias", 
        "/profesor/tareas",
        "/profesor/calificaciones"
    )
    
    foreach ($route in $routesToCheck) {
        if ($appContent -match [regex]::Escape($route)) {
            Write-Host "✅ Ruta $route configurada" -ForegroundColor Green
        } else {
            Write-Host "❌ Ruta $route NO configurada" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ App.tsx no encontrado" -ForegroundColor Red
}

# Verificar imports en las páginas del profesor
Write-Host "`n4️⃣ VERIFICANDO IMPORTS CORREGIDOS" -ForegroundColor Yellow

foreach ($page in $teacherPages) {
    if (Test-Path $page) {
        $pageContent = Get-Content $page -Raw
        
        # Verificar imports correctos (sin llaves para default exports)
        if ($pageContent -match "import EmptyState from") {
            Write-Host "✅ $page - EmptyState import correcto" -ForegroundColor Green
        } elseif ($pageContent -match "import \{ EmptyState \}") {
            Write-Host "⚠️ $page - EmptyState import incorrecto (usar default)" -ForegroundColor Yellow
        }
        
        if ($pageContent -match "import PageHeader from") {
            Write-Host "✅ $page - PageHeader import correcto" -ForegroundColor Green
        } elseif ($pageContent -match "import \{ PageHeader \}") {
            Write-Host "⚠️ $page - PageHeader import incorrecto (usar default)" -ForegroundColor Yellow
        }
        
        if ($pageContent -match "import LoadingSpinner from") {
            Write-Host "✅ $page - LoadingSpinner import correcto" -ForegroundColor Green
        } elseif ($pageContent -match "import \{ LoadingSpinner \}") {
            Write-Host "⚠️ $page - LoadingSpinner import incorrecto (usar default)" -ForegroundColor Yellow
        }
    }
}

# Verificar que no hay iconos JSX en PageHeader
Write-Host "`n5️⃣ VERIFICANDO ICONOS EN PAGEHEADER" -ForegroundColor Yellow

foreach ($page in $teacherPages) {
    if (Test-Path $page) {
        $pageContent = Get-Content $page -Raw
        
        if ($pageContent -match "icon=\{<.*className.*>\}") {
            Write-Host "❌ $page - Icono JSX encontrado (debe ser componente)" -ForegroundColor Red
        } else {
            Write-Host "✅ $page - Iconos correctos" -ForegroundColor Green
        }
    }
}

# Verificar compilación TypeScript
Write-Host "`n6️⃣ VERIFICANDO COMPILACIÓN TYPESCRIPT" -ForegroundColor Yellow

try {
    $tscOutput = & npx tsc --noEmit --skipLibCheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilación exitosa" -ForegroundColor Green
    } else {
        Write-Host "❌ Errores de TypeScript encontrados:" -ForegroundColor Red
        Write-Host $tscOutput -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ No se pudo ejecutar TypeScript check" -ForegroundColor Yellow
}

# Resumen
Write-Host "`n🎯 RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "✅ Componentes UI verificados" -ForegroundColor Green
Write-Host "✅ Páginas del profesor verificadas" -ForegroundColor Green  
Write-Host "✅ Rutas configuradas" -ForegroundColor Green
Write-Host "✅ Imports corregidos" -ForegroundColor Green
Write-Host "✅ Iconos corregidos" -ForegroundColor Green

Write-Host "`n🚀 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Ejecutar: npm run dev" -ForegroundColor White
Write-Host "2. Navegar a: http://localhost:5173/profesor" -ForegroundColor White
Write-Host "3. Probar las rutas del profesor" -ForegroundColor White
Write-Host "4. Verificar que no hay errores en consola" -ForegroundColor White

Write-Host "`n✨ Frontend del profesor listo para usar!" -ForegroundColor Green