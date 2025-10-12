// Datos de los estudios/negocios mejorados con fondo personalizado
const studiosData = [
    {
        id: 1,
        name: "MegePixel",
        image: "./img/studios/studio1.jpg",
        category: "Diseño & Desarrollo",
        description: "Un Studio Dedicado al desarrollode paginas web, Desarrollode servidores de Minecraft Bedrock o java, Un studio que crea paginas o aplicaciones web.",
        customBackground: "./img/port/prueba.jpeg",
        hasCustomBg: true,
        socialLinks: {
            discord: "https://discord.gg/RMfzSyNxjT",
            whatsapp: "https://whatsapp.com/channel/0029VbBXekx1t90czIbLim25",
            tiktok: false,
            youtube: false,
            twitter: false
        }
    },
    {
        id: 2,
        name: "SquereCraft Studio",
        image: "./img/studios/studio2.jpg",
        category: "Event Creators",
        description: "Hola, somos SquareCraft Studio, una comunidad de Minecraft muy chula, en la cual te garantizamos una diversión sin fin, ¿Te gustaría participar en servidores y eventos increíbles? Pues este es tu sitio, contamos con un staff impresionante, cuidamos de cada detalle puesto en el desarrollo del servidor o evento¿Quieres que tús eventos o servidores sean lo mejor de lo mejor? Pues tambien puedes contratar nuestros servicios, con precios muy competitivos y una calidad impresionante, un trato increíble y unos servicios extra únicos y exclusivos solo para ti y tú comunidad",
        customBackground: "./img/port/fon2.jpg",
        hasCustomBg: true,
        socialLinks: {
            discord: "https://discord.gg/MPeG9AP4",
            whatsapp: false,
            tiktok: false,
            youtube: "https://youtube.com/@squarecraftstudios?si=IQMgxxqGN4-JSGGb",
            twitter: false
        }
    },
    {
        id: 3,
        name: "Hexa Studios",
        image: "./img/studios/studio3.jpg",
        category: "Event Creators and Addons",
        description: "Un studio dedicado a Minecraft que tiene varios modos de juego.",
        customBackground: "./img/port/fon3.jpg",
        hasCustomBg: true,
        socialLinks: {
            discord: "https://discord.gg/Ur3GKgpy?event=1424897733713592330",
            whatsapp: false,
            tiktok: false,
            youtube: false,
            twitter: false
        }
    },
    {
        id: 4,
        name: "Galaxy Studio",
        image: "./img/studios/studio4.jpg",
        category: "Creadores de eventos, addons, y mapas.",
        description: "🌌 Somos desarrolladores de proyectos en Minecraft Bedrock🛠️ 📱 Creamos experiencias únicas, eventos épicos y contenido original 🎮✨.",
        customBackground: "./img/port/fon4.jpg",
        hasCustomBg: true,
        socialLinks: {
            discord: "https://discord.gg/jgFcukm2kh",
            whatsapp: false,
            tiktok: "https://www.tiktok.com/@galaxyeventscompany?_t=ZM-8yyw6tdJuRZ&_r=1",
            youtube: "https://youtube.com/@galaxycompanymc?si=11uSSD-MDFH9nG2o",
            twitter: "https://x.com/GalaxyCompania?t=DxAiSH6PoPOZn3GTBYF6pg&s=09"
        }
    }
];

// Configuración de JSONBin.io
const JSONBIN_CONFIG = {
    API_KEY: "$2a$10$utMZ24gYJKdkvxH3nnVuX.uRD6BY6J18jbZdmljaMT3TmP6OG31k.",
    BIN_ID: "68e82e88ae596e708f0c6e9c",
    BASE_URL: "https://api.jsonbin.io/v3/b"
};

// Almacenamiento local para reseñas
const STORAGE_KEY = "reviewmc_ratings";
const USER_REVIEWS_KEY = "reviewmc_user_reviews";
const STUDIO_REVIEWS_KEY = "reviewmc_reviews";
const USER_PROFILE_KEY = "reviewmc_user_profile";

