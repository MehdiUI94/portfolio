/* CHATBOT WIDGET — Portfolio Mehdi Zitouni */

const CHATBOT_API = 'https://portfolio-chatbot.mehdiui94.workers.dev/chat';

const getLang = () => { try { return localStorage.getItem('mz-lang') || 'fr'; } catch(e) { return 'fr'; } };

const CB_I18N = {
  suggestions: {
    fr: ['Quelles sont tes compétences ?', 'Parle-moi de tes projets.', 'Comment te contacter ?', 'Quelle est ton expérience ?'],
    en: ['What are your skills?', 'Tell me about your projects.', 'How can I reach you?', 'What is your experience?'],
  },
  greeting: {
    fr: 'Bonjour ! Je suis Mehdi. Posez-moi vos questions sur mon parcours, mes projets ou mes compétences.',
    en: "Hi! I'm Mehdi. Ask me anything about my background, projects, or skills.",
  },
  placeholder: {
    fr: 'Posez votre question…',
    en: 'Ask me anything…',
  },
  apiError: {
    fr: 'Désolé, une erreur est survenue.',
    en: 'Sorry, something went wrong.',
  },
  serverError: {
    fr: 'Impossible de joindre le serveur.',
    en: 'Unable to reach the server.',
  },
};

function cb(key) {
  const lang = getLang();
  return CB_I18N[key][lang] ?? CB_I18N[key].fr;
}

function injectChatbotHTML() {
  if (document.getElementById('cb-toggle')) return;
  const frag = document.createDocumentFragment();

  const toggle = document.createElement('button');
  toggle.id = 'cb-toggle';
  toggle.setAttribute('aria-label', 'Ouvrir le chatbot');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.02 2 11c0 2.67 1.19 5.07 3.09 6.73L4 22l4.5-1.5C9.58 21 10.76 21.29 12 21.29c5.52 0 10-4.02 10-9s-4.48-9-10-9zm0 16.29c-1.09 0-2.14-.22-3.09-.61l-.22-.09-2.33.77.79-2.27-.14-.22C5.63 14.74 4.71 12.94 4.71 11c0-4.02 3.27-7.29 7.29-7.29S19.29 6.98 19.29 11 16.02 18.29 12 18.29z"/></svg>';

  const panel = document.createElement('div');
  panel.id = 'cb-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chatbot assistant');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="cb-header">
      <div class="cb-header-title"><div class="cb-avatar">✦</div><span>Mehdi Zitouni</span></div>
      <button id="cb-close" aria-label="Fermer">✕</button>
    </div>
    <div id="cb-messages" role="log" aria-live="polite"></div>
    <div id="cb-chips"></div>
    <div class="cb-input-row">
      <input id="cb-input" type="text" placeholder="Posez votre question…" autocomplete="off" />
      <button id="cb-send" aria-label="Envoyer">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>`;

  frag.appendChild(toggle);
  frag.appendChild(panel);
  document.body.appendChild(frag);
}

function initChatbot() {
  injectChatbotHTML();

  const toggle   = document.getElementById('cb-toggle');
  const panel    = document.getElementById('cb-panel');
  const closeBtn = document.getElementById('cb-close');
  const messages = document.getElementById('cb-messages');
  const input    = document.getElementById('cb-input');
  const send     = document.getElementById('cb-send');
  const chips    = document.getElementById('cb-chips');

  if (!toggle) return;

  const lang = getLang();

  /* ---- Placeholder & aria-labels ---- */
  if (input) input.placeholder = cb('placeholder');
  if (toggle) toggle.setAttribute('aria-label', lang === 'en' ? 'Open chatbot' : 'Ouvrir le chatbot');
  if (closeBtn) closeBtn.setAttribute('aria-label', lang === 'en' ? 'Close' : 'Fermer');

  /* ---- Suggestions ---- */
  function buildChips() {
    const currentLang = getLang();
    const list = CB_I18N.suggestions[currentLang] ?? CB_I18N.suggestions.fr;
    chips.innerHTML = '';
    chips.style.display = '';
    list.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'cb-chip';
      chip.textContent = text;
      chip.addEventListener('click', () => sendMessage(text));
      chips.appendChild(chip);
    });
  }
  buildChips();

  /* Rebuild chips + update placeholder + reset history/messages when lang changes before any conversation */
  new MutationObserver(() => {
    const currentLang = getLang();
    if (!conversationStarted) {
      buildChips();
      messages.innerHTML = '';
      history = currentLang === 'en'
        ? [{ role: 'system', content: 'You must respond exclusively in English for this entire conversation.' }]
        : [];
    }
    if (input) input.placeholder = CB_I18N.placeholder[currentLang] ?? CB_I18N.placeholder.fr;
    if (toggle) toggle.setAttribute('aria-label', currentLang === 'en' ? 'Open chatbot' : 'Ouvrir le chatbot');
    if (closeBtn) closeBtn.setAttribute('aria-label', currentLang === 'en' ? 'Close' : 'Fermer');
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* ---- History: inject language instruction for EN ---- */
  let history = lang === 'en'
    ? [{ role: 'system', content: 'You must respond exclusively in English for this entire conversation.' }]
    : [];

  let isOpen = false;
  let conversationStarted = false;

  /* ---- Toggle ---- */
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.setAttribute('aria-hidden', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      panel.classList.add('cb-panel--open');
      input.focus();
      const hasConversation = history.filter(m => m.role !== 'system').length > 0;
      if (!hasConversation) appendBotMessage(cb('greeting'));
    } else {
      panel.classList.remove('cb-panel--open');
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('cb-panel--open');
  });

  /* ---- Send ---- */
  send.addEventListener('click', () => sendMessage(input.value.trim()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value.trim()); }
  });

  async function sendMessage(text) {
    if (!text) return;
    input.value = '';
    conversationStarted = true;
    chips.style.display = 'none';

    appendUserMessage(text);
    history.push({ role: 'user', content: text });

    const typing = appendTyping();
    send.disabled = true;
    input.disabled = true;

    try {
      const res = await fetch(CHATBOT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, lang: getLang() }),
      });
      const data = await res.json();
      const reply = data.reply || cb('apiError');
      history.push({ role: 'assistant', content: reply });
      typing.remove();
      appendBotMessage(reply);
    } catch {
      typing.remove();
      appendBotMessage(cb('serverError'));
    } finally {
      send.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'cb-msg cb-msg--user';
    el.textContent = text;
    messages.appendChild(el);
    scrollBottom();
  }

  function parseLinks(text) {
    const escaped = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return escaped
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>')
      .replace(/\[([^\]]+)\]\((#[^)]+)\)/g, (_, label, hash) =>
        `<a href="${hash}" class="cb-internal-link">${label}</a>`
      );
  }

  function appendBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'cb-msg cb-msg--bot';
    el.innerHTML = parseLinks(text);
    el.querySelectorAll('a.cb-internal-link').forEach(a => {
      a.addEventListener('click', () => {
        isOpen = false;
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('cb-panel--open');
      });
    });
    messages.appendChild(el);
    scrollBottom();
  }

  function appendTyping() {
    const el = document.createElement('div');
    el.className = 'cb-msg cb-msg--bot cb-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    scrollBottom();
    return el;
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', initChatbot);
