/* ===================================
   香港雅緻裝修 - HK Elegant Renovation
   Main JavaScript
=================================== */

// ===================================
// NAVBAR - Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when nav link clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${entry.target.id}`) {
                    link.style.color = 'var(--gold-light)';
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ===================================
// SCROLL ANIMATIONS
// ===================================
const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .process-step, .testimonial-card, .contact-item, .feature-item');

animatedElements.forEach(el => {
    el.classList.add('fade-in');
});

// Fixed: Use a global counter for proper staggered animation timing
let animationIndex = 0;
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const currentIndex = animationIndex++;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, currentIndex * 80);
            animationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => animationObserver.observe(el));

// About section animations
const aboutText = document.querySelector('.about-text');
const aboutImage = document.querySelector('.about-image');

if (aboutText) {
    aboutText.classList.add('slide-in-left');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    aboutObserver.observe(aboutText);
}

if (aboutImage) {
    aboutImage.classList.add('slide-in-right');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                imgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    imgObserver.observe(aboutImage);
}

// ===================================
// PORTFOLIO FILTER
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.style.display = 'block';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===================================
// SET MIN DATE FOR BOOKING
// ===================================
const bookingDate = document.getElementById('bookingDate');
if (bookingDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    bookingDate.setAttribute('min', minDate);
    
    // Set default date to 3 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    bookingDate.value = defaultDate.toISOString().split('T')[0];
}

// ===================================
// CONTACT FORM SUBMISSION (Formspree)
// ===================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 發送中...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://formspree.io/f/mjkyggye', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('查詢已成功發送！我們將盡快回覆您。', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showNotification('發送失敗，請稍後再試或直接 WhatsApp 聯絡我們。', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// BOOKING FORM SUBMISSION (Formspree)
// ===================================
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 處理中...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(135deg, #a0a0a0, #c0c0c0)';
        
        try {
            const formData = new FormData(bookingForm);
            const response = await fetch('https://formspree.io/f/mjkyggye', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showModal();
                bookingForm.reset();
                
                // Reset date
                if (bookingDate) {
                    const defaultDate = new Date();
                    defaultDate.setDate(defaultDate.getDate() + 3);
                    bookingDate.value = defaultDate.toISOString().split('T')[0];
                }
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showNotification('預約失敗，請稍後再試或直接 WhatsApp 聯絡我們。', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }
    });
}

// ===================================
// MODAL FUNCTIONS
// ===================================
function showModal() {
    const modal = document.getElementById('successModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make closeModal globally accessible
window.closeModal = closeModal;

// ===================================
// NOTIFICATION TOAST
// ===================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
        <div class="notification-inner">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 3000;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00C853, #69F0AE)' : 'linear-gradient(135deg, #f44336, #ef9a9a)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transform: translateX(60px);
        transition: all 0.4s ease;
        font-family: 'Noto Sans TC', sans-serif;
        max-width: 380px;
    `;
    
    notification.querySelector('.notification-inner').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 50);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(60px)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ===================================
// COUNTER ANIMATION FOR STATS
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            clearInterval(timer);
            start = target;
        }
        
        const value = Math.floor(start);
        if (element.dataset.suffix) {
            element.textContent = value + element.dataset.suffix;
        } else {
            element.textContent = value;
        }
    }, 16);
}

// Trigger counter animation when hero stats are visible
const statNumbers = document.querySelectorAll('.stat-number');
const heroSection = document.querySelector('.hero');

if (heroSection && statNumbers.length > 0) {
    setTimeout(() => {
        // Stats are visible on page load (hero section)
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            // Numbers are already set in HTML, just add pulse animation
            stat.style.animation = 'pulse 0.5s ease';
        });
    }, 1000);
}

// ===================================
// SCROLL TO TOP ON LOGO CLICK
// ===================================
const logoEl = document.querySelector('.nav-logo');
if (logoEl) {
    logoEl.style.cursor = 'pointer';
    logoEl.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================
// KEYBOARD NAVIGATION FOR MODAL
// ===================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===================================
// FORM VALIDATION ENHANCEMENT
// ===================================
function addFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef5350';
            } else {
                input.style.borderColor = 'var(--gold)';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--gold)';
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = 'var(--gold)';
            }
        });
    });
}

addFormValidation('bookingForm');
addFormValidation('contactForm');

// ===================================
// PHONE NUMBER FORMATTING
// ===================================
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        }
        e.target.value = value;
    });
});

// ===================================
// LAZY LOADING IMAGES (Intersection Observer)
// ===================================
const portfolioImgs = document.querySelectorAll('.portfolio-img');
portfolioImgs.forEach(img => {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                imgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    img.style.opacity = '0.95';
    img.style.transition = 'opacity 0.5s ease';
    imgObserver.observe(img);
});

// ===================================
// PAGE LOAD ANIMATION
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-stats');
    heroElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + i * 150);
    });
});

console.log('🏠 香港雅緻裝修 HK Elegant Renovation - Website Loaded');
console.log('📧 Contact: hkelegant852@gmail.com');
