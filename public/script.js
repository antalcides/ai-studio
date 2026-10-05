/**
 * AI Studio
 * Gestión de chats: guardado, búsqueda, favoritos, etiquetas, archivados, papelera, PDF
 * Proveedores/agentes: OpenAI, Anthropic, Gemini, Ollama, LM Studio, OpenRouter,
 * 9Router, FreeLLMAPI, OmniRoute, Groq, DeepSeek, Mistral, xAI y personalizados.
 */

const PROVIDERS = [
    {
        id: 'ollama',
        name: 'Ollama',
        icon: 'fas fa-horse-head',
        kind: 'ollama',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:11434',
        models: ['llama3:8b', 'llama3.1:8b', 'qwen2.5:7b', 'mistral:7b', 'gemma2:9b'],
        hint: 'Modelos locales ejecutados en tu equipo. Arranca Ollama con "ollama serve".'
    },
    {
        id: 'lmstudio',
        name: 'LM Studio',
        icon: 'fas fa-laptop-code',
        kind: 'openai',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:1234/v1',
        models: ['qwen2.5-7b-instruct', 'llama-3.2-3b-instruct'],
        hint: 'Servidor local de LM Studio (puerto 1234), compatible con la API de OpenAI.'
    },
    {
        id: 'openai',
        name: 'OpenAI',
        icon: 'fas fa-bolt',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://api.openai.com/v1',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'o4-mini'],
        hint: 'API oficial de OpenAI. Crea la clave en platform.openai.com/api-keys.'
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        icon: 'fas fa-feather',
        kind: 'anthropic',
        needsKey: true,
        baseUrl: 'https://api.anthropic.com',
        models: ['claude-sonnet-4-5', 'claude-opus-4-1', 'claude-3-5-haiku-latest'],
        hint: 'Modelos Claude. Crea la clave en console.anthropic.com.'
    },
    {
        id: 'gemini',
        name: 'Gemini',
        icon: 'fab fa-google',
        kind: 'gemini',
        needsKey: true,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
        hint: 'Modelos de Google. Crea la clave en aistudio.google.com/apikey.'
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        icon: 'fas fa-route',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://openrouter.ai/api/v1',
        models: [
            'openai/gpt-4o-mini',
            'anthropic/claude-3.5-sonnet',
            'meta-llama/llama-3.3-70b-instruct'
        ],
        hint: 'Un solo acceso a cientos de modelos. Crea la clave en openrouter.ai/keys.'
    },
    {
        id: '9router',
        name: '9Router',
        icon: 'fas fa-network-wired',
        kind: 'openai',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:20128/v1',
        models: ['auto', 'kr/claude-sonnet-4.5'],
        hint: 'Router local con acceso a modelos gratis (puerto 20128): npm install -g 9router'
    },
    {
        id: 'freellmapi',
        name: 'FreeLLMAPI',
        icon: 'fas fa-gift',
        kind: 'openai',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:3001/v1',
        models: ['auto'],
        hint: 'Gateway local que agrega los niveles gratis de decenas de proveedores (puerto 3001).'
    },
    {
        id: 'omniroute',
        name: 'OmniRoute',
        icon: 'fas fa-shuffle',
        kind: 'openai',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:20128/v1',
        models: ['auto'],
        hint: 'Gateway local con failover entre proveedores (puerto 20128 por defecto).'
    },
    {
        id: 'groq',
        name: 'Groq',
        icon: 'fas fa-bolt-lightning',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://api.groq.com/openai/v1',
        models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
        hint: 'Inferencia ultrarrápida. Crea la clave en console.groq.com/keys.'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        icon: 'fas fa-whale',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        hint: 'Modelos DeepSeek Chat y Reasoner. Crea la clave en platform.deepseek.com.'
    },
    {
        id: 'mistral',
        name: 'Mistral',
        icon: 'fas fa-wind',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://api.mistral.ai/v1',
        models: ['mistral-large-latest', 'mistral-small-latest'],
        hint: 'Modelos Mistral. Crea la clave en console.mistral.ai/api-keys.'
    },
    {
        id: 'xai',
        name: 'xAI',
        icon: 'fab fa-x-twitter',
        kind: 'openai',
        needsKey: true,
        baseUrl: 'https://api.x.ai/v1',
        models: ['grok-3', 'grok-3-mini'],
        hint: 'Modelos Grok. Crea la clave en console.x.ai.'
    },
    {
        id: 'custom',
        name: 'Personalizado',
        icon: 'fas fa-sliders',
        kind: 'openai',
        local: true,
        needsKey: false,
        baseUrl: 'http://localhost:11434/v1',
        models: [],
        custom: true,
        hint: 'Cualquier endpoint compatible con OpenAI (llama.cpp, vLLM, gateways propios...).'
    }
];

class ChatStore {
    constructor(storageKey = 'ollamaChatsV1') {
        this.storageKey = storageKey;
        this.chats = this._load();
    }

    _load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return [];
            const data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    _save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.chats));
    }

    generateId() {
        return 'chat_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    }

    create(partial = {}) {
        const now = new Date().toISOString();
        const chat = {
            id: this.generateId(),
            title: partial.title || 'Nuevo chat',
            createdAt: now,
            updatedAt: now,
            model: partial.model || '',
            messages: partial.messages || [],
            isFavorite: false,
            tags: partial.tags || [],
            isArchived: false,
            deletedAt: null
        };
        this.chats.unshift(chat);
        this._save();
        return chat;
    }

    get(id) {
        return this.chats.find(c => c.id === id) || null;
    }

    update(id, patch) {
        const idx = this.chats.findIndex(c => c.id === id);
        if (idx === -1) return null;
        this.chats[idx] = {
            ...this.chats[idx],
            ...patch,
            updatedAt: new Date().toISOString()
        };
        this._save();
        return this.chats[idx];
    }

    softDelete(id) {
        return this.update(id, { deletedAt: new Date().toISOString(), isArchived: false });
    }

    restore(id) {
        return this.update(id, { deletedAt: null });
    }

    permanentDelete(id) {
        this.chats = this.chats.filter(c => c.id !== id);
        this._save();
    }

    list({ filter = 'active', query = '' } = {}) {
        const q = (query || '').trim().toLowerCase();
        let items = this.chats.slice();

        if (filter === 'active') {
            items = items.filter(c => !c.deletedAt && !c.isArchived);
        } else if (filter === 'favorites') {
            items = items.filter(c => !c.deletedAt && c.isFavorite);
        } else if (filter === 'archived') {
            items = items.filter(c => !c.deletedAt && c.isArchived);
        } else if (filter === 'trash') {
            items = items.filter(c => !!c.deletedAt);
        }

        if (q) {
            items = items.filter(c => {
                const inTitle = (c.title || '').toLowerCase().includes(q);
                const inTags = (c.tags || []).some(t => t.toLowerCase().includes(q));
                const inMsgs = (c.messages || []).some(m =>
                    (m.content || '').toLowerCase().includes(q)
                );
                return inTitle || inTags || inMsgs;
            });
        }

        items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return items;
    }
}

