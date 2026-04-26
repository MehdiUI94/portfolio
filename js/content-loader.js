/* content-loader.js — fetch JSON with in-memory cache */

const _cache = {};

export async function loadJSON(path) {
  if (_cache[path]) return _cache[path];
  const base = document.querySelector('meta[name="base-path"]')?.content || '';
  const url = base + path;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const data = await res.json();
  _cache[path] = data;
  return data;
}

export async function loadSite()       { return loadJSON('content/site.json'); }
export async function loadAbout()      { return loadJSON('content/about.json'); }
export async function loadExperience() { return loadJSON('content/experience.json'); }
export async function loadSkills()     { return loadJSON('content/skills.json'); }
export async function loadEducation()  { return loadJSON('content/education.json'); }
export async function loadProjectIndex() { return loadJSON('content/projects/_index.json'); }
export async function loadProject(slug)  { return loadJSON(`content/projects/${slug}.json`); }
