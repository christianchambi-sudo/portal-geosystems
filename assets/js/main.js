// GeoSystems Consulting — main.js (multipágina)
// El menú y el pie de página se generan aquí: edítelos en UN solo lugar.

const NAV = [
  { href: 'geoespacial.html',       label: 'I · Geoespacial',  page: 'geo' },
  { href: 'auditoria.html',         label: 'II · Auditoría & DBA', page: 'audit' },
  { href: 'geoai.html',             label: 'III · GeoAI',      page: 'geoai' },
  { href: 'capacitacion.html',      label: 'IV · Capacitación', page: 'training' },
  { href: 'sistema-inventario.html', label: 'Videos',          page: 'videos', cls: 'nav-video' },
  { href: 'contacto.html',          label: 'Contacto',         page: 'contact' },
];
const WHATSAPP = 'https://wa.me/59170178698?text=' + encodeURIComponent('Hola GeoSystems Consulting, me interesa solicitar una cotización por sus servicios. ¿Podrían brindarme más información?');

const LOGO_SVG = `<svg viewBox="0 0 38 38" aria-hidden="true"><defs><radialGradient id="ng1" cx="38%" cy="32%"><stop offset="0%" stop-color="#185FA5"/><stop offset="55%" stop-color="#042C53"/><stop offset="100%" stop-color="#021829"/></radialGradient><clipPath id="ngc"><circle cx="19" cy="19" r="15"/></clipPath></defs><circle cx="19" cy="19" r="15" fill="url(#ng1)"/><g clip-path="url(#ngc)" fill="none" stroke="rgba(93,202,165,.25)" stroke-width=".6"><ellipse cx="19" cy="19" rx="15" ry="4"/><ellipse cx="19" cy="13" rx="12" ry="3"/><ellipse cx="19" cy="25" rx="12" ry="3"/><ellipse cx="19" cy="19" rx="5" ry="15"/><ellipse cx="19" cy="19" rx="11" ry="15"/></g><g clip-path="url(#ngc)" fill="rgba(93,202,165,.3)" stroke="rgba(93,202,165,.5)" stroke-width=".4"><path d="M16,16 Q15,13 17,11 Q20,10 22,12 Q23,14 21,17 Q19,19 17,18Z"/><path d="M10,18 Q9,15 11,14 Q13,13 14,15 Q14,18 12,19Z"/><path d="M22,20 Q23,18 25,19 Q26,21 24,23 Q22,23 22,21Z"/></g><circle cx="19" cy="19" r="15" fill="none" stroke="rgba(93,202,165,.35)" stroke-width=".8"/><ellipse cx="19" cy="19" rx="18" ry="6" fill="none" stroke="rgba(239,159,39,.4)" stroke-width=".6" stroke-dasharray="1,4" transform="rotate(-20 19 19)"/><circle cx="35" cy="15" r="1.8" fill="#EF9F27"/><circle cx="19" cy="21" r="1.5" fill="#5DCAA5"><animate attributeName="r" values="1.5;2.8;1.5" dur="2s" repeatCount="indefinite"/></circle></svg>`;

const page = document.body.dataset.page || '';

// ---------- NAV ----------
const nav = document.createElement('nav');
nav.id = 'navbar';
if (page !== 'home') nav.classList.add('solid');
nav.innerHTML = `
  <div class="nav-inner">
    <a href="index.html" class="nav-logo" aria-label="GeoSystems Consulting — Inicio">${LOGO_SVG}
      <span><span class="nav-logo-name">GeoSystems</span><span class="nav-logo-sub">Consulting</span></span></a>
    <ul class="nav-links" id="navLinks">
      ${NAV.map(n => `<li><a href="${n.href}" class="${n.cls || ''} ${n.page === page ? 'active' : ''}">${n.label}</a></li>`).join('')}
    </ul>
    <a href="contacto.html" class="nav-cta">✦ Solicitar consulta →</a>
    <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
  </div>`;
document.body.prepend(nav);
const toggle = nav.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.querySelector('.nav-links').classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? '✕' : '☰';
});
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

