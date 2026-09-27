/* =============================================
   AJMAIN Cyber Pro — Interactions & Animations
   ============================================= */

// ===== GRID CANVAS BACKGROUND =====
const gridCanvas = document.getElementById('grid-canvas');
const gctx = gridCanvas.getContext('2d');
let gridParticles = [];

function resizeGrid() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
}

class GridParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * gridCanvas.width;
        this.y = Math.random() * gridCanvas.height;
        this.size = Math.random() * 1.5 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5
            ? `rgba(139, 92, 246, ${this.alpha})`
            : `rgba(34, 211, 238, ${this.alpha})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > gridCanvas.width || this.y < 0 || this.y > gridCanvas.height) {
            this.reset();
        }
    }
    draw() {
        gctx.beginPath();
        gctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        gctx.fillStyle = this.color;
        gctx.fill();
    }
}

function initGrid() {
    gridParticles = [];
    const count = Math.min(Math.floor((gridCanvas.width * gridCanvas.height) / 15000), 80);
    for (let i = 0; i < count; i++) {
        gridParticles.push(new GridParticle());
    }
}

function drawConnections() {
    for (let i = 0; i < gridParticles.length; i++) {
        for (let j = i + 1; j < gridParticles.length; j++) {
            const dx = gridParticles[i].x - gridParticles[j].x;
            const dy = gridParticles[i].y - gridParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
                const opacity = (1 - dist / 110) * 0.12;
                gctx.beginPath();
                gctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                gctx.lineWidth = 0.6;
                gctx.moveTo(gridParticles[i].x, gridParticles[i].y);
                gctx.lineTo(gridParticles[j].x, gridParticles[j].y);
                gctx.stroke();
            }
        }
    }
}

function animateGrid() {
    gctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridParticles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateGrid);
}

window.addEventListener('resize', () => {
    resizeGrid();
    initGrid();
});

resizeGrid();
initGrid();
animateGrid();

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
const toTop = document.getElementById('to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
        toTop.classList.add('visible');
    } else {
        toTop.classList.remove('visible');
    }
    setActiveNav();
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

// ===== ACTIVE NAV =====
function setActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-item[href="#${id}"]`);
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
            if (link) link.classList.add('active');
        }
    });
}

// ===== COUNTER ANIMATION =====
function runCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = +el.getAttribute('data-count');
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        };
        tick();
    });
}

// ===== SKILL BARS =====
function runSkillBars() {
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        bar.style.width = w + '%';
    });
}

// ===== ROADMAP REVEAL =====
function observeRoadmap() {
    const items = document.querySelectorAll('.road-item');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 120);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(item => obs.observe(item));
}

// ===== CARD REVEAL =====
function observeCards() {
    const cards = document.querySelectorAll('.card-glass');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(28px)';
                entry.target.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    cards.forEach(c => {
        c.style.opacity = '0';
        obs.observe(c);
    });
}

// ===== SIMPLE TILT EFFECT =====
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 18;
        const rotateY = (centerX - x) / 18;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
        window.location.href = `mailto:ajmain18591859@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        const btn = form.querySelector('button');
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Opening Email...</span> <i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = original;
            form.reset();
        }, 2200);
    });
}

// ===== SMOOTH ANCHOR =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
    });
});

// ===== INIT OBSERVERS =====
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.getElementById('home');
    const skills = document.getElementById('skills');

    const heroObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runCounters();
            heroObs.disconnect();
        }
    }, { threshold: 0.4 });
    if (hero) heroObs.observe(hero);

    const skillObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runSkillBars();
            skillObs.disconnect();
        }
    }, { threshold: 0.25 });
    if (skills) skillObs.observe(skills);

    observeRoadmap();
    observeCards();
});
