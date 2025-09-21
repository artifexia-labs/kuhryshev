document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const preloader = document.getElementById('preloader');

    // --- 1. PRELOADER ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.classList.add('hidden');
                content.classList.remove('hidden');
                content.style.opacity = '1';
                startCountdown();
                
                // Инициализируем нужный интерфейс
                if (window.innerWidth > 768) {
                    initBookInterface();
                } else {
                    initMobileDiary();
                }
            }, 400);
        }, 400);
    });

    // --- 2. CUSTOM CURSOR ---
    if (window.innerWidth > 768) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 400, fill: 'forwards' });
        });
    }

    // --- 3. COUNTDOWN ---
    function startCountdown() {
        const birthday = new Date("2026-08-28T00:00:00Z").getTime();
        const update = () => {
            const now = new Date().getTime();
            const dist = birthday - now;
            if (dist < 0) {
                clearInterval(timer);
                ['days','hours','minutes','seconds'].forEach(id => {
                    document.getElementById(id).innerText = '00';
                });
                return;
            }
            const d = Math.floor(dist / (1000 * 60 * 60 * 24));
            const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((dist % (1000 * 60)) / 1000);
            const pad = n => n.toString().padStart(2, '0');
            document.getElementById('days').innerText = pad(d);
            document.getElementById('hours').innerText = pad(h);
            document.getElementById('minutes').innerText = pad(m);
            document.getElementById('seconds').innerText = pad(s);
        };
        update();
        const timer = setInterval(update, 1000);
    }

    // --- 4. BOOK INTERFACE (для ПК) ---
    function initBookInterface() {
        const totalPages = 20;
        let currentPage = 1;
        
        const complimentElement = document.getElementById('current-compliment');
        const photoElement = document.getElementById('current-photo');
        const pageCounter = document.getElementById('page-counter');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        // Комплименты
        const compliments = [
            "You always look stunning — no matter what you wear 👗",
            "Your personality? 100% pure sunshine ☀️",
            "You have the kindest soul I've ever known 💖",
            "Your laugh fixes everything 🎵",
            "You're the definition of 'good vibes only' 🌈",
            "You make everyone around you better 🌟",
            "You're beautiful — inside, outside, everywhere 🌺",
            "Your energy is contagious (in the best way) 🔋",
            "You're effortlessly cool — and you don't even try 😎",
            "You're the friend everyone wishes they had 🤝",
            "You're strong, soft, and absolutely unforgettable 💫",
            "You turn bad days into bear-hug days 🐻",
            "You're weird, wonderful, and 100% you — and that's perfect 🦄",
            "You're the human version of a warm hug 🫂",
            "You're the reason 'perfect' has a new definition 📖",
            "You're not just loved — you're cherished beyond words 💌",
            "You're my favorite notification 📱",
            "You're the main character — and you wear it so well 🎬",
            "You're the kind of person people remember forever 🌹",
            "You're my favorite place to be — no matter where we are 🗺️"
        ];

        // Обновление страницы
        function updatePage() {
            complimentElement.textContent = compliments[currentPage - 1];
            photoElement.src = `photo-${currentPage}.jpg`;
            pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
            
            // Отключаем кнопки на крайних страницах
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
        }

        // Навигация кнопками
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePage();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });

        // Навигация клавишами
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentPage > 1) {
                currentPage--;
                updatePage();
            } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });

        // Навигация колесом мыши
        document.addEventListener('wheel', (e) => {
            if (e.deltaY < 0 && currentPage > 1) {
                currentPage--;
                updatePage();
            } else if (e.deltaY > 0 && currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });

        // Инициализация
        updatePage();
    }

    // --- 5. MOBILE DIARY INTERFACE ---
    function initMobileDiary() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.floating-item').forEach((item, i) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, i * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.evidence-group').forEach(group => {
            observer.observe(group);
        });
    }

    // --- 6. EASTER EGGS ---
    document.querySelectorAll('.clickable').forEach(bear => {
        bear.addEventListener('click', function() {
            const group = this.closest('[data-group]')?.dataset.group;
            const messages = {
                "TWICE": "💖 Verdict: Guilty of being adorable.",
                "ENHYPEN": "🩸 Verdict: Guilty of stealing hearts.",
                "Stray Kids": "🦿 Verdict: Guilty of being unstoppable.",
                "Lightstick": "✨ Verdict: Guilty of shining too bright.",
                "Secret": "🕵️ FINAL VERDICT:\n\nYou're not a suspect — you're the reason this case exists.\n\nYou're loved. You're seen. You're enough.",
                "default": "🧸 Verdict: Not guilty — you're perfect."
            };
            alert(messages[group] || messages.default);
        });
    });

    // --- 7. PERFORMANCE ---
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting ? heroVideo.play() : heroVideo.pause();
            });
        }, { threshold: 0.1 });
        observer.observe(document.getElementById('hero'));
    }

    if (window.matchMedia('(prefers-reduced-motion)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.transition = 'none';
            el.style.animation = 'none';
        });
    }
});