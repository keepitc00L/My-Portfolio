/* ═══════════════════ ANIMATED BG LINES (like tbhx.net) ═══════════════════ */
(function initBgLines() {
    const canvas = document.getElementById('bgLines');
    const ctx = canvas.getContext('2d');
    let w, h, lines = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create flowing lines
    const LINE_COUNT = 12;
    for (let i = 0; i < LINE_COUNT; i++) {
        lines.push({
            x: Math.random() * w,
            y: Math.random() * h,
            length: 300 + Math.random() * 500,
            angle: (Math.PI / 6) + Math.random() * (Math.PI / 3),
            speed: 0.15 + Math.random() * 0.35,
            drift: Math.random() * 0.002 - 0.001,
            thickness: 0.5 + Math.random() * 1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#0a0a0a';

        for (const l of lines) {
            ctx.lineWidth = l.thickness;
            ctx.beginPath();

            const ex = l.x + Math.cos(l.angle) * l.length;
            const ey = l.y + Math.sin(l.angle) * l.length;

            // Draw a slightly curved line
            const cx = (l.x + ex) / 2 + Math.sin(Date.now() * 0.0005 + l.angle) * 30;
            const cy = (l.y + ey) / 2 + Math.cos(Date.now() * 0.0004 + l.angle) * 20;

            ctx.moveTo(l.x, l.y);
            ctx.quadraticCurveTo(cx, cy, ex, ey);
            ctx.stroke();

            // Move
            l.y -= l.speed;
            l.angle += l.drift;

            // Reset when off screen
            if (l.y + l.length * Math.sin(l.angle) < -50) {
                l.y = h + 50;
                l.x = Math.random() * w;
                l.angle = (Math.PI / 6) + Math.random() * (Math.PI / 3);
            }
            if (l.x < -200) l.x = w + 100;
            if (l.x > w + 200) l.x = -100;
        }

        requestAnimationFrame(draw);
    }
    draw();
})();

/* ═══════════════════ LOADER ═══════════════════ */
(function () {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loaderBar');
    const pct = document.getElementById('loaderPercent');
    let progress = 0;
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            pct.textContent = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initReveal();
            }, 400);
            return;
        }
        bar.style.width = progress + '%';
        pct.textContent = Math.floor(progress) + '%';
    }, 80);
})();

/* ═══════════════════ CUSTOM CURSOR ═══════════════════ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animateCursor() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, .project-item, .skill-card, .stat-card, .contact-link, .cert-image-wrap').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}

/* ═══════════════════ NAVIGATION ═══════════════════ */
const nav = document.getElementById('mainNav');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ═══════════════════ SCROLL REVEAL ═══════════════════ */
function initReveal() {
    const reveals = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
}

/* ═══════════════════ STAT COUNTER ═══════════════════ */
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const step = target / (1500 / 16);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current);
            }, 16);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

/* ═══════════════════ LIGHTBOX ═══════════════════ */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.cert-image-wrap:not(.cert-empty)').forEach(wrap => {
    wrap.addEventListener('click', () => {
        const img = wrap.querySelector('img');
        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

/* ═══════════════════ SMOOTH SCROLL ═══════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = nav.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
