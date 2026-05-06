/* Portfolio Analytics Tracker */
(function () {
  const WORKER = 'https://portfolio-chatbot.mehdiui94.workers.dev/track';

  const sessionId = (() => {
    try {
      let id = sessionStorage.getItem('mz-session');
      if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('mz-session', id); }
      return id;
    } catch { return 'unknown'; }
  })();

  function track() {
    if (navigator.doNotTrack === '1') return;
    try {
      const page = location.pathname + (location.search || '');
      fetch(WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, page, referrer: document.referrer }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', track);
  } else {
    track();
  }
})();
