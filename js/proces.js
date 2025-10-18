document.addEventListener('DOMContentLoaded', function() {

    const stepHeaders = document.querySelectorAll('.step-header');
    const stepContents = document.querySelectorAll('.step-content');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalCurrentStep = document.getElementById('terminal-current-step');

    // Анимация появления секций при скролле (если не используется в общем styles.css)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.step-expanded').forEach(step => {
        sectionObserver.observe(step);
    });

    // Функция для переключения аккордеона
    function toggleAccordion(header) {
        const step = header.parentElement;
        step.classList.toggle('active');

        // Обновляем "терминал" при открытии шага
        const stepTitle = header.querySelector('h3').textContent;
        const stepNumber = header.querySelector('.step-number').textContent;
        terminalCurrentStep.textContent = `> Spuštění fáze ${stepNumber}: ${stepTitle}...`;
    }

    // Добавляем обработчики кликов на заголовки шагов
    stepHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleAccordion(this);
        });
    });

    // Активируем первый шаг по умолчанию
    if (stepHeaders.length > 0) {
        stepHeaders[0].parentElement.classList.add('active');
        // terminalCurrentStep.textContent = `> Spuštění fáze 1: ${stepHeaders[0].querySelector('h3').textContent}...`;
    }

    // Анимация "печати" для терминала (опционально, если хочешь больше "жизни")
    // const initialText = terminalOutput.innerHTML;
    // terminalOutput.innerHTML = '';
    // let i = 0;
    // const speed = 50; // ms per character
    // const timer = setInterval(() => {
    //     if (i < initialText.length) {
    //         terminalOutput.innerHTML += initialText.charAt(i);
    //         i++;
    //         terminalOutput.scrollTop = terminalOutput.scrollHeight; // Прокрутка вниз
    //     } else {
    //         clearInterval(timer);
    //     }
    // }, speed);

});