class ChatApp {
    constructor() {
        this.store = new ChatStore();
        this.currentChatId = null;
        this.chatFilter = 'active';
        this.selectedChatIds = new Set();
        this.contextChatId = null;
        this.editingChatId = null;
        this.pendingAttachments = [];

        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.loadSettings();
        this.initializeElectron();
        this.setupAutoResize();
        this.setupTheme();
        this.renderChatList();

        setTimeout(() => {
            this.checkModelStatus(this.settings.model);
        }, 1000);
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.status = document.getElementById('status');
        this.modelSelect = document.getElementById('modelSelect');
        this.apiUrl = document.getElementById('apiUrl');
        this.currentModel = document.getElementById('currentModel');
        this.chatTitleDisplay = document.getElementById('chatTitleDisplay');

        this.sidebar = document.querySelector('.sidebar');
        this.toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.exportMdBtn = document.getElementById('exportMdBtn');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');
        this.clearBtn = document.getElementById('clearBtn');

        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
        this.themeSelect = document.getElementById('themeSelect');
        this.autoScroll = document.getElementById('autoScroll');
        this.markdownEnabled = document.getElementById('markdownEnabled');
        this.modalModelSelect = document.getElementById('modalModelSelect');
        this.createShortcutBtn = document.getElementById('createShortcutBtn');
        this.shortcutSettingGroup = document.getElementById('shortcutSettingGroup');

        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.modelSearch = document.getElementById('modelSearch');
        this.modalModelSearch = document.getElementById('modalModelSearch');
        this.refreshModelsBtn = document.getElementById('refreshModelsBtn');
        this.refreshModalModelsBtn = document.getElementById('refreshModalModelsBtn');
        this.checkModelBtn = document.getElementById('checkModelBtn');

        this.chatSearch = document.getElementById('chatSearch');
        this.chatsList = document.getElementById('chatsList');
        this.chatFilters = document.querySelectorAll('.chat-filter');
        this.chatsBulkActions = document.getElementById('chatsBulkActions');
        this.bulkExportPdfBtn = document.getElementById('bulkExportPdfBtn');
        this.bulkArchiveBtn = document.getElementById('bulkArchiveBtn');
        this.bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        this.bulkClearSelectionBtn = document.getElementById('bulkClearSelectionBtn');

        this.chatEditModal = document.getElementById('chatEditModal');
        this.chatTitleInput = document.getElementById('chatTitleInput');
        this.chatTagsInput = document.getElementById('chatTagsInput');
        this.saveChatEditBtn = document.getElementById('saveChatEditBtn');
        this.cancelChatEditBtn = document.getElementById('cancelChatEditBtn');
        this.closeChatEditBtn = document.getElementById('closeChatEditBtn');

        this.chatContextMenu = document.getElementById('chatContextMenu');
        this.suggestionBtns = document.querySelectorAll('.suggestion-btn');

        this.attachFileBtn = document.getElementById('attachFileBtn');
        this.fileInput = document.getElementById('fileInput');
        this.attachmentsPreview = document.getElementById('attachmentsPreview');

        // Proveedores / agentes
        this.providersBtn = document.getElementById('providersBtn');
        this.providerBtn = document.getElementById('providerBtn');
        this.providerBtnIcon = document.getElementById('providerBtnIcon');
        this.providerBtnLabel = document.getElementById('providerBtnLabel');
        this.providerChip = document.getElementById('providerChip');
        this.providerChipIcon = document.getElementById('providerChipIcon');
        this.currentProvider = document.getElementById('currentProvider');
        this.inputHint = document.getElementById('inputHint');

        this.providersModal = document.getElementById('providersModal');
        this.closeProvidersBtn = document.getElementById('closeProvidersBtn');
        this.closeProvidersFooterBtn = document.getElementById('closeProvidersFooterBtn');
        this.providersGrid = document.getElementById('providersGrid');
        this.providerConfigTitle = document.getElementById('providerConfigTitle');
        this.providerActiveBadge = document.getElementById('providerActiveBadge');
        this.providerApiKey = document.getElementById('providerApiKey');
        this.providerBaseUrl = document.getElementById('providerBaseUrl');
        this.providerModels = document.getElementById('providerModels');
        this.providerApiKeyHint = document.getElementById('providerApiKeyHint');
        this.providerBaseUrlHint = document.getElementById('providerBaseUrlHint');
        this.providerTestResult = document.getElementById('providerTestResult');
        this.toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');
        this.fetchModelsBtn = document.getElementById('fetchModelsBtn');
        this.testProviderBtn = document.getElementById('testProviderBtn');
        this.saveProviderBtn = document.getElementById('saveProviderBtn');
        this.resetProviderBtn = document.getElementById('resetProviderBtn');
    }

