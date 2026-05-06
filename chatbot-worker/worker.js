function getWorkingSlots(count = 4) {
  // Jours fériés français fixes (MM-DD)
  const HOLIDAYS = new Set(['01-01','05-01','05-08','07-14','08-15','11-01','11-11','12-25']);
  const FR_DAYS   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const FR_MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const EN_DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const TIMES = ['9h00','10h30','14h00','15h30'];

  const slots = [];
  const d = new Date();
  d.setDate(d.getDate() + 1); // demain au plus tôt
  let t = 0;

  while (slots.length < count) {
    const dow  = d.getDay();
    const mmdd = `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (dow >= 1 && dow <= 5 && !HOLIDAYS.has(mmdd)) {
      const day = d.getDate(), month = d.getMonth(), year = d.getFullYear(), time = TIMES[t % 4];
      slots.push({
        fr: `${FR_DAYS[dow]} ${day} ${FR_MONTHS[month]} ${year} à ${time}`,
        en: `${EN_DAYS[dow]}, ${EN_MONTHS[month]} ${day}, ${year} at ${time}`,
      });
      t++;
    }
    d.setDate(d.getDate() + 1);
  }
  return slots;
}

function buildSystemPrompt() {
  const now = new Date();
  const dateStr   = now.toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const dateStrEn = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const slots = getWorkingSlots(4);
  const slotsFr = slots.map(s => `"${s.fr}"`).join(', ');
  const slotsEn = slots.map(s => `"${s.en}"`).join(', ');
  const choicesFrJson = JSON.stringify([...slots.map(s => s.fr), '📝 Proposer un autre créneau']);
  const choicesEnJson = JSON.stringify([...slots.map(s => s.en), '📝 Suggest another time']);

  return `Tu es Mehdi Zitouni. Tu parles à la première personne, de façon chaleureuse et professionnelle. Tu réponds en français par défaut (en anglais si on te parle en anglais). Tu es spécialisé sur ton parcours, tes projets et tes compétences, ET tu gères les demandes de prise de rendez-vous / entretien. Tu n'es pas un assistant généraliste.

## Date du jour
Aujourd'hui : ${dateStr} (${dateStrEn}).

## Qui je suis
Je suis développeur Full Stack & IA, basé à Paris. Je suis actuellement en alternance chez SmartBack (2025–2027) tout en suivant un MSc AI Applied to Business à Eugenia School (Paris 10).

## Mon parcours
- 2025–2027 : Développeur Full Stack, Automatisation IA — SmartBack (alternance) + MSc AI Applied to Business — Eugenia School
- 2022–2025 : Product Designer — Infopro Digital (interfaces BtoB/BtoBtoC, design systems Decarbonation 2030 et Marchés Online, 50+ icônes, tests utilisateurs)
- 2022–2024 : Mastère UX Design et Chef de Projet Numérique — ICAN
- 2021–2022 : Bachelor Web Design et Communication graphique — ICAN
- 2019–2021 : Développeur Front End — KTM Advance (serious games, modules de formation HTML/CSS/JS)
- 2017–2019 : DUT Informatique — IUT d'Orsay

## Mes compétences
- Dev & Code : Python, SQL, React, React Native, HTML/CSS/JS, Supabase, Airtable, Git/GitHub
- IA & Automatisation : N8N, Make, Zapier, Dust, agents IA, ChatGPT, Claude, Gemini, Codex, Claude Code, Cursor, scraping/enrichissement
- Product & Build : Apps web & mobile, chatbots, workflows métier, dashboards & KPI, CRM & Hubspot
- Design : Recherche utilisateur, tests d'utilisabilité, design systems, Figma, direction artistique
- Data & Analytics : PowerBI, Dataiku, Google Analytics, business analytics, data visualisation, marketing analytique

## Mes projets
1. CRM Mirakl — outil CRM custom pour gérer des marchands sur marketplace Mirakl (Infopro Digital)
2. BTP Dust — pipeline multi-agents Dust pour générer des sites web BTP automatiquement (démo Loom disponible)
3. La Dalle — plateforme de mise en relation pour artisans du bâtiment (design UX)
4. Decarbonation 2030 — design system pour plateforme de suivi carbone BtoB (Infopro Digital)
5. Marchés Online — design system pour place de marché BtoB (Infopro Digital)
6. Secourisk — application mobile de sensibilisation aux gestes de premiers secours (UX Design)

## Me contacter
- Email : zitounimehdi7@gmail.com
- LinkedIn : [Mon profil LinkedIn](https://www.linkedin.com/in/mehdi-zitouni/)
- GitHub : [Mon GitHub](https://github.com/MehdiUI94)
- Localisation : Le Kremlin-Bicêtre (94270)
- Langues : Français, Anglais

## Sections du portfolio
Quand quelqu'un demande à voir mes projets, mon expérience, mes compétences ou à me contacter, oriente-le vers la bonne section avec un lien markdown :
- Projets → [voir mes projets](#work)
- À propos → [en savoir plus sur moi](#about)
- Expérience → [mon parcours](#xp)
- Compétences → [mes compétences](#skills)
- Contact → [me contacter](#contact)

## Prise de rendez-vous / Interview Booking
Si quelqu'un souhaite planifier un entretien, un appel ou une rencontre, suis exactement ce processus en 4 étapes :

**ÉTAPE 1 — Informations de base**
Pose ces deux questions, une à la fois :
a. Prénom et nom complet
b. Adresse email professionnelle (vérifie qu'elle contient un @ et un domaine valide ; si elle semble incorrecte, repose la question)

**ÉTAPE 2 — Proposition de créneaux**
Utilise EXACTEMENT ces créneaux pré-calculés (ne recalcule jamais les dates toi-même) :
- Si la conversation est en FRANÇAIS, propose : ${slotsFr}
  Puis génère ce marqueur CHOICES exact :
  [[CHOICES:${choicesFrJson}]]
- Si la conversation est en ANGLAIS, propose : ${slotsEn}
  Puis génère ce marqueur CHOICES exact :
  [[CHOICES:${choicesEnJson}]]

Présente les créneaux avec une courte phrase d'introduction, puis génère le marqueur CHOICES immédiatement après.

RÈGLE ABSOLUE sur les créneaux libres :
- Si l'utilisateur a cliqué "📝 Proposer un autre créneau" / "📝 Suggest another time" ET propose ensuite n'importe quel créneau (ex : "8 mai 16h", "next Friday 3pm", "lundi prochain matin"), ACCEPTE-LE IMMÉDIATEMENT tel quel et passe directement à l'ÉTAPE 3.
- Ne propose JAMAIS d'alternatives à ce moment-là. Ne mentionne JAMAIS les créneaux pré-calculés. N'émets aucune réserve sur la date choisie.
- Si le créneau est flou (ex : "la semaine prochaine"), demande juste le jour et l'heure précis, puis accepte.

**ÉTAPE 3 — Récapitulatif obligatoire**
Une fois le créneau choisi (proposé ou saisi manuellement), affiche TOUJOURS le récapitulatif dans la bonne langue :

Si FRANÇAIS :
📋 Récapitulatif de ta demande :
• Nom : [nom complet]
• Email : [email]
• Créneau : [date et heure]
• Message : [message ou "aucun"]
Puis génère : [[CHOICES:["✅ Confirmer","✏️ Modifier","❌ Annuler"]]]

Si ANGLAIS :
📋 Summary of your request:
• Name: [full name]
• Email: [email]
• Slot: [date and time]
• Message: [message or "none"]
Puis génère : [[CHOICES:["✅ Confirm","✏️ Edit","❌ Cancel"]]]

**ÉTAPE 4 — Traitement du choix**
- Confirmer / Confirm → dis que la demande a été transmise à Mehdi, qu'il prendra contact pour valider.
  Insère EXACTEMENT sur une nouvelle ligne :
  [[BOOKING:{"name":"NOM","email":"EMAIL","date":"DATE","message":"MESSAGE OU VIDE"}]]
- Modifier / Edit → demande quel champ corriger, mets-le à jour, réaffiche le récapitulatif complet + marqueur CHOICES.
- Annuler / Cancel → confirme l'annulation avec bienveillance. Aucun marqueur.

Règles absolues :
- N'insère JAMAIS [[BOOKING]] avant la confirmation explicite de l'utilisateur.
- N'utilise JAMAIS "programmé", "confirmé" ou "réservé".
- Ne mentionne jamais les marqueurs à l'utilisateur.
- Les marqueurs utilisent toujours des guillemets doubles JSON valides, sans virgule finale.

## Instructions de formatage
- Pour les liens externes : [texte](https://url) — Pour les sections du portfolio : [texte](#section)
- N'utilise jamais de balises HTML brutes
- Sois concis pour les réponses générales (3-5 phrases max), mais prends l'espace nécessaire pour le récapitulatif.

Si on te pose une question hors sujet (ni parcours, ni projets, ni compétences, ni rendez-vous), réponds poliment que tu es là uniquement pour parler du profil professionnel de Mehdi ou organiser un entretien.`; }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Validation email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','throwam.com','yopmail.com',
  'sharklasers.com','guerrillamailblock.com','grr.la','guerrillamail.info',
  'spam4.me','trashmail.com','trashmail.me','fakeinbox.com','maildrop.cc',
  'dispostable.com','throwam.com','mailnull.com','spamgourmet.com','10minutemail.com',
  'temp-mail.org','discard.email','mailnesia.com','spamfree24.org',
]);

function isValidEmail(email) {
  if (!EMAIL_REGEX.test(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  return !DISPOSABLE_DOMAINS.has(domain);
}

const BOOKING_ERRORS = {
  invalid_email: {
    fr: "L'adresse email fournie ne semble pas valide ou appartient à un domaine temporaire. Pourrais-tu donner une adresse professionnelle valide (ex : prenom@gmail.com) ?",
    en: "The email address provided doesn't look valid or uses a temporary domain. Could you provide a valid professional address (e.g. firstname@gmail.com)?",
  },
  invalid_name: {
    fr: "Le nom fourni semble incomplet. Pourrais-tu indiquer ton prénom et nom complets ?",
    en: "The name provided seems incomplete. Could you give your full first and last name?",
  },
  invalid_date: {
    fr: "La date ou le créneau horaire n'est pas précisé. Quel jour et quelle heure te conviendraient ?",
    en: "The date or time slot isn't specified. What day and time would work for you?",
  },
};

async function sendBookingEmail(booking, env) {
  if (!env.RESEND_API_KEY) return;

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a2e">
      <h2 style="color:#c86bfe;margin-bottom:4px">📅 Nouvelle demande d'entretien</h2>
      <p style="color:#666;margin-top:0;font-size:14px">Reçue via le chatbot du portfolio</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:8px 0;color:#888;width:140px">Nom</td><td style="padding:8px 0;font-weight:600">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${booking.email}" style="color:#c86bfe">${booking.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888">Créneau souhaité</td><td style="padding:8px 0;font-weight:600">${booking.date}</td></tr>
        ${booking.message ? `<tr><td style="padding:8px 0;color:#888;vertical-align:top">Message</td><td style="padding:8px 0">${booking.message}</td></tr>` : ''}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
      <p style="font-size:13px;color:#aaa">Réponds directement à cet email ou contacte <a href="mailto:${booking.email}" style="color:#c86bfe">${booking.email}</a> pour confirmer le créneau.</p>
    </div>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Chatbot <onboarding@resend.dev>',
      to: ['zitounimehdi7@gmail.com'],
      subject: `📅 Entretien demandé — ${booking.name}`,
      html,
    }),
  });
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function sbHeaders(env) {
  return {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };
}

async function logConversation(payload, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/chat_messages`, {
      method: 'POST', headers: sbHeaders(env), body: JSON.stringify(payload),
    });
  } catch { /* non-blocking */ }
}

async function handleTrack(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  try {
    const body = await request.json();
    await fetch(`${env.SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST', headers: sbHeaders(env), body: JSON.stringify({
        session_id: body.session_id || 'unknown',
        page: body.page || '/',
        referrer: body.referrer || '',
        country: request.cf?.country || '',
      }),
    });
  } catch { /* non-blocking */ }
  return new Response('ok', { headers: CORS_HEADERS });
}

async function handleAnalytics(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!env.ANALYTICS_KEY || key !== env.ANALYTICS_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const days = parseInt(url.searchParams.get('days') || '30', 10);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const readHeaders = {
    'apikey': env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
  };

  const [msgRes, pvRes] = await Promise.all([
    fetch(`${env.SUPABASE_URL}/rest/v1/chat_messages?created_at=gte.${since}&order=created_at.desc&limit=2000`, { headers: readHeaders }),
    fetch(`${env.SUPABASE_URL}/rest/v1/page_views?created_at=gte.${since}&order=created_at.desc&limit=5000`, { headers: readHeaders }),
  ]);

  const [msgs, pvs] = await Promise.all([msgRes.json(), pvRes.json()]);

  // Aggregate messages per day
  const msgByDay = {};
  const pvByDay = {};
  const pageCount = {};
  let bookings = 0, langFr = 0, langEn = 0;

  for (const m of (Array.isArray(msgs) ? msgs : [])) {
    const d = m.created_at?.slice(0, 10) || '';
    msgByDay[d] = (msgByDay[d] || 0) + 1;
    if (m.booking_confirmed) bookings++;
    if (m.lang === 'en') langEn++; else langFr++;
  }
  for (const p of (Array.isArray(pvs) ? pvs : [])) {
    const d = p.created_at?.slice(0, 10) || '';
    pvByDay[d] = (pvByDay[d] || 0) + 1;
    pageCount[p.page] = (pageCount[p.page] || 0) + 1;
  }

  // Build sessions from messages
  const sessionsMap = {};
  for (const m of (Array.isArray(msgs) ? msgs : [])) {
    if (!sessionsMap[m.session_id]) {
      sessionsMap[m.session_id] = { session_id: m.session_id, started_at: m.created_at, lang: m.lang, booking_confirmed: false, messages: [] };
    }
    sessionsMap[m.session_id].messages.push({ user: m.user_message, bot: m.bot_reply, ts: m.created_at, booking_confirmed: m.booking_confirmed });
    if (m.booking_confirmed) sessionsMap[m.session_id].booking_confirmed = true;
  }
  const sessions = Object.values(sessionsMap).sort((a, b) => b.started_at > a.started_at ? 1 : -1);

  const topPages = Object.entries(pageCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, count]) => ({ page, count }));

  const totalMsgs = Array.isArray(msgs) ? msgs.length : 0;
  const totalPvs  = Array.isArray(pvs)  ? pvs.length  : 0;

  return new Response(JSON.stringify({
    summary: { total_sessions: sessions.length, total_messages: totalMsgs, bookings, lang_fr: langFr, lang_en: langEn, page_views: totalPvs },
    messages_per_day: Object.entries(msgByDay).sort().map(([date, count]) => ({ date, count })),
    pageviews_per_day: Object.entries(pvByDay).sort().map(([date, count]) => ({ date, count })),
    top_pages: topPages,
    sessions,
  }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const { pathname } = new URL(request.url);

    if (pathname === '/analytics') return handleAnalytics(request, env);
    if (pathname === '/track' && request.method === 'POST') return handleTrack(request, env);

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let messages, lang, session_id;
    try {
      ({ messages, lang, session_id } = await request.json());
    } catch {
      return new Response(JSON.stringify({ error: 'JSON invalide' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    const locale = lang === 'en' ? 'en' : 'fr';

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages requis' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Erreur OpenAI' }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const rawReply = data.choices?.[0]?.message?.content || 'Désolé, une erreur est survenue.';

    // Strip [[CHOICES:[...]]] and extract options
    let choices = null;
    const choicesMatch = rawReply.match(/\[\[CHOICES:(\[[\s\S]*?\])\]\]/);
    if (choicesMatch) {
      try { choices = JSON.parse(choicesMatch[1]); } catch { /* malformed, ignore */ }
    }
    const strippedReply = rawReply.replace(/\n*\[\[CHOICES:\[[\s\S]*?\]\]\]/, '').trim();

    // Detect and process booking marker
    const bookingMatch = strippedReply.match(/\[\[BOOKING:([\s\S]*?)\]\]/);
    let bookingConfirmed = false;
    let reply = strippedReply;

    if (bookingMatch) {
      reply = strippedReply.replace(/\n*\[\[BOOKING:[\s\S]*?\]\]/, '').trim();
      try {
        const booking = JSON.parse(bookingMatch[1]);

        // Validation
        const name = (booking.name || '').trim();
        const email = (booking.email || '').trim();
        const date = (booking.date || '').trim();

        if (name.length < 2) {
          reply = BOOKING_ERRORS.invalid_name[locale];
        } else if (!isValidEmail(email)) {
          reply = BOOKING_ERRORS.invalid_email[locale];
        } else if (date.length < 3) {
          reply = BOOKING_ERRORS.invalid_date[locale];
        } else {
          await sendBookingEmail({ name, email, date, message: booking.message || '' }, env);
          bookingConfirmed = true;
        }
      } catch {
        // JSON malformé — on affiche quand même le texte de confirmation de l'IA
      }
    }

    // Log conversation — ctx.waitUntil garantit que Cloudflare attend la fin avant de tuer le worker
    const userMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
    ctx.waitUntil(logConversation({
      session_id: session_id || 'unknown',
      lang: locale,
      user_message: userMsg,
      bot_reply: reply,
      booking_confirmed: bookingConfirmed,
    }, env));

    return new Response(JSON.stringify({ reply, bookingConfirmed, choices }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
