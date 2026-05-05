/* components.js — nav et footer partagés entre toutes les pages */

import { getLang, t, setLang } from './i18n.js';

export function injectNav(site, { isIndex = false } = {}) {
  const nav = document.querySelector('nav.nav');
  if (!nav) return;

  const href = a => isIndex ? `#${a}` : `index.html#${a}`;
  const lang = getLang();

  nav.innerHTML = `
<div class="wrap nav-row">
  <a href="index.html" class="brand">
    <img id="brand-logo" src="${site.brand.logo}" alt="${site.brand.name} logo" class="brand-logo"
         style="height:${site.brand.logoHeight}px"
         onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
    <span class="brand-mark" style="display:none" aria-hidden="true"></span>
    <span id="brand-name">${site.brand.name}</span>
  </a>
  <div class="nav-links" role="list">
    <a ${isIndex ? 'id="nav-work"' : ''} href="${href('work')}" role="listitem">${t({ fr: 'Mes projets', en: 'My work' })}</a>
    <a ${isIndex ? 'id="nav-about"' : ''} href="${href('about')}" role="listitem">${t({ fr: 'À propos', en: 'About' })}</a>
    <a ${isIndex ? 'id="nav-xp"' : ''} href="${href('xp')}" role="listitem">${t({ fr: 'Mon expérience', en: 'My experience' })}</a>
    <a ${isIndex ? 'id="nav-skills"' : ''} href="${href('skills')}" role="listitem">${t({ fr: 'Compétences', en: 'Skills' })}</a>
    <a ${isIndex ? 'id="nav-contact"' : ''} href="${href('contact')}" role="listitem">${t({ fr: 'Contact', en: 'Contact' })}</a>
  </div>
  <div class="nav-right">
    <div class="lang" role="group" aria-label="Choisir la langue">
      <button data-lang="fr" class="${lang === 'fr' ? 'on' : ''}" aria-pressed="${lang === 'fr'}" >FR</button>
      <button data-lang="en" class="${lang === 'en' ? 'on' : ''}" aria-pressed="${lang === 'en'}">EN</button>
    </div>
  </div>
</div>`;

  nav.querySelectorAll('.lang button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}

export function injectFooter(site, { isIndex = false } = {}) {
  const footer = document.querySelector('footer');
  if (!footer) return;

  if (isIndex) {
    footer.innerHTML = `
<div class="wrap foot-row">
  <span id="footer-text">${t(site.footer)}</span>
  <span>Portfolio</span>
</div>`;
  } else {
    footer.innerHTML = `
<div class="wrap foot-row">
  <a href="index.html" style="color:var(--muted)">← ${site.brand.name}</a>
  <span style="color:var(--muted)">${new Date().getFullYear()}</span>
</div>`;
  }
}
