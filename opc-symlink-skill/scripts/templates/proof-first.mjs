import {
  accentColor,
  escapeHtml,
  pageShell,
  renderButtons,
  renderList,
  renderNamedCards,
  renderPills,
} from '../lib/html.mjs';

export function renderProofFirst(metadata) {
  const accent = accentColor(metadata, '#0f766e');
  const links = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const proofSummary = [
    ...metadata.proof.metrics,
    ...metadata.proof.credibility,
    ...metadata.proof.publicProjects,
  ];
  const stack = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
  ];

  const css = `
:root {
  color-scheme: light;
  --accent: ${accent};
  --ink: #17201c;
  --muted: #5f6f67;
  --line: #d9e3df;
  --paper: #ffffff;
  --wash: #f4f7f5;
}
* { box-sizing: border-box; }
body {
  background: var(--wash);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.55;
  margin: 0;
}
a { color: inherit; }
.page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 42px 0 54px;
}
.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
  gap: 26px;
  min-height: 68vh;
  padding: 38px 0 46px;
}
.hero-card, .proof-card, .card, li {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.hero-card {
  align-self: start;
  padding: 24px;
}
.proof-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px;
}
.eyebrow {
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  margin: 0 0 12px;
  text-transform: uppercase;
}
h1 {
  font-size: clamp(40px, 5.8vw, 78px);
  letter-spacing: 0;
  line-height: 0.98;
  margin: 0;
}
h2 { font-size: 30px; line-height: 1.15; margin: 0 0 18px; }
h3 { font-size: 18px; margin: 0 0 8px; }
p { color: var(--muted); margin: 0; }
.summary {
  color: var(--ink);
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.16;
  margin: 22px 0 16px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}
.button {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 14px;
  font-weight: 800;
  min-height: 42px;
  padding: 0 15px;
  text-decoration: none;
}
.button.primary { background: var(--accent); color: #fff; }
.button.ghost { background: #fff; border: 1px solid var(--line); color: var(--ink); }
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
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
  padding: 40px 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.card { padding: 18px; }
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
li { padding: 14px 16px; }
.quote {
  border-left: 3px solid var(--accent);
  padding-left: 16px;
}
.footer {
  color: var(--muted);
  font-size: 14px;
  padding-top: 30px;
}
@media (max-width: 860px) {
  .page { width: min(100% - 24px, 720px); padding-top: 24px; }
  .hero, .grid { grid-template-columns: 1fr; min-height: auto; }
}
`;

  const testimonials = metadata.proof.testimonials
    .map((item) => {
      return `<article class="card quote"><p>${escapeHtml(item.quote || '')}</p><h3>${escapeHtml(item.person || 'Public testimonial')}</h3><p>${escapeHtml(item.role || '')}</p></article>`;
    })
    .join('');

  const body = `
<main class="page">
  <section class="hero">
    <div class="hero-card">
      <p class="eyebrow">${escapeHtml(metadata.identity.title || 'AI builder')}</p>
      <h1>${escapeHtml(metadata.identity.name)}</h1>
      <p>${escapeHtml(metadata.positioning.tagline || metadata.positioning.differentiator || '')}</p>
      <div class="buttons">${renderButtons(links)}</div>
      <div class="pills">${renderPills(metadata.positioning.keywords)}</div>
    </div>
    <div class="proof-card">
      <p class="eyebrow">Proof-led profile</p>
      <h2>${escapeHtml(metadata.positioning.headline)}</h2>
      <p class="summary">${escapeHtml(metadata.positioning.summary)}</p>
      <p>${escapeHtml(metadata.audience.primary || '')}</p>
    </div>
  </section>

  ${proofSummary.length ? `<section><p class="eyebrow">Proof summary</p><h2>Signals a stranger can trust.</h2>${renderList(proofSummary)}</section>` : ''}
  ${metadata.proof.cases.length ? `<section><p class="eyebrow">Cases</p><h2>Problems, systems, and results.</h2><div class="grid">${renderNamedCards(metadata.proof.cases, { fallbackTitle: 'Case' })}</div></section>` : ''}
  ${testimonials ? `<section><p class="eyebrow">Testimonials</p><h2>What others say.</h2><div class="grid">${testimonials}</div></section>` : ''}
  ${metadata.offers.length ? `<section><p class="eyebrow">Offer</p><h2>How to work together.</h2><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${metadata.products.length ? `<section><p class="eyebrow">Products</p><h2>Public artifacts and tools.</h2><div class="grid">${renderNamedCards(metadata.products)}</div></section>` : ''}
  ${metadata.audience.painPoints.length || metadata.audience.desiredOutcomes.length ? `<section><p class="eyebrow">Audience fit</p><div class="grid"><article class="card"><h3>Pain</h3>${renderList(metadata.audience.painPoints)}</article><article class="card"><h3>Desired outcome</h3>${renderList(metadata.audience.desiredOutcomes)}</article><article class="card"><h3>Not for</h3>${renderList(metadata.audience.notFor)}</article></div></section>` : ''}
  ${stack.length ? `<section><p class="eyebrow">Builder stack</p><h2>How the work gets delivered.</h2><div class="pills">${renderPills(stack)}</div></section>` : ''}

  <section>
    <p class="eyebrow">Next step</p>
    <h2>${escapeHtml(metadata.cta.primary.label || 'Book a conversation')}</h2>
    <p>${escapeHtml(metadata.cta.note || 'Start with a focused conversation about your AI workflow, product, or delivery system.')}</p>
    <div class="buttons">${renderButtons(links)}</div>
  </section>

  <p class="footer">Generated from confirmed public packaging metadata.</p>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - Proof`,
    description: metadata.positioning.summary,
    css,
    body,
  });
}
