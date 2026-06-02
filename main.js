// GeoSystems Consulting — main.js
// Consulting | Technology | Risk & Quality

// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a, button, .srv, .audit-card, .quality-card, .disrupt-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursor.style.background = 'var(--amber)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--teal-light)'; });
});

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

// MOBILE MENU
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  if (nav.style.display === 'flex') {
    nav.style.display = 'none';
  } else {
    nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:70px;left:0;right:0;background:rgba(2,24,41,0.97);padding:1.5rem 2rem;gap:1.25rem;border-bottom:1px solid var(--border);backdrop-filter:blur(20px)';
  }
}

// FORMULARIO DE COTIZACIÓN — envío via send.py (Flask + Gmail SMTP)
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');

  btn.textContent = 'Enviando solicitud...';
  btn.disabled = true;

  try {
    const response = await fetch('send.py', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      btn.textContent = '✓ Solicitud enviada';
      btn.style.background = 'var(--teal)';
      form.reset();
    } else {
      throw new Error(data.message || 'Error en el servidor');
    }
  } catch (error) {
    btn.textContent = '❌ Error al enviar';
    btn.style.background = '#e74c3c';
    console.error(error);
  } finally {
    setTimeout(() => {
      btn.textContent = 'Enviar solicitud →';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
}
