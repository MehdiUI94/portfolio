# Portfolio — Mehdi Zitouni

Site statique hébergé sur **GitHub Pages** : [mehdiui94.github.io/portfolio](https://mehdiui94.github.io/portfolio)

Stack : HTML5 · CSS3 · JS vanilla (ES modules) · JSON · GitHub Pages

---

## Lancer en local

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Ouvre `http://localhost:8080` dans le navigateur.

> Les fichiers JSON sont chargés via `fetch()` — le site doit être servi par un serveur HTTP, pas ouvert depuis `file://`.

---

## Comment modifier mon portfolio ?

### Changer un texte du hero, du contact ou du footer
→ `content/site.json`

### Modifier mon parcours / expérience / compétences / formation
→ `content/about.json`, `content/experience.json`, `content/skills.json`, `content/education.json`

### Ajouter un nouveau projet

1. Crée `assets/projects/<mon-slug>/` et dépose les images dedans.
2. Crée `content/projects/<mon-slug>.json` (copie un fichier existant comme modèle).
3. Ajoute le slug dans `content/projects/_index.json` à la position voulue.
4. Commit + push. C'est en ligne.

### Modifier le contenu d'un projet
→ Édite `content/projects/<slug>.json`. Ajoute autant de blocs que tu veux dans `blocks[]`.

**Types de blocs :** `heading`, `paragraph`, `list`, `quote`, `image`, `gallery`, `video`, `downloads`, `spacer`

### Changer le CV
→ Remplace `assets/cv.pdf`.

### Traduire FR/EN
→ Toutes les chaînes ont la forme `{ "fr": "...", "en": "..." }`. Édite les deux.

---

## Déployer sur GitHub Pages

1. Push sur `main`.
2. Settings → Pages → Source : `main` / `/ (root)`.
3. URL : `https://mehdiui94.github.io/portfolio`

---

## Structure des fichiers

```
/
├── index.html              ← Page principale
├── projects.html           ← Détail projet (?slug=nom)
├── 404.html
├── .nojekyll
├── assets/
│   ├── Calque 1.png        ← Logo
│   ├── photo_profil.jpg    ← Photo hero
│   ├── cv.pdf
│   ├── favicon.svg
│   └── projects/           ← Images par projet
├── content/
│   ├── site.json           ← Hero, marquee, contact, footer, SEO
│   ├── about.json          ← Intro + timeline parcours
│   ├── experience.json     ← 3 postes
│   ├── skills.json         ← 5 catégories + stack pills
│   ├── education.json      ← 4 formations
│   └── projects/
│       ├── _index.json     ← Ordre des projets
│       └── *.json          ← Un fichier par projet
├── css/styles.css          ← Design system
└── js/
    ├── main.js             ← Init + rendu accueil
    ├── project-detail.js   ← Rendu page projet
    ├── projects.js         ← Cartes + blocs
    ├── i18n.js             ← Switch FR/EN
    └── content-loader.js   ← Fetch JSON avec cache
```
