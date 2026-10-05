const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    exportConversation: (conversation) => ipcRenderer.invoke('export-conversation', conversation),
    createShortcut: () => ipcRenderer.invoke('create-shortcut'),
    providerRequest: (request) => ipcRenderer.invoke('provider-request', request),

    onNewConversation: (callback) => ipcRenderer.on('new-conversation', callback),
    onExportConversation: (callback) => ipcRenderer.on('export-conversation', callback),
    onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
    onOpenProviders: (callback) => ipcRenderer.on('open-providers', callback),
    onOllamaStatus: (callback) => ipcRenderer.on('ollama-status', callback),

    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

contextBridge.exposeInMainWorld('systemInfo', {
    platform: process.platform,
    version: process.versions.electron,
    isDev: process.env.NODE_ENV === 'development'
});
