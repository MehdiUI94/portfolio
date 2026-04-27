/* projects.js — render project cards (index) and project detail blocks */

import { t } from './i18n.js';

/* ---- Span map ---- */
const SPAN_CLASS = { 7: 'span-7', 6: 'span-6', 5: 'span-5' };
const NUM_LABELS = ['01','02','03','04','05','06','07','08','09','10'];

/* ---- Project card (index page) ---- */
export function renderProjectCard(proj, index) {
  const spanClass = SPAN_CLASS[proj.span] || 'span-6';
  const cover = proj.cover || {};
  const style = `background:${cover.gradient};color:${cover.color}`;
  const lines = (cover.lines || [t(proj.title)]).join('<br/>');
  const tags = (proj.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
  const metaStack = (proj.stack || []).join(' · ');
  const links = (proj.links || []).filter(l => l.url).map(l =>
    `<a href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`
  ).join('');

  return `
<article class="proj ${spanClass} fade-up" data-slug="${proj.slug}">
  <a href="projects.html?slug=${proj.slug}" class="proj-cover" style="${style}" aria-label="${t(proj.title)}">
    <span class="proj-num">${NUM_LABELS[index]} / ${proj.slug.toUpperCase().replace(/-/g,' ')}</span>
    <div class="proj-tags">${tags}</div>
    <div class="proj-cover-inner">${lines}</div>
  </a>
  <div class="proj-body">
    <div class="proj-name serif">${t(proj.title)}</div>
    <div class="proj-tag">${t(proj.summary)}</div>
    <div class="proj-meta">
      <span>Rôle</span><b>${t(proj.role)}</b>
      <span>Année</span><b>${proj.year}</b>
      <span>Stack</span><b>${metaStack}</b>
    </div>
    ${links ? `<div class="proj-links">${links}</div>` : ''}
  </div>
</article>`;
}

/* ---- Detail page — cover ---- */
export function renderDetailCover(proj) {
  const cover = proj.cover || {};
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

    case 'downloads': {
      const items = (b.items || []).map(item => `
<div class="dl-item">
  <span class="dl-label">${L(item.label)}</span>
  <a href="${item.src}" download="${item.filename || ''}" class="dl-btn">Télécharger ↓</a>
</div>`).join('');
      return `<div class="block"><div class="block-downloads">${items}</div></div>`;
    }
    case 'spacer': {
      const sz = b.size || 'md';
      return `<div class="block-spacer-${sz}"></div>`;
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

  document.querySelectorAll('.block-gallery img, .block-img img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (lbClose) lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
