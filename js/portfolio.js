window.addEventListener('load', () => {
    // Инициализируем Isotope для сетки проектов
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
});