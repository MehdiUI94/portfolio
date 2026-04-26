/* main.js — init + render all sections from JSON */

import { initLang, getLang, onLangChange, t } from './i18n.js';
import {
  loadSite, loadAbout, loadExperience,
  loadSkills, loadEducation, loadProjectIndex, loadProject
} from './content-loader.js';
import { renderProjectCard } from './projects.js';

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', async () => {
  initLang();

  try {
    const [site, about, experience, skills, education, index] = await Promise.all([
      loadSite(), loadAbout(), loadExperience(),
      loadSkills(), loadEducation(), loadProjectIndex()
    ]);

    const projects = await Promise.all(index.ordered.map(slug => loadProject(slug)));

    renderAll(site, about, experience, skills, education, projects);

    onLangChange(() => {
      renderAll(site, about, experience, skills, education, projects);
      document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    });

    initScrollAnimations();
    initNavActiveLinks();
  } catch (err) {
    console.error('Portfolio load error:', err);
  }
});

/* ---- Master render ---- */
function renderAll(site, about, experience, skills, education, projects) {
  const lang = getLang();
  renderNav(site);
  renderHero(site);
  renderMarquee(site);
  renderProjects(projects);
  renderAbout(about);
  renderExperience(experience);
  renderSkills(skills);
  renderEducation(education);
  renderContact(site);
  renderFooter(site);
}

/* ---- Nav ---- */
function renderNav(site) {
  const brand = document.getElementById('brand-name');
  if (brand) brand.textContent = site.brand.name;
  const logo = document.getElementById('brand-logo');
  if (logo) {
    logo.src = getBase() + site.brand.logo;
    logo.alt = site.brand.name + ' logo';
    logo.style.height = site.brand.logoHeight + 'px';
  }
  const links = {
    'nav-work':    t({ fr: 'Mes projets', en: 'My work' }),
    'nav-about':   t({ fr: 'À propos', en: 'About' }),
    'nav-xp':      t({ fr: 'Mon expérience', en: 'My experience' }),
    'nav-skills':  t({ fr: 'Compétences', en: 'Skills' }),
    'nav-contact': t({ fr: 'Contact', en: 'Contact' })
  };
  Object.entries(links).forEach(([id, txt]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  });
  updateSEO(site);
}

function updateSEO(site) {
  const seo = site.seo || {};
  document.title = seo.title || site.brand.name;
  setMeta('description', t(seo.description));
  setMeta('og:title', seo.title, true);
  setMeta('og:description', t(seo.description), true);
}
function setMeta(name, content, og = false) {
  const attr = og ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.content = content || '';
}

/* ---- Hero ---- */
function renderHero(site) {
  const hero = site.hero;
  const tagEl = document.getElementById('hero-tagline');
  if (tagEl) tagEl.textContent = t(hero.tagline);

  const h1a = document.getElementById('hero-h1a');
  if (h1a) h1a.textContent = t(hero.title)[0] || '';
  const h1b = document.getElementById('hero-h1b');
  if (h1b) h1b.textContent = t(hero.title)[1] || '';

  const intro = document.getElementById('hero-intro');
  if (intro) intro.textContent = t(hero.intro);

  const cta1 = document.getElementById('hero-cta1');
  if (cta1) cta1.textContent = t({ fr: 'Voir les projets', en: 'See the work' });
  const cta2 = document.getElementById('hero-cta2');
  if (cta2) cta2.textContent = t({ fr: 'Télécharger CV', en: 'Download CV' });
  const cvLink = document.getElementById('hero-cv');
  if (cvLink) cvLink.href = getBase() + hero.cv;

  const photo = document.getElementById('hero-photo');
  if (photo) {
    photo.src = getBase() + hero.photo;
    photo.alt = site.brand.name;
  }

  (hero.stats || []).forEach((stat, i) => {
    const k = document.getElementById(`stat-k-${i}`);
    const v = document.getElementById(`stat-v-${i}`);
    if (k) k.textContent = t(stat.label);
    if (v) v.textContent = t(stat.value);
  });
}

/* ---- Marquee ---- */
function renderMarquee(site) {
  const items = (site.marquee?.items || []);
  const html = items.map((item, i) =>
    i === 0 ? `<b class="serif">${item}</b>` : `<i class="dot"></i> ${item.includes('IA') || item.includes('AI') || item.includes('UX') ? `<b class="serif">${item}</b>` : item} `
  ).join(' ');
  const doubled = html + ' ' + html;
  const track = document.getElementById('marquee-track');
  if (track) track.innerHTML = `<span>${doubled}</span><span>${doubled}</span>`;
}

