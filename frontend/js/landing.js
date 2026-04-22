/* =========================================================
   Minutes — Landing JS
   - Navbar scroll shadow
   - Scroll-reveal animation
   - Query param pass-through for login/signup mode
   ========================================================= */

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Scroll-reveal
const revealEls = document.querySelectorAll(
  '.feature-card, .step-card, .testi-card, .hero-visual, #trusted'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Pass mode param so index.html can pre-select login vs signup
document.querySelectorAll('a[href*="index.html"]').forEach(a => {
  const url = new URL(a.href, location.href);
  const mode = url.searchParams.get('mode') || 'login';
  a.dataset.mode = mode;
});
