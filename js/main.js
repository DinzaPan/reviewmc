// Archivo JavaScript principal mejorado con sistema de perfil
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReviewMC website loaded successfully');
    
    // Inicializar efectos de partículas
    initParticles();
    
    // Configurar event listeners del sidebar
    setupSidebarEvents();
    
    // Efectos interactivos para el perfil de usuario
    const profileCircle = document.querySelector('.profile-circle');
    if (profileCircle) {
        profileCircle.addEventListener('click', function(e) {
            e.stopPropagation();
            openProfileSidebar();
            
            // Animación suave
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 200);
        });
        
        // Restaurar animación hover original
        profileCircle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        profileCircle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Efectos hover mejorados para las tarjetas
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.studio-card');
        if (card) {
            const image = card.querySelector('.studio-image');
            const stars = card.querySelectorAll('.star');
            
            if (image) {
                image.style.transform = 'scale(1.05) rotate(2deg)';
            }
            
            // Animación secuencial de estrellas (solo estrellas de visualización, no interactivas)
            const displayStars = card.querySelectorAll('.stars-interactive .star');
            displayStars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        star.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.studio-card');
        if (card) {
            const image = card.querySelector('.studio-image');
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    });
    
    // Sincronizar con JSONBin.io periódicamente (cada 5 minutos)
    setInterval(async () => {
        if (typeof syncWithJsonBin === 'function') {
            await syncWithJsonBin();
            console.log('Reseñas sincronizadas con JSONBin.io');
        }
    }, 5 * 60 * 1000); // 5 minutos
    
    // Sincronizar también cuando la página gana foco
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && typeof syncWithJsonBin === 'function') {
            setTimeout(() => {
                syncWithJsonBin();
            }, 1000);
        }
    });
});

// Configurar eventos del sidebar
function setupSidebarEvents() {
    // Cerrar sidebar al hacer clic en el overlay
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeProfileSidebar);
    }
    
    // Cerrar sidebar con el botón de cerrar
    const closeBtn = document.getElementById('sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProfileSidebar);
    }
    
    // Cerrar sidebar al presionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProfileSidebar();
            
            // También cerrar modales si están abiertos
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Configurar eventos para los items del menú
    setupMenuEvents();
}

// Configurar eventos del menú
function setupMenuEvents() {
    // Inicio - Cerrar sidebar
    const menuHome = document.getElementById('menu-home');
    if (menuHome) {
        menuHome.addEventListener('click', function(e) {
            e.preventDefault();
            closeProfileSidebar();
        });
    }
    
    // Créditos - Mostrar modal de créditos
    const menuCredits = document.getElementById('menu-credits');
    if (menuCredits) {
        menuCredits.addEventListener('click', function(e) {
            e.preventDefault();
            showCreditsModal();
        });
    }
    
    // Discord - Ya manejado en discord.js
    const menuDiscord = document.getElementById('menu-discord');
    if (menuDiscord) {
        menuDiscord.addEventListener('click', function(e) {
            e.preventDefault();
            // La funcionalidad está en discord.js
        });
    }
    
    // Cómo Unirte - Mostrar modal de unirse
    const menuJoin = document.getElementById('menu-join');
    if (menuJoin) {
        menuJoin.addEventListener('click', function(e) {
            e.preventDefault();
            showJoinModal();
        });
    }
    
    // Logout - Ya manejado en discord.js
    const menuLogout = document.getElementById('menu-logout');
    if (menuLogout) {
        menuLogout.addEventListener('click', function(e) {
            e.preventDefault();
            // La funcionalidad está en discord.js
        });
    }
    
    // Configurar cierre de modales
    setupModalClosures();
}

// Configurar cierre de modales
function setupModalClosures() {
    // Cerrar modal de créditos
    const creditsClose = document.getElementById('credits-close');
    if (creditsClose) {
        creditsClose.addEventListener('click', function() {
            closeModal('credits-modal');
        });
    }
    
    // Cerrar modal de unirse
    const joinClose = document.getElementById('join-close');
    if (joinClose) {
        joinClose.addEventListener('click', function() {
            closeModal('join-modal');
        });
    }
    
    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });
    });
}

