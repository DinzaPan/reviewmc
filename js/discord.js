// Sistema de autenticación con Discord para ReviewMC
class DiscordAuth {
    constructor() {
        this.clientId = '1397262934601896129';
        this.redirectUri = window.location.origin + '/callback.html';
        this.scope = 'identify email';
        this.token = null;
        this.user = null;
        
        this.init();
    }

    init() {
        // Verificar si hay un token guardado
        const savedToken = localStorage.getItem('discord_token');
        const savedUser = localStorage.getItem('discord_user');
        
        if (savedToken && savedUser) {
            this.token = savedToken;
            this.user = JSON.parse(savedUser);
            this.updateUI();
            
            // Actualizar perfil en el sistema de reseñas
            this.updateReviewSystemProfile();
        }
        
        // Verificar si estamos en la página de callback
        if (window.location.pathname.includes('callback.html')) {
            this.handleCallbackPage();
        }
    }

    // Actualizar perfil en el sistema de reseñas
    async updateReviewSystemProfile() {
        if (this.user && this.token && window.updateProfileFromDiscord) {
            try {
                await window.updateProfileFromDiscord(this.user);
                console.log('Perfil actualizado en el sistema de reseñas');
            } catch (error) {
                console.error('Error actualizando perfil:', error);
            }
        }
    }

    // Manejar la página de callback
    handleCallbackPage() {
        console.log('En página de callback de Discord');
    }

    // Iniciar sesión con Discord
    login() {
        const state = this.generateState();
        localStorage.setItem('discord_auth_state', state);
        
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=token&scope=${encodeURIComponent(this.scope)}&state=${state}`;
        window.location.href = authUrl;
    }

    // Generar estado para prevenir CSRF
    generateState() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Obtener perfil del usuario de Discord
    async fetchUserProfile() {
        try {
            if (!this.token) {
                throw new Error('No hay token disponible');
            }

            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                localStorage.setItem('discord_user', JSON.stringify(this.user));
                this.updateUI();
                this.showNotification(`¡Bienvenido, ${this.user.username}!`, 'success');
                
                // Actualizar perfil en el sistema de reseñas
                await this.updateReviewSystemProfile();
                
                // Disparar evento para que otros componentes se actualicen
                document.dispatchEvent(new CustomEvent('authStateChanged'));
            } else {
                throw new Error('Error al obtener perfil');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            this.showNotification('Error al cargar el perfil', 'error');
            this.logout();
        }
    }

    // Cerrar sesión
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('discord_token');
        localStorage.removeItem('discord_user');
        this.updateUI();
        this.showNotification('Sesión cerrada correctamente', 'info');
        
        // Restablecer perfil por defecto en el sistema de reseñas
        if (window.getUserProfile && window.saveUserProfile) {
            const defaultProfile = {
                id: 'user_' + Date.now(),
                username: 'Usuario',
                discord: 'usuario#0000',
                avatar: './img/avatar-default.png',
                isDefault: true
            };
            window.saveUserProfile(defaultProfile);
        }
        
        // Disparar evento para que otros componentes se actualicen
        document.dispatchEvent(new CustomEvent('authStateChanged'));
    }

    // Actualizar la interfaz de usuario
    updateUI() {
        const profileCircle = document.querySelector('.profile-circle');
        
        if (!profileCircle) return;

        if (this.user && this.token) {
            // Usuario logueado - mostrar avatar
            const avatarUrl = this.user.avatar 
                ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png?size=64`
                : `https://cdn.discordapp.com/embed/avatars/${this.user.discriminator % 5}.png`;
            
            profileCircle.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="profile-avatar">`;
        } else {
            // Usuario no logueado - mostrar icono por defecto
            profileCircle.innerHTML = '<i class="fas fa-user"></i>';
        }
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Cerrar notificación
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Obtener información del usuario actual
    getCurrentUser() {
        return this.user;
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!(this.user && this.token);
    }

    // Verificar y cargar usuario desde token existente
    async loadUserFromToken() {
        const savedToken = localStorage.getItem('discord_token');
        const savedUser = localStorage.getItem('discord_user');
        
        if (savedToken) {
            this.token = savedToken;
            
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                this.updateUI();
                // Actualizar perfil en el sistema de reseñas
                await this.updateReviewSystemProfile();
            } else {
                // Si hay token pero no usuario, obtener el perfil
                await this.fetchUserProfile();
            }
        }
    }
}

// Inicializar autenticación con Discord
const discordAuth = new DiscordAuth();

// Cargar usuario si existe token al iniciar
document.addEventListener('DOMContentLoaded', function() {
    if (window.discordAuth) {
        window.discordAuth.loadUserFromToken();
    }
});

// Exportar para uso global
window.discordAuth = discordAuth;
