// =========================================================
//  VIDEOS — Titanium Store (sistema de inventario: catálogo, ventas, compras, reportes)
//  Cada video tiene 2 versiones:
//    horizontal → se muestra en computadora / tablet
//    vertical   → se muestra en celular
//  Para agregar o cambiar un video, solo edite esta lista.
// =========================================================
const VIDEOS = [
  {
    id: 'demo', duracion: '2:01',
    titulo: 'Recorrido general del sistema',
    descripcion: 'Muestra el acceso seguro, el panel de control y el catálogo web mayorista. Al cambiar el tipo de cambio, el catálogo actualiza los precios solo. También incluye la gestión de productos por marca, el alta y edición con precios calculados en bolivianos, la actualización rápida por código, y las marcas y categorías.',
  },
  {
    id: 'ventas', duracion: '1:43',
    titulo: 'Módulo de ventas',
    descripcion: 'Ventas por unidad y por mayor, con pago en efectivo, QR o mixto. Las boletas salen en Bs y $US, se pueden editar o anular (el stock se devuelve solo) y se envían por WhatsApp. Además, convierte en boleta los pedidos que los clientes hacen desde el catálogo web.',
  },
  {
    id: 'compras', duracion: '1:01',
    titulo: 'Módulo de compras',
    descripcion: 'Registra compras por proveedor con factura, cajas, unidades y costo en dólares. La compra pasa por borrador, confirmada y recibida, y al recibir la mercadería el inventario sube automáticamente.',
  },
  {
    id: 'reportes', duracion: '0:58',
    titulo: 'Módulo de reportes',
    descripcion: 'Reportes de ventas generales, por vendedor y por método de pago, más los productos más vendidos, las compras por proveedor, el inventario con stock crítico y el ranking de clientes. Filtra por día, semana, mes o un rango de fechas. Como opción, se puede agregar la exportación a Excel y PDF.',
  },
  {
    id: 'celular', duracion: '1:18',
    titulo: 'El sistema en tu celular',
    descripcion: 'Funciona desde el navegador del teléfono (iPhone o Android) sin instalar nada. Permite vender, cobrar, enviar boletas por WhatsApp, actualizar precios y stock, registrar compras y consultar reportes desde cualquier lugar.',
  },
];
// Rutas: assets/videos/horizontal/<id>.mp4  ·  assets/videos/vertical/<id>.mp4
// Portadas: assets/img/videos/<id>-h.jpg  ·  assets/img/videos/<id>-v.jpg
const src = (v, vert) => `assets/videos/${vert ? 'vertical' : 'horizontal'}/${v.id}.mp4`;
const poster = (v, vert) => `assets/img/videos/${v.id}-${vert ? 'v' : 'h'}.jpg`;

// ---------------------------------------------------------
(function () {
  const player = document.getElementById('vPlayer');
  const box = document.getElementById('vBox');
  const empty = document.getElementById('vEmpty');
  const list = document.getElementById('vList');
  const tTitle = document.getElementById('vTitle');
  const tDesc = document.getElementById('vDesc');
  const tNum = document.getElementById('vNum');
  if (!player || !list) return;

  // Celular (pantalla angosta) → versión vertical
  const mq = window.matchMedia('(max-width: 767px)');
  let vertical = mq.matches;
  let current = 0;

  function renderList() {
    list.classList.toggle('is-vertical', vertical);
    list.innerHTML = VIDEOS.map((v, i) => `
      <button class="vitem ${i === current ? 'active' : ''}" data-i="${i}" aria-label="Reproducir: ${v.titulo}">
        <div class="vthumb">
          <img src="${poster(v, vertical)}" alt="" loading="lazy">
          <span class="n">${String(i + 1).padStart(2, '0')}</span>
          <span class="d">${v.duracion}</span>
        </div>
        <div><h4>${v.titulo}</h4><span class="vdesc">${v.descripcion}</span></div>
      </button>`).join('');
  }

  function load(i, autoplay, keepTime) {
    const t = keepTime ? player.currentTime : 0;
    const wasPlaying = keepTime && !player.paused;
    current = i;
    const v = VIDEOS[i];
    box.classList.toggle('is-vertical', vertical);
    player.poster = poster(v, vertical);
    player.src = src(v, vertical);
    if (t) player.addEventListener('loadedmetadata', () => { player.currentTime = t; }, { once: true });
    tTitle.textContent = v.titulo;
    tDesc.textContent = v.descripcion;
    tNum.textContent = `Video ${i + 1} de ${VIDEOS.length}`;
    list.querySelectorAll('.vitem').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
    history.replaceState(null, '', `?v=${i + 1}`);
    if (autoplay || wasPlaying) player.play().catch(() => {});
  }

  list.addEventListener('click', e => {
    const b = e.target.closest('.vitem'); if (!b) return;
    load(+b.dataset.i, true);
    document.getElementById('vStage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  player.addEventListener('ended', () => { if (current < VIDEOS.length - 1) load(current + 1, true); });
  // Aviso solo si el video realmente no se puede cargar
  player.addEventListener('error', () => { if (player.error && player.error.code >= 2) empty.hidden = false; });
  ['loadeddata', 'playing', 'canplay'].forEach(ev => player.addEventListener(ev, () => { empty.hidden = true; }));

  // Si el usuario gira la pantalla o cambia el tamaño, cambia de versión sin perder el minuto
  mq.addEventListener('change', e => {
    vertical = e.matches;
    renderList();
    load(current, false, true);
  });

  const start = Math.min(Math.max((+new URLSearchParams(location.search).get('v') || 1) - 1, 0), VIDEOS.length - 1);
  current = start;
  renderList();
  load(start, false);
})();