// Función para obtener perfil del usuario
function getUserProfile() {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Perfil por defecto si no existe
    const defaultProfile = {
        id: 'user_' + Date.now(),
        username: 'Usuario',
        discord: 'usuario#0000',
        avatar: './img/avatar-default.png',
        isDefault: true
    };
    
    saveUserProfile(defaultProfile);
    return defaultProfile;
}

// Función para guardar perfil del usuario
function saveUserProfile(profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

// Función para actualizar perfil desde Discord
async function updateProfileFromDiscord(discordData) {
    const profile = {
        id: discordData.id || 'user_' + Date.now(),
        username: discordData.username || 'Usuario',
        discord: discordData.discord || `${discordData.username}#${discordData.discriminator || '0000'}`,
        avatar: discordData.avatar ? 
            `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png` : 
            `https://cdn.discordapp.com/embed/avatars/${(discordData.discriminator || '0000') % 5}.png`,
        isDefault: false
    };
    
    saveUserProfile(profile);
    
    // Actualizar UI inmediatamente
    updateNavbarProfile();
    
    return profile;
}

// Función para obtener reseñas del almacenamiento local
function getLocalRatings() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Función para guardar reseñas en el almacenamiento local
function saveLocalRatings(ratings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

// Función para obtener reseñas de usuarios
function getUserReviews() {
    const stored = localStorage.getItem(USER_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Función para guardar reseñas de usuarios
function saveUserReviews(reviews) {
    localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(reviews));
}

// Función para obtener reseñas de un estudio específico
function getStudioReviews(studioId) {
    const stored = localStorage.getItem(STUDIO_REVIEWS_KEY);
    const allReviews = stored ? JSON.parse(stored) : {};
    return allReviews[studioId] || [];
}

// Función para guardar reseñas de un estudio
function saveStudioReviews(studioId, reviews) {
    const stored = localStorage.getItem(STUDIO_REVIEWS_KEY);
    const allReviews = stored ? JSON.parse(stored) : {};
    allReviews[studioId] = reviews;
    localStorage.setItem(STUDIO_REVIEWS_KEY, JSON.stringify(allReviews));
}

// Nueva estructura para JSONBin.io que incluye reseñas completas
function getCompleteDataForJsonBin() {
    const ratings = getLocalRatings();
    const allStudioReviews = {};
    
    // Obtener todas las reseñas de todos los estudios
    studiosData.forEach(studio => {
        allStudioReviews[studio.id] = getStudioReviews(studio.id);
    });
    
    return {
        ratings: ratings,
        reviews: allStudioReviews,
        lastUpdated: new Date().toISOString()
    };
}

// Función para sincronizar con JSONBin.io (ACTUALIZADA)
async function syncWithJsonBin() {
    try {
        // Obtenemos los datos completos (ratings + reseñas)
        const localData = getCompleteDataForJsonBin();
        
        // Si no hay datos locales, inicializamos
        if (Object.keys(localData.ratings).length === 0) {
            const initialRatings = {};
            studiosData.forEach(studio => {
                initialRatings[studio.id] = {
                    totalRating: 0,
                    reviewCount: 0,
                    averageRating: 0
                };
            });
            localData.ratings = initialRatings;
            saveLocalRatings(initialRatings);
        }
        
        // Intentamos obtener los datos de JSONBin.io
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        let remoteData = { ratings: {}, reviews: {} };
        
        if (response.ok) {
            const data = await response.json();
            remoteData = data.record || { ratings: {}, reviews: {} };
        }
        
        // Fusionamos los datos (las locales tienen prioridad)
        const mergedData = {
            ratings: { ...remoteData.ratings, ...localData.ratings },
            reviews: { ...remoteData.reviews, ...localData.reviews },
            lastUpdated: new Date().toISOString()
        };
        
        // Aseguramos que todos los estudios tengan una entrada
        studiosData.forEach(studio => {
            if (!mergedData.ratings[studio.id]) {
                mergedData.ratings[studio.id] = {
                    totalRating: 0,
                    reviewCount: 0,
                    averageRating: 0
                };
            }
            if (!mergedData.reviews[studio.id]) {
                mergedData.reviews[studio.id] = [];
            }
        });
        
        // Guardamos localmente
        saveLocalRatings(mergedData.ratings);
        
        // Guardamos las reseñas localmente
        Object.keys(mergedData.reviews).forEach(studioId => {
            saveStudioReviews(parseInt(studioId), mergedData.reviews[studioId]);
        });
        
        // Actualizamos JSONBin.io con datos completos
        await updateJsonBin(mergedData);
        
        return mergedData.ratings;
        
    } catch (error) {
        console.error('Error sincronizando con JSONBin.io:', error);
        // En caso de error, usamos solo los datos locales
        return getLocalRatings();
    }
}

// Función para actualizar JSONBin.io (ACTUALIZADA)
async function updateJsonBin(data) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                'Content-Type': 'application/json',
                'X-Bin-Versioning': 'false'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar JSONBin.io');
        }
        
        console.log('Datos completos actualizados en JSONBin.io correctamente');
        return true;
    } catch (error) {
        console.error('Error actualizando JSONBin.io:', error);
        return false;
    }
}

