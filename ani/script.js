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
                initScrollAnimations();
            }, 400);
        }, 400);
    });

    // --- 2. CUSTOM CURSOR (desktop only) ---
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

    // --- 3. PARALLAX (desktop only) ---
    if (window.innerWidth > 768) {
        const canvas = document.getElementById('memories-canvas');
        const groups = document.querySelectorAll('.evidence-group');
        canvas.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const mouseX = e.clientX - centerX;
            groups.forEach(group => {
                const depth = 0.02;
                const moveX = mouseX * depth;
                group.style.transform = `translateX(${moveX}px)`;
            });
        });
    }

    // --- 4. COUNTDOWN ---
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

    // --- 5. SCROLL ANIMATIONS ---
    function initScrollAnimations() {
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
            const group = this.closest('.kpop-bear')?.dataset.group;
            const messages = {
                "TWICE": "💖 Verdict: Guilty of being adorable.",
                "ENHYPEN": "🩸 Verdict: Guilty of stealing hearts.",
                "Stray Kids": "🦿 Verdict: Guilty of being unstoppable.",
                "Lightstick": "✨ Verdict: Guilty of shining too bright.",
                "Secret": "🕵️ FINAL VERDICT:\n\nYou’re not a suspect — you’re the reason this case exists.\n\nYou’re loved. You’re seen. You’re enough.",
                "default": "🧸 Verdict: Not guilty — you’re perfect."
            };
            alert(messages[group] || messages.default);
        });
    });

    // --- 7. PERFORMANCE ---
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && window.innerWidth > 768) {
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