// Mostrar modal de créditos
function showCreditsModal() {
    closeProfileSidebar();
    setTimeout(() => {
        const modal = document.getElementById('credits-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }, 300);
}

// Mostrar modal de cómo unirse
function showJoinModal() {
    closeProfileSidebar();
    setTimeout(() => {
        const modal = document.getElementById('join-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }, 300);
}

// Cerrar modal específico
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Función para inicializar efectos de partículas
function initParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Crear partículas dinámicas adicionales
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(245, 158, 11, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.zIndex = '1';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `floatParticle ${Math.random() * 20 + 10}s infinite linear`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(particle);
    }
}

// Añadir keyframes para partículas dinámicas
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Estilos adicionales para mejoras visuales */
    .studio-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .profile-circle {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Mejoras de accesibilidad para focus */
    .menu-item:focus,
    .sidebar-close:focus,
    .modal-close:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
    
    /* Loading overlay styles */
    #loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 1.2rem;
    }
    
    #loading-overlay .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(6, 182, 212, 0.3);
        border-top: 3px solid #06b6d4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    /* Mejoras de rendimiento para animaciones */
    @media (prefers-reduced-motion: reduce) {
        .studio-card,
        .profile-circle,
        .studio-image,
        .star {
            transition: none !important;
            animation: none !important;
        }
        
        #loading-overlay .spinner {
            animation: none !important;
        }
    }
    
    /* Global notification styles */
    .global-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        font-family: inherit;
    }
`;
document.head.appendChild(style);

// Funciones globales para manejar el sidebar
function openProfileSidebar() {
    const sidebar = document.getElementById('profile-sidebar');
    if (sidebar) {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

function closeProfileSidebar() {
    const sidebar = document.getElementById('profile-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
}

// Mejora: Cerrar sidebar al hacer clic fuera
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('profile-sidebar');
    const profileButton = document.getElementById('profile-button');
    
    if (sidebar && sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        profileButton && !profileButton.contains(e.target)) {
        closeProfileSidebar();
    }
});

// Mejora: Manejar redimensionamiento de ventana
window.addEventListener('resize', function() {
    // Cerrar sidebar en dispositivos móviles al redimensionar
    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('profile-sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            closeProfileSidebar();
        }
    }
});

// Mejora: Prevenir múltiples clics rápidos
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a funciones críticas
const debouncedCloseSidebar = debounce(closeProfileSidebar, 100);
const debouncedOpenSidebar = debounce(openProfileSidebar, 100);

// Mejora: Manejar estado de carga mejorado
function showGlobalLoading(message = 'Cargando...') {
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        const text = document.createElement('div');
        text.id = 'loading-text';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(text);
        document.body.appendChild(loadingOverlay);
    }
    
    document.getElementById('loading-text').textContent = message;
    loadingOverlay.style.display = 'flex';
}

function hideGlobalLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Mejora: Sistema de notificaciones mejorado
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
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
    notification.className = 'global-notification';
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Exportar funciones globalmente
window.openProfileSidebar = openProfileSidebar;
window.closeProfileSidebar = closeProfileSidebar;
window.showNotification = showNotification;
window.showGlobalLoading = showGlobalLoading;
window.hideGlobalLoading = hideGlobalLoading;
window.showCreditsModal = showCreditsModal;
window.showJoinModal = showJoinModal;
window.closeModal = closeModal;

// Inicialización adicional cuando todo esté cargado
window.addEventListener('load', function() {
    console.log('ReviewMC completamente cargado');
    
    // Verificar si hay usuario autenticado y actualizar UI
    if (window.discordAuth && typeof window.discordAuth.updateUI === 'function') {
        setTimeout(() => {
            window.discordAuth.updateUI();
        }, 100);
    }
    
    // Mejora: Añadir clase loaded para transiciones suaves después de la carga
    document.body.classList.add('loaded');
});

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('Error no capturado:', e.error);
    showNotification('Ha ocurrido un error inesperado', 'error');
});

// Mejora: Prevenir comportamientos no deseados en touch devices
document.addEventListener('touchstart', function(e) {
    // Prevenir zoom en elementos interactivos
    if (e.target.classList.contains('menu-item') || 
        e.target.classList.contains('profile-circle') ||
        e.target.closest('.studio-card')) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Mejora: Manejar la visibilidad de la página para optimizar recursos
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Página no visible, podrías pausar animaciones intensivas
        console.log('Página en segundo plano');
    } else {
        // Página visible nuevamente
        console.log('Página en primer plano');
    }
});

// Mejora: Cargar recursos críticos primero
function loadCriticalResources() {
    // Preload de fuentes o recursos críticos si es necesario
    const criticalResources = [
        // Añade URLs de recursos críticos aquí si es necesario
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image'; // o 'font', 'script', etc.
        document.head.appendChild(link);
    });
}

// Inicializar carga de recursos críticos
loadCriticalResources();