// Función para agregar una reseña (ACTUALIZADA)
async function addReview(studioId, rating, comment) {
    const userProfile = getUserProfile();
    const userReviews = getUserReviews();
    const studioReviews = getStudioReviews(studioId);
    
    // Verificar si el usuario ya tiene una reseña para este estudio
    if (userReviews[studioId]) {
        alert('Ya has publicado una reseña para este estudio.');
        return;
    }
    
    // Crear nueva reseña
    const newReview = {
        id: Date.now(), // ID único basado en timestamp
        userId: userProfile.id,
        username: userProfile.username,
        discord: userProfile.discord,
        avatar: userProfile.avatar,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
    };
    
    // Guardar reseña del usuario
    userReviews[studioId] = newReview.id;
    saveUserReviews(userReviews);
    
    // Agregar reseña a las reseñas del estudio
    studioReviews.push(newReview);
    saveStudioReviews(studioId, studioReviews);
    
    // Actualizar calificaciones globales
    const ratings = getLocalRatings();
    
    if (!ratings[studioId]) {
        ratings[studioId] = {
            totalRating: 0,
            reviewCount: 0,
            averageRating: 0
        };
    }
    
    ratings[studioId].totalRating += rating;
    ratings[studioId].reviewCount += 1;
    ratings[studioId].averageRating = ratings[studioId].totalRating / ratings[studioId].reviewCount;
    
    saveLocalRatings(ratings);
    
    // Preparar datos completos para JSONBin.io
    const completeData = getCompleteDataForJsonBin();
    
    // Sincronizamos con JSONBin.io (en segundo plano) con datos completos
    setTimeout(() => {
        updateJsonBin(completeData);
    }, 0);
    
    return ratings[studioId];
}

