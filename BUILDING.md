# Guía Completa de Build y Distribución - AI Studio

Esta guía te mostrará paso a paso cómo crear los paquetes de instalación para Windows, macOS y Linux.

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [Build en Windows](#build-en-windows)
4. [Build en macOS](#build-en-macos)
5. [Build en Linux](#build-en-linux)
6. [Build Flatpak para Flathub](#build-flatpak-para-flathub)
7. [Publicación en GitHub Releases](#publicación-en-github-releases)
8. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### Todos los Sistemas
- **Node.js 18.x o superior**: [Descargar](https://nodejs.org/)
- **npm 9.x o superior** (viene con Node.js)
- **Git**: [Descargar](https://git-scm.com/)

### Windows
- **Windows 7 o superior**
- **Visual Studio Build Tools 2019+** (para compilar módulos nativos)
  - Descargar desde: https://visualstudio.microsoft.com/downloads/
  - Incluir: C++ desktop development tools

### macOS
- **macOS 10.13+**
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```
- **Certificados de Apple** (opcional, para notarización):
  - Necesitas una cuenta de Apple Developer
  - Variables de entorno: `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_SIGNING_IDENTITY`

### Linux
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y build-essential fakeroot dpkg

# Fedora/RedHat
sudo dnf install -y gcc g++ make fakeroot rpm-build

# Arch
sudo pacman -S base-devel fakeroot
```

---

## Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone https://github.com/antalcides/ai-studio.git
cd ai-studio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Verificar la estructura
```
ai-studio/
├── public/               # Archivos web
├── electron/            # Código de Electron
├── build/               # Recursos (iconos, etc.)
│   ├── icon.ico        # Para Windows
│   ├── icon.png        # Para Linux
│   └── icon.icns       # Para macOS
├── dist/               # Binarios compilados (generado)
├── flatpak/            # Configuración Flatpak
├── .github/
│   └── workflows/      # Workflows de GitHub Actions
├── package.json        # Configuración de npm/Electron Builder
└── BUILDING.md         # Esta guía
```

---

## Build en Windows

### Opción 1: Crear Instalador + Portable (Recomendado)

```bash
npm run build-win
```

Esto generará en la carpeta `dist/`:
- `AI Studio-Setup-1.2.0.exe` - Instalador
- `AI Studio-Portable-1.2.0.exe` - Ejecutable portátil

### Opción 2: Crear solo el Portable

```bash
npm run build-win-portable
```

Genera: `AI Studio-Portable-1.2.0.exe`

### Opción 3: Crear solo el Instalador

```bash
npm run build-win-nsis
```

Genera: `AI Studio-Setup-1.2.0.exe`

### Requisitos Específicos Windows

1. **Icono**: Debe existir `build/icon.ico` (256x256 o superior)
2. **Variables de entorno** (opcional, para firma de código):
   ```powershell
   $env:WIN_CSC_LINK = "C:\ruta\al\certificado.pfx"
   $env:WIN_CSC_KEY_PASSWORD = "contraseña"
   ```

### Verificación

Los archivos `.exe` deben generarse en `dist/`:
```bash
dir dist\*.exe
```

**Propiedades esperadas**:
- Tamaño: ~150-200 MB (Portable), ~50 MB (Setup)
- Icono visible en el Explorador
- Compatible con Windows 7 y superiores

---

## Build en macOS

### Crear DMG

```bash
npm run build-mac
```

Esto generará en `dist/`:
- `ai-studio-1.2.0.dmg` - Instalador de disco
- `ai-studio-1.2.0.zip` - Archivo comprimido

### Con Notarización (Recomendado para distribución)

Para que macOS no bloquee la app, necesitas notarizar:

```bash
# 1. Configura las variables de entorno
export APPLE_ID="tu-apple-id@example.com"
export APPLE_PASSWORD="tu-contraseña-o-app-password"
export APPLE_SIGNING_IDENTITY="Developer ID Application: Tu Nombre (XXXXXXXXXX)"
export APPLE_TEAM_ID="XXXXXXXXXX"

# 2. Build y notariza
npm run build-mac
```

### Requisitos Específicos macOS

1. **Icono**: Debe existir `build/icon.icns` (1024x1024)
   
   Para convertir PNG a ICNS:
   ```bash
   # Usando ImageMagick
   convert build/icon.png -define icon:auto-resize=256,128,96,64,48,32,16 build/icon.icns
   
   # O usando herramientas online: https://icoconvert.com/
   ```

2. **Certificados**:
   - Abre Keychain Access
   - Importa tu certificado "Developer ID Application"
   - Verifica que esté disponible para Xcode

### Verificación

```bash
# Ver información del DMG
hdiutil info dist/ai-studio-1.2.0.dmg

# Verificar firma
codesign -v dist/AI\ Studio.app
```

---

## Build en Linux

### Crear Deb + AppImage (Recomendado)

```bash
npm run build-linux
```

Esto generará en `dist/`:
- `ai-studio-1.2.0.deb` - Paquete Debian/Ubuntu
- `ai-studio-1.2.0.AppImage` - Ejecutable portátil

### Opción 1: Solo Deb

```bash
npm run build-linux-deb
```

Genera: `ai-studio-1.2.0.deb`

### Opción 2: Solo AppImage

```bash
npm run build-linux-appimage
```

Genera: `ai-studio-1.2.0.AppImage`

### Instalación del Deb

```bash
sudo dpkg -i ai-studio-1.2.0.deb
# Si hay dependencias faltantes:
sudo apt-get install -f
```

### Uso del AppImage

```bash
chmod +x ai-studio-1.2.0.AppImage
./ai-studio-1.2.0.AppImage
```

### Requisitos Específicos Linux

1. **Icono**: Debe existir `build/icon.png` (256x256 o superior)

2. **Dependencias en Deb**:
   El archivo `.deb` declara estas dependencias en `package.json`:
   ```json
   "depends": [
     "gconf2",
     "libappindicator1",
     "libnotify4",
     "libxtst6",
     "libnss3",
     "libxss1"
   ]
   ```

### Verificación

```bash
# Ver contenido del Deb
dpkg -c ai-studio-1.2.0.deb

# Extraer AppImage y verificar
./ai-studio-1.2.0.AppImage --appimage-extract

# Validar firma (si aplica)
file ai-studio-1.2.0.AppImage
```

### Publicar en Repos Linux

#### Ubuntu PPA (Personal Package Archive)

1. Crea una cuenta en Launchpad: https://launchpad.net
2. Genera GPG key:
   ```bash
   gpg --gen-key
   ```
3. Sube tu GPG key a Launchpad
4. Crea un PPA y sube tu paquete:
   ```bash
   dput ppa:tu-usuario/ai-studio ai-studio_1.2.0_amd64.changes
   ```

#### AUR (Arch Linux)

1. Crea cuenta en: https://aur.archlinux.org
2. Crea `PKGBUILD` en el repositorio AUR
3. Usuarios instalan con:
   ```bash
   yay -S ai-studio
   ```

---

## Build Flatpak para Flathub

### Requisitos Previos

```bash
# Linux
sudo apt-get install -y flatpak flatpak-builder

# macOS (usando Homebrew)
brew install flatpak

# Agregar Flathub repo
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

### Build Local

```bash
# Compilar Flatpak
flatpak-builder --force-clean build-dir flatpak/com.aistudio.desktop.yml

# Crear archivo de instalación
flatpak build-export repo build-dir

# Crear paquete
flatpak-builder --repo=repo --create-link-app --force-clean build ai-studio.flatpak com.aistudio.desktop
```

### Verificar

```bash
# Instalar localmente
flatpak install --user ai-studio.flatpak

# Ejecutar
flatpak run com.aistudio.desktop
```

### Publicar en Flathub

1. **Fork** del repositorio de Flathub:
   https://github.com/flathub/flathub

2. **Crea rama** para tu aplicación:
   ```bash
   git checkout -b com.aistudio.desktop
   ```

3. **Copia el manifest**:
   ```bash
   mkdir -p new-manifests/com/aistudio/desktop
   cp flatpak/com.aistudio.desktop.yml new-manifests/com/aistudio/desktop/
   ```

4. **Commit y Push**:
   ```bash
   git add new-manifests/
   git commit -m "Add com.aistudio.desktop"
   git push origin com.aistudio.desktop
   ```

5. **Pull Request** a Flathub
   - Los mantenedores revisarán
   - Después estará disponible en Flathub

6. **Usuarios instalaran con**:
   ```bash
   flatpak install flathub com.aistudio.desktop
   flatpak run com.aistudio.desktop
   ```

---

## Publicación en GitHub Releases

### Opción 1: Automático (GitHub Actions)

1. **Crear un tag**:
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

2. **El workflow `.github/workflows/build-release.yml` se ejecutará automáticamente**:
   - Build en Windows
   - Build en macOS
   - Build en Linux
   - Build Flatpak
   - Crea GitHub Release con todos los artifacts

### Opción 2: Manual

1. **Build en cada plataforma**:
   ```bash
   npm run build-all  # Si quieres todo en una máquina (no recomendado)
   ```

2. **Crear release en GitHub**:
   ```bash
   # Instalar GitHub CLI
   # https://cli.github.com/
   
   gh release create v1.2.0 \
     dist/AI\ Studio-Setup-1.2.0.exe \
     dist/AI\ Studio-Portable-1.2.0.exe \
     dist/ai-studio-1.2.0.dmg \
     dist/ai-studio-1.2.0.deb \
     dist/ai-studio-1.2.0.AppImage \
     --title "AI Studio 1.2.0" \
     --notes "Nueva versión con soporte completo multiplataforma"
   ```

### Verificar Release

En GitHub: https://github.com/antalcides/ai-studio/releases

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Servir web en `http://localhost:8000` |
| `npm run dev` | Servir web con hot reload |
| `npm run electron` | Ejecutar Electron en desarrollo |
| `npm run electron-dev` | Ejecutar Electron con dev tools |
| `npm run build` | Build universal (todas las plataformas) |
| `npm run build-win` | Build Windows (NSIS + Portable) |
| `npm run build-win-portable` | Build Windows Portable |
| `npm run build-win-nsis` | Build Windows Setup |
| `npm run build-mac` | Build macOS (DMG + ZIP) |
| `npm run build-linux` | Build Linux (Deb + AppImage) |
| `npm run build-linux-deb` | Build Linux Deb |
| `npm run build-linux-appimage` | Build Linux AppImage |
| `npm run build-all` | Build todas las plataformas |

---

## Estructura de Archivos Esperados

Después de compilar, en `dist/` encontrarás:

```
dist/
├── Windows/
│   ├── AI Studio-Setup-1.2.0.exe      (50-100 MB)
│   └── AI Studio-Portable-1.2.0.exe   (150-200 MB)
├── macOS/
│   └── ai-studio-1.2.0.dmg            (150-250 MB)
├── Linux/
│   ├── ai-studio-1.2.0.deb            (50-100 MB)
│   ├── ai-studio-1.2.0.AppImage       (150-200 MB)
│   └── builder-effective-config.yaml
└── Flatpak/
    └── ai-studio.flatpak              (200-300 MB)
```

---

## Troubleshooting

### Windows

#### Error: "Visual Studio Build Tools not found"
```bash
# Instala VS Build Tools desde:
# https://visualstudio.microsoft.com/downloads/
# Incluye: C++ desktop development tools
```

#### Error: "NSIS no encontrado"
```bash
# Descarga NSIS: https://nsis.sourceforge.io/
# O instálalo via Chocolatey:
choco install nsis
```

#### El .exe no tiene icono
- Verifica que `build/icon.ico` existe y es válido
- Debe ser 256x256 o mayor
- Intenta regenerar con una herramienta como: https://icoconvert.com/

### macOS

#### Error: "Certificate not found"
```bash
# Abre Keychain Access
# Busca tu certificado "Developer ID Application"
# Verifica que esté en tu login keychain
```

#### DMG no abre correctamente
```bash
# Intenta regenerar el DMG
rm -rf dist/*.dmg
npm run build-mac
```

#### Codesign error
```bash
# Verifica la identidad disponible
security find-identity -v -p codesigning

# Usa la identidad correcta en APPLE_SIGNING_IDENTITY
```

### Linux

#### Error: "fakeroot: not found"
```bash
# Debian/Ubuntu
sudo apt-get install fakeroot

# Fedora
sudo dnf install fakeroot

# Arch
sudo pacman -S fakeroot
```

#### El Deb tiene dependencias incorrectas
- Revisa la sección `deb` en `package.json`
- Ajusta `depends` según lo que necesite tu app
- Regenera con: `npm run build-linux-deb`

#### AppImage no ejecutable
```bash
# Hazlo ejecutable
chmod +x ai-studio-1.2.0.AppImage

# Ejecuta con permisos
./ai-studio-1.2.0.AppImage
```

### Flatpak

#### Error: "Runtime not found"
```bash
# Instala el runtime
flatpak install flathub org.freedesktop.Platform//23.08

# Si necesitas el SDK también
flatpak install flathub org.freedesktop.Sdk//23.08
```

#### Build Flatpak muy lento
- Usa `--verbose` para debug
- Aumenta la caché disponible
- Considera usar compilación en paralelo

---

## Variables de Entorno

### Para Builds Automatizados

```bash
# Windows (Firma de código)
export WIN_CSC_LINK="/path/to/certificate.pfx"
export WIN_CSC_KEY_PASSWORD="password"

# macOS (Notarización)
export APPLE_ID="user@apple.com"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="XXXXXXXXXX"
export APPLE_SIGNING_IDENTITY="Developer ID Application: Name (XXXXXXXXXX)"

# GitHub (Para CI/CD)
export GH_TOKEN="tu-token-github"
```

---

## Seguridad y Firma de Código

### Windows

1. Obtén certificado de Sectigo o DigiCert
2. Descarga y importa en tu máquina
3. Configura las variables de entorno (ver arriba)
4. Los usuarios verán: "Verificado por: Your Company"

### macOS

1. Crea cuenta Developer en Apple (99 USD/año)
2. Genera certificado "Developer ID Application"
3. Descarga e importa en Keychain
4. Configura variables de entorno
5. El build notarizará automáticamente

### Linux

- No hay firma requerida típicamente
- Publica el hash SHA256 para verificación manual
- Algunos repos como Ubuntu PPA requieren GPG

---

## Performance y Optimización

### Reducir tamaño de builds

```bash
# En package.json, asar comprime los archivos
"asar": true

# Excluir archivos innecesarios
"files": [
  "electron/**/*",
  "public/**/*",
  "package.json"
]
```

### Acelerar builds posteriores

```bash
# Los builds usan caché
# Para limpiar caché:
rm -rf dist node_modules/.cache
npm run build
```

---

## Próximos Pasos

1. ✅ Configura los recursos (`build/icon.*`)
2. ✅ Prueba builds locales en cada plataforma
3. ✅ Ajusta `package.json` según necesidades
4. ✅ Configura GitHub Actions secrets (para macOS)
5. ✅ Crea versión tag en Git (`v1.2.0`)
6. ✅ El workflow se ejecutará automáticamente

---

## Recursos Adicionales

- [Electron Builder Docs](https://www.electron.build/)
- [Flatpak Documentation](https://docs.flatpak.org/)
- [GitHub Actions](https://docs.github.com/actions)
- [macOS Code Signing](https://developer.apple.com/support/code-signing/)
- [Windows Signing with Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing-certificate)

---

**¿Preguntas o problemas?**
- Abre un issue en: https://github.com/antalcides/ai-studio/issues
- Consulta los logs del workflow en: https://github.com/antalcides/ai-studio/actions
