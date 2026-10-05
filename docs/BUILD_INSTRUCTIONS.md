# 🖥️ Instrucciones de Construcción - Windows

## ✅ ¡Aplicación Construida Exitosamente!

Tu aplicación de escritorio para Windows ha sido construida y está lista para usar.

---

## 📁 Archivos Generados

### Aplicación Ejecutable:

- **Ubicación**: `tools/dist/win-unpacked/`
- **Archivo principal**: `AI Studio.exe`
- **Script de ejecución**: `run.bat`

### Paquete Distribuible:

- **Archivo ZIP**: `tools/dist/Chat-IA-Local-Windows.zip`
- **Contenido**: Aplicación completa lista para usar

---

## 🚀 Cómo Usar la Aplicación

### Opción 1: Ejecutar desde el directorio

```bash
cd tools/dist/win-unpacked
run.bat
```

### Opción 2: Ejecutar directamente

```bash
cd tools/dist/win-unpacked
node_modules\.bin\electron .
```

### Opción 3: Doble clic

- Navega a `tools/dist/win-unpacked/`
- Haz doble clic en `AI Studio.exe`

---

## 📦 Distribución

### Para compartir la aplicación:

1. **Archivo ZIP**: `tools/dist/Chat-IA-Local-Windows.zip`
2. **Extraer** en cualquier carpeta
3. **Ejecutar** `run.bat` o `AI Studio.exe`

### Requisitos para el usuario final:

- **Ollama** debe estar instalado y ejecutándose
- **Modelo de IA** debe estar descargado

---

## 🛠️ Scripts Disponibles

### Construir aplicación:

```bash
npm run build-win-simple
```

### Crear paquete ZIP:

```bash
npm run package-win
```

### Construir y empaquetar todo:

```bash
npm run build-win-simple && npm run package-win
```

---

## 🏆 Características de la Aplicación

- Interfaz oscura y moderna
- Conexión directa a Ollama (sin CORS)
- Múltiples modelos
- Markdown en respuestas
- Configuración persistente
- Exportación de conversaciones
- Menú nativo

---

## 🆘 Solución de Problemas

### La aplicación no se ejecuta:

1. Verifica que tengas permisos de administrador
2. Ejecuta `run.bat` desde la línea de comandos
3. Verifica que no haya antivirus bloqueando

### No se conecta a Ollama:

1. Asegúrate de que Ollama esté ejecutándose: `ollama serve`
2. Verifica que tengas un modelo: `ollama list`
3. Descarga un modelo: `ollama pull llama3:8b`

### Error de dependencias:

1. Ejecuta: `npm install --production` en el directorio de la aplicación
2. Verifica que Node.js esté instalado

---

## 📋 Checklist de Distribución

- [x] Aplicación construida
- [x] Archivo ZIP creado
- [x] Scripts de ejecución incluidos
- [x] Documentación incluida
- [x] Dependencias incluidas
- [x] Iconos incluidos

---

## 🎉 ¡Listo para Distribuir!

Tu aplicación está completamente lista para ser compartida. Los usuarios solo necesitan:

1. **Descargar** el archivo ZIP
2. **Extraer** en cualquier carpeta
3. **Ejecutar** la aplicación
4. **Configurar** Ollama si es necesario

¡Disfruta de tu app de escritorio para chatear con IA local! 🤖✨
