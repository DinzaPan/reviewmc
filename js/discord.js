// Sistema de autenticación con Discord OAuth2 para Vercel (sin backend)
class DiscordAuth {
    constructor() {
        this.config = {
            clientId: '1397262934601896129', // Reemplaza con tu Client ID real
            redirectUri: window.location.origin, // Usamos la misma página
            scope: 'identify',
            responseType: 'token' // Flujo implícito para frontend
        };
        
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.updateUI();
        this.setupEventListeners();
        
        // Verificar si hay token en la URL (callback del flujo implícito)
        this.handleTokenCallback();
    }

    // Manejar el callback del flujo implícito
    handleTokenCallback() {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            this.showLoading('Iniciando sesión...');
            
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const tokenType = params.get('token_type');
            const expiresIn = params.get('expires_in');
            
            if (accessToken) {
                this.getUserData(accessToken);
                // Limpiar URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }

    // Obtener datos del usuario desde Discord API
    async getUserData(accessToken) {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }
            
            const userData = await response.json();
            userData.accessToken = accessToken;
            userData.connectedAt = new Date().toISOString();
            
            this.userData = userData;
            this.saveUserData();
            this.updateUI();
            this.hideLoading();
            this.showMessage(`¡Bienvenido ${userData.username}!`, 'success');
            
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            this.showMessage('Error al cargar datos del perfil', 'error');
            this.hideLoading();
        }
    }

    // Iniciar flujo OAuth2 implícito
    connectDiscord() {
        const state = this.generateState();
        localStorage.setItem('oauth_state', state);
        
        const authUrl = new URL('https://discord.com/api/oauth2/authorize');
        authUrl.searchParams.set('client_id', this.config.clientId);
        authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.set('response_type', this.config.responseType);
        authUrl.searchParams.set('scope', this.config.scope);
        authUrl.searchParams.set('state', state);
        
        window.location.href = authUrl.toString();
    }

    // Generar estado para seguridad OAuth2
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Cargar datos del usuario desde localStorage
    loadUserData() {
        const saved = localStorage.getItem('discord_user_data');
        if (saved) {
            try {
                const userData = JSON.parse(saved);
                // Verificar si el token podría estar expirado (opcional)
                // En producción podrías verificar la fecha de expiración
                this.userData = userData;
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('discord_user_data');
            }
        }
    }

    // Guardar datos del usuario en localStorage
    saveUserData() {
        if (this.userData) {
            localStorage.setItem('discord_user_data', JSON.stringify(this.userData));
        } else {
            localStorage.removeItem('discord_user_data');
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón de Discord en el menú
        const discordBtn = document.getElementById('menu-discord');
        if (discordBtn) {
            discordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.userData) {
                    // Si ya está conectado, abrir Discord
                    window.open('https://discord.com', '_blank');
                } else {
                    // Si no está conectado, iniciar OAuth2
                    this.connectDiscord();
                }
            });
        }

        // Botón de logout
        const logoutBtn = document.getElementById('menu-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Cerrar sesión
    logout() {
        this.userData = null;
        this.saveUserData();
        this.updateUI();
        this.closeSidebar();
        this.showMessage('Sesión cerrada correctamente', 'info');
    }

    // Actualizar la interfaz de usuario
    updateUI() {
        const profileImage = document.getElementById('profile-image');
        const profileIcon = document.getElementById('profile-icon');
        const sidebarProfileImage = document.getElementById('sidebar-profile-image');
        const sidebarProfileIcon = document.getElementById('sidebar-profile-icon');
        const usernameDisplay = document.getElementById('username-display');
        const userDiscordId = document.getElementById('user-discord-id');
        const discordText = document.getElementById('discord-text');
        const logoutBtn = document.getElementById('menu-logout');

        if (this.userData) {
            // Usuario conectado
            const avatarUrl = this.userData.avatar ? 
                `https://cdn.discordapp.com/avatars/${this.userData.id}/${this.userData.avatar}.png?size=128` :
                `https://cdn.discordapp.com/embed/avatars/${(this.userData.discriminator % 5) || 0}.png`;
            
            if (profileImage) {
                profileImage.src = avatarUrl;
                profileImage.style.display = 'block';
                profileIcon.style.display = 'none';
            }

            if (sidebarProfileImage) {
                sidebarProfileImage.src = avatarUrl;
                sidebarProfileImage.style.display = 'block';
                sidebarProfileIcon.style.display = 'none';
            }

            if (usernameDisplay) {
                usernameDisplay.textContent = this.userData.global_name || this.userData.username;
            }

            if (userDiscordId) {
                userDiscordId.textContent = `@${this.userData.username}`;
            }

            if (discordText) {
                discordText.textContent = 'Abrir Discord';
            }

            if (logoutBtn) {
                logoutBtn.style.display = 'flex';
            }
        } else {
            // Usuario no conectado
            if (profileImage) {
                profileImage.style.display = 'none';
                profileIcon.style.display = 'block';
            }

            if (sidebarProfileImage) {
                sidebarProfileImage.style.display = 'none';
                sidebarProfileIcon.style.display = 'block';
            }

            if (usernameDisplay) {
                usernameDisplay.textContent = 'Usuario';
            }

            if (userDiscordId) {
                userDiscordId.textContent = '';
            }

            if (discordText) {
                discordText.textContent = 'Conectar con Discord';
            }

            if (logoutBtn) {
                logoutBtn.style.display = 'none';
            }
        }
    }

    // Mostrar carga
    showLoading(message) {
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-size: 1.2rem;
            `;
            
            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 50px;
                height: 50px;
                border: 3px solid rgba(6, 182, 212, 0.3);
                border-top: 3px solid #06b6d4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            `;
            
            const text = document.createElement('div');
            text.id = 'loading-text';
            
            loadingOverlay.appendChild(spinner);
            loadingOverlay.appendChild(text);
            document.body.appendChild(loadingOverlay);
        }
        
        document.getElementById('loading-text').textContent = message;
        loadingOverlay.style.display = 'flex';
    }

    // Ocultar carga
    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Mostrar mensaje
    showMessage(message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        
        const notification = document.createElement('div');
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
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
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

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.userData !== null;
    }
}

// Inicializar sistema de Discord cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.discordAuth = new DiscordAuth();
});

// Funciones globales para manejar el sidebar
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

// Cerrar sidebar al hacer clic fuera
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('profile-sidebar');
    const profileButton = document.getElementById('profile-button');
    
    if (sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        profileButton && !profileButton.contains(e.target)) {
        closeProfileSidebar();
    }
});

// Cerrar con Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProfileSidebar();
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