// ---------- FOOTER ----------
const footer = document.createElement('footer');
footer.innerHTML = `
  <div class="container">
    <div class="f-grid">
      <div>
        <div class="f-brand">GeoSystems Consulting</div>
        <div class="f-tag">Consulting · Technology · Risk & Quality</div>
        <p>Firma de consultoría especializada en tecnología geoespacial, auditoría estratégica e innovación para Bolivia.</p>
      </div>
      <div><h5>Divisiones</h5><ul>
        <li><a href="geoespacial.html">Inteligencia Geoespacial</a></li>
        <li><a href="auditoria.html">Auditoría y DBA</a></li>
        <li><a href="geoai.html">GeoAI & Transformación Digital</a></li>
        <li><a href="capacitacion.html">Capacitación</a></li></ul></div>
      <div><h5>Empresa</h5><ul>
        <li><a href="sistema-inventario.html">Videos del sistema</a></li>
        <li><a href="geoespacial.html#catastro">Catastro urbano</a></li>
        <li><a href="capacitacion.html#calidad">Control de calidad</a></li>
        <li><a href="contacto.html">Solicitar cotización</a></li></ul></div>
      <div><h5>Contacto</h5><ul>
        <li><a href="mailto:boliviageosystems@gmail.com">boliviageosystems@gmail.com</a></li>
        <li><a href="tel:+59170178698">+591 70178698</a></li>
        <li><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><a>La Paz · Sucre, Bolivia</a></li></ul></div>
    </div>
    <div class="f-bottom"><span>© ${new Date().getFullYear()} GeoSystems Consulting · La Paz, Bolivia · Todos los derechos reservados</span><span>Hecho en Bolivia 🇧🇴</span></div>
  </div>`;
document.body.append(footer);

// ---------- WHATSAPP ----------
const wa = document.createElement('a');
wa.className = 'wa'; wa.href = WHATSAPP; wa.target = '_blank'; wa.rel = 'noopener';
wa.setAttribute('aria-label', 'Escríbenos por WhatsApp');
wa.innerHTML = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4c-1-1.6-1.6-3.5-1.6-5.4C5.3 9.8 10.1 5.1 16 5.1s10.7 4.7 10.7 10.5S21.9 26.1 16 26.1zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.8 1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
document.body.append(wa);

// ---------- REVEAL ----------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- LIGHTBOX (imágenes con data-zoom) ----------
const zooms = document.querySelectorAll('[data-zoom]');
if (zooms.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="x" aria-label="Cerrar">×</button><img alt="">';
  document.body.append(lb);
  const img = lb.querySelector('img');
  zooms.forEach(z => z.addEventListener('click', () => {
    const src = z.dataset.zoom || z.querySelector('img').src;
    img.src = src; img.alt = z.querySelector('img')?.alt || '';
    lb.classList.add('open');
  }));
  lb.addEventListener('click', () => lb.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
}

// ---------- FORMULARIO (send.py — Flask + Gmail SMTP) ----------
function mostrarMensaje(form, tipo, texto) {
  let msg = form.querySelector('.form-status-msg');
  if (!msg) { msg = document.createElement('div'); msg.className = 'form-status-msg'; form.appendChild(msg); }
  const ok = tipo === 'exito';
  msg.style.cssText = `margin-top:14px;padding:12px 18px;border-radius:10px;font-size:13px;font-family:var(--mono);text-align:center;
    background:${ok ? 'rgba(29,158,117,.15)' : 'rgba(231,76,60,.12)'};border:1px solid ${ok ? 'rgba(29,158,117,.4)' : 'rgba(231,76,60,.35)'};color:${ok ? '#5DCAA5' : '#e74c3c'}`;
  msg.textContent = texto;
  setTimeout(() => msg.remove(), 7000);
}
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target, btn = form.querySelector('button[type="submit"]'), original = btn.textContent;
  btn.textContent = 'Enviando solicitud...'; btn.disabled = true;
  try {
    const r = await fetch('send.py', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    const data = await r.json();
    if (!data.success) throw new Error(data.message || 'Error en el servidor');
    btn.textContent = '✓ Solicitud enviada'; form.reset();
    mostrarMensaje(form, 'exito', '✓ Su solicitud fue enviada correctamente. Nos pondremos en contacto a la brevedad.');
  } catch (err) {
    btn.textContent = '❌ Error al enviar';
    mostrarMensaje(form, 'error', '❌ No se pudo enviar. Verifique su conexión o contáctenos por WhatsApp.');
  } finally {
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 4000);
  }
}
window.handleSubmit = handleSubmit;
// Preseleccionar servicio desde ?servicio=...
const sel = document.querySelector('select[name="servicio"]');
const pre = new URLSearchParams(location.search).get('servicio');
if (sel && pre) [...sel.options].forEach(o => { if (o.text === pre) sel.value = o.value || o.text; });
