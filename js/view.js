// Script para la página de detalles del studio (view.html)

// Función para obtener parámetros de la URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id'))
    };
}

// Función para crear estrellas
function createStars(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const hasAlmostFull = rating % 1 > 0.7;
    
    for (let i = 0; i < fullStars + (hasAlmostFull ? 1 : 0); i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star filled';
        starsContainer.appendChild(star);
    }
    
    if (hasHalfStar && fullStars + (hasAlmostFull ? 1 : 0) < 5) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt half';
        starsContainer.appendChild(halfStar);
    }
    
    const totalStars = fullStars + (hasHalfStar ? 1 : 0) + (hasAlmostFull ? 1 : 0);
    const emptyStars = 5 - totalStars;
    
    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star star';
        starsContainer.appendChild(star);
    }
    
    return starsContainer;
}

// Función para cargar los detalles del studio
function loadStudioDetail() {
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
    const ratings = getLocalRatings();
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
    
    // Crear el HTML de los detalles
    container.innerHTML = `
        <div class="studio-detail-card">
            <div class="studio-header-detail">
                <img src="${studio.image}" alt="${studio.name}" class="studio-image-large"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xMjBfMTIwKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzEyMF8xMjAiIHgxPSIwIiB5MT0iMCIgeDI9IjEyMCIgeTI9IjEyMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDZCNkQ0Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='">
                <div class="studio-info-detail">
                    <h1 class="studio-name-large">${studio.name}</h1>
                    <div class="studio-category-large">${studio.category}</div>
                    <div class="rating-section">
                        <span class="rating-value-large">${studioRating.averageRating.toFixed(1)}</span>
                        <div class="stars-large"></div>
                        <span class="review-count-large">${studioRating.reviewCount} reseñas</span>
                    </div>
                </div>
            </div>
            
            <div class="studio-description">
                ${studio.description || 'No hay descripción disponible.'}
            </div>
            
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Fundado</div>
                    <div class="detail-value">${studio.details?.founded || 'No especificado'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Ubicación</div>
                    <div class="detail-value">${studio.details?.location || 'No especificada'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Especialidades</div>
                    <div class="detail-value">${studio.details?.specialties?.join(', ') || 'No especificadas'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Sitio Web</div>
                    <div class="detail-value">
                        ${studio.details?.website ? 
                            `<a href="${studio.details.website}" target="_blank" style="color: var(--primary-light); text-decoration: none;">
                                Visitar sitio web
                            </a>` : 
                            'No disponible'
                        }
                    </div>
                </div>
            </div>
            
            <div class="reviews-section">
                <h2 class="section-title">Reseñas de la Comunidad</h2>
                <div class="reviews-grid" id="reviews-container">
                    ${studio.reviews && studio.reviews.length > 0 ? 
                        studio.reviews.map(review => `
                            <div class="review-card">
                                <div class="review-header">
                                    <span class="review-author">${review.author}</span>
                                    <span class="review-date">${new Date(review.date).toLocaleDateString('es-ES')}</span>
                                </div>
                                <div class="stars-small"></div>
                                <div class="review-content">${review.comment}</div>
                            </div>
                        `).join('') : 
                        '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No hay reseñas aún. Sé el primero en opinar.</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // Agregar estrellas dinámicamente
    const starsLargeContainer = container.querySelector('.stars-large');
    if (starsLargeContainer) {
        const stars = createStars(studioRating.averageRating);
        starsLargeContainer.appendChild(stars);
    }
    
    // Agregar estrellas a las reseñas
    const reviewCards = container.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        const starsSmallContainer = card.querySelector('.stars-small');
        if (starsSmallContainer && studio.reviews && studio.reviews[index]) {
            const reviewStars = createStars(studio.reviews[index].rating);
            starsSmallContainer.appendChild(reviewStars);
        }
    });
}

// Función para obtener reseñas del almacenamiento local
function getLocalRatings() {
    const stored = localStorage.getItem('reviewmc_ratings');
    return stored ? JSON.parse(stored) : {};
}

// Cargar los detalles cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
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
