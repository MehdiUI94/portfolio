/* projects.js — render project cards (index) and project detail blocks */

import { t } from './i18n.js';

/* ---- Span map ---- */
const SPAN_CLASS = { 7: 'span-7', 6: 'span-6', 5: 'span-5' };
const NUM_LABELS = ['01','02','03','04','05','06','07','08','09','10'];

/* ---- Project card (index page) ---- */
export function renderProjectCard(proj, index) {
  const spanClass = SPAN_CLASS[proj.span] || 'span-6';
  const cover = proj.cover || {};
  const style = cover.image ? '' : `background:${cover.gradient};color:${cover.color}`;
  const lines = (cover.lines || [t(proj.title)]).join('<br/>');
  const tags = (proj.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
  const metaStack = (proj.stack || []).join(' · ');
  const links = (proj.links || []).filter(l => l.url).map(l =>
    `<a href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`
  ).join('');
  const coverInner = cover.image
    ? `<div class="proj-cover-inner"><img src="${cover.image}" alt="${t(proj.title)}" class="cover-img" loading="lazy" /></div>`
    : `<div class="proj-cover-inner proj-cover-placeholder">${lines}</div>`;

  return `
<article class="proj ${spanClass} fade-up" data-slug="${proj.slug}">
  <a href="projects.html?slug=${proj.slug}" class="proj-cover" style="${style}" aria-label="${t(proj.title)}">
    <span class="proj-num">${NUM_LABELS[index]} / ${proj.slug.toUpperCase().replace(/-/g,' ')}</span>
    <div class="proj-tags">${tags}</div>
    ${coverInner}
  </a>
  <div class="proj-body">
    <div class="proj-name serif">${t(proj.title)}</div>
    <div class="proj-tag">${t(proj.summary)}</div>
    <div class="proj-meta">
      <span>${t({ fr: 'Rôle', en: 'Role' })}</span><b>${t(proj.role)}</b>
      <span>${t({ fr: 'Année', en: 'Year' })}</span><b>${proj.year}</b>
      <span>Stack</span><b>${metaStack}</b>
    </div>
    ${links ? `<div class="proj-links">${links}</div>` : ''}
  </div>
</article>`;
}

/* ---- Detail page — cover ---- */
export function renderDetailCover(proj) {
  const cover = proj.cover || {};
  if (cover.image) {
    const bg = `background:${cover.gradient}`;
    return `<div class="detail-cover detail-cover--img" style="${bg}"><img src="${cover.image}" alt="${t(proj.title)}" class="cover-img cover-img--contain" /></div>`;
  }
  const style = `background:${cover.gradient};color:${cover.color}`;
  const lines = (cover.lines || [t(proj.title)]).join('<br/>');
  return `<div class="detail-cover" style="${style}">${lines}</div>`;
}

/* ---- Detail page — blocks ---- */
export function renderBlocks(blocks, lang) {
  if (!blocks) return '';
  return blocks.map(b => renderBlock(b, lang)).join('\n');
}

function renderBlock(b, lang) {
  const L = (obj) => (typeof obj === 'object' ? (obj[lang] ?? obj.fr ?? '') : obj ?? '');

  switch (b.type) {
    case 'heading': {
      const cls = `block-h${b.level}`;
      return `<div class="block"><${cls === 'block-h2' ? 'h2' : b.level === 3 ? 'h3' : 'h4'} class="${cls}">${L(b)}</${cls === 'block-h2' ? 'h2' : b.level === 3 ? 'h3' : 'h4'}></div>`;
    }
    case 'paragraph':
      return `<div class="block"><p class="block-p">${L(b)}</p></div>`;

    case 'list': {
      const cls = b.ordered ? 'block-list ordered' : 'block-list';
      const items = (b.items || []).map(item => `<li>${L(item)}</li>`).join('');
      const tag = b.ordered ? 'ol' : 'ul';
      return `<div class="block"><${tag} class="${cls}">${items}</${tag}></div>`;
    }
    case 'quote': {
      const cite = b.author ? `<cite>— ${b.author}</cite>` : '';
      return `<div class="block"><blockquote class="block-quote">${L(b)}${cite}</blockquote></div>`;
    }
    case 'image': {
      const widthCls = b.width ? b.width : 'normal';
      const caption = b.caption ? `<p class="block-caption">${L(b.caption)}</p>` : '';
      const altText = L(b.alt) || '';
      return `<div class="block"><div class="block-img ${widthCls}"><img src="${b.src}" alt="${altText}" loading="lazy"></div>${caption}</div>`;
    }
    case 'gallery': {
      const cols = b.columns || 2;
      const imgs = (b.images || []).map(img =>
        `<img src="${img.src}" alt="${L(img.alt) || ''}" loading="lazy">`
      ).join('');
      return `<div class="block"><div class="block-gallery cols-${cols}">${imgs}</div></div>`;
    }
    case 'video': {
      let src = '';
      if (b.provider === 'loom') src = `https://www.loom.com/embed/${b.id}`;
      else if (b.provider === 'youtube') src = `https://www.youtube.com/embed/${b.id}`;
      else if (b.provider === 'vimeo') src = `https://player.vimeo.com/video/${b.id}`;
      else src = b.url || '';
      return `<div class="block"><div class="block-video"><iframe src="${src}" allowfullscreen title="Video"></iframe></div></div>`;
    }
    case 'embed':
      return `<div class="block"><div class="block-video" style="padding-bottom:${b.height ? b.height + 'px' : '56.25%'};"><iframe src="${b.url}" allowfullscreen title="Embed"></iframe></div></div>`;

    case 'links': {
      const items = (b.items || []).map(item =>
        `<a href="${item.url}" target="_blank" rel="noopener">${item.label} ↗</a>`
      ).join('');
      return `<div class="block"><div class="block-links">${items}</div></div>`;
    }
    case 'downloads': {
      const items = (b.items || []).map(item => `
<div class="dl-item">
  <span class="dl-label">${L(item.label)}</span>
  <a href="${item.src}" download="${item.filename || ''}" class="dl-btn">${t({ fr: 'Télécharger ↓', en: 'Download ↓' })}</a>
</div>`).join('');
      return `<div class="block"><div class="block-downloads">${items}</div></div>`;
    }
    case 'spacer': {
      const sz = b.size || 'md';
      return `<div class="block-spacer-${sz}"></div>`;
    }
    case 'comparison': {
      const beforeLabel = lang === 'en' ? 'Before' : 'Avant';
      const afterLabel  = lang === 'en' ? 'After'  : 'Après';
      const pageLabel   = b.label ? `<div class="comp-page-label">${L(b.label)}</div>` : '';
      const noteHtml    = b.note  ? `<p class="comp-note">${L(b.note)}</p>` : '';
      const beforeImg   = b.before
        ? `<img src="${b.before.src}" alt="${L(b.before.alt) || ''}" loading="lazy">`
        : '';
      const multiStep   = (b.after || []).length > 1;
      const afterImgs   = (b.after || []).map((img, i) => {
        const step = multiStep
          ? `<span class="comp-step">${lang === 'en' ? `Step ${i+1}/${b.after.length}` : `Étape ${i+1}/${b.after.length}`}</span>`
          : '';
        return `<div class="comp-after-item">${step}<img src="${img.src}" alt="${L(img.alt) || ''}" loading="lazy"></div>`;
      }).join('');
      return `<div class="block">
  <div class="block-comparison">
    ${pageLabel}
    ${noteHtml}
    <div class="comp-grid">
      <div class="comp-col comp-col--before">
        <div class="comp-badge comp-badge--before">${beforeLabel}</div>
        ${beforeImg}
      </div>
      <div class="comp-col comp-col--after">
        <div class="comp-badge comp-badge--after">${afterLabel}</div>
        ${afterImgs}
      </div>
    </div>
  </div>
</div>`;
    }
    default:
      return '';
  }
}

/* ---- Lightbox for gallery images ---- */
export function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  const lbClose = lb.querySelector('.lightbox-close');

  let scale = 1, tx = 0, ty = 0, fitScale = 1;
  let dragging = false, dragStartX = 0, dragStartY = 0, dragTx = 0, dragTy = 0;
  let hasDragged = false;
  let lastPinchDist = null;

  function applyTransform() {
    lbImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    lbImg.style.cursor = scale > fitScale * 1.05 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in';
  }

  function calcFitScale() {
    const nw = lbImg.naturalWidth, nh = lbImg.naturalHeight;
    if (!nw || !nh) return 1;
    return Math.min(window.innerWidth * 0.90 / nw, window.innerHeight * 0.85 / nh);
  }

  function resetTransform() {
    fitScale = calcFitScale(); scale = fitScale; tx = 0; ty = 0;
    applyTransform();
  }

  function zoomBy(factor, cx, cy) {
    const newScale = Math.max(fitScale * 0.5, Math.min(20, scale * factor));
    const r = newScale / scale;
    // zoom toward point (cx, cy) expressed as offset from viewport center
    tx = cx * (1 - r) + tx * r;
    ty = cy * (1 - r) + ty * r;
    scale = newScale;
    applyTransform();
  }

  // Open lightbox
  document.querySelectorAll('.block-gallery img, .block-img img, .block-comparison img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lbImg.complete && lbImg.naturalWidth) {
        resetTransform();
      } else {
        fitScale = 1; scale = 1; tx = 0; ty = 0; applyTransform();
        lbImg.onload = () => { resetTransform(); lbImg.onload = null; };
      }
    });
  });

  // Wheel zoom toward cursor
  lb.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const cx = e.clientX - window.innerWidth / 2;
    const cy = e.clientY - window.innerHeight / 2;
    zoomBy(factor, cx, cy);
  }, { passive: false });

  // Mouse drag
  lbImg.addEventListener('mousedown', e => {
    dragging = true;
    hasDragged = false;
    dragStartX = e.clientX; dragStartY = e.clientY;
    dragTx = tx; dragTy = ty;
    applyTransform();
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
    tx = dragTx + dx;
    ty = dragTy + dy;
    applyTransform();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    applyTransform();
  });

  // Touch: pinch zoom + single-finger pan
  lb.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      lastPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      dragging = true;
      hasDragged = false;
      dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY;
      dragTx = tx; dragTy = ty;
    }
  }, { passive: true });

  lb.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastPinchDist) {
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - window.innerWidth / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - window.innerHeight / 2;
        zoomBy(d / lastPinchDist, mx, my);
      }
      lastPinchDist = d;
    } else if (e.touches.length === 1 && dragging) {
      const dx = e.touches[0].clientX - dragStartX;
      const dy = e.touches[0].clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      tx = dragTx + dx;
      ty = dragTy + dy;
      applyTransform();
    }
  }, { passive: false });

  lb.addEventListener('touchend', e => {
    if (e.touches.length < 2) lastPinchDist = null;
    if (e.touches.length === 0) { dragging = false; applyTransform(); }
  }, { passive: true });

  // Zoom buttons
  lb.querySelectorAll('.lightbox-zoom-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const z = btn.dataset.zoom;
      if (z === 'in') zoomBy(1.4, 0, 0);
      else if (z === 'out') zoomBy(1 / 1.4, 0, 0);
      else resetTransform();
    });
  });

  // Close
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    resetTransform();
  };
  if (lbClose) lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => {
    if (e.target === lb && !hasDragged) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
