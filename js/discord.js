// Sistema de autenticación con Discord OAuth2 - Versión Funcional
class DiscordAuth {
    constructor() {
        this.config = {
            clientId: '1397262934601896129', // Tu Client ID de Discord
            redirectUri: window.location.origin, // Misma página para el callback
            scope: 'identify',
            responseType: 'token'
        };
        
        this.userData = null;
        this.init();
    }

    init() {
        console.log('Inicializando Discord Auth...');
        this.loadUserData();
        this.setupEventListeners();
        this.handleAuthCallback();
        this.updateUI();
    }

    // Manejar el callback de autenticación
    handleAuthCallback() {
        console.log('Verificando callback de auth...');
        const hash = window.location.hash;
        
        if (hash && hash.includes('access_token')) {
            console.log('Token detectado en URL:', hash.substring(0, 50) + '...');
            this.processTokenFromHash(hash);
        }
    }

    // Procesar token del hash de la URL
    processTokenFromHash(hash) {
        try {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const tokenType = params.get('token_type');
            const expiresIn = params.get('expires_in');

            if (accessToken) {
                console.log('Token obtenido, obteniendo datos del usuario...');
                this.showLoading('Iniciando sesión...');
                this.getUserData(accessToken);
                
                // Limpiar la URL - IMPORTANTE
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error('Error procesando token:', error);
            this.showMessage('Error en la autenticación', 'error');
        }
    }

    // Obtener datos del usuario desde Discord API
    async getUserData(accessToken) {
        try {
            console.log('Haciendo request a Discord API...');
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Respuesta de Discord:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const userData = await response.json();
            console.log('Datos del usuario:', userData);
            
            userData.accessToken = accessToken;
            userData.connectedAt = new Date().toISOString();
            
            this.userData = userData;
            this.saveUserData();
            this.updateUI();
            this.hideLoading();
            this.showMessage(`¡Bienvenido ${userData.username}!`, 'success');
            
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            this.showMessage('Error al cargar datos del perfil: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    // Iniciar flujo OAuth2
    connectDiscord() {
        console.log('Iniciando flujo OAuth2...');
        
        const state = this.generateState();
        localStorage.setItem('oauth_state', state);
        
        const authParams = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: this.config.responseType,
            scope: this.config.scope,
            state: state
        });

        const authUrl = `https://discord.com/api/oauth2/authorize?${authParams.toString()}`;
        console.log('Redirigiendo a:', authUrl);
        
        window.location.href = authUrl;
    }

    // Generar estado para seguridad
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Cargar datos del usuario desde localStorage
    loadUserData() {
        try {
            const saved = localStorage.getItem('discord_user_data');
            if (saved) {
                this.userData = JSON.parse(saved);
                console.log('Usuario cargado desde localStorage:', this.userData.username);
            }
        } catch (error) {
            console.error('Error cargando datos del usuario:', error);
            localStorage.removeItem('discord_user_data');
        }
    }

    // Guardar datos del usuario
    saveUserData() {
        if (this.userData) {
            localStorage.setItem('discord_user_data', JSON.stringify(this.userData));
            console.log('Usuario guardado en localStorage');
        } else {
            localStorage.removeItem('discord_user_data');
            console.log('Usuario eliminado de localStorage');
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Botón de Discord en el menú
        const discordBtn = document.getElementById('menu-discord');
        if (discordBtn) {
            discordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Botón Discord clickeado, usuario autenticado:', !!this.userData);
                
                if (this.userData) {
                    // Si ya está conectado, abrir Discord
                    window.open('https://discord.com', '_blank');
                } else {
                    // Si no está conectado, iniciar OAuth2
                    this.connectDiscord();
                }
            });
        } else {
            console.error('No se encontró el botón menu-discord');
        }

        // Botón de logout
        const logoutBtn = document.getElementById('menu-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Cerrando sesión...');
                this.logout();
            });
        } else {
            console.error('No se encontró el botón menu-logout');
        }

        // Verificar que existan los elementos del DOM
        this.checkDOMElements();
    }

    // Verificar elementos del DOM
    checkDOMElements() {
        const requiredElements = [
            'menu-discord',
            'menu-logout', 
            'profile-image',
            'profile-icon',
            'sidebar-profile-image',
            'sidebar-profile-icon',
            'username-display',
            'user-discord-id',
            'discord-text'
        ];

        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Elemento no encontrado: #${id}`);
            }
        });
    }

    // Cerrar sesión
    logout() {
        console.log('Ejecutando logout...');
        this.userData = null;
        this.saveUserData();
        this.updateUI();
        this.closeSidebar();
        this.showMessage('Sesión cerrada correctamente', 'info');
    }

    // Actualizar la interfaz de usuario
    updateUI() {
        console.log('Actualizando UI...');
        
        const elements = {
            profileImage: document.getElementById('profile-image'),
            profileIcon: document.getElementById('profile-icon'),
            sidebarProfileImage: document.getElementById('sidebar-profile-image'),
            sidebarProfileIcon: document.getElementById('sidebar-profile-icon'),
            usernameDisplay: document.getElementById('username-display'),
            userDiscordId: document.getElementById('user-discord-id'),
            discordText: document.getElementById('discord-text'),
            logoutBtn: document.getElementById('menu-logout')
        };

        if (this.userData) {
            console.log('Mostrando usuario autenticado:', this.userData.username);
            
            // Usuario conectado - generar avatar URL
            const avatarUrl = this.userData.avatar ? 
                `https://cdn.discordapp.com/avatars/${this.userData.id}/${this.userData.avatar}.png?size=128` :
                `https://cdn.discordapp.com/embed/avatars/${(parseInt(this.userData.discriminator) % 5) || 0}.png`;

            // Actualizar imágenes de perfil
            if (elements.profileImage) {
                elements.profileImage.src = avatarUrl;
                elements.profileImage.style.display = 'block';
            }
            if (elements.profileIcon) {
                elements.profileIcon.style.display = 'none';
            }
            if (elements.sidebarProfileImage) {
                elements.sidebarProfileImage.src = avatarUrl;
                elements.sidebarProfileImage.style.display = 'block';
            }
            if (elements.sidebarProfileIcon) {
                elements.sidebarProfileIcon.style.display = 'none';
            }

            // Actualizar texto
            if (elements.usernameDisplay) {
                elements.usernameDisplay.textContent = this.userData.global_name || this.userData.username;
            }
            if (elements.userDiscordId) {
                elements.userDiscordId.textContent = `@${this.userData.username}`;
            }
            if (elements.discordText) {
                elements.discordText.textContent = 'Abrir Discord';
            }
            if (elements.logoutBtn) {
                elements.logoutBtn.style.display = 'flex';
            }

        } else {
            console.log('Mostrando usuario no autenticado');
            
            // Usuario no conectado
            if (elements.profileImage) elements.profileImage.style.display = 'none';
            if (elements.profileIcon) elements.profileIcon.style.display = 'block';
            if (elements.sidebarProfileImage) elements.sidebarProfileImage.style.display = 'none';
            if (elements.sidebarProfileIcon) elements.sidebarProfileIcon.style.display = 'block';
            if (elements.usernameDisplay) elements.usernameDisplay.textContent = 'Usuario';
            if (elements.userDiscordId) elements.userDiscordId.textContent = '';
            if (elements.discordText) elements.discordText.textContent = 'Conectar con Discord';
            if (elements.logoutBtn) elements.logoutBtn.style.display = 'none';
        }
    }

    // Mostrar loading
    showLoading(message) {
        console.log('Mostrando loading:', message);
        let loadingOverlay = document.getElementById('loading-overlay');
        
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="spinner"></div>
                <div id="loading-text">${message}</div>
            `;
            document.body.appendChild(loadingOverlay);
        }
        
        document.getElementById('loading-text').textContent = message;
        loadingOverlay.style.display = 'flex';
    }

    // Ocultar loading
    hideLoading() {
        console.log('Ocultando loading');
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Mostrar mensaje
    showMessage(message, type = 'info') {
        console.log(`Mostrando mensaje [${type}]:`, message);
        
        // Remover notificaciones existentes
        document.querySelectorAll('.global-notification').forEach(notification => {
            notification.remove();
        });

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };

        const notification = document.createElement('div');
        notification.className = 'global-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            font-family: inherit;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Cerrar sidebar
    closeSidebar() {
        const sidebar = document.getElementById('profile-sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }

    // Obtener datos del usuario
    getUserData() {
        return this.userData;
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return this.userData !== null;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando Discord Auth...');
    window.discordAuth = new DiscordAuth();
});

// Funciones globales
function openProfileSidebar() {
    const sidebar = document.getElementById('profile-sidebar');
    if (sidebar) {
        sidebar.classList.add('active');
    }
}

function closeProfileSidebar() {
    const sidebar = document.getElementById('profile-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

// Debug: Exponer funciones globalmente
window.DiscordAuth = DiscordAuth;
window.openProfileSidebar = openProfileSidebar;
window.closeProfileSidebar = closeProfileSidebar;

console.log('Discord Auth cargado correctamente');
