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

function proofSignals(metadata) {
  return [
    ...metadata.proof.metrics,
    ...metadata.proof.credibility,
    ...metadata.proof.publicProjects,
  ];
}

function renderCaseLedger(cases, t) {
  return cases
    .slice(0, 6)
    .map((item) => {
      const title = escapeHtml(item.name || t.cases);
      const url = item.url
        ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${title}</a>`
        : title;

      return `<article class="case-row">
        <h3>${url}</h3>
        ${item.problem ? `<p><strong>${t.pain}</strong> ${escapeHtml(item.problem)}</p>` : ''}
        ${item.result ? `<p><strong>${t.after}</strong> ${escapeHtml(item.result)}</p>` : ''}
      </article>`;
    })
    .join('');
}

export function renderProofFirst(metadata) {
  const accent = accentColor(metadata, '#0d9488');
  const t = labelsFor(metadata.locale);
  const links = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const signals = proofSignals(metadata);
  const snapshot = signals.slice(0, 3);
  const stack = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
  ];
  const testimonials = metadata.proof.testimonials
    .slice(0, 3)
    .map((item) => {
      return `<article class="quote"><p>${escapeHtml(item.quote || '')}</p><h3>${escapeHtml(item.person || t.testimonials)}</h3><span>${escapeHtml(item.role || '')}</span></article>`;
    })
    .join('');

  const css = `
:root {
  color-scheme: light;
  --accent: ${accent};
  --ink: #14201d;
  --muted: #62736e;
  --line: #d8e2de;
  --paper: #ffffff;
  --wash: #f3f7f5;
  --mark: #ecfdf5;
}
* { box-sizing: border-box; }
html, body { overflow-x: hidden; }
body {
  background:
    linear-gradient(180deg, #fbfdfc 0%, var(--wash) 55%, #ffffff 100%);
  color: var(--ink);
  font-family: Avenir Next, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
  margin: 0;
}
a { color: inherit; }
.page {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 50px;
}
.topbar {
  align-items: center;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 18px;
  justify-content: space-between;
  min-width: 0;
  padding: 14px 0 28px;
}
.brand { min-width: 0; }
.brand strong { display: block; font-size: 18px; }
.brand span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 750;
}
.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(300px, 0.8fr);
  gap: 24px;
  align-items: stretch;
  padding: 38px 0 44px;
}
.hero-copy, .snapshot, .case-row, .card, .quote, li {
  min-width: 0;
}
.hero-copy {
  align-self: center;
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
  font-size: clamp(40px, 5.6vw, 68px);
  letter-spacing: 0;
  line-height: 0.99;
  margin: 0;
  max-width: 760px;
}
h2 {
  font-size: clamp(28px, 3vw, 40px);
  letter-spacing: 0;
  line-height: 1.08;
  margin: 0;
}
h3 {
  font-size: 18px;
  line-height: 1.25;
  margin: 0 0 8px;
}
p { color: var(--muted); margin: 0; }
.summary {
  color: #33423e;
  font-size: 19px;
  margin-top: 20px;
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
.button.primary { background: var(--accent); color: #fff; }
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
.snapshot {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 24px 70px rgba(25, 48, 42, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
}
.snapshot ul {
  display: grid;
  gap: 12px;
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}
li {
  background: var(--mark);
  border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--line));
  border-radius: 8px;
  color: var(--ink);
  padding: 14px;
}
section {
  border-top: 1px solid var(--line);
  padding: 42px 0;
}
.section-head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
  max-width: 760px;
}
.case-ledger {
  display: grid;
  gap: 12px;
}
.case-row {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  display: grid;
  gap: 8px;
  grid-template-columns: minmax(180px, 0.35fr) minmax(0, 1fr) minmax(0, 1fr);
  padding: 18px;
}
.case-row h3 {
  margin: 0;
}
.case-row strong {
  color: var(--ink);
  display: block;
  font-size: 12px;
  text-transform: uppercase;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.card, .quote {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
}
.card a, .case-row a {
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.quote {
  border-left: 4px solid var(--accent);
}
.quote span {
  color: var(--muted);
  font-size: 13px;
}
.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
ul {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.cta-panel {
  align-items: center;
  background: var(--ink);
  border-radius: 8px;
  color: #fff;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  padding: 24px;
}
.cta-panel p { color: #d7e3df; }
.cta-panel .button.primary { background: #fff; color: var(--ink); }
.footer {
  color: var(--muted);
  font-size: 13px;
  padding-top: 28px;
}
@media (max-width: 860px) {
  .page { width: min(100% - 24px, 720px); padding-top: 12px; }
  .topbar { align-items: flex-start; flex-direction: column; padding-right: 128px; }
  .hero, .grid, .audience-grid, .cta-panel { grid-template-columns: 1fr; }
  .case-row { grid-template-columns: 1fr; }
  h1 {
    font-size: clamp(31px, 9vw, 36px);
    max-width: min(100%, 330px);
    text-wrap: balance;
  }
  h2 { font-size: 28px; }
  .summary { font-size: 17px; }
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
  </nav>

  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">${t.proofFirstProfile}</p>
      <h1>${escapeHtml(metadata.positioning.headline)}</h1>
      <p class="summary">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="actions">
        <div class="buttons">${renderButtons(links)}</div>
        ${renderPillList(metadata.positioning.keywords)}
      </div>
    </div>
    <aside class="snapshot">
      <p class="eyebrow">${snapshot.length ? t.proofSummary : t.proofSignals}</p>
      <h2>${snapshot.length ? t.strangerTrust : t.publicLogs}</h2>
      ${snapshot.length ? renderList(snapshot) : `<p>${escapeHtml(metadata.audience.primary || t.defaultAudience)}</p>`}
    </aside>
  </section>

  ${metadata.proof.cases.length ? `<section><div class="section-head"><p class="eyebrow">${t.cases}</p><h2>${t.reasonsToBelieve}</h2></div><div class="case-ledger">${renderCaseLedger(metadata.proof.cases, t)}</div></section>` : ''}
  ${signals.length ? `<section><div class="section-head"><p class="eyebrow">${t.credibility || t.proof}</p><h2>${t.proofSignals}</h2></div>${renderList(signals.slice(0, 6))}</section>` : ''}
  ${testimonials ? `<section><div class="section-head"><p class="eyebrow">${t.testimonials}</p><h2>${t.whatOthersSay}</h2></div><div class="grid">${testimonials}</div></section>` : ''}
  ${metadata.offers.length ? `<section><div class="section-head"><p class="eyebrow">${t.offer}</p><h2>${t.waysWorkTogether}</h2></div><div class="grid">${renderNamedCards(metadata.offers)}</div></section>` : ''}
  ${metadata.products.length ? `<section><div class="section-head"><p class="eyebrow">${t.products}</p><h2>${t.publicArtifacts}</h2></div><div class="grid">${renderNamedCards(metadata.products)}</div></section>` : ''}
  ${metadata.audience.painPoints.length || metadata.audience.desiredOutcomes.length || metadata.audience.notFor.length ? `<section><div class="section-head"><p class="eyebrow">${t.audienceFit}</p><h2>${escapeHtml(metadata.audience.primary || t.defaultAudience)}</h2></div><div class="audience-grid"><article class="card"><h3>${t.pain}</h3>${renderList(metadata.audience.painPoints.slice(0, 3))}</article><article class="card"><h3>${t.desiredOutcome}</h3>${renderList(metadata.audience.desiredOutcomes.slice(0, 3))}</article><article class="card"><h3>${t.notFor}</h3>${renderList(metadata.audience.notFor.slice(0, 3))}</article></div></section>` : ''}
  ${stack.length ? `<section><div class="section-head"><p class="eyebrow">${t.builderStack}</p><h2>${t.howWorkDelivered}</h2></div>${renderPillList(stack)}</section>` : ''}

  <section class="cta-panel">
    <div>
      <p class="eyebrow">${t.nextStep}</p>
      <h2>${escapeHtml(metadata.cta.primary.label || t.bookConversation)}</h2>
      <p>${escapeHtml(metadata.cta.note || t.defaultProofCta)}</p>
    </div>
    <div class="buttons">${renderButtons(links)}</div>
  </section>

  <p class="footer">${t.footer}</p>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - ${t.proof}`,
    description: metadata.positioning.summary,
    css,
    body,
  });
}