// Función para eliminar una reseña (ACTUALIZADA)
function deleteReview(studioId, reviewId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
        return;
    }
    
    const userReviews = getUserReviews();
    const studioReviews = getStudioReviews(studioId);
    const ratings = getLocalRatings();
    
    // Encontrar la reseña a eliminar
    const reviewIndex = studioReviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
        alert('No se pudo encontrar la reseña.');
        return;
    }
    
    const reviewToDelete = studioReviews[reviewIndex];
    
    // Eliminar la reseña del estudio
    studioReviews.splice(reviewIndex, 1);
    saveStudioReviews(studioId, studioReviews);
    
    // Eliminar la referencia del usuario
    delete userReviews[studioId];
    saveUserReviews(userReviews);
    
    // Actualizar calificaciones globales
    if (ratings[studioId]) {
        ratings[studioId].totalRating -= reviewToDelete.rating;
        ratings[studioId].reviewCount -= 1;
        
        if (ratings[studioId].reviewCount > 0) {
            ratings[studioId].averageRating = ratings[studioId].totalRating / ratings[studioId].reviewCount;
        } else {
            ratings[studioId].averageRating = 0;
        }
        
        saveLocalRatings(ratings);
        
        // Preparar datos completos para JSONBin.io
        const completeData = getCompleteDataForJsonBin();
        
        // Sincronizar con JSONBin.io con datos actualizados
        setTimeout(() => {
            updateJsonBin(completeData);
        }, 0);
    }
    
    // Recargar la página para reflejar los cambios
    window.location.reload();
}

// Función para cargar reseñas desde JSONBin.io (NUEVA)
async function loadReviewsFromJsonBin(studioId) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos de JSONBin.io');
        }
        
        const data = await response.json();
        const remoteData = data.record || { reviews: {} };
        
        return remoteData.reviews[studioId] || [];
        
    } catch (error) {
        console.error('Error cargando reseñas desde JSONBin.io:', error);
        return getStudioReviews(studioId); // Fallback a local
    }
}

// Función mejorada para crear estrellas
function createStars(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const hasAlmostFull = rating % 1 > 0.7;
    
    // Estrellas llenas
    for (let i = 0; i < fullStars + (hasAlmostFull ? 1 : 0); i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star filled';
        starsContainer.appendChild(star);
    }
    
    // Media estrella si es necesario
    if (hasHalfStar && fullStars + (hasAlmostFull ? 1 : 0) < 5) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt half';
        starsContainer.appendChild(halfStar);
    }
    
    // Estrellas vacías
    const totalStars = fullStars + (hasHalfStar ? 1 : 0) + (hasAlmostFull ? 1 : 0);
    const emptyStars = 5 - totalStars;
    
    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star star';
        starsContainer.appendChild(star);
    }
    
    return starsContainer;
}

// Función mejorada para crear una tarjeta de estudio
function createStudioCard(studio, ratings) {
    const card = document.createElement('div');
    card.className = 'studio-card';
    card.setAttribute('data-id', studio.id);
    
    // Obtener rating del estudio o usar valores por defecto
    const studioRating = ratings[studio.id] || {
        averageRating: 0,
        reviewCount: 0
    };
    
    // Aplicar fondo personalizado si está activado
    if (studio.hasCustomBg && studio.customBackground) {
        card.classList.add('has-custom-bg');
        card.style.backgroundImage = `url('${studio.customBackground}')`;
    }
    
    card.innerHTML = `
        <div class="studio-header">
            <img src="${studio.image}" alt="${studio.name}" class="studio-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl85MF85MCkiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl85MF85MCIgeDE9IjAiIHkxPSIwIiB4Mj0iOTAiIHkyPSI5MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDZCNkQ0Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='">
            <div class="studio-info">
                <h3 class="studio-name">${studio.name}</h3>
                <div class="studio-rating">
                    <span class="rating-value">${studioRating.averageRating.toFixed(1)}</span>
                </div>
                <div class="studio-category">${studio.category}</div>
                <div class="review-count">${studioRating.reviewCount} reseñas</div>
            </div>
        </div>
    `;
    
    // Agregar estrellas dinámicamente
    const ratingContainer = card.querySelector('.studio-rating');
    const stars = createStars(studioRating.averageRating);
    ratingContainer.appendChild(stars);
    
    // Agregar evento de clic para redirigir a view.html
    card.addEventListener('click', function() {
        window.location.href = `view.html?id=${studio.id}`;
    });
    
    // Agregar cursor pointer para indicar que es clickeable
    card.style.cursor = 'pointer';
    
    return card;
}