/* ---- Projects ---- */
function renderProjects(projects) {
  const grid = document.getElementById('proj-grid');
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => renderProjectCard(p, i)).join('');
}

/* ---- About ---- */
function renderAbout(data) {
  const intro = document.getElementById('about-intro');
  if (intro) {
    intro.innerHTML = (data.intro || []).map((p, i) =>
      `<p${i > 0 ? ' class="muted"' : ''}>${t(p)}</p>`
    ).join('');
  }
  const jt = document.getElementById('journey-timeline');
  if (!jt) return;
  jt.innerHTML = (data.timeline || []).map(item => {
    const tag = item.tag ? `<div class="jt-tag">${t(item.tag)}</div>` : '';
    return `
<li class="jt-item fade-up">
  <span class="jt-year mono">${item.period}</span>
  <div class="jt-card">
    ${tag}
    <h4>${t(item.title)}</h4>
    <p>${t(item.body)}</p>
  </div>
</li>`;
  }).join('');
}

/* ---- Experience ---- */
function renderExperience(data) {
  const el = document.getElementById('experience-list');
  if (!el) return;
  el.innerHTML = (data.positions || []).map(pos => {
    const bullets = (pos.bullets || []).map(b => `<li>${t(b)}</li>`).join('');
    return `
<div class="tl fade-up">
  <div class="tl-period mono">${pos.period}</div>
  <div>
    <div class="tl-role">${t(pos.role)}</div>
    <div class="tl-org">${pos.org}${pos.location ? ' · ' + pos.location : ''}</div>
    <ul class="tl-bullets">${bullets}</ul>
  </div>
</div>`;
  }).join('');
}

/* ---- Skills ---- */
function renderSkills(data) {
  const el = document.getElementById('skills-grid');
  if (!el) return;
  el.innerHTML = (data.categories || []).map(cat => {
    const items = (cat.items || []).map(item =>
      `<li>${typeof item === 'object' ? t(item) : item}</li>`
    ).join('');
    return `
<div class="skill-cat fade-up">
  <h3><span>${t(cat.label)}</span><span class="dot" style="background:${cat.accent}"></span></h3>
  <ul>${items}</ul>
</div>`;
  }).join('');

  const pills = document.getElementById('stack-pills');
  if (pills) {
    pills.innerHTML = (data.pills || []).map(p => `<span>${p}</span>`).join('');
  }
}

/* ---- Education ---- */
function renderEducation(data) {
  const el = document.getElementById('education-list');
  if (!el) return;
  el.innerHTML = (data.degrees || []).map(d => {
    const status = d.status ? ` · <em>${t(d.status)}</em>` : '';
    return `
<a class="cert fade-up" href="${d.url}" target="_blank" rel="noopener">
  <div class="cert-icon">${d.icon}</div>
  <div>
    <div class="cert-name">${t(d.name)}</div>
    <div class="cert-verify mono">${d.location}${status}</div>
  </div>
  <div class="cert-year mono">${d.period}</div>
</a>`;
  }).join('');
}

/* ---- Contact ---- */
function renderContact(site) {
  const c = site.contact;
  const title = document.getElementById('contact-title');
  if (title) title.textContent = t(c.title);
  const sub = document.getElementById('contact-subtitle');
  if (sub) sub.textContent = t(c.subtitle);
  const grid = document.getElementById('contact-grid');
  if (!grid) return;
  grid.innerHTML = (c.items || []).map(item => `
<a class="contact-item" href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
  <div class="lbl">${item.label}</div>
  <div class="val">${item.value}</div>
</a>`).join('');
}

/* ---- Footer ---- */
function renderFooter(site) {
  const el = document.getElementById('footer-text');
  if (el) el.textContent = t(site.footer);
}

/* ---- Scroll animations ---- */
function initScrollAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* Re-observe after re-render */
export function reObserveFadeUp() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => obs.observe(el));
}

/* ---- Active nav links on scroll ---- */
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => obs.observe(s));
}

/* ---- Base path helper ---- */
function getBase() {
  const meta = document.querySelector('meta[name="base-path"]');
  return meta ? meta.content : '';
}
