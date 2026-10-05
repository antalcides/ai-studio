# 🖥️ Guía Completa: Generar Paquetes desde Windows 11

## 📋 Requisitos Previos

### 1. **Node.js y npm**
- Descargar e instalar desde: https://nodejs.org/
- Versión recomendada: **18.x o superior**
- Verificar instalación:
```bash
node --version
npm --version
```

### 2. **Git** (para control de versiones)
- Descargar desde: https://git-scm.com/
- Verificar: `git --version`

### 3. **Wine** (para compilar paquetes Linux en Windows)
- Descargar desde: https://www.winehq.org/
- O instalar con Chocolatey:
```powershell
choco install wine
```

### 4. **Docker Desktop** (alternativa para Linux packages)
- Descarga: https://www.docker.com/products/docker-desktop
- Útil para compilar `.deb` y Flatpak sin Wine

### 5. **Herramientas de compilación (opcional)**
```powershell
# Instalación con Chocolatey (si no la tienes)
choco install python build-tools
```

---

## 🚀 Paso 1: Clonar y Preparar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/antalcides/ai-studio.git
cd ai-studio

# Cambiar a rama de build
git checkout build/release-1.2.0

# Instalar dependencias
npm install
```

---

## 🔨 Paso 2: Generar Paquetes Windows

### Opción A: Generar TODOS los paquetes Windows
```bash
npm run build-win
```

Esto genera:
- ✅ **AI Studio-Setup-1.2.0.exe** (instalador NSIS)
- ✅ **AI Studio-Portable-1.2.0.exe** (ejecutable portátil)
- ✅ **win-unpacked/** (directorio desempaquetado)

**Ubicación:** `dist/`

### Opción B: Generar solo Portable
```bash
npm run build-win-portable
```

### Opción C: Generar solo Setup (Instalador)
```bash
npx electron-builder --win --x64
```

---

## 🐧 Paso 3: Generar Paquetes Linux desde Windows

### Opción 1: Usar Wine (más directo)

```bash
# Instalar dependencias globales (una sola vez)
npm install -g electron-builder

# Generar .deb
npx electron-builder --linux deb --x64 --win.signingCertificateFile= --publish=never

# Generar AppImage
npx electron-builder --linux AppImage --x64 --publish=never

# Generar ambos
npx electron-builder --linux deb AppImage --x64 --publish=never
```

**Ubicación:** `dist/`
- ✅ `ai-studio_1.2.0_amd64.deb`
- ✅ `ai-studio-1.2.0.AppImage`

### Opción 2: Usar Docker (más limpio, sin Wine)

```bash
# Instalación (primera vez)
docker pull electronuserland/builder:latest
docker pull electronuserland/builder:wine

# Generar .deb
docker run --rm -v %cd%:/project electronuserland/builder:latest /bin/bash -c "cd /project && npm install && npm run build-linux-deb"

# Generar AppImage
docker run --rm -v %cd%:/project electronuserland/builder:latest /bin/bash -c "cd /project && npm run build-linux-appimage"
```

---

## 🍎 Paso 4: Generar Paquetes macOS

**Nota:** Idealmente esto se hace en una Mac real o mediante CI/CD en GitHub Actions.

### Desde Windows con GitHub Actions (Recomendado)
Crear archivo `.github/workflows/build.yml` (ver abajo)

### O generar en Mac directamente:
```bash
npm run build-mac
```

---

## 📦 Paso 5: Generar Paquete Flatpak

### Opción 1: Compilar localmente con Flatpak (en Windows con WSL2)

```bash
# Instalar Flatpak en WSL2 Ubuntu
wsl --install -d Ubuntu
wsl
sudo apt install flatpak flatpak-builder

# Compilar
cd /path/to/ai-studio
flatpak-builder --repo=repo builddir flatpak/com.aistudio.desktop.yml
flatpak build-export repo builddir
flatpak build-bundle repo ai-studio-1.2.0.flatpak com.aistudio.desktop
```

### Opción 2: Usar Docker (más simple)

```bash
docker run --rm -v %cd%:/workspace -w /workspace \
  flathub/flathub-build-tools flatpak-builder \
  --repo=repo builddir flatpak/com.aistudio.desktop.yml
```

**Resultado:** `ai-studio-1.2.0.flatpak`

---

## 📤 Paso 6: Subir los Paquetes a GitHub

### Opción A: Crear Release Manualmente

1. **Ir a:** https://github.com/antalcides/ai-studio/releases
2. **Clic en:** "Draft a new release"
3. **Llenar:**
   - Tag: `v1.2.0`
   - Title: `AI Studio 1.2.0`
   - Description: (ver plantilla abajo)
4. **Adjuntar archivos:**
   - `AI Studio-Setup-1.2.0.exe`
   - `AI Studio-Portable-1.2.0.exe`
   - `ai-studio_1.2.0_amd64.deb`
   - `ai-studio-1.2.0.AppImage`
   - `ai-studio-1.2.0.flatpak`
   - `AI Studio-1.2.0-arm64.dmg` (si lo tienes de Mac)

5. **Publicar**

### Opción B: Subir vía CLI (Git)

```bash
# Crear tag local
git tag -a v1.2.0 -m "Release AI Studio 1.2.0"

