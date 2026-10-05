# Gestión inteligente de chats

## Funcionalidades añadidas

### Guardado automático
- Cada conversación se guarda automáticamente en `localStorage` al enviar mensajes.
- El título se genera a partir del primer mensaje del usuario (editable).

### Lista de chats (sidebar)
- Filtros: **Activos** · **Favoritos** · **Archivados** · **Papelera**
- Búsqueda por título, etiquetas y contenido de mensajes
- Selección múltiple con checkboxes

### Acciones por chat (menú ⋮)
- Renombrar y asignar etiquetas
- Marcar / quitar favorito
- Archivar / desarchivar
- Exportar a PDF, Markdown o JSON
- Mover a papelera
- En papelera: **Recuperar** o **Eliminar permanentemente**

### Acciones en bloque
- Exportar PDF de varios chats
- Archivar seleccionados
- Mover a papelera (o borrar definitivo si estás en Papelera)

### Exportación PDF
- Individual (botón lateral o menú contextual)
- En bloque (selección + botón PDF)
- Usa jsPDF (CDN)

### Acceso directo (Windows / Electron)
- Al instalar con el empaquetado **NSIS**, se crean accesos en el escritorio y el menú Inicio.
- Desde **Configuración** → «Crear acceso directo en el menú Inicio» (solo app de escritorio).

## Uso rápido
1. Escribe y envía mensajes → el chat aparece en la lista.
2. Clic en un chat de la lista para abrirlo.
3. «Nuevo Chat» guarda el actual y abre uno vacío.
4. Ctrl/Cmd+N → nuevo chat; Ctrl/Cmd+F → foco en búsqueda de chats.

## Almacenamiento
- Clave: `ollamaChatsV1` en `localStorage`
- Los chats en papelera no se borran hasta eliminación permanente
