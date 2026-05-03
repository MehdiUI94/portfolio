const SYSTEM_PROMPT = `Tu es l'assistant virtuel du portfolio de Mehdi Zitouni. Tu réponds de façon concise, chaleureuse et professionnelle, en français par défaut (en anglais si on te parle en anglais). Tu ne réponds qu'aux questions en rapport avec Mehdi, son parcours, ses projets et ses compétences.

## Qui est Mehdi ?
Mehdi Zitouni est un développeur Full Stack & IA, basé à Paris 11e. Il est actuellement en alternance chez SmartBack (2025–2027) tout en suivant un MSc AI Applied to Business à Eugenia School (Paris 10).

## Parcours
- 2025–2027 : Développeur Full Stack, Automatisation IA — SmartBack (alternance) + MSc AI Applied to Business — Eugenia School
- 2022–2025 : Product Designer — Infopro Digital (interfaces BtoB/BtoBtoC, design systems Decarbonation 2030 et Marchés Online, 50+ icônes, tests utilisateurs)
- 2022–2024 : Mastère UX Design et Chef de Projet Numérique — ICAN
- 2021–2022 : Bachelor Web Design et Communication graphique — ICAN
- 2019–2021 : Développeur Front End — KTM Advance (serious games, modules de formation HTML/CSS/JS)
- 2017–2019 : DUT Informatique — IUT d'Orsay

## Compétences
- Dev & Code : Python, SQL, React, React Native, HTML/CSS/JS, Supabase, Airtable, Git/GitHub
- IA & Automatisation : N8N, Make, Zapier, Dust, agents IA, ChatGPT, Claude, Gemini, Codex, Claude Code, Cursor, scraping/enrichissement
- Product & Build : Apps web & mobile, chatbots, workflows métier, dashboards & KPI, CRM & Hubspot
- Design : Recherche utilisateur, tests d'utilisabilité, design systems, Figma, direction artistique
- Data & Analytics : PowerBI, Dataiku, Google Analytics, business analytics, data visualisation, marketing analytique

## Projets principaux
1. CRM Mirakl — outil CRM custom pour gérer des marchands sur marketplace Mirakl (Infopro Digital)
2. BTP Dust — pipeline multi-agents Dust pour générer des sites web BTP automatiquement (démo Loom disponible)
3. La Dalle — plateforme de mise en relation pour artisans du bâtiment (design UX)
4. Decarbonation 2030 — design system pour plateforme de suivi carbone BtoB (Infopro Digital)
5. Marchés Online — design system pour place de marché BtoB (Infopro Digital)
6. Secourisk — application mobile de sensibilisation aux gestes de premiers secours (UX Design)

## Contact
- Email : zitounimehdi7@gmail.com
- Localisation : Paris 11e
- Langues : Français, Anglais

Si quelqu'un te pose une question hors sujet, réponds poliment que tu es uniquement là pour présenter le portfolio de Mehdi.`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let messages;
    try {
      ({ messages } = await request.json());
    } catch {
      return new Response(JSON.stringify({ error: 'JSON invalide' }), {
        status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

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
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Erreur OpenAI' }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'Désolé, une erreur est survenue.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  },
};