    initializeState() {
        this.isLoading = false;
        this.conversationHistory = [];
        this.isElectron = typeof window.electronAPI !== 'undefined';
        this.configuringProviderId = 'ollama';
        this._providerBaseline = null;
        this._providerDirty = false;
        this.settings = {
            theme: 'dark',
            autoScroll: true,
            markdownEnabled: true,
            apiUrl: 'http://localhost:11434',
            model: 'llama3:8b',
            activeProvider: 'ollama',
            providers: {}
        };
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        this.newChatBtn.addEventListener('click', () => this.newChat());
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.exportBtn.addEventListener('click', () => this.exportChat());
        if (this.exportMdBtn) this.exportMdBtn.addEventListener('click', () => this.exportChatMarkdown());
        if (this.exportPdfBtn) this.exportPdfBtn.addEventListener('click', () => this.exportChatPdf());
        this.clearBtn.addEventListener('click', () => this.clearChatView());

        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.cancelSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });

        // Proveedores / agentes
        [this.providersBtn, this.providerBtn, this.providerChip].forEach(btn => {
            if (btn) btn.addEventListener('click', () => this.openProvidersModal());
        });
        if (this.closeProvidersBtn) {
            this.closeProvidersBtn.addEventListener('click', () => this.closeProvidersModal());
        }
        if (this.closeProvidersFooterBtn) {
            this.closeProvidersFooterBtn.addEventListener('click', () => this.closeProvidersModal());
        }
        if (this.providersModal) {
            this.providersModal.addEventListener('click', (e) => {
                if (e.target === this.providersModal) this.closeProvidersModal();
            });
        }
        if (this.saveProviderBtn) {
            this.saveProviderBtn.addEventListener('click', () => this.saveProviderAndUse());
        }
        if (this.resetProviderBtn) {
            this.resetProviderBtn.addEventListener('click', () => this.resetProviderForm());
        }
        if (this.fetchModelsBtn) {
            this.fetchModelsBtn.addEventListener('click', () => this.fetchProviderModels());
        }
        if (this.testProviderBtn) {
            this.testProviderBtn.addEventListener('click', () => this.testProviderConnection());
        }
        if (this.toggleApiKeyBtn) {
            this.toggleApiKeyBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        }
        if (this.providerModels) {
            this.providerModels.addEventListener('input', () => this.updateProviderFormDirtyState());
        }
        if (this.providerBaseUrl) {
            this.providerBaseUrl.addEventListener('input', () => this.updateProviderFormDirtyState());
        }
        if (this.providerApiKey) {
            this.providerApiKey.addEventListener('input', () => this.updateProviderFormDirtyState());
        }

        this.modelSelect.addEventListener('change', () => this.updateModel());
        if (this.modalModelSelect) {
            this.modalModelSelect.addEventListener('change', () => this.updateModelFromModal());
        }
        this.themeSelect.addEventListener('change', () => this.changeTheme());

        if (this.modelSearch) {
            this.modelSearch.addEventListener('input', () =>
                this.filterModels(this.modelSearch, this.modelSelect)
            );
        }
        if (this.modalModelSearch) {
            this.modalModelSearch.addEventListener('input', () =>
                this.filterModels(this.modalModelSearch, this.modalModelSelect)
            );
        }
        if (this.refreshModelsBtn) {
            this.refreshModelsBtn.addEventListener('click', () =>
                this.populateModelSelects(this.settings.model)
            );
        }
        if (this.refreshModalModelsBtn) {
            this.refreshModalModelsBtn.addEventListener('click', () =>
                this.populateModelSelects(this.modalModelSelect?.value || this.settings.model)
            );
        }
        if (this.checkModelBtn) {
            this.checkModelBtn.addEventListener('click', () =>
                this.checkModelStatus(this.modelSelect.value)
            );
        }

        if (this.chatSearch) {
            this.chatSearch.addEventListener('input', () => this.renderChatList());
        }
        this.chatFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.chatFilters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.chatFilter = btn.dataset.filter;
                this.selectedChatIds.clear();
                this.renderChatList();
            });
        });

        if (this.bulkExportPdfBtn) this.bulkExportPdfBtn.addEventListener('click', () => this.bulkExportPdf());
        if (this.bulkArchiveBtn) this.bulkArchiveBtn.addEventListener('click', () => this.bulkArchive());
        if (this.bulkDeleteBtn) this.bulkDeleteBtn.addEventListener('click', () => this.bulkDelete());
        if (this.bulkClearSelectionBtn) {
            this.bulkClearSelectionBtn.addEventListener('click', () => {
                this.selectedChatIds.clear();
                this.renderChatList();
            });
        }

        if (this.saveChatEditBtn) this.saveChatEditBtn.addEventListener('click', () => this.saveChatEdit());
        if (this.cancelChatEditBtn) this.cancelChatEditBtn.addEventListener('click', () => this.closeChatEdit());
        if (this.closeChatEditBtn) this.closeChatEditBtn.addEventListener('click', () => this.closeChatEdit());
        if (this.chatEditModal) {
            this.chatEditModal.addEventListener('click', (e) => {
                if (e.target === this.chatEditModal) this.closeChatEdit();
            });
        }

        if (this.chatContextMenu) {
            this.chatContextMenu.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn || !this.contextChatId) return;
                this.handleContextAction(btn.dataset.action, this.contextChatId);
                this.hideContextMenu();
            });
        }
        document.addEventListener('click', (e) => {
            if (this.chatContextMenu && !this.chatContextMenu.contains(e.target)) {
                this.hideContextMenu();
            }
        });
        document.addEventListener('scroll', () => this.hideContextMenu(), true);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.model-selector') && !e.target.closest('.setting-group')) {
                this.closeDropdowns();
            }
        });

        [this.modelSearch, this.modalModelSearch].forEach(searchInput => {
            if (!searchInput) return;
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim()) {
                    const selectElement =
                        searchInput === this.modelSearch ? this.modelSelect : this.modalModelSelect;
                    selectElement.size = Math.min(8, this.countVisibleOptions(selectElement, searchInput.value));
                }
            });
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!document.activeElement || !document.activeElement.closest('select')) {
                        this.closeDropdowns();
                    }
                }, 150);
            });
        });

        this.suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleSuggestion(btn.textContent));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.settingsModal.classList.contains('show')) this.closeSettings();
                if (this.providersModal?.classList.contains('show')) this.closeProvidersModal();
                if (this.chatEditModal?.classList.contains('show')) this.closeChatEdit();
                this.hideContextMenu();
                if (this.modelSearch?.value || this.modalModelSearch?.value) this.clearSearch();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                if (this.settingsModal.classList.contains('show')) this.modalModelSearch?.focus();
                else this.chatSearch?.focus() || this.modelSearch?.focus();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.newChat();
            }
        });

        if (this.createShortcutBtn) {
            this.createShortcutBtn.addEventListener('click', () => this.createStartMenuShortcut());
        }

        if (this.attachFileBtn && this.fileInput) {
            this.attachFileBtn.addEventListener('click', () => this.fileInput.click());
            this.fileInput.addEventListener('change', (e) => this.handleFilesSelected(e));
        }

        // Drag & drop de archivos sobre el área de chat
        const dropZone = document.querySelector('.chat-container') || document.body;
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer?.files?.length) {
                this.addFiles(Array.from(e.dataTransfer.files));
            }
        });
    }

    // ---------- Proveedores / agentes ----------

    getProviderDef(id) {
        return PROVIDERS.find(p => p.id === id) || PROVIDERS[0];
    }

    getProviderConfig(id) {
        const def = this.getProviderDef(id);
        const saved = (this.settings.providers || {})[id];
        return {
            baseUrl: (saved && saved.baseUrl) || def.baseUrl || '',
            apiKey: (saved && saved.apiKey) || '',
            models: saved && Array.isArray(saved.models) && saved.models.length
                ? saved.models.slice()
                : (def.models || []).slice()
        };
    }

    isProviderConfigured(id) {
        const def = this.getProviderDef(id);
        const saved = (this.settings.providers || {})[id];
        if (!saved) return false;
        if (def.needsKey && !saved.apiKey) return false;
        return true;
    }

    endpoint(baseUrl, path) {
        const base = String(baseUrl || '').replace(/\/+$/, '');
        if (path.startsWith('/v1/') && base.endsWith('/v1')) return base + path.slice(3);
        return base + path;
    }

    openProvidersModal() {
        if (!this.providersModal) return;
        this.renderProvidersGrid();
        this.selectProviderForConfig(this.settings.activeProvider || 'ollama');
        this.providersModal.classList.add('show');
    }

    closeProvidersModal() {
        if (!this.providersModal) return;
        this.providersModal.classList.remove('show');
        this.setProviderTestResult('');
        this._providerBaseline = null;
        this._providerDirty = false;
    }

    renderProvidersGrid() {
        if (!this.providersGrid) return;
        this.providersGrid.innerHTML = PROVIDERS.map(def => {
            const active = def.id === this.settings.activeProvider ? 'active' : '';
            const configured = this.isProviderConfigured(def.id) ? 'configured' : '';
            const kind = def.custom ? 'Libre' : def.local ? 'Local' : 'Nube';
            return `
          <button type="button" class="provider-card ${active} ${configured}" data-provider="${def.id}" title="Configurar ${this.escapeHtml(def.name)}">
            <i class="${def.icon} provider-card-icon"></i>
            <span class="provider-card-name">${this.escapeHtml(def.name)}</span>
            <span class="provider-card-kind">${kind}</span>
          </button>`;
        }).join('');

        this.providersGrid.querySelectorAll('.provider-card').forEach(card => {
            card.addEventListener('click', () => this.selectProviderForConfig(card.dataset.provider));
        });
    }

    readProviderForm() {
        return {
            baseUrl: (this.providerBaseUrl?.value || '').trim().replace(/\/+$/, ''),
            apiKey: (this.providerApiKey?.value || '').trim(),
            models: (this.providerModels?.value || '')
                .split(/[,\n]/)
                .map(s => s.trim())
                .filter(Boolean)
        };
    }

    updateProviderFormDirtyState() {
        if (!this.providersModal || !this.providersModal.classList.contains('show')) return;
        if (!this._providerBaseline) return;
        this._providerDirty = JSON.stringify(this.readProviderForm()) !== this._providerBaseline;
    }

    hasUnsavedProviderChanges() {
        if (!this._providerBaseline || !this._providerDirty) return false;
        return JSON.stringify(this.readProviderForm()) !== this._providerBaseline;
    }

    selectProviderForConfig(id) {
        if (this.hasUnsavedProviderChanges()) {
            if (!confirm('Tienes cambios sin guardar en la configuración del proveedor. ¿Descartarlos?')) {
                return;
            }
        }
        const def = this.getProviderDef(id);
        const cfg = this.getProviderConfig(id);
        this.configuringProviderId = def.id;
        if (this.providerConfigTitle) this.providerConfigTitle.textContent = `Configuración · ${def.name}`;
        if (this.providerActiveBadge) {
            this.providerActiveBadge.hidden = def.id !== this.settings.activeProvider;
        }
        if (this.providerApiKey) {
            this.providerApiKey.value = cfg.apiKey;
            this.providerApiKey.type = 'password';
        }
        if (this.toggleApiKeyBtn) {
            this.toggleApiKeyBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
        if (this.providerBaseUrl) this.providerBaseUrl.value = cfg.baseUrl;
        if (this.providerModels) this.providerModels.value = cfg.models.join(', ');
        if (this.providerApiKeyHint) {
            this.providerApiKeyHint.textContent = def.needsKey
                ? `Clave API de ${def.name}. Se guarda solo en la configuración local de este equipo.`
                : `Este proveedor no exige clave API. Puedes dejarla vacía${def.local ? ' si el servicio corre en local.' : '.'}`;
        }
        if (this.providerBaseUrlHint) {
            this.providerBaseUrlHint.textContent = def.hint || 'Dirección del endpoint de la API.';
        }
        this.setProviderTestResult('');
        this._providerBaseline = JSON.stringify(this.readProviderForm());
        this._providerDirty = false;
    }

    toggleApiKeyVisibility() {
        if (!this.providerApiKey || !this.toggleApiKeyBtn) return;
        const showing = this.providerApiKey.type === 'text';
        this.providerApiKey.type = showing ? 'password' : 'text';
        this.toggleApiKeyBtn.innerHTML = showing
            ? '<i class="fas fa-eye"></i>'
            : '<i class="fas fa-eye-slash"></i>';
    }

    setProviderTestResult(message, type = 'info') {
        if (!this.providerTestResult) return;
        if (!message) {
            this.providerTestResult.hidden = true;
            this.providerTestResult.textContent = '';
            return;
        }
        this.providerTestResult.hidden = false;
        this.providerTestResult.textContent = message;
        this.providerTestResult.className = `provider-test-result ${type}`;
    }

    resetProviderForm() {
        const def = this.getProviderDef(this.configuringProviderId);
        if (this.providerBaseUrl) this.providerBaseUrl.value = def.baseUrl || '';
        if (this.providerApiKey) this.providerApiKey.value = '';
        if (this.providerModels) this.providerModels.value = (def.models || []).join(', ');
        this.setProviderTestResult('Valores por defecto cargados. Pulsa «Guardar y usar» para aplicarlos.', 'info');
        this.updateProviderFormDirtyState();
    }

    async saveProviderAndUse() {
        const id = this.configuringProviderId;
        const def = this.getProviderDef(id);
        const form = this.readProviderForm();

        if (!form.baseUrl) {
            this.setProviderTestResult('La URL base no puede estar vacía.', 'error');
            return;
        }
        if (def.needsKey && !form.apiKey) {
            this.setProviderTestResult(`Introduce la clave API de ${def.name} (o usa otro proveedor).`, 'error');
            return;
        }
        if (!form.models.length && !def.custom) {
            this.setProviderTestResult('Indica al menos un modelo (escribelo o usa «Obtener modelos»).', 'error');
            return;
        }

        this.settings.providers = this.settings.providers || {};
        this.settings.providers[id] = form;
        this.settings.activeProvider = id;
        if (id === 'ollama') {
            this.settings.apiUrl = form.baseUrl;
            if (this.apiUrl) this.apiUrl.value = form.baseUrl;
        }

        await this.persistSettings();
        this.renderProvidersGrid();
        this.updateProviderUI();
        const previousModel = this.settings.model;
        await this.populateModelSelects(form.models.includes(previousModel) ? previousModel : form.models[0]);
        this.closeProvidersModal();
        this.showStatus(`Proveedor activo: ${def.name}`, 'success');
        this.checkModelStatus(this.settings.model);
    }

    updateProviderUI() {
        const def = this.getProviderDef(this.settings.activeProvider);
        if (this.providerBtnLabel) this.providerBtnLabel.textContent = def.name;
        if (this.providerBtnIcon) this.providerBtnIcon.className = `${def.icon} provider-btn-icon`;
        if (this.currentProvider) this.currentProvider.textContent = def.name;
        if (this.providerChipIcon) this.providerChipIcon.className = def.icon;
        if (this.inputHint) {
            const where = def.local || def.custom ? 'local' : 'en la nube';
            this.inputHint.textContent = `${def.name} · ${where} · puedes adjuntar texto, código, PDF e imágenes`;
        }
        if (this.providerActiveBadge && this.providersModal?.classList.contains('show')) {
            this.providerActiveBadge.hidden = def.id !== this.configuringProviderId;
        }
    }

    async listModelsFromApi(def, cfg) {
        if (def.kind === 'ollama') {
            const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/api/tags'), { method: 'GET' });
            return (data.models || []).map(m => m.name).filter(Boolean).sort();
        }
        if (def.kind === 'gemini') {
            const key = cfg.apiKey ? `?key=${encodeURIComponent(cfg.apiKey)}` : '';
            const data = await this.httpJson(`${this.endpoint(cfg.baseUrl, '/models')}${key}`, { method: 'GET' });
            return (data.models || [])
                .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
                .map(m => (m.name || '').replace(/^models\//, ''))
                .filter(Boolean);
        }
        const headers = {};
        if (def.kind === 'anthropic') {
            headers['x-api-key'] = cfg.apiKey;
            headers['anthropic-version'] = '2023-06-01';
        } else if (cfg.apiKey) {
            headers['Authorization'] = `Bearer ${cfg.apiKey}`;
        }
        const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/models'), { method: 'GET', headers });
        const list = data.data || data.models || [];
        return list.map(m => m.id || m.name).filter(Boolean);
    }

    async fetchProviderModels() {
        const def = this.getProviderDef(this.configuringProviderId);
        const form = this.readProviderForm();
        this.setProviderTestResult(`Consultando modelos de ${def.name}...`, 'info');
        try {
            const models = await this.listModelsFromApi(def, form);
            if (!models.length) throw new Error('La API no devolvió ningún modelo');
            if (this.providerModels) this.providerModels.value = models.join(', ');
            this.updateProviderFormDirtyState();
            this.setProviderTestResult(`${models.length} modelos disponibles cargados. Pulsa «Guardar y usar».`, 'success');
            return models;
        } catch (error) {
            this.setProviderTestResult(`No se pudieron obtener los modelos: ${error.message}`, 'error');
            return null;
        }
    }

    async testProviderConnection() {
        const def = this.getProviderDef(this.configuringProviderId);
        const form = this.readProviderForm();
        if (!form.baseUrl) {
            this.setProviderTestResult('La URL base no puede estar vacía.', 'error');
            return;
        }
        this.setProviderTestResult(`Probando conexión con ${def.name}...`, 'info');
        try {
            const models = await this.listModelsFromApi(def, form);
            this.setProviderTestResult(
                `Conexión correcta con ${def.name}: ${models.length} modelo(s) disponibles.`,
                'success'
            );
        } catch (error) {
            this.setProviderTestResult(`Fallo al conectar con ${def.name}: ${error.message}`, 'error');
        }
    }

    async httpJson(url, { method = 'GET', headers = {}, body = null } = {}) {
        let res;
        if (this.isElectron && window.electronAPI && window.electronAPI.providerRequest) {
            res = await window.electronAPI.providerRequest({ url, method, headers, body });
            if (res && res.error && res.status === 0) throw new Error(res.error);
        } else {
            const init = { method, headers };
            if (body !== null && body !== undefined && method !== 'GET') {
                init.body = typeof body === 'string' ? body : JSON.stringify(body);
            }
            const response = await fetch(url, init);
            res = {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                body: await response.text()
            };
        }
        if (!res || !res.ok) throw new Error(this.extractHttpError(res));
        if (res.body === null || res.body === undefined || res.body === '') return {};
        if (typeof res.body !== 'string') return res.body;
        try {
            return JSON.parse(res.body);
        } catch {
            return { raw: res.body };
        }
    }

    extractHttpError(res) {
        if (!res) return 'Sin respuesta del servidor';
        if (res.status === 0) return res.error || 'Error de red al contactar con el proveedor';
        let message = '';
        try {
            const data = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
            message = data?.error?.message || data?.error || data?.message || data?.[0]?.error?.message || '';
            if (typeof message === 'object') message = message.message || JSON.stringify(message);
        } catch {
            message = typeof res.body === 'string' ? res.body.slice(0, 200) : '';
        }
        return `HTTP ${res.status}${res.statusText ? ' ' + res.statusText : ''}${message ? ': ' + message : ''}`;
    }

    renderChatList() {
        if (!this.chatsList) return;
        const query = this.chatSearch?.value || '';
        const items = this.store.list({ filter: this.chatFilter, query });

        if (items.length === 0) {
            const labels = {
                active: 'No hay chats guardados. Empieza a escribir o pulsa Nuevo Chat.',
                favorites: 'No hay chats favoritos.',
                archived: 'No hay chats archivados.',
                trash: 'La papelera está vacía.'
            };
            this.chatsList.innerHTML = `<div class="chats-empty">${labels[this.chatFilter] || 'Sin resultados'}</div>`;
            this.updateBulkBar();
            return;
        }

        this.chatsList.innerHTML = items.map(chat => {
            const active = chat.id === this.currentChatId ? 'active' : '';
            const selected = this.selectedChatIds.has(chat.id) ? 'selected' : '';
            const fav = chat.isFavorite ? '<i class="fas fa-star fav-icon" title="Favorito"></i>' : '';
            const date = this.formatRelativeDate(chat.updatedAt);
            const tags = (chat.tags || []).slice(0, 3)
                .map(t => `<span class="chat-tag">${this.escapeHtml(t)}</span>`).join('');
            const msgCount = (chat.messages || []).length;
            return `
          <div class="chat-item ${active} ${selected}" data-id="${chat.id}">
            <input type="checkbox" class="chat-item-check" data-id="${chat.id}" ${this.selectedChatIds.has(chat.id) ? 'checked' : ''} title="Seleccionar" />
            <div class="chat-item-body">
              <div class="chat-item-title">${fav}<span>${this.escapeHtml(chat.title || 'Sin título')}</span></div>
              <div class="chat-item-meta">
                <span>${date}</span><span>·</span><span>${msgCount} msg</span>
                ${chat.model ? `<span>·</span><span>${this.escapeHtml(chat.model)}</span>` : ''}
              </div>
              ${tags ? `<div class="chat-item-tags">${tags}</div>` : ''}
            </div>
            <button type="button" class="chat-item-menu-btn" data-id="${chat.id}" title="Opciones">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>`;
        }).join('');

        this.chatsList.querySelectorAll('.chat-item').forEach(el => {
            el.addEventListener('click', e => {
                if (e.target.closest('.chat-item-check') || e.target.closest('.chat-item-menu-btn')) return;
                this.openChat(el.dataset.id);
            });
        });
        this.chatsList.querySelectorAll('.chat-item-check').forEach(cb => {
            cb.addEventListener('change', e => {
                e.stopPropagation();
                const id = cb.dataset.id;
                if (cb.checked) this.selectedChatIds.add(id);
                else this.selectedChatIds.delete(id);
                this.renderChatList();
            });
            cb.addEventListener('click', e => e.stopPropagation());
        });
        this.chatsList.querySelectorAll('.chat-item-menu-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this.showContextMenu(btn.dataset.id, e.clientX, e.clientY);
            });
        });
        this.updateBulkBar();
    }

    updateBulkBar() {
        if (!this.chatsBulkActions) return;
        this.chatsBulkActions.hidden = this.selectedChatIds.size === 0;
    }

    formatRelativeDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return 'ahora';
        if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
        if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} d`;
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    showContextMenu(chatId, x, y) {
        const chat = this.store.get(chatId);
        if (!chat || !this.chatContextMenu) return;
        this.contextChatId = chatId;

        const favLabel = this.chatContextMenu.querySelector('.ctx-fav-label');
        const archLabel = this.chatContextMenu.querySelector('.ctx-arch-label');
        const delLabel = this.chatContextMenu.querySelector('.ctx-del-label');
        const restoreBtn = this.chatContextMenu.querySelector('.ctx-restore');
        const foreverBtn = this.chatContextMenu.querySelector('.ctx-forever');

        if (favLabel) favLabel.textContent = chat.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito';
        if (archLabel) archLabel.textContent = chat.isArchived ? 'Desarchivar' : 'Archivar';
        if (delLabel) delLabel.textContent = chat.deletedAt ? 'Eliminar permanentemente' : 'Mover a papelera';

        const inTrash = !!chat.deletedAt;
        if (restoreBtn) restoreBtn.hidden = !inTrash;
        if (foreverBtn) foreverBtn.hidden = !inTrash;
        const deleteBtn = this.chatContextMenu.querySelector('[data-action="delete"]');
        if (deleteBtn) deleteBtn.hidden = inTrash;

        this.chatContextMenu.hidden = false;
        const rect = this.chatContextMenu.getBoundingClientRect();
        let left = x;
        let top = y;
        if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width - 8;
        if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - 8;
        this.chatContextMenu.style.left = left + 'px';
        this.chatContextMenu.style.top = top + 'px';
    }

    hideContextMenu() {
        if (this.chatContextMenu) this.chatContextMenu.hidden = true;
        this.contextChatId = null;
    }

    handleContextAction(action, chatId) {
        const chat = this.store.get(chatId);
        if (!chat) return;

        switch (action) {
            case 'rename':
                this.openChatEdit(chatId);
                break;
            case 'favorite':
                this.store.update(chatId, { isFavorite: !chat.isFavorite });
                this.renderChatList();
                this.showStatus(chat.isFavorite ? 'Quitado de favoritos' : 'Marcado como favorito', 'success');
                break;
            case 'archive':
                this.store.update(chatId, { isArchived: !chat.isArchived });
                this.renderChatList();
                this.showStatus(chat.isArchived ? 'Chat desarchivado' : 'Chat archivado', 'success');
                break;
            case 'export-pdf':
                this.exportChatPdfById(chatId);
                break;
            case 'export-md':
                this.exportChatMarkdownById(chatId);
                break;
            case 'export-json':
                this.exportChatJsonById(chatId);
                break;
            case 'restore':
                this.store.restore(chatId);
                this.renderChatList();
                this.showStatus('Chat recuperado de la papelera', 'success');
                break;
            case 'delete':
                this.store.softDelete(chatId);
                if (this.currentChatId === chatId) {
                    this.currentChatId = null;
                    this.resetConversationView();
                }
                this.renderChatList();
                this.showStatus('Chat movido a la papelera', 'success');
                break;
            case 'delete-forever':
                if (confirm('¿Eliminar permanentemente este chat? No se puede deshacer.')) {
                    this.store.permanentDelete(chatId);
                    if (this.currentChatId === chatId) {
                        this.currentChatId = null;
                        this.resetConversationView();
                    }
                    this.renderChatList();
                    this.showStatus('Chat eliminado permanentemente', 'success');
                }
                break;
        }
    }

    openChatEdit(chatId) {
        const chat = this.store.get(chatId);
        if (!chat || !this.chatEditModal) return;
        this.editingChatId = chatId;
        this.chatTitleInput.value = chat.title || '';
        this.chatTagsInput.value = (chat.tags || []).join(', ');
        this.chatEditModal.classList.add('show');
        this.chatTitleInput.focus();
    }

    closeChatEdit() {
        this.chatEditModal?.classList.remove('show');
        this.editingChatId = null;
    }

    saveChatEdit() {
        if (!this.editingChatId) return;
        const title = (this.chatTitleInput.value || '').trim() || 'Sin título';
        const tags = (this.chatTagsInput.value || '').split(',').map(t => t.trim()).filter(Boolean);
        this.store.update(this.editingChatId, { title, tags });
        if (this.currentChatId === this.editingChatId && this.chatTitleDisplay) {
            this.chatTitleDisplay.textContent = title;
        }
        this.closeChatEdit();
        this.renderChatList();
        this.showStatus('Chat actualizado', 'success');
    }

    ensureCurrentChat() {
        if (this.currentChatId && this.store.get(this.currentChatId)) {
            return this.store.get(this.currentChatId);
        }
        const title = this.suggestTitleFromMessages();
        const chat = this.store.create({
            title,
            model: this.settings.model,
            messages: this.serializeMessages(this.conversationHistory)
        });
        this.currentChatId = chat.id;
        if (this.chatTitleDisplay) this.chatTitleDisplay.textContent = chat.title;
        this.renderChatList();
        return chat;
    }

    serializeMessages(history) {
        return (history || []).map(m => ({
            type: m.type,
            content: m.content,
            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
            model: m.model || null,
            attachments: m.attachments || undefined
        }));
    }

    suggestTitleFromMessages() {
        const firstUser = this.conversationHistory.find(m => m.type === 'user');
        if (firstUser && firstUser.content) {
            const t = firstUser.content.trim().replace(/\s+/g, ' ');
            return t.length > 48 ? t.slice(0, 48) + '…' : t;
        }
        return 'Nuevo chat';
    }

    persistCurrentChat() {
        if (this.conversationHistory.length === 0) return;
        if (!this.currentChatId || !this.store.get(this.currentChatId)) {
            this.ensureCurrentChat();
            return;
        }
        const existing = this.store.get(this.currentChatId);
        const title = existing.title === 'Nuevo chat' ? this.suggestTitleFromMessages() : existing.title;
        this.store.update(this.currentChatId, {
            messages: this.serializeMessages(this.conversationHistory),
            model: this.settings.model,
            title
        });
        if (this.chatTitleDisplay) this.chatTitleDisplay.textContent = title;
        this.renderChatList();
    }

    openChat(chatId) {
        const chat = this.store.get(chatId);
        if (!chat) return;
        if (chat.deletedAt) {
            this.showStatus('Recupera el chat de la papelera para abrirlo', 'error');
            return;
        }
        this.persistCurrentChat();
        this.currentChatId = chatId;
        this.conversationHistory = (chat.messages || []).map(m => ({
            type: m.type,
            content: m.content,
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
            model: m.model,
            attachments: m.attachments
        }));
        this.chatMessages.innerHTML = '';
        if (this.conversationHistory.length === 0) {
            this.resetConversationView(false);
        } else {
            this.conversationHistory.forEach(m => this.renderMessage(m, false));
            this.scrollToBottom();
        }
        if (this.chatTitleDisplay) this.chatTitleDisplay.textContent = chat.title || 'Chat';
        if (chat.model && this.modelSelect) {
            const opt = Array.from(this.modelSelect.options).find(o => o.value === chat.model);
            if (opt) {
                this.modelSelect.value = chat.model;
                this.updateModel();
            }
        }
        this.renderChatList();
        this.showStatus('Chat cargado', 'success');
    }

    resetConversationView(updateTitle = true) {
        this.conversationHistory = [];
        this.chatMessages.innerHTML = `
            <div class="welcome-message">
              <div class="welcome-icon"><i class="fas fa-robot"></i></div>
              <h2>¡Hola! Soy tu asistente de AI Studio</h2>
              <p>Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?</p>
              <div class="suggestions">
                <button class="suggestion-btn">Explícame un concepto</button>
                <button class="suggestion-btn">Ayúdame con código</button>
                <button class="suggestion-btn">Escribe un texto</button>
                <button class="suggestion-btn">Resuelve un problema</button>
              </div>
            </div>`;
        this.chatMessages.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleSuggestion(btn.textContent));
        });
        if (updateTitle && this.chatTitleDisplay) this.chatTitleDisplay.textContent = 'Chat con AI Studio';
    }

    newChat() {
        this.persistCurrentChat();
        this.currentChatId = null;
        this.resetConversationView();
        this.renderChatList();
        this.messageInput?.focus();
        this.showStatus('Nuevo chat listo', 'success');
    }

    clearChatView() {
        if (this.conversationHistory.length === 0) return;
        if (!confirm('¿Vaciar los mensajes de la vista actual? El chat guardado no se borrará hasta que lo elimines desde la lista.')) return;
        this.resetConversationView(false);
        if (this.currentChatId) {
            this.store.update(this.currentChatId, { messages: [] });
            this.renderChatList();
        }
        this.showStatus('Vista limpiada', 'success');
    }

    bulkArchive() {
        const ids = [...this.selectedChatIds];
        ids.forEach(id => {
            const c = this.store.get(id);
            if (c && !c.deletedAt) this.store.update(id, { isArchived: true });
        });
        this.selectedChatIds.clear();
        this.renderChatList();
        this.showStatus(`${ids.length} chat(s) archivado(s)`, 'success');
    }

    bulkDelete() {
        const ids = [...this.selectedChatIds];
        if (this.chatFilter === 'trash') {
            if (!confirm(`¿Eliminar permanentemente ${ids.length} chat(s)?`)) return;
            ids.forEach(id => this.store.permanentDelete(id));
        } else {
            ids.forEach(id => this.store.softDelete(id));
        }
        if (ids.includes(this.currentChatId)) {
            this.currentChatId = null;
            this.resetConversationView();
        }
        this.selectedChatIds.clear();
        this.renderChatList();
        this.showStatus('Operación completada', 'success');
    }

    async bulkExportPdf() {
        const ids = [...this.selectedChatIds];
        if (ids.length === 0) return;
        this.showStatus(`Exportando ${ids.length} PDF(s)...`, 'info');
        for (const id of ids) await this.exportChatPdfById(id);
        this.showStatus('Exportación PDF en bloque finalizada', 'success');
    }

    setupAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.themeSelect.value = savedTheme;
        this.changeTheme();
    }

    changeTheme() {
        const theme = this.themeSelect.value;
        localStorage.setItem('theme', theme);
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        this.settings.theme = theme;
    }

    toggleSidebar() { this.sidebar.classList.toggle('show'); }

    openSettings() {
        this.settingsModal.classList.add('show');
        if (this.isElectron && this.shortcutSettingGroup) this.shortcutSettingGroup.hidden = false;
    }

    closeSettings() { this.settingsModal.classList.remove('show'); }

    async saveSettings() {
        this.settings.apiUrl = this.apiUrl.value;
        this.settings.model = this.modelSelect.value;
        this.settings.theme = this.themeSelect.value;
        this.settings.autoScroll = this.autoScroll.checked;
        this.settings.markdownEnabled = this.markdownEnabled.checked;
        this.settings.providers = this.settings.providers || {};
        const ollamaCfg = this.getProviderConfig('ollama');
        ollamaCfg.baseUrl = (this.apiUrl.value || '').trim().replace(/\/+$/, '') || 'http://localhost:11434';
        this.settings.providers.ollama = ollamaCfg;
        await this.persistSettings();
        this.updateModel();
        this.closeSettings();
        this.showStatus('Configuración guardada', 'success');
    }

    async persistSettings() {
        if (this.isElectron) {
            try {
                await window.electronAPI.saveSettings(this.settings);
            } catch (error) {
                console.error('Error al guardar configuración en Electron:', error);
            }
        } else {
            localStorage.setItem('ollamaChatSettings', JSON.stringify(this.settings));
        }
    }

    updateModel() {
        const model = this.modelSelect.value;
        this.currentModel.textContent = model;
        this.settings.model = model;
        if (this.modalModelSelect) this.modalModelSelect.value = model;
        this.checkModelStatus(model);
    }

    updateModelFromModal() {
        const model = this.modalModelSelect.value;
        this.currentModel.textContent = model;
        this.settings.model = model;
        this.modelSelect.value = model;
        this.checkModelStatus(model);
    }

    filterModels(searchInput, selectElement) {
        if (!searchInput || !selectElement) return;
        const searchTerm = searchInput.value.toLowerCase();
        const options = selectElement.querySelectorAll('option');
        const optgroups = selectElement.querySelectorAll('optgroup');
        if (searchTerm) {
            selectElement.size = Math.min(8, this.countVisibleOptions(selectElement, searchTerm));
        } else {
            selectElement.size = 1;
        }
        optgroups.forEach(optgroup => {
            const groupOptions = optgroup.querySelectorAll('option');
            const hasVisibleOptions = Array.from(groupOptions).some(option => {
                const matches = option.textContent.toLowerCase().includes(searchTerm);
                option.style.display = matches ? '' : 'none';
                return matches;
            });
            optgroup.style.display = hasVisibleOptions ? '' : 'none';
        });
        if (!searchTerm) {
            optgroups.forEach(optgroup => {
                optgroup.style.display = '';
                optgroup.querySelectorAll('option').forEach(option => { option.style.display = ''; });
            });
            options.forEach(option => { option.style.display = ''; });
        } else {
            options.forEach(option => {
                if (!option.parentElement || option.parentElement.tagName !== 'OPTGROUP') {
                    option.style.display = option.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
                }
            });
        }
        this.showNoResultsMessage(selectElement, searchTerm, options);
        this.showResultsCount(selectElement, searchTerm, options);
    }

    countVisibleOptions(selectElement, searchTerm) {
        return Array.from(selectElement.querySelectorAll('option')).filter(option =>
            option.textContent.toLowerCase().includes((searchTerm || '').toLowerCase())
        ).length;
    }

    showNoResultsMessage(selectElement, searchTerm, options) {
        const existing = selectElement.parentNode.querySelector('.no-results');
        if (existing) existing.remove();
        if (!searchTerm) return;
        const visible = Array.from(options).filter(
            o => o.style.display !== 'none' && o.textContent.toLowerCase().includes(searchTerm)
        );
        if (visible.length === 0) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.textContent = `No se encontraron modelos que coincidan con "${searchTerm}"`;
            message.style.cssText = 'color:var(--text-muted);font-size:0.75rem;padding:0.5rem;text-align:center;';
            selectElement.parentNode.appendChild(message);
        }
    }

    showResultsCount(selectElement, searchTerm, options) {
        const existingCount = selectElement.parentNode.querySelector('.results-count');
        if (existingCount) existingCount.remove();
        if (!searchTerm) return;
        const visibleOptions = Array.from(options).filter(
            option => option.style.display !== 'none' && option.textContent.toLowerCase().includes(searchTerm)
        );
        if (visibleOptions.length > 0) {
            const countMessage = document.createElement('div');
            countMessage.className = 'results-count';
            countMessage.textContent = `${visibleOptions.length} modelo${visibleOptions.length !== 1 ? 's' : ''} encontrado${visibleOptions.length !== 1 ? 's' : ''}`;
            countMessage.style.cssText = 'color:var(--text-muted);font-size:0.75rem;padding:0.25rem 0.5rem;text-align:right;font-style:italic;';
            selectElement.parentNode.appendChild(countMessage);
        }
    }

    closeDropdowns() {
        [this.modelSelect, this.modalModelSelect].forEach(sel => { if (sel) sel.size = 1; });
    }

    clearSearch() {
        if (this.modelSearch) this.modelSearch.value = '';
        if (this.modalModelSearch) this.modalModelSearch.value = '';
        this.closeDropdowns();
        if (this.modelSelect) this.filterModels(this.modelSearch, this.modelSelect);
        if (this.modalModelSelect) this.filterModels(this.modalModelSearch, this.modalModelSelect);
    }

    async populateModelSelects(preferredModel = null) {
        const def = this.getProviderDef(this.settings.activeProvider);
        const cfg = this.getProviderConfig(def.id);
        const targetModel = preferredModel || this.modelSelect.value || this.settings.model;
        const setEmpty = (message) => {
            [this.modelSelect, this.modalModelSelect].forEach(select => {
                if (select) select.innerHTML = `<option value="">${message}</option>`;
            });
            this.showStatus(message, 'error');
        };

        let models = [];
        if (def.kind === 'ollama') {
            try {
                const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/api/tags'), { method: 'GET' });
                models = (data.models || [])
                    .map(m => ({
                        name: m.name,
                        label: `${m.name}${m.size ? ` (${(m.size / 1e9).toFixed(1)}GB)` : ''}`
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
            } catch (error) {
                console.error('Error al obtener modelos de Ollama:', error);
                this.showStatus(`No se pudo obtener la lista de modelos: ${error.message}`, 'error');
                models = cfg.models.map(name => ({ name, label: name }));
            }
        } else {
            models = cfg.models.map(name => ({ name, label: name }));
        }

        if (models.length === 0) {
            setEmpty(
                def.kind === 'ollama'
                    ? 'No se encontraron modelos. Descarga uno con: ollama pull <modelo>'
                    : `Sin modelos configurados para ${def.name}. Ábrelos desde «Proveedores».`
            );
            return;
        }

        [this.modelSelect, this.modalModelSelect].forEach(select => {
            if (!select) return;
            select.innerHTML = '';
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.label;
                select.appendChild(option);
            });
        });

        const modelExists = models.some(m => m.name === targetModel);
        const modelToSelect = modelExists ? targetModel : models[0].name;
        this.modelSelect.value = modelToSelect;
        if (this.modalModelSelect) this.modalModelSelect.value = modelToSelect;
        this.currentModel.textContent = modelToSelect;
        this.settings.model = modelToSelect;
    }

    async checkModelStatus(model) {
        if (!model) return;
        const statusDot = document.querySelector('.status-dot');
        const def = this.getProviderDef(this.settings.activeProvider);
        if (this.checkModelBtn) this.checkModelBtn.classList.add('loading');

        if (def.kind !== 'ollama') {
            const cfg = this.getProviderConfig(def.id);
            const found = cfg.models.includes(model);
            if (statusDot) statusDot.style.background = found ? '#22c55e' : '#f59e0b';
            if (!found) {
                this.showStatus(`El modelo "${model}" no está en la lista de ${def.name}`, 'error');
            }
            if (this.checkModelBtn) this.checkModelBtn.classList.remove('loading');
            return;
        }

        try {
            const cfg = this.getProviderConfig(def.id);
            const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/api/tags'), { method: 'GET' });
            const found = (data.models || []).some(m => m.name === model);
            if (statusDot) statusDot.style.background = found ? '#22c55e' : '#f59e0b';
            if (!found) this.showStatus(`El modelo "${model}" no está instalado localmente`, 'error');
        } catch (error) {
            if (statusDot) statusDot.style.background = '#ef4444';
            this.showStatus(`Error de conexión con Ollama: ${error.message}`, 'error');
        } finally {
            if (this.checkModelBtn) this.checkModelBtn.classList.remove('loading');
        }
    }

    handleSuggestion(text) {
        this.messageInput.value = text.trim();
        this.messageInput.focus();
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }


    // ---------- Adjuntos ----------

    handleFilesSelected(e) {
        const files = Array.from(e.target.files || []);
        if (files.length) this.addFiles(files);
        e.target.value = '';
    }

    async addFiles(files) {
        const maxBytes = 8 * 1024 * 1024; // 8 MB por archivo
        for (const file of files) {
            if (file.size > maxBytes) {
                this.showStatus(`"${file.name}" supera 8 MB y se omitió`, 'error');
                continue;
            }
            try {
                const att = await this.readFileAsAttachment(file);
                if (att) {
                    this.pendingAttachments.push(att);
                }
            } catch (err) {
                console.error(err);
                this.showStatus(`No se pudo leer "${file.name}"`, 'error');
            }
        }
        this.renderAttachmentsPreview();
    }

    readFileAsAttachment(file) {
        return new Promise((resolve, reject) => {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            const reader = new FileReader();

            reader.onerror = () => reject(reader.error);

            if (isImage) {
                reader.onload = () => {
                    const dataUrl = reader.result;
                    const base64 = String(dataUrl).split(',')[1] || '';
                    resolve({
                        id: 'att_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                        name: file.name,
                        type: 'image',
                        mime: file.type || 'image/png',
                        size: file.size,
                        base64,
                        dataUrl
                    });
                };
                reader.readAsDataURL(file);
            } else if (isPdf) {
                // Extraer texto básico de PDF es limitado sin librería; guardamos como binario no usable
                // Intentamos leer como texto por si es PDF textual simple; si no, avisamos
                reader.onload = () => {
                    let text = String(reader.result || '');
                    // Limpiar basura binaria aproximada
                    const printable = text.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ').replace(/\s+/g, ' ').trim();
                    if (printable.length < 40) {
                        this.showStatus(
                            `PDF "${file.name}": extracción de texto limitada. Copia el texto o usa un .txt`,
                            'error'
                        );
                        resolve({
                            id: 'att_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                            name: file.name,
                            type: 'text',
                            mime: 'application/pdf',
                            size: file.size,
                            content: `[Archivo PDF adjunto: ${file.name}. No se pudo extraer texto legible automáticamente.]`
                        });
                    } else {
                        resolve({
                            id: 'att_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                            name: file.name,
                            type: 'text',
                            mime: 'application/pdf',
                            size: file.size,
                            content: printable.slice(0, 100000)
                        });
                    }
                };
                reader.readAsText(file);
            } else {
                reader.onload = () => {
                    resolve({
                        id: 'att_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                        name: file.name,
                        type: 'text',
                        mime: file.type || 'text/plain',
                        size: file.size,
                        content: String(reader.result || '').slice(0, 200000)
                    });
                };
                reader.readAsText(file);
            }
        });
    }

    removeAttachment(id) {
        this.pendingAttachments = this.pendingAttachments.filter(a => a.id !== id);
        this.renderAttachmentsPreview();
    }

    renderAttachmentsPreview() {
        if (!this.attachmentsPreview) return;
        if (!this.pendingAttachments.length) {
            this.attachmentsPreview.hidden = true;
            this.attachmentsPreview.innerHTML = '';
            return;
        }
        this.attachmentsPreview.hidden = false;
        this.attachmentsPreview.innerHTML = this.pendingAttachments
            .map(a => {
                const icon = a.type === 'image' ? 'fa-image' : 'fa-file-alt';
                const sizeKb = a.size ? `${Math.max(1, Math.round(a.size / 1024))} KB` : '';
                return `<span class="attachment-chip" data-id="${a.id}">
                    <i class="fas ${icon} file-icon"></i>
                    <span class="att-name" title="${this.escapeHtml(a.name)}">${this.escapeHtml(a.name)}</span>
                    <span style="opacity:0.6">${sizeKb}</span>
                    <button type="button" class="att-remove" data-id="${a.id}" title="Quitar">&times;</button>
                </span>`;
            })
            .join('');
        this.attachmentsPreview.querySelectorAll('.att-remove').forEach(btn => {
            btn.addEventListener('click', () => this.removeAttachment(btn.dataset.id));
        });
    }

    buildPromptWithAttachments(userMessage) {
        const texts = this.pendingAttachments.filter(a => a.type === 'text' && a.content);
        if (!texts.length) return userMessage;
        let block = userMessage + '\n\n';
        texts.forEach(a => {
            block += `--- Archivo adjunto: ${a.name} ---\n${a.content}\n--- Fin de ${a.name} ---\n\n`;
        });
        return block;
    }

    getPendingImageAttachments() {
        return this.pendingAttachments
            .filter(a => a.type === 'image' && a.base64)
            .map(a => ({ mime: a.mime || 'image/png', base64: a.base64 }));
    }

    snapshotPendingAttachments() {
        // Metadatos ligeros + contenido texto / miniatura para historial
        return this.pendingAttachments.map(a => {
            if (a.type === 'image') {
                return {
                    id: a.id,
                    name: a.name,
                    type: 'image',
                    mime: a.mime,
                    size: a.size,
                    // Guardamos dataUrl solo si es razonable (<1.5MB approx en chars)
                    dataUrl: a.dataUrl && a.dataUrl.length < 1_500_000 ? a.dataUrl : null,
                    base64: a.base64 && a.base64.length < 1_200_000 ? a.base64 : null
                };
            }
            return {
                id: a.id,
                name: a.name,
                type: 'text',
                mime: a.mime,
                size: a.size,
                content: a.content
            };
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        const hasAttachments = this.pendingAttachments.length > 0;
        if ((!message && !hasAttachments) || this.isLoading) return;

        this.isLoading = true;
        this.sendButton.disabled = true;
        this.showLoading(true);

        const displayText = message || (hasAttachments ? '(Archivo(s) adjunto(s))' : '');
        const attachmentsSnap = this.snapshotPendingAttachments();
        const prompt = this.buildPromptWithAttachments(message || 'Analiza el archivo o imagen adjunto y responde en español.');
        const images = this.getPendingImageAttachments();

        this.addMessage(displayText, 'user', attachmentsSnap);
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.pendingAttachments = [];
        this.renderAttachmentsPreview();
        this.showTypingIndicator();

        try {
            const response = await this.callProviderAPI(prompt, images);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            this.showStatus('Mensaje enviado correctamente', 'success');
        } catch (error) {
            this.hideTypingIndicator();
            this.showStatus(`Error: ${error.message}`, 'error');
            console.error('Error al enviar mensaje:', error);
        } finally {
            this.isLoading = false;
            this.sendButton.disabled = false;
            this.showLoading(false);
            this.persistCurrentChat();
        }
    }

    addMessage(content, type, attachments = null) {
        const msg = {
            type,
            content,
            timestamp: new Date(),
            model: type === 'ai' ? this.settings.model : null,
            attachments: attachments && attachments.length ? attachments : undefined
        };
        this.conversationHistory.push(msg);
        this.renderMessage(msg, true);
    }

    renderMessage(msg, scroll = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}-message`;
        const header = document.createElement('div');
        header.className = 'message-header';
        const time = msg.timestamp instanceof Date
            ? msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            : '';
        header.innerHTML = msg.type === 'user'
            ? `<i class="fas fa-user"></i> Tú <span style="opacity:0.6;font-size:0.75rem;margin-left:8px;">${time}</span>`
            : `<i class="fas fa-robot"></i> ${this.escapeHtml(msg.model || this.settings.model || 'IA')} <span style="opacity:0.6;font-size:0.75rem;margin-left:8px;">${time}</span>`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        if (msg.type === 'ai' && this.settings.markdownEnabled) {
            contentDiv.innerHTML = this.parseMarkdown(msg.content);
        } else {
            contentDiv.textContent = msg.content;
        }
        messageDiv.appendChild(header);
        messageDiv.appendChild(contentDiv);

        if (msg.attachments && msg.attachments.length) {
            const attDiv = document.createElement('div');
            attDiv.className = 'message-attachments';
            msg.attachments.forEach(a => {
                if (a.type === 'image' && a.dataUrl) {
                    const img = document.createElement('img');
                    img.className = 'att-thumb';
                    img.src = a.dataUrl;
                    img.alt = a.name || 'imagen';
                    attDiv.appendChild(img);
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'att-badge';
                    badge.innerHTML = `<i class="fas fa-paperclip"></i> ${this.escapeHtml(a.name || 'archivo')}`;
                    attDiv.appendChild(badge);
                }
            });
            messageDiv.appendChild(attDiv);
        }

        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) welcomeMessage.remove();
        this.chatMessages.appendChild(messageDiv);
        if (scroll && this.settings.autoScroll) this.scrollToBottom();
    }

    parseMarkdown(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = `<div class="message-content"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    showLoading(show) {
        if (show) this.loadingOverlay.classList.add('show');
        else this.loadingOverlay.classList.remove('show');
    }

    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        setTimeout(() => {
            this.status.textContent = '';
            this.status.className = 'status';
        }, 3000);
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getSystemPrompt() {
        return 'Eres AI Studio, un asistente de IA útil, claro y preciso. Respondes siempre en el idioma del usuario.';
    }

    buildTextMessages(prompt) {
        const history = this.conversationHistory;
        const last = history[history.length - 1];
        const limit = last && last.type === 'user' ? history.length - 1 : history.length;
        const messages = [];
        for (let i = 0; i < limit; i++) {
            const item = history[i];
            if (!item || !item.content) continue;
            const role = item.type === 'user' ? 'user' : 'assistant';
            const text = String(item.content);
            const prev = messages[messages.length - 1];
            if (prev && prev.role === role) prev.content += `\n\n${text}`;
            else messages.push({ role, content: text });
        }
        while (messages.length && messages[0].role === 'assistant') messages.shift();
        messages.push({ role: 'user', content: prompt });
        return messages;
    }

    requireResponseText(name, content) {
        if (content === undefined || content === null || content === '') {
            throw new Error(`${name} no devolvió contenido en la respuesta`);
        }
        return content;
    }

    async callProviderAPI(prompt, images = []) {
        const def = this.getProviderDef(this.settings.activeProvider);
        const cfg = this.getProviderConfig(def.id);
        const model = this.modelSelect.value || this.settings.model;
        if (!cfg.baseUrl) throw new Error(`Falta la URL base del proveedor ${def.name}`);
        if (!model) throw new Error('No hay ningún modelo seleccionado');

        switch (def.kind) {
            case 'ollama':
                return this.callOllamaProvider(cfg, model, prompt, images);
            case 'anthropic':
                return this.callAnthropicProvider(cfg, model, prompt, images);
            case 'gemini':
                return this.callGeminiProvider(cfg, model, prompt, images);
            default:
                return this.callOpenAIProvider(def, cfg, model, prompt, images);
        }
    }

    async callOpenAIProvider(def, cfg, model, prompt, images) {
        const messages = this.buildTextMessages(prompt);
        if (images.length) {
            messages[messages.length - 1].content = [
                { type: 'text', text: prompt },
                ...images.map(img => ({
                    type: 'image_url',
                    image_url: { url: `data:${img.mime};base64,${img.base64}` }
                }))
            ];
        }
        const headers = { 'Content-Type': 'application/json' };
        if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;

        const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/chat/completions'), {
            method: 'POST',
            headers,
            body: { model, messages, stream: false }
        });

        const choice = (data.choices || [])[0];
        let content = choice?.message?.content ?? choice?.text ?? data.response ?? data.message;
        if (Array.isArray(content)) {
            content = content
                .map(part => (typeof part === 'string' ? part : part?.text || ''))
                .join('');
        }
        if ((content === undefined || content === null) && data.error) {
            throw new Error(data.error.message || JSON.stringify(data.error));
        }
        return this.requireResponseText(def.name, content);
    }

    async callAnthropicProvider(cfg, model, prompt, images) {
        const messages = this.buildTextMessages(prompt);
        if (images.length) {
            messages[messages.length - 1].content = [
                { type: 'text', text: prompt },
                ...images.map(img => ({
                    type: 'image',
                    source: { type: 'base64', media_type: img.mime, data: img.base64 }
                }))
            ];
        }
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': cfg.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        };

        const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/v1/messages'), {
            method: 'POST',
            headers,
            body: {
                model,
                max_tokens: 4096,
                system: this.getSystemPrompt(),
                messages
            }
        });

        const content = (data.content || [])
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('');
        if (!content && data.stop_reason) {
            throw new Error('Anthropic devolvió una respuesta sin texto');
        }
        return this.requireResponseText('Anthropic', content);
    }

    async callGeminiProvider(cfg, model, prompt, images) {
        const rawMessages = this.buildTextMessages(prompt);
        const contents = rawMessages.map((m, index) => {
            const parts = [];
            if (index === rawMessages.length - 1 && images.length) {
                parts.push({ text: prompt });
                images.forEach(img => parts.push({ inline_data: { mime_type: img.mime, data: img.base64 } }));
            } else {
                parts.push({ text: String(m.content) });
            }
            return { role: m.role === 'user' ? 'user' : 'model', parts };
        });

        const key = cfg.apiKey ? `?key=${encodeURIComponent(cfg.apiKey)}` : '';
        const url =
            this.endpoint(cfg.baseUrl, `/models/${encodeURIComponent(model)}:generateContent`) + key;

        const data = await this.httpJson(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                systemInstruction: { parts: [{ text: this.getSystemPrompt() }] },
                contents,
                generationConfig: { temperature: 0.7 }
            }
        });

        const parts = data?.candidates?.[0]?.content?.parts || [];
        const content = parts.map(p => p.text).filter(Boolean).join('');
        if (!content && data?.promptFeedback?.blockReason) {
            throw new Error(`Gemini bloqueó la respuesta: ${data.promptFeedback.blockReason}`);
        }
        return this.requireResponseText('Gemini', content);
    }

    async callOllamaProvider(cfg, model, prompt, images) {
        const messages = this.buildTextMessages(prompt);
        if (images.length) {
            messages[messages.length - 1].images = images.map(img => img.base64);
        }

        const data = await this.httpJson(this.endpoint(cfg.baseUrl, '/api/chat'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { model, messages, stream: false }
        });

        const content = data.message?.content ?? data.response;
        return this.requireResponseText('Ollama', content);
    }

    getMessagesForExport(chatId = null) {
        if (chatId) {
            const chat = this.store.get(chatId);
            return {
                title: chat?.title || 'Chat',
                model: chat?.model || this.settings.model,
                messages: chat?.messages || []
            };
        }
        return {
            title: this.chatTitleDisplay?.textContent || 'Chat',
            model: this.settings.model,
            messages: this.serializeMessages(this.conversationHistory)
        };
    }

    exportChat() {
        this.exportChatJsonById(null);
    }

    exportChatJsonById(chatId) {
        const data = this.getMessagesForExport(chatId);
        if (!data.messages.length) {
            this.showStatus('No hay conversación para exportar', 'error');
            return;
        }
        const exportData = {
            title: data.title,
            currentModel: data.model,
            timestamp: new Date().toISOString(),
            messages: data.messages
        };
        const safeName = (data.title || 'chat').replace(/[^\w\-]+/g, '_').slice(0, 40);
        this.downloadFile(
            JSON.stringify(exportData, null, 2),
            'application/json',
            `${safeName}-${new Date().toISOString().split('T')[0]}.json`
        );
        this.showStatus('Chat exportado a JSON', 'success');
    }

    exportChatMarkdown() {
        this.exportChatMarkdownById(null);
    }

    exportChatMarkdownById(chatId) {
        const data = this.getMessagesForExport(chatId);
        if (!data.messages.length) {
            this.showStatus('No hay conversación para exportar', 'error');
            return;
        }
        const modeloActual = data.model;
        let md = `# ${data.title}\n\n**Modelo:** ${modeloActual}\n**Fecha:** ${new Date().toLocaleString('es-ES')}\n\n---\n\n`;
        data.messages.forEach(msg => {
            const hora = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('es-ES') : '';
            if (msg.type === 'user') {
                md += `### 👤 Tú${hora ? ` (${hora})` : ''}\n\n${msg.content}\n\n`;
            } else {
                const modeloMsg = msg.model || modeloActual;
                md += `### 🤖 ${modeloMsg}${hora ? ` (${hora})` : ''}\n\n${msg.content}\n\n`;
            }
            md += `---\n\n`;
        });
        const safeName = (data.title || 'chat').replace(/[^\w\-]+/g, '_').slice(0, 40);
        this.downloadFile(md, 'text/markdown', `${safeName}-${new Date().toISOString().split('T')[0]}.md`);
        this.showStatus('Chat exportado a Markdown', 'success');
    }

    exportChatPdf() {
        this.exportChatPdfById(null);
    }

    async exportChatPdfById(chatId) {
        const data = this.getMessagesForExport(chatId);
        if (!data.messages.length) {
            this.showStatus('No hay conversación para exportar', 'error');
            return;
        }
        const jspdf = window.jspdf;
        if (!jspdf || !jspdf.jsPDF) {
            this.showStatus('jsPDF no está cargado. Revisa la conexión a la CDN.', 'error');
            return;
        }
        const { jsPDF } = jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - margin * 2;
        let y = margin;
        const ensureSpace = (needed = 20) => {
            if (y + needed > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }
        };
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        const titleLines = doc.splitTextToSize(data.title || 'Chat', maxWidth);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 20 + 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Modelo: ${data.model || '-'}  ·  ${new Date().toLocaleString('es-ES')}`, margin, y);
        y += 24;
        doc.setTextColor(0);
        for (const msg of data.messages) {
            ensureSpace(40);
            const who = msg.type === 'user' ? 'Tú' : msg.model || data.model || 'IA';
            const time = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                : '';
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(`${who}${time ? '  ·  ' + time : ''}`, margin, y);
            y += 16;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const lines = doc.splitTextToSize(String(msg.content || ''), maxWidth);
            for (const line of lines) {
                ensureSpace(14);
                doc.text(line, margin, y);
                y += 14;
            }
            y += 12;
        }
        const safeName = (data.title || 'chat').replace(/[^\w\-]+/g, '_').slice(0, 40);
        doc.save(`${safeName}-${new Date().toISOString().split('T')[0]}.pdf`);
        this.showStatus('PDF generado', 'success');
    }

    downloadFile(content, mimeType, filename) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async loadSettings() {
        if (this.isElectron) {
            try {
                const settings = await window.electronAPI.getSettings();
                this.settings = { ...this.settings, ...settings };
            } catch (error) {
                console.error('Error al cargar configuración de Electron:', error);
                this.loadLocalSettings();
            }
        } else {
            this.loadLocalSettings();
        }

        this.settings.providers = this.settings.providers || {};
        if (!PROVIDERS.some(p => p.id === this.settings.activeProvider)) {
            this.settings.activeProvider = 'ollama';
        }
        if (!this.settings.providers.ollama && this.settings.apiUrl) {
            this.settings.providers.ollama = {
                baseUrl: this.settings.apiUrl,
                apiKey: '',
                models: PROVIDERS[0].models.slice()
            };
        }

        const ollamaCfg = this.getProviderConfig('ollama');
        this.settings.apiUrl = ollamaCfg.baseUrl;
        this.apiUrl.value = ollamaCfg.baseUrl;

        this.renderProvidersGrid();
        this.selectProviderForConfig(this.settings.activeProvider);
        this.updateProviderUI();

        await this.populateModelSelects(this.settings.model);
        this.themeSelect.value = this.settings.theme;
        this.autoScroll.checked = this.settings.autoScroll;
        this.markdownEnabled.checked = this.settings.markdownEnabled;
        this.updateModel();
        this.changeTheme();
    }

    loadLocalSettings() {
        const saved = localStorage.getItem('ollamaChatSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('Error al cargar configuración local:', error);
            }
        }
    }

    initializeElectron() {
        if (!this.isElectron) return;
        console.log('Ejecutando en Electron');
        if (this.shortcutSettingGroup) this.shortcutSettingGroup.hidden = false;
        if (window.electronAPI.onNewConversation) {
            window.electronAPI.onNewConversation(() => this.newChat());
        }
        if (window.electronAPI.onExportConversation) {
            window.electronAPI.onExportConversation(() => this.exportChat());
        }
        if (window.electronAPI.onOpenSettings) {
            window.electronAPI.onOpenSettings(() => this.openSettings());
        }
        if (window.electronAPI.onOpenProviders) {
            window.electronAPI.onOpenProviders(() => this.openProvidersModal());
        }
    }

    async createStartMenuShortcut() {
        if (!this.isElectron || !window.electronAPI?.createShortcut) {
            this.showStatus('La creación de acceso directo solo está disponible en la app de escritorio', 'error');
            return;
        }
        try {
            const result = await window.electronAPI.createShortcut();
            if (result?.success) this.showStatus(result.message || 'Acceso directo creado', 'success');
            else this.showStatus(result?.message || 'No se pudo crear el acceso directo', 'error');
        } catch (e) {
            this.showStatus('Error al crear acceso directo: ' + e.message, 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});
