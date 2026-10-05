[console]::OutputEncoding = New-Object System.Text.UTF8Encoding
# Oh My Posh setup
oh-my-posh init pwsh --config  "jandedobbeleer" | Invoke-Expression

# Aliases útiles
Set-Alias -Name ll -Value Get-ChildItem
Set-Alias -Name grep -Value Select-String

# Colores personalizados
$Host.PrivateData.ErrorForegroundColor = "Red"
$Host.PrivateData.ErrorBackgroundColor = "Black"
$Host.PrivateData.WarningForegroundColor = "Yellow"
$Host.PrivateData.WarningBackgroundColor = "Black"
$Host.PrivateData.DebugForegroundColor = "Cyan"
$Host.PrivateData.DebugBackgroundColor = "Black"


function sage {
    $runtime = "C:\Users\Rafael Olivo\AppData\Local\SageMath 9.3\runtime\bin"
    $bash = "$runtime\bash.exe"
    $sageExe = "/opt/sagemath-9.3/sage"
    
    if ($args.Count -eq 0) {
        # Inicia Sage interactivo
        & $bash --login -c "$sageExe"
    } else {
        # Obtener la ruta completa del archivo
        $winPath = Resolve-Path $args[0] -ErrorAction SilentlyContinue
        
        if (-not $winPath) {
            Write-Host "Error: No se pudo encontrar el archivo $($args[0])" -ForegroundColor Red
            return
        }
        
        # Convertir ruta de Windows a Cygwin
        $cygPath = & "$runtime\cygpath.exe" -u "$winPath"
        
        # Obtener el directorio del archivo en formato Cygwin
        $fileDir = Split-Path -Parent $winPath
        $cygDir = & "$runtime\cygpath.exe" -u "$fileDir"
        
        # Obtener solo el nombre del archivo
        $fileName = Split-Path -Leaf $cygPath
        
        # Ejecutar Sage cambiando primero al directorio del archivo
        & $bash --login -c "cd '$cygDir' && $sageExe '$fileName'"
    }
}

New-Alias -Name sagetex -Value "C:\Users\Rafael Olivo\AppData\Local\SageMath 9.3\compile-sage.bat"

function openwebui {    # Cambia la ruta por la carpeta exacta donde creaste tu 'openwebui-env'
   & "C:\Users\Rafael Olivo\openwebui-env\Scripts\Activate.ps1"
open-webui serve}

Set-Alias -Name opencode -Value "C:\opencode\opencode.exe"