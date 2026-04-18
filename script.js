/**
 * PearlSmile Dental Clinic — script.js
 * Dr. Anushka Singh, BDS
 * All interactions, animations, and form validation
 */

/* =============================================
   1. LOADER
   ============================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations after loader
    document.body.style.overflow = 'auto';
  }, 2000);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* =============================================
   2. STICKY HEADER
   ============================================= */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleBackToTop();
});


/* =============================================
   3. MOBILE HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!header.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* =============================================
   4. ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}


/* =============================================
   5. SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* =============================================
   6. SCROLL ANIMATIONS (AOS-LIKE)
   — Service cards are EXCLUDED from hiding
   ============================================= */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, delay);
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  // Skip service cards — they must always be visible
  if (el.classList.contains('service-card')) return;
  scrollObserver.observe(el);
});


/* =============================================
   7. FAQ ACCORDION
   ============================================= */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(i => {
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-answer').classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});


/* =============================================
   8. TESTIMONIALS SLIDER
   ============================================= */
const track       = document.getElementById('testimonialTrack');
const cards       = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsWrapper = document.getElementById('sliderDots');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');

let currentSlide  = 0;
let slidesPerView = getSlidesPerView();
let totalSlides   = Math.max(0, cards.length - slidesPerView);
let autoSlideTimer;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function buildDots() {
  if (!dotsWrapper) return;
  dotsWrapper.innerHTML = '';
  for (let i = 0; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrapper.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsWrapper) return;
  dotsWrapper.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides));
  const cardWidth  = cards[0] ? cards[0].offsetWidth + 24 : 0; // gap = 24px
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  updateDots();
}

function nextSlide() {
  goToSlide(currentSlide >= totalSlides ? 0 : currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide <= 0 ? totalSlides : currentSlide - 1);
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(nextSlide, 4500);
}

function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}

if (track && cards.length > 0) {
  buildDots();
  startAutoSlide();

  prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });
  nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });

  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', startAutoSlide);

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
      stopAutoSlide(); startAutoSlide();
    }
  }, { passive: true });

  // Rebuild on resize
  window.addEventListener('resize', () => {
    const newSPV = getSlidesPerView();
    if (newSPV !== slidesPerView) {
      slidesPerView  = newSPV;
      totalSlides    = Math.max(0, cards.length - slidesPerView);
      currentSlide   = 0;
      buildDots();
      goToSlide(0);
    }
  });
}


/* =============================================
   9. APPOINTMENT FORM VALIDATION
   ============================================= */
const form = document.getElementById('appointmentForm');

const validators = {
  name: {
    el: () => document.getElementById('name'),
    err: () => document.getElementById('nameError'),
    validate(val) {
      if (!val.trim()) return 'Full name is required.';
      if (val.trim().length < 3) return 'Name must be at least 3 characters.';
      return '';
    }
  },
  phone: {
    el: () => document.getElementById('phone'),
    err: () => document.getElementById('phoneError'),
    validate(val) {
      const clean = val.replace(/[\s\-()]/g, '');
      if (!clean) return 'Phone number is required.';
      if (!/^(\+91)?[6-9]\d{9}$/.test(clean)) return 'Enter a valid 10-digit Indian mobile number.';
      return '';
    }
  },
  email: {
    el: () => document.getElementById('email'),
    err: () => document.getElementById('emailError'),
    validate(val) {
      if (!val.trim()) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
      return '';
    }
  },
  date: {
    el: () => document.getElementById('date'),
    err: () => document.getElementById('dateError'),
    validate(val) {
      if (!val) return 'Please select your preferred date.';
      const selected = new Date(val);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) return 'Please select a future date.';
      return '';
    }
  }
};

// Set min date for date input
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Real-time validation
Object.values(validators).forEach(({ el, err, validate }) => {
  const input = el();
  if (!input) return;
  input.addEventListener('blur', () => {
    const msg = validate(input.value);
    showFieldError(input, err(), msg);
  });
  input.addEventListener('input', () => {
    if (err().textContent) {
      const msg = validate(input.value);
      showFieldError(input, err(), msg);
    }
  });
});

function showFieldError(input, errEl, msg) {
  if (!errEl) return;
  errEl.textContent = msg;
  input.classList.toggle('error', !!msg);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.values(validators).forEach(({ el, err, validate }) => {
      const input = el();
      if (!input) return;
      const msg = validate(input.value);
      showFieldError(input, err(), msg);
      if (msg) isValid = false;
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.classList.add('hidden');
      document.getElementById('formSuccess').classList.remove('hidden');
    }, 1600);
  });
}

// Reset form
function resetForm() {
  form.reset();
  form.classList.remove('hidden');
  document.getElementById('formSuccess').classList.add('hidden');
  // Clear all errors
  Object.values(validators).forEach(({ el, err }) => {
    const input = el();
    if (input) input.classList.remove('error');
    if (err()) err().textContent = '';
  });
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="ri-calendar-check-line"></i> Confirm Appointment';
    submitBtn.disabled = false;
  }
}

// Add spin animation style dynamically
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
`;
document.head.appendChild(spinStyle);


/* =============================================
   10. BACK TO TOP BUTTON
   ============================================= */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =============================================
   11. SERVICE CARD STAGGER
   ============================================= */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, i) => {
  card.style.animationDelay = `${i * 60}ms`;
  if (!card.dataset.delay) card.dataset.delay = i * 60;
});

const whyCards = document.querySelectorAll('.why-card');
whyCards.forEach((card, i) => {
  if (!card.dataset.delay) card.dataset.delay = i * 80;
});


/* =============================================
   12. COUNTER ANIMATION FOR HERO STATS
   ============================================= */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current    = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat strong');
      stats.forEach(stat => {
        const text = stat.textContent;
        const num  = parseInt(text);
        const suffix = text.replace(/\d/g, '');
        animateCounter(stat, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);


/* =============================================
   13. HEADER NAV TRANSPARENT → SOLID ON HERO
   ============================================= */
// Keep nav links white when over the hero and not scrolled
const heroSection = document.getElementById('home');

function updateNavTheme() {
  const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 500;
  if (window.scrollY < heroBottom - 80 && !header.classList.contains('scrolled')) {
    // over hero; keep dark text (the bg is light gradient)
  }
}

window.addEventListener('scroll', updateNavTheme);
updateNavTheme();


/* =============================================
   14. SMOOTH REVEAL FOR WHY & TESTIMONIAL CARDS
   ============================================= */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

// Only animate why-cards and testimonial-cards (NOT service-cards)
document.querySelectorAll('.why-card, .testimonial-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.08}s`;
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(el);
});


/* =============================================
   15. HIGHLIGHT CURRENT YEAR IN FOOTER
   ============================================= */
const yearEl = document.querySelector('.footer-bottom p');
if (yearEl) {
  yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
}


/* =============================================
   END OF script.js
   ============================================= */
console.log('%cPearlSmile Dental Clinic — Dr. Anushka Singh, BDS', 'color:#0e9ea7;font-weight:bold;font-size:14px;');
