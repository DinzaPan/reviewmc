// Sistema de menú de perfil para ReviewMC
class ProfileMenu {
    constructor() {
        this.menuVisible = false;
        this.init();
    }

    init() {
        this.createMenu();
        this.bindEvents();
        this.updateMenuUserInfo();
    }

    // Crear el menú desplegable
    createMenu() {
        const menuHTML = `
            <div id="profile-menu" class="profile-menu">
                <div class="menu-header">
                    <div class="user-info">
                        <div class="user-avatar" id="menu-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-details">
                            <span class="username" id="menu-username">Invitado</span>
                            <span class="user-status">No conectado</span>
                        </div>
                    </div>
                </div>
                <div class="menu-items">
                    <a href="#" class="menu-item" data-action="home">
                        <i class="fas fa-home"></i>
                        <span>Inicio</span>
                    </a>
                    <a href="#" class="menu-item" data-action="credits">
                        <i class="fas fa-heart"></i>
                        <span>Créditos</span>
                    </a>
                    <a href="https://discord.gg/RMfzSyNxjT" target="_blank" class="menu-item" data-action="discord">
                        <i class="fab fa-discord"></i>
                        <span>Discord</span>
                    </a>
                    <div class="menu-divider"></div>
                    <a href="#" class="menu-item" data-action="auth">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Iniciar sesión</span>
                    </a>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    // Vincular eventos
    bindEvents() {
        const profileCircle = document.querySelector('.profile-circle');
        const menu = document.getElementById('profile-menu');

        // Toggle menú al hacer click en el perfil
        if (profileCircle) {
            profileCircle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (menu && !menu.contains(e.target) && profileCircle && !profileCircle.contains(e.target)) {
                this.hideMenu();
            }
        });

        // Manejar acciones del menú
        if (menu) {
            menu.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.menu-item');
                if (menuItem) {
                    e.preventDefault();
                    const action = menuItem.getAttribute('data-action');
                    this.handleMenuAction(action);
                }
            });
        }

        // Actualizar información del usuario cuando cambie el estado de autenticación
        document.addEventListener('authStateChanged', () => {
            this.updateMenuUserInfo();
        });

        // Actualizar también cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.updateMenuUserInfo(), 100);
        });
    }

    // Mostrar/ocultar menú
    toggleMenu() {
        const menu = document.getElementById('profile-menu');
        if (this.menuVisible) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    showMenu() {
        const menu = document.getElementById('profile-menu');
        const profileCircle = document.querySelector('.profile-circle');
        
        if (!menu || !profileCircle) return;

        // Posicionar el menú
        const rect = profileCircle.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        
        menu.classList.add('visible');
        this.menuVisible = true;
    }

    hideMenu() {
        const menu = document.getElementById('profile-menu');
        if (menu) {
            menu.classList.remove('visible');
            this.menuVisible = false;
        }
    }

    // Manejar acciones del menú
    handleMenuAction(action) {
        switch (action) {
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'credits':
                this.showCreditsModal();
                break;
            case 'discord':
                // Ya está configurado para abrir en nueva pestaña
                break;
            case 'auth':
                if (window.discordAuth && window.discordAuth.isAuthenticated()) {
                    window.discordAuth.logout();
                } else {
                    window.discordAuth.login();
                }
                break;
        }
        this.hideMenu();
    }

    // Actualizar información del usuario en el menú
    updateMenuUserInfo() {
        const menuAvatar = document.getElementById('menu-avatar');
        const menuUsername = document.getElementById('menu-username');
        const menuStatus = document.querySelector('.user-status');
        const authItem = document.querySelector('.menu-item[data-action="auth"]');

        if (window.discordAuth && window.discordAuth.isAuthenticated()) {
            const user = window.discordAuth.getCurrentUser();
            
            if (user) {
                // Actualizar avatar
                if (menuAvatar) {
                    if (user.avatar) {
                        const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
                        menuAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="user-avatar-img">`;
                    } else {
                        menuAvatar.innerHTML = '<i class="fas fa-user"></i>';
                    }
                }
                
                // Actualizar información
                if (menuUsername) {
                    menuUsername.textContent = user.username;
                }
                if (menuStatus) {
                    menuStatus.textContent = `#${user.discriminator}`;
                }
                
                // Cambiar a "Cerrar sesión"
                if (authItem) {
                    authItem.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Cerrar sesión</span>';
                }
            }
        } else {
            // Reset a estado invitado
            if (menuAvatar) {
                menuAvatar.innerHTML = '<i class="fas fa-user"></i>';
            }
            if (menuUsername) {
                menuUsername.textContent = 'Invitado';
            }
            if (menuStatus) {
                menuStatus.textContent = 'No conectado';
            }
            
            // Cambiar a "Iniciar sesión"
            if (authItem) {
                authItem.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Iniciar sesión</span>';
            }
        }
    }

    // Mostrar modal de créditos
    showCreditsModal() {
        // Cerrar menú primero
        this.hideMenu();

        const modalHTML = `
            <div id="credits-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Créditos</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="credits-section">
                            <h4>Desarrollado por</h4>
                            <p>ReviewMC Team</p>
                        </div>
                        <div class="credits-section">
                            <h4>Tecnologías utilizadas</h4>
                            <ul>
                                <li>HTML5, CSS3, JavaScript</li>
                                <li>Font Awesome Icons</li>
                                <li>Discord OAuth2</li>
                                <li>JSONBin.io API</li>
                                <li>Vercel Hosting</li>
                            </ul>
                        </div>
                        <div class="credits-section">
                            <h4>Agradecimientos especiales</h4>
                            <p>A nuestra comunidad de Discord y todos los colaboradores que hacen posible este proyecto.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('credits-modal');
        const closeBtn = modal.querySelector('.modal-close');

        // Mostrar modal con animación
        setTimeout(() => modal.classList.add('visible'), 10);

        // Cerrar modal
        const closeModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // Cerrar con ESC
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
}

// Inicializar menú de perfil cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProfileMenu();
});
