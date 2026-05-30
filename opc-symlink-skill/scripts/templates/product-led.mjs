import {
  accentColor,
  escapeHtml,
  labelsFor,
  pageShell,
  renderButtons,
  renderList,
  renderNamedCards,
  renderPillList,
} from '../lib/html.mjs';

function renderOutcomeCards(metadata, t) {
  const pain = metadata.audience.painPoints.slice(0, 3);
  const outcomes = metadata.audience.desiredOutcomes.slice(0, 3);

  return `
    <div class="outcome-column">
      <p class="eyebrow">${t.theirPain}</p>
      ${renderList(pain)}
    </div>
    <div class="outcome-column outcome-column-strong">
      <p class="eyebrow">${t.desiredOutcome}</p>
      ${renderList(outcomes)}
    </div>`;
}

function renderProofItems(metadata) {
  const proofItems = [
    ...metadata.proof.metrics,
    ...metadata.proof.credibility,
    ...metadata.proof.publicProjects,
  ].slice(0, 6);

  return renderList(proofItems);
}

export function renderProductLed(metadata) {
  const accent = accentColor(metadata, '#2457f5');
  const t = labelsFor(metadata.locale);
  const primaryLinks = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const hasOutcomes =
    metadata.audience.painPoints.length ||
    metadata.audience.desiredOutcomes.length;
  const hasProof =
    metadata.proof.metrics.length ||
    metadata.proof.credibility.length ||
    metadata.proof.publicProjects.length ||
    metadata.proof.cases.length;

  const css = `
:root {
  color-scheme: light;
  --accent: ${accent};
  --ink: #101522;
  --muted: #5d6675;
  --line: #dfe4ec;
  --paper: #ffffff;
  --wash: #f5f7fb;
  --soft: #eef3ff;
}
* { box-sizing: border-box; }
html, body { overflow-x: hidden; }
body {
  margin: 0;
  background:
    linear-gradient(180deg, #ffffff 0%, var(--wash) 46%, #ffffff 100%);
  color: var(--ink);
  font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
a { color: inherit; }
.page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 48px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  padding: 14px 0 30px;
}
.brand, .top-meta { min-width: 0; }
.brand strong {
  display: block;
  font-size: 18px;
  letter-spacing: 0;
}
.brand span, .top-meta {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 28px;
  align-items: center;
  min-height: 620px;
  padding: 24px 0 46px;
}
.hero-copy, .hero-panel, .card, li, .cta-band {
  min-width: 0;
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
  font-size: clamp(42px, 5.8vw, 72px);
  letter-spacing: 0;
  line-height: 0.98;
  margin: 0;
  max-width: 820px;
}
h2 {
  font-size: clamp(28px, 3vw, 42px);
  letter-spacing: 0;
  line-height: 1.05;
  margin: 0;
}
h3 {
  font-size: 18px;
  line-height: 1.25;
  margin: 0 0 8px;
}
p { color: var(--muted); margin: 0; }
.summary {
  color: #3d4758;
  font-size: 19px;
  max-width: 720px;
  margin-top: 20px;
}
.hero-actions {
  display: grid;
  gap: 16px;
  margin-top: 28px;
  max-width: 720px;
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
  min-height: 44px;
  min-width: 0;
  padding: 0 18px;
  text-align: center;
  text-decoration: none;
  overflow-wrap: anywhere;
  white-space: normal;
  font-size: 14px;
  font-weight: 850;
  line-height: 1.15;
}
.button.primary {
  background: var(--ink);
  color: #fff;
}
.button.ghost {
  background: #fff;
  border: 1px solid var(--line);
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.pill {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 13px;
  min-width: 0;
  padding: 6px 10px;
  overflow-wrap: anywhere;
}
.hero-panel {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(25, 36, 62, 0.08);
  display: grid;
  gap: 20px;
  padding: 24px;
}
.hero-panel h2 {
  font-size: 27px;
}
.hero-panel ul, .outcomes ul {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  padding: 13px 14px;
}
section {
  border-top: 1px solid var(--line);
  padding: 44px 0;
}
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}
.section-head p {
  max-width: 480px;
}
.outcomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.outcome-column {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
}
.outcome-column-strong {
  background: var(--soft);
  border-color: color-mix(in srgb, var(--accent) 28%, var(--line));
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
}
.card a {
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.proof-strip ul {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.cta-band {
  align-items: center;
  background: var(--ink);
  border-radius: 8px;
  color: #fff;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  padding: 26px;
}
.cta-band p { color: #d6dbe4; }
.cta-band .button.primary { background: #fff; color: var(--ink); }
.footer {
  color: var(--muted);
  font-size: 13px;
  padding-top: 28px;
}
@media (max-width: 860px) {
  .page { width: min(100% - 24px, 720px); padding-top: 12px; }
  .topbar { align-items: flex-start; flex-direction: column; padding-right: 128px; }
  .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 18px; }
  h1 {
    font-size: clamp(31px, 9vw, 36px);
    max-width: min(100%, 330px);
    text-wrap: balance;
  }
  h2 { font-size: 28px; }
  .summary { font-size: 17px; }
  .hero-panel h2 { font-size: 24px; }
  .section-head, .outcomes, .grid, .proof-strip ul, .cta-band {
    grid-template-columns: 1fr;
    display: grid;
  }
  .button { width: 100%; }
}
`;

  const body = `
<main class="page">
  <nav class="topbar">
    <div class="brand">
      <strong>${escapeHtml(metadata.identity.name)}</strong>
      <span>${escapeHtml(metadata.identity.title || t.aiBuilder)}</span>
    </div>
    <div class="top-meta">${escapeHtml(metadata.identity.location || '')}</div>
  </nav>

  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">${t.offer}</p>
      <h1>${escapeHtml(metadata.positioning.headline)}</h1>
      <p class="summary">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="hero-actions">
        <div class="buttons">${renderButtons(primaryLinks)}</div>
        ${renderPillList(metadata.positioning.keywords)}
      </div>
    </div>
    <aside class="hero-panel">
      <div>
        <p class="eyebrow">${t.bestFit}</p>
        <h2>${escapeHtml(metadata.audience.primary || t.defaultAudience)}</h2>
      </div>
      ${metadata.audience.painPoints.length ? `<div><p class="eyebrow">${t.theirPain}</p>${renderList(metadata.audience.painPoints.slice(0, 3))}</div>` : ''}
      <p>${escapeHtml(metadata.cta.note || metadata.positioning.differentiator || t.defaultCtaNote)}</p>
    </aside>
  </section>

  ${hasOutcomes ? `<section><div class="section-head"><div><p class="eyebrow">${t.transformation}</p><h2>${t.transformationTitle}</h2></div><p>${escapeHtml(metadata.transformation.mechanism || metadata.positioning.differentiator || t.defaultMechanism)}</p></div><div class="outcomes">${renderOutcomeCards(metadata, t)}</div></section>` : ''}
  ${metadata.offers.length ? `<section><div class="section-head"><div><p class="eyebrow">${t.offers}</p><h2>${t.waysWorkTogether}</h2></div><p>${t.howWorkDelivered}</p></div><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${metadata.products.length ? `<section><div class="section-head"><div><p class="eyebrow">${t.products}</p><h2>${t.thingsBeingBuilt}</h2></div><p>${t.publicArtifacts}</p></div><div class="grid">${renderNamedCards(metadata.products)}</div></section>` : ''}
  ${hasProof ? `<section class="proof-strip"><div class="section-head"><div><p class="eyebrow">${t.proof}</p><h2>${t.reasonsToBelieve}</h2></div><p>${t.strangerTrust}</p></div>${renderProofItems(metadata)}</section>` : ''}

  <section class="cta-band">
    <div>
      <p class="eyebrow">${t.nextStep}</p>
      <h2>${escapeHtml(metadata.cta.primary.label || t.bookConversation)}</h2>
      <p>${escapeHtml(metadata.cta.note || t.defaultCtaNote)}</p>
    </div>
    <div class="buttons">${renderButtons(primaryLinks)}</div>
  </section>

  <p class="footer">${t.footer}</p>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - ${metadata.positioning.headline}`,
    description: metadata.positioning.summary,
    css,
    body,
  });
}
