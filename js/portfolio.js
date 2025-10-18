document.addEventListener('DOMContentLoaded', function() {

    // Инициализируем Isotope для сетки проектов (оригинальный код)
    const grid = document.querySelector('.portfolio-grid');
    if (grid) {
        const iso = new Isotope(grid, {
            itemSelector: '.portfolio-card',
            layoutMode: 'fitRows' // Можно поменять на 'masonry' для разной высоты
        });

        // Находим все кнопки-фильтры
        const filterBtns = document.querySelector('.filter-buttons');
        if (filterBtns) {
            filterBtns.addEventListener('click', (event) => {
                if (!event.target.matches('button')) {
                    return;
                }

                const filterValue = event.target.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });

                // Управляем классом 'active' для кнопок
                const currentActive = filterBtns.querySelector('.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                event.target.classList.add('active');
            });
        }
    }

    // --- НОВЫЙ КОД: Анимация появления карточек при скролле ---
    const portfolioCards = document.querySelectorAll('.portfolio-card.animated-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Прекращаем наблюдение за этой карточкой
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    portfolioCards.forEach(card => {
        cardObserver.observe(card);
    });
    // --- /НОВЫЙ КОД ---
});