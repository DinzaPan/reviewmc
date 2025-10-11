// Sistema de autenticación con Discord OAuth2
class DiscordAuth {
    constructor() {
        this.config = {
            clientId: '1397262934601896129', // Reemplaza con tu Client ID
            clientSecret: 'x92cubHXQVcOjyEhdDtLaZDbybKq9pBU', // Reemplaza con tu Client Secret
            redirectUri: window.location.origin + '/auth/callback.html', // Necesitarás crear esta página
            scope: 'identify email',
            apiUrl: 'https://discord.com/api/v10'
        };
        
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.updateUI();
        this.setupEventListeners();
        
        // Verificar si hay un código de autorización en la URL (callback)
        this.handleCallback();
    }

    // Manejar el callback de OAuth2
    handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
            this.showMessage('Error de autenticación: ' + error, 'error');
            this.cleanUrl();
            return;
        }
        
        if (code) {
            this.exchangeCodeForToken(code);
        }
    }

    // Intercambiar código por token de acceso
    async exchangeCodeForToken(code) {
        try {
            this.showLoading('Verificando autenticación...');
            
            const response = await fetch('/api/discord/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    redirectUri: this.config.redirectUri
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener token');
            }
            
            const data = await response.json();
            await this.getUserData(data.access_token);
            this.cleanUrl();
            
        } catch (error) {
            console.error('Error en autenticación:', error);
            this.showMessage('Error en la autenticación', 'error');
            this.hideLoading();
        }
    }

    // Obtener datos del usuario desde Discord API
    async getUserData(accessToken) {
        try {
            const response = await fetch(this.config.apiUrl + '/users/@me', {
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

    // Iniciar flujo OAuth2
    connectDiscord() {
        const state = this.generateState();
        localStorage.setItem('oauth_state', state);
        
        const authUrl = new URL('https://discord.com/api/oauth2/authorize');
        authUrl.searchParams.set('client_id', this.config.clientId);
        authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', this.config.scope);
        authUrl.searchParams.set('state', state);
        
        window.location.href = authUrl.toString();
    }

    // Generar estado para seguridad OAuth2
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Limpiar URL después del callback
    cleanUrl() {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    // Cargar datos del usuario desde localStorage
    loadUserData() {
        const saved = localStorage.getItem('discord_user_data');
        if (saved) {
            const userData = JSON.parse(saved);
            
            // Verificar si el token sigue siendo válido (opcional)
            // En producción, podrías verificar la expiración del token
            this.userData = userData;
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

        // Botones de menú
        document.getElementById('menu-home')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeSidebar();
        });

        document.getElementById('menu-credits')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCredits();
        });

        document.getElementById('menu-join')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showJoinInfo();
        });

        // Cerrar modales
        document.getElementById('credits-close')?.addEventListener('click', () => {
            this.closeModal('credits-modal');
        });

        document.getElementById('join-close')?.addEventListener('click', () => {
            this.closeModal('join-modal');
        });

        // Cerrar modales al hacer clic fuera
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const modal = e.target.closest('.modal');
                    if (modal) {
                        modal.classList.remove('active');
                    }
                }
            });
        });
    }

    // Cerrar sesión
    logout() {
        // Opcional: Revocar el token en Discord
        if (this.userData?.accessToken) {
            this.revokeToken(this.userData.accessToken).catch(console.error);
        }
        
        this.userData = null;
        this.saveUserData();
        this.updateUI();
        this.closeSidebar();
        this.showMessage('Sesión cerrada correctamente', 'info');
    }

    // Revocar token en Discord (opcional)
    async revokeToken(accessToken) {
        try {
            const formData = new URLSearchParams();
            formData.append('token', accessToken);
            formData.append('client_id', this.config.clientId);
            formData.append('client_secret', this.config.clientSecret);
            
            await fetch('https://discord.com/api/oauth2/token/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
        } catch (error) {
            console.error('Error revocando token:', error);
        }
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
                `https://cdn.discordapp.com/embed/avatars/${this.userData.discriminator % 5}.png`;
            
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

    // Mostrar créditos
    showCredits() {
        this.closeSidebar();
        setTimeout(() => {
            const modal = document.getElementById('credits-modal');
            if (modal) {
                modal.classList.add('active');
            }
        }, 300);
    }

    // Mostrar información de cómo unirse
    showJoinInfo() {
        this.closeSidebar();
        setTimeout(() => {
            const modal = document.getElementById('join-modal');
            if (modal) {
                modal.classList.add('active');
            }
        }, 300);
    }

    // Cerrar modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Mostrar carga
    showLoading(message) {
        // Crear overlay de carga
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
            
            // Añadir keyframes para el spinner
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
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
        
        // Crear notificación
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
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 4 segundos
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
        !profileButton.contains(e.target)) {
        closeProfileSidebar();
    }
});

// Cerrar con Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProfileSidebar();
        
        // También cerrar modales
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Exportar para uso global
window.DiscordAuth = DiscordAuth;
window.openProfileSidebar = openProfileSidebar;
window.closeProfileSidebar = closeProfileSidebar;
