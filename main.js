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

// MENSAJE DE ESTADO bajo el botón
function mostrarMensaje(form, tipo, texto) {
  let msg = form.querySelector('.form-status-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'form-status-msg';
    msg.style.cssText = [
      'margin-top:14px',
      'padding:12px 18px',
      'border-radius:8px',
      'font-size:13px',
      'font-family:var(--mono)',
      'letter-spacing:0.04em',
      'opacity:0',
      'transition:opacity 0.4s ease',
      'text-align:center'
    ].join(';');
    form.appendChild(msg);
  }

  if (tipo === 'exito') {
    msg.style.background = 'rgba(29,158,117,0.15)';
    msg.style.border = '1px solid rgba(29,158,117,0.4)';
    msg.style.color = '#5DCAA5';
  } else {
    msg.style.background = 'rgba(231,76,60,0.12)';
    msg.style.border = '1px solid rgba(231,76,60,0.35)';
    msg.style.color = '#e74c3c';
  }

  msg.textContent = texto;
  requestAnimationFrame(() => { msg.style.opacity = '1'; });

  // Desaparece suavemente a los 6 segundos
  setTimeout(() => {
    msg.style.opacity = '0';
    setTimeout(() => msg.remove(), 400);
  }, 6000);
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
      mostrarMensaje(form, 'exito', '✓ Su solicitud fue enviada correctamente. Nos pondremos en contacto a la brevedad.');
    } else {
      throw new Error(data.message || 'Error en el servidor');
    }
  } catch (error) {
    btn.textContent = '❌ Error al enviar';
    btn.style.background = '#e74c3c';
    mostrarMensaje(form, 'error', '❌ No se pudo enviar. Verifique su conexión o contáctenos por WhatsApp.');
    console.error(error);
  } finally {
    setTimeout(() => {
      btn.textContent = 'Enviar solicitud →';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
}
