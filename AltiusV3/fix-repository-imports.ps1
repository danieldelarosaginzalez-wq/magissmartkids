# Script para actualizar imports de repositorios
Write-Host "Actualizando imports de repositorios..." -ForegroundColor Yellow

$files = Get-ChildItem -Path "AltiusV3/backend/src" -Recurse -Filter "*.java"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Actualizar imports de repositorios
    $content = $content -replace 'import com\.altiusacademy\.repository\.([A-Za-z]+Repository);', 'import com.altiusacademy.repository.mysql.$1;'
    
    # Guardar solo si hubo cambios
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Actualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Imports actualizados!" -ForegroundColor Green