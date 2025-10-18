document.addEventListener('DOMContentLoaded', function() {

    // Анимация появления карточек услуг при скролле
    const serviceCards = document.querySelectorAll('.service-detailed-card');
    const customSolutionBox = document.querySelector('#custom-solutions .custom-solution-box');
    const approachCard = document.querySelector('.approach-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Анимация для блока "Máte specifický nápad?"
    if (customSolutionBox) {
        const solutionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        solutionObserver.observe(customSolutionBox);
    }

    // Анимация для блока "Můj základní princip"
    if (approachCard) {
        const approachObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        approachObserver.observe(approachCard);
    }

    // Опционально: Анимация "печати" для подзаголовка hero
    // const subtitle = document.querySelector('.animated-subtitle');
    // if (subtitle) {
    //     const originalText = subtitle.textContent;
    //     subtitle.textContent = '';
    //     let i = 0;
    //     const speed = 30; // ms per character
    //     const timer = setInterval(() => {
    //         if (i < originalText.length) {
    //             subtitle.textContent += originalText.charAt(i);
    //             i++;
    //         } else {
    //             clearInterval(timer);
    //         }
    //     }, speed);
    // }
});