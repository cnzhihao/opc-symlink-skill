import {
  accentColor,
  asArray,
  escapeHtml,
  labelsFor,
  pageShell,
  renderButtons,
  renderList,
  renderNamedCards,
  renderPills,
} from '../lib/html.mjs';

export function renderProductLed(metadata) {
  const accent = accentColor(metadata, '#2563eb');
  const t = labelsFor(metadata.locale);
  const keywords = asArray(metadata.positioning.keywords);
  const primaryLinks = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const proofItems = [
    ...metadata.proof.metrics,
    ...metadata.proof.credibility,
    ...metadata.proof.publicProjects,
  ];
  const stackItems = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
  ];

  const css = `
:root {
  color-scheme: light;
  --accent: ${accent};
  --ink: #111827;
  --muted: #5b6472;
  --line: #e5e7eb;
  --paper: #ffffff;
  --wash: #f7f8fb;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--wash);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.55;
}
a { color: inherit; }
.page {
  width: min(1160px, calc(100% - 32px));
  margin: 0 auto;
  padding: 38px 0 52px;
}
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 28px;
  align-items: stretch;
  min-height: 72vh;
  padding: 34px 0 42px;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.kicker, .eyebrow {
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  margin: 0 0 12px;
  text-transform: uppercase;
}
h1 {
  font-size: clamp(44px, 6.8vw, 90px);
  letter-spacing: 0;
  line-height: 0.96;
  margin: 0;
}
h2 { font-size: 30px; line-height: 1.15; margin: 0 0 18px; }
h3 { font-size: 19px; margin: 0 0 8px; }
p { color: var(--muted); margin: 0; }
.headline {
  color: var(--ink);
  font-size: clamp(23px, 3vw, 36px);
  line-height: 1.12;
  max-width: 820px;
  margin: 24px 0 16px;
}
.summary {
  font-size: 18px;
  max-width: 760px;
}
.panel {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 24px;
}
.audience-panel {
  align-self: end;
  display: grid;
  gap: 20px;
}
.avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--line);
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}
.button {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 14px;
  font-weight: 800;
  min-height: 44px;
  padding: 0 16px;
  text-decoration: none;
}
.button.primary { background: var(--ink); color: #fff; }
.button.ghost { background: #fff; border: 1px solid var(--line); color: var(--ink); }
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}
.pill {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 13px;
  padding: 6px 10px;
}
section {
  border-top: 1px solid var(--line);
  padding: 42px 0;
}
.split {
  display: grid;
  grid-template-columns: minmax(220px, 0.35fr) minmax(0, 1fr);
  gap: 24px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.card, li {
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
ul {
  display: grid;
  gap: 10px;
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
  grid-template-columns: 1fr auto;
  gap: 22px;
  padding: 26px;
}
.cta-band p { color: #d1d5db; }
.cta-band .button.primary { background: #fff; color: var(--ink); }
.footer {
  color: var(--muted);
  font-size: 14px;
  padding-top: 30px;
}
@media (max-width: 860px) {
  .page { width: min(100% - 24px, 720px); padding-top: 22px; }
  .hero, .split, .cta-band { grid-template-columns: 1fr; min-height: auto; }
  .grid { grid-template-columns: 1fr; }
}
`;

  const body = `
<main class="page">
  <section class="hero">
    <div class="hero-copy">
      <p class="kicker">${escapeHtml(metadata.identity.title || t.aiBuilder)}</p>
      <h1>${escapeHtml(metadata.identity.name)}</h1>
      <p class="headline">${escapeHtml(metadata.positioning.headline)}</p>
      <p class="summary">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="buttons">${renderButtons(primaryLinks)}</div>
      <div class="pills">${renderPills(keywords)}</div>
    </div>
    <aside class="panel audience-panel">
      ${metadata.identity.avatar ? `<img class="avatar" src="${escapeHtml(metadata.identity.avatar)}" alt="${escapeHtml(metadata.identity.name)}">` : ''}
      <div>
        <p class="eyebrow">${t.bestFit}</p>
        <h2>${escapeHtml(metadata.audience.primary || metadata.positioning.tagline || t.defaultAudience)}</h2>
        <p>${escapeHtml(metadata.cta.note || metadata.positioning.differentiator || '')}</p>
      </div>
      ${metadata.audience.painPoints.length ? `<div><p class="eyebrow">${t.theirPain}</p>${renderList(metadata.audience.painPoints)}</div>` : ''}
    </aside>
  </section>

  <section class="split">
    <div><p class="eyebrow">${t.transformation}</p><h2>${t.transformationTitle}</h2></div>
    <div class="grid">
      <article class="card"><h3>${t.before}</h3><p>${escapeHtml(metadata.transformation.from || t.defaultTransformationBefore)}</p></article>
      <article class="card"><h3>${t.after}</h3><p>${escapeHtml(metadata.transformation.to || t.defaultTransformationAfter)}</p></article>
      <article class="card"><h3>${t.mechanisms}</h3><p>${escapeHtml(metadata.transformation.mechanism || metadata.positioning.differentiator || t.defaultMechanism)}</p></article>
    </div>
  </section>

  ${metadata.offers.length ? `<section class="split"><div><p class="eyebrow">${t.offers}</p><h2>${t.waysWorkTogether}</h2></div><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${metadata.products.length ? `<section class="split"><div><p class="eyebrow">${t.products}</p><h2>${t.thingsBeingBuilt}</h2></div><div class="grid">${renderNamedCards(metadata.products)}</div></section>` : ''}
  ${proofItems.length ? `<section class="split"><div><p class="eyebrow">${t.proof}</p><h2>${t.reasonsToBelieve}</h2></div>${renderList(proofItems)}</section>` : ''}
  ${stackItems.length ? `<section class="split"><div><p class="eyebrow">${t.builderStack}</p><h2>${t.howWorkMade}</h2></div><div class="pills">${renderPills(stackItems)}</div></section>` : ''}

  <section class="cta-band">
    <div><p class="eyebrow">${t.nextStep}</p><h2>${escapeHtml(metadata.cta.primary.label || t.bookConversation)}</h2><p>${escapeHtml(metadata.cta.note || t.defaultCtaNote)}</p></div>
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