# Empujar tag a GitHub
git push origin v1.2.0

# Luego crear release manualmente o con GitHub CLI
gh release create v1.2.0 --title "AI Studio 1.2.0" --notes-file RELEASE_NOTES.md \
  dist/AI\ Studio-Setup-1.2.0.exe \
  dist/AI\ Studio-Portable-1.2.0.exe \
  dist/ai-studio_1.2.0_amd64.deb \
  dist/ai-studio-1.2.0.AppImage \
  dist/ai-studio-1.2.0.flatpak
```

**Requiere GitHub CLI:**
```bash
# Instalar
choco install gh

# Autenticar
gh auth login
```

### Opción C: Automatizar con GitHub Actions

Crear archivo `.github/workflows/build.yml`:

```yaml
name: Build Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build-win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-artifacts
          path: dist/*.exe

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build-linux-all
      - uses: actions/upload-artifact@v3
        with:
          name: linux-artifacts
          path: dist/ai-studio*

  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build-mac
      - uses: actions/upload-artifact@v3
        with:
          name: mac-artifacts
          path: dist/*.dmg

  create-release:
    needs: [build-windows, build-linux, build-mac]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            windows-artifacts/**/*.exe
            linux-artifacts/**/*
            mac-artifacts/**/*.dmg
```

---

## 📝 Plantilla de Notas de Release

Crear archivo `RELEASE_NOTES.md`:

```markdown
# 🚀 AI Studio 1.2.0

## ✨ Nuevas Características
- [Describe las nuevas features]
- Soporte mejorado para múltiples modelos
- Interfaz optimizada

## 🐛 Correcciones
- Corregido error de conexión con Ollama
- Mejora en manejo de errores

## 📦 Descargas Disponibles

### Windows
- **Instalador:** `AI Studio-Setup-1.2.0.exe` - Recomendado para la mayoría
- **Portátil:** `AI Studio-Portable-1.2.0.exe` - Sin instalación requerida

### Linux
- **Debian/Ubuntu:** `ai-studio_1.2.0_amd64.deb`
  ```bash
  sudo dpkg -i ai-studio_1.2.0_amd64.deb
  ```
- **AppImage:** `ai-studio-1.2.0.AppImage` - Ejecutable directo
  ```bash
  chmod +x ai-studio-1.2.0.AppImage
  ./ai-studio-1.2.0.AppImage
  ```
- **Flatpak:** `ai-studio-1.2.0.flatpak` - Para Flathub
  ```bash
  flatpak install ai-studio-1.2.0.flatpak
  ```

### macOS
- **DMG:** `AI Studio-1.2.0-arm64.dmg` - Apple Silicon
- **DMG (Intel):** `AI Studio-1.2.0-x64.dmg` - Intel Macs

## 🔧 Requisitos
- Ollama 0.1+ (para modelos locales)
- Node.js 18+ (si lo compilas)

## 📖 Documentación
- [Setup Desktop App](https://github.com/antalcides/ai-studio/blob/main/docs/DESKTOP_APP.md)
- [Build Instructions](https://github.com/antalcides/ai-studio/blob/main/docs/BUILD_FROM_WINDOWS.md)
```

---

## 🔍 Verificar Paquetes Generados

```bash
# Ver todos los paquetes
dir dist\

# Verificar .deb
dpkg -c ai-studio_1.2.0_amd64.deb

# Verificar .exe (Windows)
wix examine AI Studio-Setup-1.2.0.exe  # requiere Wix Toolset
```

---

## 🚨 Solución de Problemas

### Error: "node-gyp" no encontrado
```bash
npm install -g node-gyp
npm install --production
```

### Error: No se puede generar .deb en Windows
Usar Docker o WSL2 con Ubuntu:
```bash
wsl --install -d Ubuntu
wsl
cd /mnt/c/ruta/del/proyecto
npm run build-linux-deb
```

### Error: Electron no se encuentra
```bash
npm install electron --save-dev
```

### Paquetes muy grandes
Actualizar `.gitignore` para excluir `node_modules/`:
```bash
git rm -r --cached node_modules
npm install --production
```

---

## ✅ Checklist Final

- [ ] Todos los paquetes generados exitosamente
- [ ] Nombres de archivos correctos
- [ ] Pruebas en Windows, Linux y Mac
- [ ] Release creada en GitHub
- [ ] Descripción y notas actualizadas
- [ ] Etiqueta (tag) creada: `v1.2.0`
- [ ] Documentación actualizada

---

## 📞 Soporte

Para problemas: https://github.com/antalcides/ai-studio/issues
