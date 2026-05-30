export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function safeUrl(value = '') {
  const url = String(value || '').trim();

  if (!url) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function normalizeTemplateName(value = '') {
  const template = String(value).trim().toLowerCase();
  const aliases = {
    product: 'product-led',
    'product-led': 'product-led',
    productled: 'product-led',
    builder: 'builder-os',
    'builder-os': 'builder-os',
    builderos: 'builder-os',
    proof: 'proof-first',
    'proof-first': 'proof-first',
    prooffirst: 'proof-first',
  };

  return aliases[template] || template;
}

function requireText(object, pathName) {
  const value = pathName.split('.').reduce((current, key) => {
    return current && current[key];
  }, object);

  if (!String(value || '').trim()) {
    throw new Error(`Missing required metadata field: ${pathName}`);
  }
}

function legacyProducts(metadata) {
  return asArray(metadata.work?.products).map((item) => ({
    name: item.name || '',
    status: item.status || '',
    audience: item.audience || '',
    value: item.value || item.description || '',
    description: item.description || item.value || '',
    url: item.url || '',
  }));
}

function legacyOffers(metadata) {
  return asArray(metadata.work?.services).map((item) => ({
    name: item.name || '',
    type: item.type || 'delivery',
    audience: item.audience || '',
    outcome: item.outcome || item.description || '',
    description: item.description || item.outcome || '',
    ctaLabel: item.ctaLabel || 'Book a conversation',
    url: item.url || '',
  }));
}

function normalizeProof(metadata) {
  const proof = metadata.proof || {};
  const legacyHighlights = asArray(proof.publicHighlights).map((item) => ({
    name: item,
    problem: '',
    result: item,
    url: '',
  }));

  return {
    cases: [...asArray(proof.cases), ...legacyHighlights],
    publicProjects: asArray(proof.publicProjects),
    metrics: asArray(proof.metrics),
    testimonials: asArray(proof.testimonials),
    credibility: asArray(proof.credibility),
  };
}

function normalizeLinks(metadata) {
  const contentLinks = asArray(metadata.content?.links);
  const legacyLinks = asArray(metadata.links);
  const contactLinks = [
    metadata.contact?.email
      ? { label: 'Email', url: `mailto:${metadata.contact.email}` }
      : null,
    metadata.contact?.calendar
      ? { label: 'Schedule', url: metadata.contact.calendar }
      : null,
  ].filter(Boolean);

  return [...contentLinks, ...legacyLinks, ...contactLinks];
}

function normalizeCta(metadata, links) {
  const primary = metadata.cta?.primary || {};
  const fallback = links[0] || {};

  return {
    primary: {
      label:
        primary.label ||
        metadata.collaboration?.callToAction ||
        'Book a conversation',
      url: primary.url || fallback.url || '',
    },
    secondary: metadata.cta?.secondary || {},
    note:
      metadata.cta?.note ||
      metadata.collaboration?.bestFit ||
      metadata.contact?.preferred ||
      '',
  };
}

export function normalizeMetadata(metadata) {
  const links = normalizeLinks(metadata);
  const products = asArray(metadata.products).length
    ? asArray(metadata.products)
    : legacyProducts(metadata);
  const offers = asArray(metadata.offers).length
    ? asArray(metadata.offers)
    : legacyOffers(metadata);
  const proof = normalizeProof(metadata);
  const cta = normalizeCta(metadata, links);

  const normalized = {
    locale: metadata.locale || 'en',
    identity: metadata.identity || {},
    positioning: metadata.positioning || {},
    audience: {
      primary:
        metadata.audience?.primary ||
        metadata.collaboration?.bestFit ||
        '',
      segments: asArray(metadata.audience?.segments),
      painPoints: asArray(metadata.audience?.painPoints),
      desiredOutcomes: asArray(metadata.audience?.desiredOutcomes),
      notFor: asArray(metadata.audience?.notFor),
    },
    transformation: metadata.transformation || {},
    offers,
    products,
    proof,
    builderStack: {
      tools: asArray(metadata.builderStack?.tools),
      agentCapabilities: asArray(metadata.builderStack?.agentCapabilities),
      automationCapabilities: asArray(
        metadata.builderStack?.automationCapabilities,
      ),
      technicalTags: asArray(metadata.builderStack?.technicalTags),
    },
    content: {
      featured: asArray(metadata.content?.featured),
      links,
    },
    cta,
    style: metadata.style || {},
  };

  requireText(normalized, 'identity.name');
  requireText(normalized, 'positioning.headline');
  requireText(normalized, 'positioning.summary');

  return normalized;
}

export function accentColor(metadata, fallback = '#2563eb') {
  return /^#[0-9a-f]{6}$/i.test(metadata.style?.accentColor || '')
    ? metadata.style.accentColor
    : fallback;
}

export function renderButton(link, variant = 'primary') {
  const url = safeUrl(link?.url || '');

  if (!url) {
    return '';
  }

  return `<a class="button ${variant}" href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label || url)}</a>`;
}

export function renderButtons(links = []) {
  return asArray(links)
    .map((link, index) => renderButton(link, index === 0 ? 'primary' : 'ghost'))
    .join('');
}

export function renderPills(items = []) {
  return asArray(items)
    .map((item) => `<span class="pill">${escapeHtml(item)}</span>`)
    .join('');
}

export function renderList(items = []) {
  const list = asArray(items);

  if (!list.length) {
    return '';
  }

  return `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function renderNamedCards(items = [], options = {}) {
  const cards = asArray(items);

  if (!cards.length) {
    return '';
  }

  return cards
    .map((item) => {
      const title = escapeHtml(item.name || item.title || options.fallbackTitle || 'Item');
      const eyebrow = item.status || item.type || item.audience || '';
      const body =
        item.value ||
        item.outcome ||
        item.description ||
        item.result ||
        item.problem ||
        '';
      const url = safeUrl(item.url || '');
      const titleHtml = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${title}</a>`
        : title;

      return `<article class="card">${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}<h3>${titleHtml}</h3><p>${escapeHtml(body)}</p></article>`;
    })
    .join('');
}

export function renderJsonLd(metadata) {
  const firstUrl = metadata.content.links[0]?.url || '';
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: metadata.identity.name,
    jobTitle: metadata.identity.title,
    description: metadata.positioning.summary,
    knowsAbout: [
      ...asArray(metadata.positioning.keywords),
      ...metadata.builderStack.technicalTags,
    ].slice(0, 12),
    url: safeUrl(firstUrl) || undefined,
  };

  return JSON.stringify(json);
}

export function pageShell({ metadata, title, description, css, body }) {
  return `<!doctype html>
<!--
  Generated by opc-symlink-skill/scripts/render-homepage.mjs.
  Do not edit this HTML directly. Update the metadata JSON and rerun the renderer.
-->
<html lang="${escapeHtml(metadata.locale || 'en')}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <style>${css}</style>
  <script type="application/ld+json">${renderJsonLd(metadata)}</script>
</head>
<body>
${body}
</body>
</html>
`;
}
