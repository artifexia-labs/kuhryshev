document.addEventListener('DOMContentLoaded', function() {

    // --- Animace hvězdného pozadí na Canvasu ---
    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        // Nastavení velikosti canvasu
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Třída pro částici (hvězdu)
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(255, 255, 255, ${Math.random()})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Inicializace částic
        function initParticles() {
            const particleCount = window.innerWidth < 768 ? 100 : 200;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();
        window.addEventListener('resize', initParticles);

        // Animační smyčka
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // --- Plynulé posouvání A PŘECHODY MEZI STRÁNKAMI ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');

            // POKUD je to odkaz pro posouvání na STEJNÉ stránce (začíná na #)...
            if (targetUrl && targetUrl.startsWith('#')) {
                // ...ZABRÁNÍME přechodu a plynule posuneme.
                e.preventDefault(); // <-- TOTO JE KLÍČOVÁ ZMĚNA, PŘESUNUTO DOVNITŘ PODMÍNKY
                
                const targetId = targetUrl.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Kompenzace za výšku navigace
                        behavior: 'smooth'
                    });
                }
            }
            // POKUD je to odkaz na jinou stránku (např. "portfolio.html"),
            // tento kód se nespustí a prohlížeč provede normální přechod.
        });
    });

    // --- Animace zobrazení sekcí při skrolování ---
    const sections = document.querySelectorAll('.content-section');
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