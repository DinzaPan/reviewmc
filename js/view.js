// Script para la página de detalles del studio (view.html)

// Función para obtener parámetros de la URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id'))
    };
}

// Función para crear botones de redes sociales
function createSocialLinks(socialLinks) {
    if (!socialLinks) return '';
    
    const socialIcons = {
        discord: 'fab fa-discord',
        whatsapp: 'fab fa-whatsapp',
        tiktok: 'fab fa-tiktok',
        youtube: 'fab fa-youtube',
        twitter: 'fab fa-twitter'
    };
    
    let html = '<div class="social-links">';
    
    for (const [platform, url] of Object.entries(socialLinks)) {
        if (url && socialIcons[platform]) {
            html += `
                <a href="${url}" target="_blank" class="social-link ${platform}">
                    <i class="${socialIcons[platform]}"></i>
                </a>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

// Función para cargar los detalles del studio
async function loadStudioDetail() {
    const container = document.getElementById('studio-detail-container');
    const params = getUrlParams();
    
    if (!container) {
        console.error('No se encontró el contenedor de detalles');
        return;
    }
    
    if (!params.id) {
        container.innerHTML = `
            <div class="error-detail">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h2>Studio no encontrado</h2>
                <p>No se ha especificado un ID de studio válido.</p>
                <a href="index.html" class="back-button" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-left"></i>
                    Volver al Inicio
                </a>
            </div>
        `;
        return;
    }
    
    // Buscar el studio en los datos globales
    const studio = window.studiosData ? window.studiosData.find(s => s.id === params.id) : null;
    const ratings = window.getLocalRatings ? window.getLocalRatings() : {};
    const studioRating = ratings[studio?.id] || { averageRating: 0, reviewCount: 0 };
    
    if (!studio) {
        container.innerHTML = `
            <div class="error-detail">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h2>Studio no encontrado</h2>
                <p>El studio con ID ${params.id} no existe.</p>
                <a href="index.html" class="back-button" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-left"></i>
                    Volver al Inicio
                </a>
            </div>
        `;
        return;
    }
    
    // Obtener reseñas del usuario actual
    const userReviews = window.getUserReviews ? window.getUserReviews() : {};
    const userReview = userReviews[studio.id];
    
    // Crear el HTML de los detalles con el nuevo diseño de fondo
    container.innerHTML = `
        <div class="studio-hero" id="studio-hero">
            <div class="studio-overlay"></div>
            <div class="studio-hero-content">
                <img src="${studio.image}" alt="${studio.name}" class="studio-image-large"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiByeD0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xNDBfMTQwKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzE0MF8xNDAiIHgxPSIwIiB5MT0iMCIgeDI9IjE0MCIgeTI9IjE0MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDZCNkQ0Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='">
                <div class="studio-info-hero">
                    <h1 class="studio-name-large">${studio.name}</h1>
                    <div class="studio-category-large">${studio.category}</div>
                    <div class="rating-section">
                        <i class="fas fa-star rating-icon"></i>
                        <span class="rating-value-large">${studioRating.averageRating.toFixed(1)}</span>
                        <span class="review-count-large">${studioRating.reviewCount} reseñas</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="studio-description-section">
            <h2 class="section-title">Descripción</h2>
            <div class="studio-description">
                ${studio.description || 'No hay descripción disponible.'}
            </div>
            
            <h2 class="section-title">Redes Sociales</h2>
            ${createSocialLinks(studio.socialLinks)}
        </div>
        
        <div class="reviews-section">
            <h2 class="section-title">Reseñas de la Comunidad</h2>
            
            ${!userReview ? `
            <div class="add-review-section">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.4rem;">Añadir tu reseña</h3>
                <div class="review-form">
                    <div class="rating-input" id="rating-input">
                        <i class="far fa-star rating-star" data-rating="1"></i>
                        <i class="far fa-star rating-star" data-rating="2"></i>
                        <i class="far fa-star rating-star" data-rating="3"></i>
                        <i class="far fa-star rating-star" data-rating="4"></i>
                        <i class="far fa-star rating-star" data-rating="5"></i>
                    </div>
                    <textarea class="comment-input" id="comment-input" placeholder="Escribe tu reseña aquí..."></textarea>
                    <button class="submit-review-btn" id="submit-review-btn" disabled>Publicar reseña</button>
                </div>
            </div>
            ` : `
            <div class="user-review-notice">
                <i class="fas fa-info-circle"></i> Ya has publicado una reseña para este estudio.
            </div>
            `}
            
            <div class="reviews-grid" id="reviews-container">
                <div class="loading-detail">
                    <div class="loading-spinner"></div>
                    <p>Cargando reseñas...</p>
                </div>
            </div>
        </div>
    `;

    // Configurar el fondo personalizado si existe
    if (studio.hasCustomBg && studio.customBackground) {
        const studioHero = document.getElementById('studio-hero');
        const backgroundImg = document.createElement('img');
        backgroundImg.src = studio.customBackground;
        backgroundImg.alt = `${studio.name} Background`;
        backgroundImg.className = 'studio-background';
        backgroundImg.onerror = function() {
            // Si falla la imagen de fondo, usar gradiente por defecto
            studioHero.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(245, 158, 11, 0.2))';
        };
        studioHero.appendChild(backgroundImg);
    }
    
    // Cargar reseñas existentes desde JSONBin.io
    await loadReviews(studio.id);
    
    // Configurar eventos para el formulario de reseña si el usuario no ha reseñado
    if (!userReview) {
        setupReviewForm(studio.id);
    }
}

// Función para cargar las reseñas desde JSONBin.io
async function loadReviews(studioId) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;
    
    let reviews = [];
    
    try {
        // Intentar cargar desde JSONBin.io primero
        if (window.loadReviewsFromJsonBin) {
            reviews = await window.loadReviewsFromJsonBin(studioId);
        }
        
        // Si no hay reseñas en JSONBin.io, cargar localmente
        if (reviews.length === 0 && window.getStudioReviews) {
            reviews = window.getStudioReviews(studioId);
        }
    } catch (error) {
        console.error('Error cargando reseñas:', error);
        if (window.getStudioReviews) {
            reviews = window.getStudioReviews(studioId);
        }
    }
    
    // Ordenar reseñas por fecha (más recientes primero)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comment-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No hay reseñas aún. Sé el primero en opinar.</p>
            </div>
        `;
        return;
    }
    
    let reviewsHTML = '';
    
    reviews.forEach(review => {
        const userProfile = window.getUserProfile ? window.getUserProfile() : {};
        const isCurrentUser = review.userId === userProfile.id;
        
        reviewsHTML += `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-author">
                        <img src="${review.avatar}" alt="${review.username}" class="author-avatar" 
                             onerror="this.src='./img/avatar-default.png'">
                        <div class="author-info">
                            <span class="author-name">${review.username}</span>
                            <span class="author-discord">${review.discord}</span>
                        </div>
                    </div>
                    <span class="review-date">${new Date(review.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div class="review-rating">
                    ${window.createStars ? window.createStars(review.rating).outerHTML : ''}
                </div>
                <div class="review-content">${review.comment}</div>
                ${isCurrentUser ? `
                <div class="review-actions">
                    <button class="delete-review-btn" onclick="deleteUserReview(${studioId}, ${review.id})">
                        <i class="fas fa-trash"></i> Eliminar reseña
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHTML;
}

// Función para configurar el formulario de reseña
function setupReviewForm(studioId) {
    const ratingStars = document.querySelectorAll('.rating-star');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('submit-review-btn');
    
    let selectedRating = 0;
    
    // Configurar eventos para las estrellas
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            // Actualizar visualización de estrellas
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
            
            // Habilitar botón si hay calificación y comentario
            updateSubmitButton();
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            ratingStars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    });
    
    // Configurar evento para el campo de comentario
    commentInput.addEventListener('input', updateSubmitButton);
    
    // Configurar evento para el botón de enviar
    submitBtn.addEventListener('click', async function() {
        if (selectedRating === 0 || !commentInput.value.trim()) {
            alert('Por favor, selecciona una calificación y escribe un comentario.');
            return;
        }
        
        const userProfile = window.getUserProfile ? window.getUserProfile() : {};
        
        // Verificar si el usuario está autenticado
        if (!userProfile || userProfile.isDefault) {
            alert('Por favor, inicia sesión con Discord para publicar una reseña.');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publicando...';
        
        try {
            // Agregar la reseña
            await window.addReview(studioId, selectedRating, commentInput.value.trim());
            
            // Mostrar mensaje de éxito
            alert('¡Reseña publicada con éxito!');
            
            // Recargar la página para mostrar la nueva reseña
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            console.error('Error publicando reseña:', error);
            alert('Error al publicar la reseña. Intenta nuevamente.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publicar reseña';
        }
    });
    
    function updateSubmitButton() {
        submitBtn.disabled = selectedRating === 0 || !commentInput.value.trim();
    }
}

// Función para eliminar reseña (global para acceso desde HTML)
function deleteUserReview(studioId, reviewId) {
    if (window.deleteReview) {
        window.deleteReview(studioId, reviewId);
    }
}

// Función para mostrar perfil de usuario en la navbar
function updateNavbarProfile() {
    const userProfile = window.getUserProfile ? window.getUserProfile() : null;
    const profileCircle = document.querySelector('.profile-circle');
    
    if (userProfile && profileCircle) {
        // Limpiar el contenido existente
        profileCircle.innerHTML = '';
        
        // Si el usuario tiene avatar y no es el por defecto, usar la imagen
        if (userProfile.avatar && !userProfile.isDefault) {
            const avatarImg = document.createElement('img');
            avatarImg.src = userProfile.avatar;
            avatarImg.alt = userProfile.username;
            avatarImg.style.width = '100%';
            avatarImg.style.height = '100%';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.objectFit = 'cover';
            avatarImg.onerror = function() {
                // Si falla la imagen, usar ícono por defecto
                profileCircle.innerHTML = '<i class="fas fa-user"></i>';
            };
            profileCircle.appendChild(avatarImg);
        } else {
            // Usar ícono por defecto
            profileCircle.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        // Actualizar tooltip o información del perfil si existe
        const profileElement = document.querySelector('.user-profile');
        if (profileElement) {
            profileElement.setAttribute('title', `${userProfile.username}\n${userProfile.discord}`);
        }
    }
}

// Cargar los detalles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar perfil en la navbar
    updateNavbarProfile();
    
    // Escuchar cambios en la autenticación
    document.addEventListener('authStateChanged', function() {
        updateNavbarProfile();
    });
    
    // Esperar a que studiosData esté disponible
    if (window.studiosData) {
        loadStudioDetail();
    } else {
        // Si studiosData no está disponible inmediatamente, esperar un poco
        setTimeout(() => {
            if (window.studiosData) {
                loadStudioDetail();
            } else {
                // Mostrar error si después de 2 segundos no hay datos
                const container = document.getElementById('studio-detail-container');
                if (container) {
                    container.innerHTML = `
                        <div class="error-detail">
                            <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h2>Error al cargar los datos</h2>
                            <p>No se pudieron cargar los datos del studio. Intenta recargar la página.</p>
                            <a href="index.html" class="back-button" style="margin-top: 1rem;">
                                <i class="fas fa-arrow-left"></i>
                                Volver al Inicio
                            </a>
                        </div>
                    `;
                }
            }
        }, 2000);
    }
});

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

// Exportar funciones para uso global
window.loadStudioDetail = loadStudioDetail;
window.loadReviews = loadReviews;
window.deleteUserReview = deleteUserReview;
window.updateNavbarProfile = updateNavbarProfile;
