#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [inputPath, outputPath = 'personal-homepage.html'] = process.argv.slice(2);

if (!inputPath) {
  console.error('Usage: node render-homepage.mjs metadata.json [output.html]');
  process.exit(1);
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeUrl(value = '') {
  const url = String(value).trim();
  if (!url) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function requireText(object, pathName) {
  const value = pathName.split('.').reduce((current, key) => {
    return current && current[key];
  }, object);

  if (!String(value || '').trim()) {
    throw new Error(`Missing required metadata field: ${pathName}`);
  }
}

const metadata = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

requireText(metadata, 'identity.name');
requireText(metadata, 'positioning.headline');
requireText(metadata, 'positioning.summary');

const identity = metadata.identity || {};
const positioning = metadata.positioning || {};
const work = metadata.work || {};
const proof = metadata.proof || {};
const collaboration = metadata.collaboration || {};
const contact = metadata.contact || {};
const style = metadata.style || {};
const links = asArray(metadata.links);
const products = asArray(work.products);
const services = asArray(work.services);
const highlights = asArray(proof.publicHighlights);
const metrics = asArray(proof.metrics);
const keywords = asArray(positioning.keywords);
const lookingFor = asArray(collaboration.lookingFor);

const accent = /^#[0-9a-f]{6}$/i.test(style.accentColor || '')
  ? style.accentColor
  : '#2563eb';

const contactLinks = [
  contact.email
    ? { label: 'Email', url: `mailto:${contact.email}` }
    : null,
  contact.calendar
    ? { label: 'Schedule', url: contact.calendar }
    : null,
  ...links,
].filter(Boolean);

const renderList = (items) => {
  if (!items.length) {
    return '';
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
};

const renderCards = (items) => {
  if (!items.length) {
    return '';
  }

  return items
    .map((item) => {
      const title = escapeHtml(item.name || item.label || 'Item');
      const description = escapeHtml(item.description || item.audience || '');
      const url = safeUrl(item.url || '');
      const status = item.status ? `<span>${escapeHtml(item.status)}</span>` : '';
      const titleHtml = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${title}</a>`
        : title;

      return `<article class="card"><h3>${titleHtml}</h3>${status}<p>${description}</p></article>`;
    })
    .join('');
};

const linkHtml = contactLinks
  .map((link) => {
    const url = safeUrl(link.url);
    if (!url) {
      return '';
    }

    return `<a class="button" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label || url)}</a>`;
  })
  .join('');

const html = `<!doctype html>
<html lang="${escapeHtml(metadata.locale || 'en')}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(identity.name)} - ${escapeHtml(positioning.headline)}</title>
  <meta name="description" content="${escapeHtml(positioning.summary)}">
  <style>
    :root {
      color-scheme: light;
      --accent: ${accent};
      --ink: #111827;
      --muted: #5b6472;
      --line: #e5e7eb;
      --paper: #ffffff;
      --wash: #f6f8fb;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--wash);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }

    main {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
      gap: 28px;
      align-items: end;
      min-height: 62vh;
      padding: 36px 0 44px;
      border-bottom: 1px solid var(--line);
    }

    .kicker {
      color: var(--accent);
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 14px;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(44px, 7vw, 92px);
      line-height: 0.95;
      margin: 0;
      letter-spacing: 0;
    }

    h2 {
      font-size: 28px;
      margin: 0 0 18px;
    }

    h3 {
      font-size: 18px;
      margin: 0 0 8px;
    }

    p {
      color: var(--muted);
      margin: 0;
    }

    .headline {
      color: var(--ink);
      font-size: clamp(22px, 3vw, 34px);
      margin: 24px 0 18px;
      max-width: 850px;
    }

    .summary {
      font-size: 18px;
      max-width: 780px;
    }

    .side {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
    }

    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 18px;
      border: 1px solid var(--line);
    }

    .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 22px;
    }

    .button {
      display: inline-flex;
      align-items: center;
      min-height: 42px;
      padding: 0 14px;
      border-radius: 999px;
      background: var(--ink);
      color: white;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
    }

    .button:nth-child(n + 2) {
      background: white;
      color: var(--ink);
      border: 1px solid var(--line);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 22px;
    }

    .tag {
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--muted);
      font-size: 13px;
      padding: 6px 10px;
      background: white;
    }

    section {
      padding: 42px 0;
      border-bottom: 1px solid var(--line);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .card {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      min-height: 150px;
    }

    .card a {
      color: var(--ink);
      text-decoration-color: var(--accent);
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }

    .card span {
      display: inline-flex;
      margin-bottom: 12px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }

    ul {
      display: grid;
      gap: 10px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px 16px;
    }

    .footer {
      padding: 34px 0 0;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 820px) {
      main { width: min(100% - 24px, 680px); padding: 24px 0; }
      .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 16px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    jobTitle: identity.title,
    description: positioning.summary,
    url: links[0]?.url,
  })}</script>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <p class="kicker">${escapeHtml(identity.title || work.company?.role || 'Personal homepage')}</p>
        <h1>${escapeHtml(identity.name)}</h1>
        <p class="headline">${escapeHtml(positioning.headline)}</p>
        <p class="summary">${escapeHtml(positioning.summary)}</p>
        <div class="buttons">${linkHtml}</div>
        <div class="tags">${keywords.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
      </div>
      <aside class="side">
        ${identity.avatar ? `<img class="avatar" src="${escapeHtml(identity.avatar)}" alt="${escapeHtml(identity.name)}">` : ''}
        <h2>${escapeHtml(positioning.tagline || collaboration.callToAction || 'Let us build something useful.')}</h2>
        <p>${escapeHtml(collaboration.bestFit || contact.preferred || '')}</p>
      </aside>
    </section>

    ${products.length ? `<section><h2>Products</h2><div class="grid">${renderCards(products)}</div></section>` : ''}
    ${services.length ? `<section><h2>Services</h2><div class="grid">${renderCards(services)}</div></section>` : ''}
    ${highlights.length || metrics.length ? `<section><h2>Proof</h2>${renderList([...highlights, ...metrics])}</section>` : ''}
    ${lookingFor.length ? `<section><h2>Collaborate</h2>${renderList(lookingFor)}</section>` : ''}

    <p class="footer">Generated from confirmed profile metadata.</p>
  </main>
</body>
</html>
`;

const resolvedOutput = path.resolve(outputPath);
fs.writeFileSync(resolvedOutput, html);
console.log(resolvedOutput);
