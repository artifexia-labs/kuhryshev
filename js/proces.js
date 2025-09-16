document.addEventListener('DOMContentLoaded', function() {

    const timelineItems = document.querySelectorAll('.timeline-item');

    // Настройки для "наблюдателя"
    const observerOptions = {
        root: null, // отслеживаем пересечение с viewport
        rootMargin: '0px',
        threshold: 0.2 // элемент считается видимым, если видно хотя бы 20%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Если элемент появился в области видимости
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Прекращаем наблюдение за этим элементом, чтобы анимация не повторялась
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Запускаем наблюдение за каждой карточкой
    timelineItems.forEach(item => {
        observer.observe(item);
    });

});