// Función para actualizar la visualización de la calificación
function updateStudioRating(studioId, averageRating, reviewCount) {
    // Actualizar el valor numérico
    const ratingValue = document.querySelector(`.studio-card[data-id="${studioId}"] .rating-value`);
    if (ratingValue) {
        ratingValue.textContent = averageRating.toFixed(1);
    }
    
    // Actualizar las estrellas de valoración
    const starsContainer = document.querySelector(`.studio-card[data-id="${studioId}"] .stars`);
    if (starsContainer) {
        const newStars = createStars(averageRating);
        starsContainer.parentNode.replaceChild(newStars, starsContainer);
    }
    
    // Actualizar contador de reseñas
    const reviewCountElement = document.querySelector(`.studio-card[data-id="${studioId}"] .review-count`);
    if (reviewCountElement) {
        reviewCountElement.textContent = `${reviewCount} reseñas`;
    }
    
    // Reordenar las tarjetas según la nueva calificación
    reorderStudioCards();
}

// Función para ordenar las tarjetas por calificación
function reorderStudioCards() {
    const container = document.getElementById('studios-container');
    if (!container) return;
    
    const cards = Array.from(container.querySelectorAll('.studio-card'));
    const ratings = getLocalRatings();
    
    cards.sort((a, b) => {
        const aId = parseInt(a.getAttribute('data-id'));
        const bId = parseInt(b.getAttribute('data-id'));
        
        const aRating = ratings[aId] ? ratings[aId].averageRating : 0;
        const bRating = ratings[bId] ? ratings[bId].averageRating : 0;
        
        const aReviews = ratings[aId] ? ratings[aId].reviewCount : 0;
        const bReviews = ratings[bId] ? ratings[bId].reviewCount : 0;
        
        // Primero por calificación (descendente)
        if (bRating !== aRating) {
            return bRating - aRating;
        }
        
        // Si tienen la misma calificación, por cantidad de reseñas (descendente)
        return bReviews - aReviews;
    });
    
    // Reorganizar las tarjetas en el DOM
    cards.forEach(card => container.appendChild(card));
}

// Función mejorada para cargar todos los estudios
async function loadStudios() {
    const container = document.getElementById('studios-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de estudios');
        return;
    }
    
    // Mostrar estado de carga
    container.innerHTML = '<div class="loading-text">Cargando negocios...</div>';
    
    try {
        // Obtener reseñas sincronizadas (ahora incluye reseñas completas)
        const ratings = await syncWithJsonBin();
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Crear y agregar tarjetas
        studiosData.forEach(studio => {
            const card = createStudioCard(studio, ratings);
            container.appendChild(card);
        });
        
        // Ordenar las tarjetas inicialmente
        reorderStudioCards();
        
    } catch (error) {
        console.error('Error cargando estudios:', error);
        container.innerHTML = '<div class="error-text">Error al cargar los estudios. Intenta recargar la página.</div>';
    }
}

// Función para actualizar el perfil en la navbar
function updateNavbarProfile() {
    const userProfile = getUserProfile();
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

// Cargar estudios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar perfil en la navbar
    updateNavbarProfile();
    
    // Escuchar cambios en la autenticación
    document.addEventListener('authStateChanged', function() {
        updateNavbarProfile();
    });
    
    loadStudios();
});

// Exportar para uso global
window.studiosData = studiosData;
window.loadStudios = loadStudios;
window.addReview = addReview;
window.deleteReview = deleteReview;
window.syncWithJsonBin = syncWithJsonBin;
window.getLocalRatings = getLocalRatings;
window.getUserReviews = getUserReviews;
window.getStudioReviews = getStudioReviews;
window.getUserProfile = getUserProfile;
window.updateProfileFromDiscord = updateProfileFromDiscord;
window.createStars = createStars;
window.loadReviewsFromJsonBin = loadReviewsFromJsonBin;
window.updateNavbarProfile = updateNavbarProfile;
