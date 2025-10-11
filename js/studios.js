// Datos de los estudios/negocios mejorados con fondo personalizado
const studiosData = [
    {
        id: 1,
        name: "MegePixel",
        image: "./img/studios/studio1.jpg",
        category: "Diseño & Desarrollo",
        description: "Especialistas en diseño web y desarrollo de aplicaciones modernas. Creamos experiencias digitales únicas que impulsan tu negocio.",
        customBackground: "./img/port/prueba.jpeg",
        hasCustomBg: true,
        details: {
            founded: "2020",
            location: "Madrid, España",
            specialties: ["Diseño Web", "Desarrollo App", "UI/UX"],
            website: "https://megepixel.com"
        },
        reviews: [
            {
                author: "Ana García",
                date: "2024-01-15",
                rating: 5,
                comment: "Excelente trabajo en nuestro sitio web. Muy profesionales y creativos."
            },
            {
                author: "Carlos López",
                date: "2024-01-10",
                rating: 4,
                comment: "Buen servicio, entrega puntual. Recomendado."
            }
        ]
    },
    {
        id: 2,
        name: "Digital Creations",
        image: "./img/studios/prueba.jpg",
        category: "Marketing Digital",
        description: "Agencia de marketing digital especializada en estrategias de crecimiento y posicionamiento online para marcas.",
        customBackground: "./img/port/default.jpeg",
        hasCustomBg: false,
        details: {
            founded: "2019",
            location: "Barcelona, España",
            specialties: ["SEO", "Redes Sociales", "Email Marketing"],
            website: "https://digitalcreations.com"
        },
        reviews: [
            {
                author: "María Rodríguez",
                date: "2024-01-08",
                rating: 5,
                comment: "Increíble aumento en nuestro tráfico orgánico. Muy satisfechos."
            }
        ]
    },
    {
        id: 3,
        name: "Tech Solutions",
        image: "./img/studios/prueba.jpg",
        category: "Consultoría IT",
        description: "Consultoría tecnológica especializada en transformación digital y soluciones empresariales innovadoras.",
        customBackground: "./img/port/default.jpeg",
        hasCustomBg: false,
        details: {
            founded: "2018",
            location: "Valencia, España",
            specialties: ["Consultoría", "Cloud", "Ciberseguridad"],
            website: "https://techsolutions.com"
        },
        reviews: []
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

// Función para obtener reseñas del almacenamiento local
function getLocalRatings() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Función para guardar reseñas en el almacenamiento local
function saveLocalRatings(ratings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

// Función para sincronizar con JSONBin.io
async function syncWithJsonBin() {
    try {
        // Primero obtenemos las reseñas locales
        const localRatings = getLocalRatings();
        
        // Si no hay reseñas locales, inicializamos con ceros
        if (Object.keys(localRatings).length === 0) {
            const initialRatings = {};
            studiosData.forEach(studio => {
                initialRatings[studio.id] = {
                    totalRating: 0,
                    reviewCount: 0,
                    averageRating: 0
                };
            });
            saveLocalRatings(initialRatings);
            return initialRatings;
        }
        
        // Intentamos obtener las reseñas de JSONBin.io
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
        const remoteRatings = data.record || {};
        
        // Fusionamos las reseñas (las locales tienen prioridad)
        const mergedRatings = { ...remoteRatings, ...localRatings };
        
        // Aseguramos que todos los estudios tengan una entrada
        studiosData.forEach(studio => {
            if (!mergedRatings[studio.id]) {
                mergedRatings[studio.id] = {
                    totalRating: 0,
                    reviewCount: 0,
                    averageRating: 0
                };
            }
        });
        
        // Guardamos localmente y en JSONBin.io
        saveLocalRatings(mergedRatings);
        await updateJsonBin(mergedRatings);
        
        return mergedRatings;
        
    } catch (error) {
        console.error('Error sincronizando con JSONBin.io:', error);
        // En caso de error, usamos solo las reseñas locales
        return getLocalRatings();
    }
}

// Función para actualizar JSONBin.io
async function updateJsonBin(ratings) {
    try {
        const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ratings)
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar JSONBin.io');
        }
        
        console.log('Datos actualizados en JSONBin.io correctamente');
    } catch (error) {
        console.error('Error actualizando JSONBin.io:', error);
    }
}

// Función para agregar una reseña
async function addReview(studioId, rating) {
    const localRatings = getLocalRatings();
    
    // Si el estudio no existe en las reseñas, lo creamos
    if (!localRatings[studioId]) {
        localRatings[studioId] = {
            totalRating: 0,
            reviewCount: 0,
            averageRating: 0
        };
    }
    
    // Actualizamos las estadísticas
    localRatings[studioId].totalRating += rating;
    localRatings[studioId].reviewCount += 1;
    localRatings[studioId].averageRating = localRatings[studioId].totalRating / localRatings[studioId].reviewCount;
    
    // Guardamos localmente
    saveLocalRatings(localRatings);
    
    // Sincronizamos con JSONBin.io (en segundo plano)
    setTimeout(() => {
        updateJsonBin(localRatings);
    }, 0);
    
    return localRatings[studioId];
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
        // Obtener reseñas sincronizadas
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

// Cargar estudios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadStudios);

// Exportar para uso global
window.studiosData = studiosData;
window.loadStudios = loadStudios;
window.addReview = addReview;
window.syncWithJsonBin = syncWithJsonBin;
window.getLocalRatings = getLocalRatings;
