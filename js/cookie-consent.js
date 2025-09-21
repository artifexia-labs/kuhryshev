// kuhryshev/js/cookie-consent.js

document.addEventListener('DOMContentLoaded', () => {

    const COOKIE_CONSENT_KEY = 'kuhryshev_cookie_consent';
    const GA_MEASUREMENT_ID = 'G-DHKQXV0ZFF'; // !!! ЗАМЕНИ НА СВОЙ ID !!!

    const banner = document.getElementById('cookie-consent-banner');
    const modalOverlay = document.getElementById('cookie-modal-overlay');

    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const showDetailsBtn = document.getElementById('show-cookie-details');
    const saveSettingsBtn = document.getElementById('save-cookie-settings');
    const analyticsToggle = document.getElementById('analytics-cookies');

    // --- Логика Google Analytics ---
    let isAnalyticsActive = false;
    
    function activateAnalytics() {
        if (isAnalyticsActive || !GA_MEASUREMENT_ID.startsWith('G-')) return;

        // Создаем и добавляем первый скрипт (библиотеку gtag)
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(gtagScript);

        // Создаем и добавляем второй скрипт (конфигурацию)
        const configScript = document.createElement('script');
        configScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
        `;
        document.head.appendChild(configScript);
        
        isAnalyticsActive = true;
        console.log('Google Analytics activated.');
    }

    // --- Управление согласием ---
    function saveConsent(consent) {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    }

    function getConsent() {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        return consent ? JSON.parse(consent) : null;
    }

    function hideBannerAndModal() {
        if (banner) banner.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    // --- Обработчики событий ---
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => {
            const consent = { necessary: true, analytics: true, timestamp: new Date().toISOString() };
            saveConsent(consent);
            activateAnalytics();
            hideBannerAndModal();
        });
    }

    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.add('active');
        });
    }
    
    if (modalOverlay) {
        // Закрытие модального окна по клику на фон
         modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                 modalOverlay.classList.remove('active');
            }
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const analyticsAllowed = analyticsToggle ? analyticsToggle.checked : false;
            const consent = { necessary: true, analytics: analyticsAllowed, timestamp: new Date().toISOString() };
            saveConsent(consent);
            if (analyticsAllowed) {
                activateAnalytics();
            }
            hideBannerAndModal();
        });
    }

    // --- Инициализация при загрузке страницы ---
    const userConsent = getConsent();

    if (userConsent) {
        // Если согласие уже дано, просто активируем нужные скрипты
        if (userConsent.analytics) {
            activateAnalytics();
        }
    } else {
        // Если согласия нет, показываем баннер
        if (banner) {
             setTimeout(() => banner.classList.add('active'), 500); // Небольшая задержка для плавности
        }
    }
});