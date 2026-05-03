/* =============================================
   CHATBOT WIDGET — Portfolio Mehdi Zitouni
   Appelle le proxy local : http://localhost:3001/chat
   ============================================= */

const CHATBOT_API = 'https://portfolio-chatbot.mehdiui94.workers.dev/chat';

const SUGGESTIONS = [
  'Quelles sont tes compétences ?',
  'Parle-moi de tes projets.',
  'Comment te contacter ?',
  'Quelle est ton expérience ?',
];

function initChatbot() {
  const toggle   = document.getElementById('cb-toggle');
  const panel    = document.getElementById('cb-panel');
  const close    = document.getElementById('cb-close');
  const messages = document.getElementById('cb-messages');
  const input    = document.getElementById('cb-input');
  const send     = document.getElementById('cb-send');
  const chips    = document.getElementById('cb-chips');

  if (!toggle) return;

  let history = [];
  let isOpen  = false;

  /* ---- Suggestions ---- */
  SUGGESTIONS.forEach(text => {
    const chip = document.createElement('button');
    chip.className = 'cb-chip';
    chip.textContent = text;
    chip.addEventListener('click', () => sendMessage(text));
    chips.appendChild(chip);
  });

  /* ---- Toggle ---- */
  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.setAttribute('aria-hidden', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      panel.classList.add('cb-panel--open');
      input.focus();
      if (history.length === 0) appendBotMessage(
        'Bonjour ! Je suis Mehdi. Posez-moi vos questions sur mon parcours, mes projets ou mes compétences.'
      );
    } else {
      panel.classList.remove('cb-panel--open');
    }
  });

  close.addEventListener('click', () => {
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
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply || 'Désolé, une erreur est survenue.';
      history.push({ role: 'assistant', content: reply });
      typing.remove();
      appendBotMessage(reply);
    } catch {
      typing.remove();
      appendBotMessage('Impossible de joindre le serveur. Assurez-vous que le chatbot-server tourne en local.');
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
