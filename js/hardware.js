// hardware.js (Обновленный)

document.addEventListener('DOMContentLoaded', function() {
    // --- Подключение к Supabase ---
    const SUPABASE_URL = 'https://xcyiklzvjzlpzotgnown.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjeWlrbHp2anpscHpvdGdub3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTA1MDksImV4cCI6MjA3MzM2NjUwOX0.UEpYaD2LuEkC1c-5j8G3bb2kvOWCiPcwKgLt1ye8a3o';

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- Функция получения публичного URL изображения из Storage ---
    function getPublicImageUrl(imageKey) {
        if (!imageKey) {
             console.warn('getPublicImageUrl: imageKey is null or empty');
             return null;
        }
        const { data, error } = supabaseClient.storage
            .from('hardware-images')
            .getPublicUrl(imageKey);

        if (error) {
            console.error('Chyba při získávání veřejné URL pro obrázek:', imageKey, error);
            return null;
        }
        return data.publicUrl;
    }

    // --- Функция загрузки товаров ---
    async function loadProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) {
            console.error('Products grid element not found!');
            return;
        }

        try {
            console.log('Starting to load products...');
            productsGrid.innerHTML = '<div class="loading-placeholder">Načítání...</div>';

            const { data: products, error, status } = await supabaseClient
                .from('hardware_products')
                .select('*')
                .order('id', { ascending: true });

            console.log('Supabase response status:', status);
            console.log('Raw data object from Supabase:', {  products, error });
            console.log('Supabase error object:', error);

            if (error) {
                console.error('Chyba při načítání produktů z Supabase:', error);
                productsGrid.innerHTML = '<div class="error-message">Chyba při načítání produktů: ' + error.message + '</div>';
                return;
            }

            if (products === null || products === undefined) {
                console.warn('Data array is null or undefined.');
                productsGrid.innerHTML = '<div class="no-products-message">Data produktů jsou dočasně nedostupná (data je null/undefined).</div>';
                return;
            }

            if (products.length === 0) {
                console.warn('Data array is empty.');
                productsGrid.innerHTML = '<div class="no-products-message">Momentálně nejsou k dispozici žádné produkty.</div>';
                return;
            }

            console.log('Successfully loaded', products.length, 'products.');
            productsGrid.innerHTML = '';

            products.forEach(product => {
                const productCard = createProductCard(product);
                if (productCard) {
                    productsGrid.appendChild(productCard);
                } else {
                     console.warn('Failed to create card for product:', product);
                }
            });

            // Инициализация поиска (не зависит от динамических элементов)
            initializeSearch();

        } catch (err) {
            console.error('Neočekávaná chyба při načítání produktů:', err);
            productsGrid.innerHTML = '<div class="error-message">Neočekávaná chyba: ' + err.message + '</div>';
        }
    }

    // --- Функция создания *компактной* карточки товара ---
    function createProductCard(product) {
        if (!product) {
             console.error('createProductCard received a null or undefined product object.');
             return null;
        }

        const card = document.createElement('div');
        card.className = `product-card status-${product.status || 'available'}`;
        card.setAttribute('data-category', product.category || '');
        const searchTags = `${product.name} ${product.description} ${product.specs ? Object.values(product.specs).join(' ') : ''}`;
        card.setAttribute('data-search', searchTags.toLowerCase());

        // --- Преобразование ключей изображений в публичные URL ---
        const imageKeys = Array.isArray(product.images) ? product.images : [];
        const imageUrls = imageKeys.map(key => getPublicImageUrl(key)).filter(url => url !== null);
        const placeholderUrl = 'images/placeholder.webp';

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${imageUrls.length > 0 ? imageUrls[0] : placeholderUrl}" alt="${product.name || 'Produkt'}" class="product-main-image">
                <div class="product-status-badge">${getStatusText(product.status)}</div>
                <div class="product-price-tag">${product.price || ''}</div>
            </div>
            <div class="product-summary-content">
                <h3 class="product-title">${product.name || 'Bez názvu'}</h3>
                <p class="product-description-summary">${product.description ? (product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description) : ''}</p>
                <button class="btn product-details-btn" data-product-id="${product.id}">Podrobnosti</button>
            </div>
        `;

        // Добавляем обработчик для кнопки "Podrobnosti"
        const detailsBtn = card.querySelector('.product-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Предотвращаем всплытие, если кликаем на кнопку
                openProductModal(product);
            });
        }

        return card;
    }

    // --- Функция открытия модального окна ---
    function openProductModal(product) {
        const modal = document.getElementById('product-modal');
        const modalContent = document.getElementById('modal-product-details');

        if (!modal || !modalContent) {
             console.error('Modal elements not found!');
             return;
        }

        // Генерируем HTML для деталей
        const imageUrls = Array.isArray(product.images) ? product.images.map(key => getPublicImageUrl(key)).filter(url => url !== null) : [];
        const placeholderUrl = 'images/placeholder.webp';

        let imageThumbnailsHTML = '';
        if (imageUrls.length > 0) {
            imageThumbnailsHTML = `
                <div class="modal-image-thumbnails-wrapper">
                    ${imageUrls.map((url, index) => `
                        <img src="${url}" alt="Thumbnail ${index + 1}" class="modal-thumbnail ${index === 0 ? 'active' : ''}">
                    `).join('')}
                </div>
            `;
        }

        modalContent.innerHTML = `
            <div class="modal-product-image-container">
                <div class="modal-main-image-wrapper">
                    <img src="${imageUrls.length > 0 ? imageUrls[0] : placeholderUrl}" alt="${product.name}" class="modal-main-image">
                </div>
                ${imageThumbnailsHTML}
            </div>
            <div class="modal-product-info">
                <h2 class="modal-product-title">${product.name || 'Bez názvu'}</h2>
                <div class="modal-product-status-price">
                    <span class="modal-product-status">${getStatusText(product.status)}</span>
                    <span class="modal-product-price">${product.price || ''}</span>
                </div>
                <p class="modal-product-description">${product.description || ''}</p>
                <div class="modal-product-specs">
                    <h4>Technické specifikace:</h4>
                    <ul>
                        ${product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => `
                            <li><strong>${key}:</strong> <span>${value}</span></li>
                        `).join('') : '<li><em>Specifikace nejsou k dispozici.</em></li>'}
                    </ul>
                </div>
                <p class="modal-delivery-info">
                    ${product.delivery_info || '<i class="fas fa-shipping-fast"></i> Informace o doručení nejsou k dispozici.'}
                </p>
                <a href="#contact" class="btn modal-product-contact-btn">Zájmem o tento produkt</a>
            </div>
        `;

        // Инициализация переключения изображений в модальном окне
        initializeModalImageSwitching();

        // Показываем модальное окно
        modal.style.display = 'flex';
    }

    // --- Функция инициализации переключения изображений в модальном окне ---
    function initializeModalImageSwitching() {
        const modalMainImage = document.querySelector('.modal-main-image');
        const modalThumbnails = document.querySelectorAll('.modal-thumbnail');

        if (modalMainImage && modalThumbnails.length > 0) {
            const firstThumbnail = modalThumbnails[0];
            if (firstThumbnail) {
                modalThumbnails.forEach(t => t.classList.remove('active'));
                firstThumbnail.classList.add('active');
                modalMainImage.src = firstThumbnail.src;
                modalMainImage.alt = firstThumbnail.alt.replace('Thumbnail', 'Main Image');
            }

            modalThumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    modalThumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    modalMainImage.src = this.src;
                    modalMainImage.alt = this.alt.replace('Thumbnail', 'Main Image');
                });
            });
        }
    }

    // --- Функция закрытия модального окна ---
    function closeProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // --- Обработчики для модального окна ---
    const modal = document.getElementById('product-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    if (modal) {
        modal.addEventListener('click', function(e) {
            // Закрытие при клике на оверлей (не на содержимое)
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProductModal);
    }

    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeProductModal();
        }
    });

    function getStatusText(status) {
        const statusMap = {
            available: 'Skladem',
            limited: 'Na dotaz',
            sold: 'Prodáno'
        };
        return statusMap[status] || 'Stav neznámý';
    }

    // --- Инициализация поиска ---
    function initializeSearch() {
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            searchBox.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const productCards = document.querySelectorAll('.product-card');

                productCards.forEach(card => {
                    const title = card.querySelector('.product-title').textContent.toLowerCase();
                    const description = card.querySelector('.product-description-summary').textContent.toLowerCase();
                    const searchTags = card.getAttribute('data-search').toLowerCase();

                    if (title.includes(searchTerm) || description.includes(searchTerm) || searchTags.includes(searchTerm)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // --- Загрузка товаров при загрузке страницы ---
    loadProducts();

    // --- Повторная инициализация анимации для статических секций ---
    function initializeIntersectionObserver() {
        const sections = document.querySelectorAll('.content-section, .vinted-section, .delivery-info-section, .contact-section-unique');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    initializeIntersectionObserver();
});
