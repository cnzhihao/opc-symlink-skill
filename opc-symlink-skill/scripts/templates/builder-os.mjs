import {
  accentColor,
  asArray,
  escapeHtml,
  pageShell,
  renderButtons,
  renderList,
  renderNamedCards,
  renderPills,
} from '../lib/html.mjs';

export function renderBuilderOs(metadata) {
  const accent = accentColor(metadata, '#14b8a6');
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

  const css = `
:root {
  color-scheme: dark;
  --accent: ${accent};
  --ink: #f9fafb;
  --muted: #a8b3c7;
  --line: rgba(255,255,255,0.14);
  --panel: rgba(17, 24, 39, 0.76);
  --wash: #080b12;
}
* { box-sizing: border-box; }
body {
  background: radial-gradient(circle at 20% 0%, rgba(20,184,166,0.22), transparent 34%), var(--wash);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.55;
  margin: 0;
}
a { color: inherit; }
.page {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 42px 0 56px;
}
.topbar {
  align-items: center;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  padding-bottom: 18px;
}
.status {
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
  gap: 18px;
  min-height: 70vh;
  padding: 34px 0;
}
.terminal, .panel, .card, li {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.terminal {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px;
}
.chrome {
  color: var(--muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  margin-bottom: 28px;
}
h1 {
  font-size: clamp(42px, 6vw, 82px);
  letter-spacing: 0;
  line-height: 0.98;
  margin: 0;
}
h2 { font-size: 28px; line-height: 1.15; margin: 0 0 16px; }
h3 { font-size: 18px; margin: 0 0 8px; }
p { color: var(--muted); margin: 0; }
.headline {
  color: var(--ink);
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.15;
  margin: 22px 0 14px;
}
.side {
  display: grid;
  gap: 18px;
}
.panel { padding: 22px; }
.eyebrow {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  margin: 0 0 10px;
  text-transform: uppercase;
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
  min-height: 42px;
  padding: 0 15px;
  text-decoration: none;
}
.button.primary { background: var(--accent); color: #041014; }
.button.ghost { border: 1px solid var(--line); color: var(--ink); }
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}
.pill {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 13px;
  padding: 6px 10px;
}
section {
  border-top: 1px solid var(--line);
  padding: 38px 0;
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
.footer {
  color: var(--muted);
  font-size: 14px;
  padding-top: 30px;
}
@media (max-width: 880px) {
  .page { width: min(100% - 24px, 720px); padding-top: 24px; }
  .hero, .grid { grid-template-columns: 1fr; min-height: auto; }
  .topbar { align-items: flex-start; flex-direction: column; gap: 8px; }
}
`;

  const body = `
<main class="page">
  <nav class="topbar">
    <strong>${escapeHtml(metadata.identity.name)}</strong>
    <span class="status">${escapeHtml(metadata.identity.title || 'AI builder operating system')}</span>
  </nav>
  <section class="hero">
    <div class="terminal">
      <p class="chrome">~/builder-os/package-public-profile</p>
      <h1>${escapeHtml(metadata.positioning.headline)}</h1>
      <p class="headline">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="buttons">${renderButtons(links)}</div>
      <div class="pills">${renderPills(metadata.positioning.keywords)}</div>
    </div>
    <aside class="side">
      <div class="panel"><p class="eyebrow">Audience</p><h2>${escapeHtml(metadata.audience.primary || 'Teams and founders building with AI.')}</h2><p>${escapeHtml(metadata.cta.note || '')}</p></div>
      <div class="panel"><p class="eyebrow">Transformation</p><p>${escapeHtml(metadata.transformation.mechanism || metadata.positioning.differentiator || 'Turns scattered AI ideas into working systems.')}</p></div>
      ${capabilities.length ? `<div class="panel"><p class="eyebrow">Capabilities</p><div class="pills">${renderPills(capabilities)}</div></div>` : ''}
    </aside>
  </section>

  ${metadata.products.length ? `<section><p class="eyebrow">Current builds</p><h2>Products and systems in motion.</h2><div class="grid">${renderNamedCards(metadata.products)}</div></section>` : ''}
  ${metadata.offers.length ? `<section><p class="eyebrow">Interfaces</p><h2>Ways to plug into the work.</h2><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${systemSignals.length ? `<section><p class="eyebrow">Stack</p><h2>Tools, models, and technical surface area.</h2><div class="pills">${renderPills(systemSignals)}</div></section>` : ''}
  ${metadata.audience.painPoints.length || metadata.audience.desiredOutcomes.length ? `<section><p class="eyebrow">Operating brief</p><div class="grid"><article class="card"><h3>Pain</h3>${renderList(metadata.audience.painPoints)}</article><article class="card"><h3>Desired outcome</h3>${renderList(metadata.audience.desiredOutcomes)}</article><article class="card"><h3>Not for</h3>${renderList(metadata.audience.notFor)}</article></div></section>` : ''}
  ${featured.length ? `<section><p class="eyebrow">Public logs</p><h2>Writing, demos, and artifacts.</h2><div class="grid">${renderNamedCards(featured, { fallbackTitle: 'Public item' })}</div></section>` : ''}

  <p class="footer">Generated from confirmed public packaging metadata.</p>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - Builder OS`,
    description: metadata.positioning.summary,
    css,
    body,
  });
}
