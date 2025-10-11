// Archivo JavaScript principal mejorado
document.addEventListener('DOMContentLoaded', function() {
    console.log('ReviewMC website loaded successfully');
    
    // Inicializar efectos de partículas
    initParticles();
    
    // Efectos interactivos para el perfil de usuario - Animación corregida
    const profileCircle = document.querySelector('.profile-circle');
    if (profileCircle) {
        profileCircle.addEventListener('click', function() {
            // Animación suave como antes
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 200);
            
            console.log('Perfil de usuario clickeado');
            // Aquí puedes agregar más funcionalidad
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
`;
document.head.appendChild(style);