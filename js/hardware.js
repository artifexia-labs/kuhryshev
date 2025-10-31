// hardware.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Поиск ---
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        const productCards = document.querySelectorAll('.product-card');

        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                const specs = card.querySelector('.product-specs ul').textContent.toLowerCase();
                const searchTags = card.getAttribute('data-search').toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm) || specs.includes(searchTerm) || searchTags.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Переключение изображений ---
    // Находим все карточки с изображениями
    const productCardsWithImages = document.querySelectorAll('.product-card');

    productCardsWithImages.forEach(card => {
        const mainImage = card.querySelector('.main-image');
        const thumbnails = card.querySelectorAll('.thumbnail');

        if (mainImage && thumbnails.length > 0) {
            // Устанавливаем первое изображение как активное по умолчанию
            const firstThumbnail = thumbnails[0];
            if (firstThumbnail) {
                firstThumbnail.classList.add('active');
                // Устанавливаем src основного изображения
                mainImage.src = firstThumbnail.src;
                // Устанавливаем alt основного изображения
                mainImage.alt = firstThumbnail.alt.replace('Thumbnail', 'Main Image');
            }

            // Добавляем обработчики клика на миниатюры
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Убираем активный класс у всех миниатюр
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // Добавляем активный класс к нажатой миниатюре
                    this.classList.add('active');
                    // Меняем src основного изображения на src нажатой миниатюры
                    mainImage.src = this.src;
                    // Меняем alt основного изображения
                    mainImage.alt = this.alt.replace('Thumbnail', 'Main Image');
                });
            });
        }
    });

    // --- Анимация при скролле ---
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});