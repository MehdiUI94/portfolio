/* project-detail.js — render a single project detail page */

import { initLang, getLang, onLangChange, t } from './i18n.js';
import { loadSite, loadProject, loadProjectIndex } from './content-loader.js';
import { renderDetailCover, renderBlocks, initLightbox } from './projects.js';

document.addEventListener('DOMContentLoaded', async () => {
  initLang();

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) { window.location.href = 'index.html'; return; }

  try {
    const [site, proj, index] = await Promise.all([
      loadSite(),
      loadProject(slug),
      loadProjectIndex()
    ]);

    renderNav(site);
    renderDetail(proj);

    onLangChange(() => {
      renderNav(site);
      renderDetail(proj);
      initLightbox();
    });

    initLightbox();
    initScrollAnim();
  } catch (err) {
    console.error('Project load error:', err);
    document.getElementById('detail-root').innerHTML =
      `<div class="wrap" style="padding:80px 0;color:var(--muted);font-family:'JetBrains Mono',monospace">Projet introuvable.</div>`;
  }
});

function renderNav(site) {
  const logo = document.getElementById('brand-logo');
  if (logo) { logo.src = site.brand.logo; logo.alt = site.brand.name + ' logo'; }
  const name = document.getElementById('brand-name');
  if (name) name.textContent = site.brand.name;
  document.querySelectorAll('.lang button').forEach(b => {
    b.addEventListener('click', () => {
      import('./i18n.js').then(m => m.setLang(b.dataset.lang));
    });
  });
}

function renderDetail(proj) {
  const lang = getLang();
  const root = document.getElementById('detail-root');
  if (!root) return;

  document.title = t(proj.title) + ' — Mehdi Zitouni';

  const cover = proj.cover || {};
  const coverStyle = `background:${cover.gradient};color:${cover.color}`;
  const coverLines = (cover.lines || [t(proj.title)]).join('<br>');

  const tags = (proj.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');
  const metaStack = (proj.stack || []).join(' · ');

  const links = (proj.links || []).filter(l => l.url).map(l =>
    `<a href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`
  ).join('');

  const blocks = renderBlocks(proj.blocks, lang);

  root.innerHTML = `
<div class="wrap">
  <div class="detail-hero">
    <a href="index.html#work" class="detail-back" aria-label="Retour aux projets">← Tous les projets</a>

    <div class="detail-cover" style="${coverStyle}" aria-hidden="true">${coverLines}</div>

    <div class="proj-tags" style="position:static;margin-bottom:16px;justify-content:flex-start">${tags}</div>
    <h1 class="detail-title">${t(proj.title)}</h1>
    <p class="detail-summary">${t(proj.summary)}</p>

    <div class="detail-meta">
      <span>${t({ fr: 'Rôle', en: 'Role' })}</span><b>${t(proj.role)}</b>
      <span>${t({ fr: 'Année', en: 'Year' })}</span><b>${proj.year}</b>
      <span>Stack</span><b>${metaStack}</b>
    </div>

    ${links ? `<div class="detail-links">${links}</div>` : ''}
  </div>

  <div class="detail-content">${blocks}</div>
</div>

<div id="lightbox" class="lightbox" role="dialog" aria-label="Image agrandie" aria-modal="true">
  <button class="lightbox-close" aria-label="Fermer">×</button>
  <img src="" alt="">
</div>`;
}

function initScrollAnim() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}
