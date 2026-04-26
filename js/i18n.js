/* i18n.js — FR/EN switch, persistent via localStorage */

let _currentLang = 'fr';
const _listeners = [];

export function getLang() { return _currentLang; }

export function t(obj) {
  if (!obj || typeof obj !== 'object') return obj || '';
  return obj[_currentLang] ?? obj['fr'] ?? '';
}

export function setLang(lang) {
  if (lang !== 'fr' && lang !== 'en') return;
  _currentLang = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem('mz-lang', lang); } catch(e) {}
  document.querySelectorAll('.lang button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === lang);
  });
  _listeners.forEach(fn => fn(lang));
}

export function onLangChange(fn) { _listeners.push(fn); }

export function initLang() {
  let saved = 'fr';
  try { saved = localStorage.getItem('mz-lang') || 'fr'; } catch(e) {}
  _currentLang = saved;
  document.documentElement.lang = saved;
  document.querySelectorAll('.lang button').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
    b.classList.toggle('on', b.dataset.lang === saved);
  });
}
