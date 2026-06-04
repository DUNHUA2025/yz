/* ===================================
   雅緻裝修設計 - Elegant Renovation Design
   Main JavaScript  v2.0
=================================== */

// NAVBAR
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = navbar.offsetHeight + 8;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
    });
});

// ACTIVE NAV
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (a) a.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -40% 0px', threshold: 0 }).observe
    ? sections.forEach(s => new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (a) a.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 }).observe(s))
    : null;

// SCROLL ANIMATIONS
const animEls = document.querySelectorAll(
    '.service-card, .portfolio-item, .proc-step, .testi-card, .ci-item, .ah-item, .tb-step, .tb-feature-card, .usp-item, .section-header, .about-text, .about-img-wrap, .taobao-text, .taobao-features, .booking-header'
);
animEls.forEach(el => el.classList.add('fade-up'));

const animObs = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentNode.children).filter(c => c.classList.contains('fade-up'));
            const i = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('vis'), (i >= 0 ? i : 0) * 80);
            animObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => animObs.observe(el));

// PORTFOLIO FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const portItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portItems.forEach(item => {
            const show = filter === 'all' || item.dataset.category === filter;
            if (show) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.92)';
                requestAnimationFrame(() => {
                    item.style.transition = 'opacity .35s ease, transform .35s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                });
            } else {
                item.style.transition = 'opacity .25s ease';
                item.style.opacity = '0';
                setTimeout(() => { item.style.display = 'none'; }, 250);
            }
        });
    });
});

// BOOKING DATE
const bookingDate = document.getElementById('bookingDate');
if (bookingDate) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    bookingDate.min = d.toISOString().split('T')[0];
    const def = new Date();
    def.setDate(def.getDate() + 3);
    bookingDate.value = def.toISOString().split('T')[0];
}

// PHONE FORMAT
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (val.length > 4) val = val.slice(0, 4) + ' ' + val.slice(4);
        e.target.value = val;
    });
});

// FORM VALIDATION
document.querySelectorAll('[required]').forEach(el => {
    el.addEventListener('blur', () => {
        el.style.borderColor = el.value.trim() ? 'var(--gold)' : '#e53935';
    });
    el.addEventListener('input', () => {
        if (el.value.trim()) el.style.borderColor = 'var(--gold)';
    });
});

// MODAL
function closeModal() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}
window.closeModal = closeModal;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// HERO ANIMATION ON LOAD
window.addEventListener('load', () => {
    const els = document.querySelectorAll('.hero-logo-wrap, .hero-title, .hero-tagline, .hero-sub, .hero-btns, .hero-stats');
    els.forEach((el, i) => {
        el.style.cssText = `opacity:0;transform:translateY(26px);transition:opacity .65s ease ${i * .13}s,transform .65s ease ${i * .13}s;`;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 150 + i * 130);
    });
});

// WHATSAPP PULSE
const wb = document.querySelector('.float-btn.wb');
if (wb) {
    setInterval(() => {
        wb.animate([
            { boxShadow: '0 0 0 0 rgba(37,211,102,.5)' },
            { boxShadow: '0 0 0 14px rgba(37,211,102,0)' }
        ], { duration: 1200, easing: 'ease-out' });
    }, 3000);
}

console.log('%c雅緻裝修設計', 'color:#C8971A;font-size:20px;font-weight:bold;font-family:serif;');
console.log('%c📧 hkelegant852@gmail.com | 📞 9819 8117 | 💬 WA: 9798 1959', 'color:#555;font-size:12px;');
console.log('%c📍 屯門石排頭路5號偉昌工業中心地下I鋪', 'color:#555;font-size:12px;');
