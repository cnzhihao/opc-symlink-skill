import {
  accentColor,
  asArray,
  escapeHtml,
  labelsFor,
  pageShell,
  renderButtons,
  renderList,
  renderNamedCards,
  renderPillList,
} from '../lib/html.mjs';

function renderModule(title, body) {
  if (!body) {
    return '';
  }

  return `<article class="module"><p class="eyebrow">${title}</p>${body}</article>`;
}

export function renderBuilderOs(metadata) {
  const accent = accentColor(metadata, '#35d0ba');
  const t = labelsFor(metadata.locale);
  const links = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const systemSignals = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.technicalTags,
  ];
  const capabilities = [
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
  ];
  const featured = asArray(metadata.content.featured);
  const currentBuilds = metadata.products.slice(0, 3);

  const css = `
:root {
  color-scheme: dark;
  --accent: ${accent};
  --ink: #f7fbff;
  --muted: #9eaabd;
  --line: rgba(255,255,255,0.14);
  --panel: rgba(14, 22, 36, 0.86);
  --panel-strong: rgba(20, 32, 52, 0.96);
  --wash: #060910;
}
* { box-sizing: border-box; }
html, body { overflow-x: hidden; }
body {
  background:
    linear-gradient(135deg, rgba(53,208,186,0.20), transparent 28%),
    linear-gradient(180deg, #0a1220 0%, var(--wash) 70%);
  color: var(--ink);
  font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
  margin: 0;
}
a { color: inherit; }
.page {
  width: min(1140px, calc(100% - 32px));
  margin: 0 auto;
  padding: 30px 0 52px;
}
.topbar {
  align-items: center;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-width: 0;
  padding: 12px 0 22px;
}
.brand, .status { min-width: 0; overflow-wrap: anywhere; }
.brand strong { display: block; font-size: 18px; }
.brand span, .status { color: var(--muted); font-size: 13px; font-weight: 750; }
.status { color: var(--accent); text-transform: uppercase; }
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
  gap: 22px;
  align-items: stretch;
  padding: 38px 0 44px;
}
.brief, .module, .card, li, .build-board {
  min-width: 0;
}
.brief, .module, .card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.brief {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
}
.eyebrow {
  color: var(--accent);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0;
  margin: 0 0 12px;
  text-transform: uppercase;
}
h1, h2, h3, p { overflow-wrap: anywhere; }
h1 {
  font-size: clamp(38px, 4.8vw, 52px);
  letter-spacing: 0;
  line-height: 1.02;
  margin: 0;
  max-width: 760px;
}
h2 {
  font-size: clamp(27px, 3vw, 38px);
  letter-spacing: 0;
  line-height: 1.08;
  margin: 0;
}
h3 {
  font-size: 17px;
  line-height: 1.25;
  margin: 0 0 8px;
}
p { color: var(--muted); margin: 0; }
.summary {
  color: #dce6f4;
  font-size: 18px;
  margin-top: 18px;
  max-width: 720px;
}
.actions {
  display: grid;
  gap: 16px;
  margin-top: 26px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}
.button {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  justify-content: center;
  max-width: 100%;
  min-height: 42px;
  min-width: 0;
  padding: 0 17px;
  text-align: center;
  text-decoration: none;
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 14px;
  font-weight: 850;
  line-height: 1.15;
}
.button.primary {
  background: var(--accent);
  color: #fff;
}
.button.ghost {
  border: 1px solid var(--line);
  color: var(--ink);
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.pill {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: #c5cfdd;
  font-size: 13px;
  min-width: 0;
  padding: 6px 10px;
  overflow-wrap: anywhere;
}
.module-stack {
  display: grid;
  gap: 12px;
}
.module {
  padding: 18px;
}
.module h2 {
  font-size: 22px;
}
section {
  border-top: 1px solid var(--line);
  padding: 40px 0;
}
.section-head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
  max-width: 760px;
}
.build-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.module .build-board {
  grid-template-columns: 1fr;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.card {
  padding: 18px;
}
.card a {
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
ul {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  background: var(--panel-strong);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  padding: 13px 14px;
}
.cta-panel {
  align-items: center;
  background: var(--panel-strong);
  border: 1px solid var(--line);
  border-radius: 8px;
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) auto;
  padding: 24px;
}
.footer {
  color: var(--muted);
  font-size: 13px;
  padding-top: 28px;
}
@media (max-width: 880px) {
  .page { width: min(100% - 24px, 720px); padding-top: 12px; }
  .topbar { align-items: flex-start; flex-direction: column; padding-right: 128px; }
  .hero, .build-board, .grid, .cta-panel { grid-template-columns: 1fr; }
  .brief { padding: 22px; }
  h1 {
    font-size: clamp(30px, 8.5vw, 34px);
    max-width: min(100%, 330px);
    text-wrap: balance;
  }
  h2 { font-size: 27px; }
  .summary { font-size: 16px; }
  .button { width: 100%; }
}
`;

  const buildCards = currentBuilds.length
    ? renderNamedCards(currentBuilds)
    : renderModule(t.currentBuilds, `<p>${t.productsInMotion}</p>`);

  const body = `
<main class="page">
  <nav class="topbar">
    <div class="brand">
      <strong>${escapeHtml(metadata.identity.name)}</strong>
      <span>${escapeHtml(metadata.identity.title || t.builderOsTitle)}</span>
    </div>
    <span class="status">${t.builderOsTitle}</span>
  </nav>

  <section class="hero">
    <div class="brief">
      <p class="eyebrow">${t.operatingBrief}</p>
      <h1>${escapeHtml(metadata.positioning.headline)}</h1>
      <p class="summary">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="actions">
        <div class="buttons">${renderButtons(links)}</div>
        ${renderPillList(metadata.positioning.keywords)}
      </div>
    </div>
    <aside class="module-stack">
      ${renderModule(t.currentBuilds, currentBuilds.length ? `<div class="build-board">${renderNamedCards(currentBuilds)}</div>` : `<p>${t.productsInMotion}</p>`)}
      ${renderModule(t.capabilities, capabilities.length ? renderPillList(capabilities) : `<p>${escapeHtml(metadata.transformation.mechanism || t.defaultMechanismBuilderOs)}</p>`)}
      ${renderModule(t.stack, systemSignals.length ? renderPillList(systemSignals.slice(0, 8)) : `<p>${t.toolsModelsSurface}</p>`)}
    </aside>
  </section>

  ${metadata.products.length ? `<section><div class="section-head"><p class="eyebrow">${t.currentBuilds}</p><h2>${t.productsInMotion}</h2></div><div class="build-board">${buildCards}</div></section>` : ''}
  ${capabilities.length || systemSignals.length ? `<section><div class="section-head"><p class="eyebrow">${t.capabilities}</p><h2>${t.howWorkMade}</h2></div><div class="grid">${capabilities.length ? `<article class="card"><h3>${t.capabilities}</h3>${renderPillList(capabilities)}</article>` : ''}${systemSignals.length ? `<article class="card"><h3>${t.stack}</h3>${renderPillList(systemSignals)}</article>` : ''}</div></section>` : ''}
  ${featured.length ? `<section><div class="section-head"><p class="eyebrow">${t.publicLogs}</p><h2>${t.writingDemosArtifacts}</h2></div><div class="grid">${renderNamedCards(featured, { fallbackTitle: t.publicItem })}</div></section>` : ''}
  ${metadata.offers.length ? `<section><div class="section-head"><p class="eyebrow">${t.interfaces}</p><h2>${t.waysPlugIn}</h2></div><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${metadata.audience.painPoints.length || metadata.audience.desiredOutcomes.length ? `<section><div class="section-head"><p class="eyebrow">${t.audience}</p><h2>${escapeHtml(metadata.audience.primary || t.defaultAudienceBuilderOs)}</h2></div><div class="grid"><article class="card"><h3>${t.pain}</h3>${renderList(metadata.audience.painPoints.slice(0, 3))}</article><article class="card"><h3>${t.desiredOutcome}</h3>${renderList(metadata.audience.desiredOutcomes.slice(0, 3))}</article></div></section>` : ''}

  <section class="cta-panel">
    <div>
      <p class="eyebrow">${t.nextStep}</p>
      <h2>${escapeHtml(metadata.cta.primary.label || t.bookConversation)}</h2>
      <p>${escapeHtml(metadata.cta.note || t.defaultCtaNote)}</p>
    </div>
    <div class="buttons">${renderButtons(links)}</div>
  </section>

  <p class="footer">${t.footer}</p>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - ${t.builderOsTitle}`,
    description: metadata.positioning.summary,
    css,
    body,
  });
}
