import {
  accentColor,
  currentWorkStyles,
  escapeHtml,
  labelsFor,
  pageShell,
  renderButtons,
  renderCurrentWorkSection,
  renderList,
  renderNamedCards,
  renderPillList,
} from '../lib/html.mjs';

const themes = {
  gridline: {
    className: 'template-gridline layout-editorial',
    accent: '#1957ff',
    art: 'grid',
    token: 'GRID / 01',
  },
  'split-signal': {
    className: 'template-split-signal layout-split',
    accent: '#ff5c35',
    art: 'signal',
    token: 'SIGNAL / 02',
  },
  'cozy-archive': {
    className: 'template-cozy-archive layout-soft',
    accent: '#9a5c38',
    art: 'archive',
    token: 'ARCHIVE / 03',
  },
  handwritten: {
    className: 'template-handwritten layout-soft',
    accent: '#e05635',
    art: 'scribble',
    token: 'NOTES / 04',
  },
  'quiet-product': {
    className: 'template-quiet-product layout-minimal',
    accent: '#1f4d45',
    art: 'quiet',
    token: 'QUIET / 05',
  },
  fireline: {
    className: 'template-fireline layout-dense',
    accent: '#ff3b16',
    art: 'fire',
    token: 'FIRE / 06',
  },
  'tile-playground': {
    className: 'template-tile-playground layout-playful',
    accent: '#6b45ff',
    art: 'tiles',
    token: 'TILES / 07',
  },
  'night-director': {
    className: 'template-night-director layout-dark',
    accent: '#8ff5c2',
    art: 'night',
    token: 'NIGHT / 08',
  },
  'pattern-field': {
    className: 'template-pattern-field layout-playful',
    accent: '#0e8174',
    art: 'pattern',
    token: 'FIELD / 09',
  },
  'continuous-axis': {
    className: 'template-continuous-axis layout-axis',
    accent: '#0f6cff',
    art: 'axis',
    token: 'AXIS / 10',
  },
  'three-column': {
    className: 'template-three-column layout-columns',
    accent: '#e03b75',
    art: 'columns',
    token: 'COLUMNS / 11',
  },
  'pixel-arcade': {
    className: 'template-pixel-arcade layout-pixel',
    accent: '#f5e600',
    art: 'pixel',
    token: 'PIXEL / 12',
  },
  'copy-collage': {
    className: 'template-copy-collage layout-collage',
    accent: '#c83bff',
    art: 'collage',
    token: 'COPY / 13',
  },
  'ink-hover': {
    className: 'template-ink-hover layout-ink',
    accent: '#111111',
    art: 'ink',
    token: 'INK / 14',
  },
  'grainy-lab': {
    className: 'template-grainy-lab layout-lab',
    accent: '#d77b27',
    art: 'grain',
    token: 'LAB / 15',
  },
};

function renderArt(theme) {
  return `<div class="hero-art art-${theme.art}" aria-hidden="true">
  <div class="art-orbit art-orbit-one"></div>
  <div class="art-orbit art-orbit-two"></div>
  <div class="art-core"></div>
  <span class="art-token">${escapeHtml(theme.token)}</span>
</div>`;
}

function renderCaseCards(metadata) {
  const t = labelsFor(metadata.locale);

  if (!metadata.proof.cases.length) {
    return '';
  }

  return `<section class="portfolio-section proof-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.proof)}</p>
    <h2>${escapeHtml(t.proofEvidence)}</h2>
  </div>
  <div class="card-grid">${renderNamedCards(metadata.proof.cases.slice(0, 6))}</div>
</section>`;
}

function renderProofSignals(metadata) {
  const t = labelsFor(metadata.locale);
  const signals = [
    ...metadata.proof.metrics,
    ...metadata.proof.credibility,
    ...metadata.proof.publicProjects,
  ].slice(0, 6);

  if (!signals.length) {
    return '';
  }

  return `<section class="portfolio-section signal-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.proofSignals)}</p>
    <h2>${escapeHtml(t.strangerTrust)}</h2>
  </div>
  ${renderList(signals)}
</section>`;
}

function renderAudience(metadata) {
  const t = labelsFor(metadata.locale);
  const audience = metadata.audience;

  if (
    !audience.primary &&
    !audience.painPoints.length &&
    !audience.desiredOutcomes.length &&
    !audience.notFor.length
  ) {
    return '';
  }

  return `<section class="portfolio-section audience-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.audience)}</p>
    <h2>${escapeHtml(audience.primary || t.defaultAudience)}</h2>
  </div>
  <div class="audience-grid">
    ${audience.painPoints.length ? `<article><p class="eyebrow">${escapeHtml(t.pain)}</p>${renderList(audience.painPoints.slice(0, 3))}</article>` : ''}
    ${audience.desiredOutcomes.length ? `<article><p class="eyebrow">${escapeHtml(t.desiredOutcome)}</p>${renderList(audience.desiredOutcomes.slice(0, 3))}</article>` : ''}
    ${audience.notFor.length ? `<article><p class="eyebrow">${escapeHtml(t.notFor)}</p>${renderList(audience.notFor.slice(0, 3))}</article>` : ''}
  </div>
</section>`;
}

function renderTransformation(metadata) {
  const t = labelsFor(metadata.locale);
  const transformation = metadata.transformation;

  if (
    !transformation.from &&
    !transformation.to &&
    !transformation.mechanism
  ) {
    return '';
  }

  return `<section class="portfolio-section transformation-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.transformation)}</p>
    <h2>${escapeHtml(t.transformationTitle)}</h2>
  </div>
  <div class="transformation-grid">
    <article><p class="eyebrow">${escapeHtml(t.before)}</p><p>${escapeHtml(transformation.from || '')}</p></article>
    <article><p class="eyebrow">${escapeHtml(t.after)}</p><p>${escapeHtml(transformation.to || '')}</p></article>
    <article><p class="eyebrow">${escapeHtml(t.mechanisms)}</p><p>${escapeHtml(transformation.mechanism || '')}</p></article>
  </div>
</section>`;
}

function renderStack(metadata) {
  const t = labelsFor(metadata.locale);
  const stack = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
    ...metadata.builderStack.technicalTags,
  ];

  if (!stack.length) {
    return '';
  }

  return `<section class="portfolio-section stack-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.builderStack)}</p>
    <h2>${escapeHtml(t.toolsModelsSurface)}</h2>
  </div>
  ${renderPillList(stack)}
</section>`;
}

function renderFeatured(metadata) {
  const t = labelsFor(metadata.locale);
  const featured = metadata.content.featured;

  if (!featured.length) {
    return '';
  }

  return `<section class="portfolio-section featured-section">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(t.writingDemosArtifacts)}</p>
    <h2>${escapeHtml(t.publicArtifacts)}</h2>
  </div>
  <div class="card-grid">${renderNamedCards(featured.slice(0, 6))}</div>
</section>`;
}

function portfolioCss() {
  return `
:root { color-scheme: light; }
* { box-sizing: border-box; }
html, body { margin: 0; overflow-x: hidden; }
body {
  background: var(--wash);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.5;
}
a { color: inherit; }
h1, h2, h3, p { overflow-wrap: anywhere; }
.portfolio-page {
  --accent: #1957ff;
  --ink: #131313;
  --muted: #626262;
  --line: color-mix(in srgb, var(--ink) 18%, transparent);
  --paper: #fff;
  --wash: #f3f3f0;
  --soft: color-mix(in srgb, var(--accent) 10%, transparent);
  min-height: 100vh;
  padding: 24px clamp(18px, 4vw, 68px) 56px;
}
.portfolio-page.layout-dark {
  --ink: #f1f5ee;
  --muted: #a8b5ab;
  --line: color-mix(in srgb, var(--ink) 24%, transparent);
  --paper: #17231e;
  --wash: #101411;
}
.portfolio-page.layout-pixel,
.portfolio-page.layout-collage { font-family: "Courier New", ui-monospace, monospace; }
.portfolio-page.layout-soft { font-family: Georgia, "Times New Roman", serif; }
.portfolio-page.layout-ink h1,
.portfolio-page.layout-ink h2,
.portfolio-page.layout-ink h3 { font-family: Georgia, "Times New Roman", serif; }
.portfolio-page.layout-minimal { max-width: 1320px; margin: 0 auto; }
.portfolio-page.layout-axis { padding-left: clamp(24px, 10vw, 170px); padding-right: clamp(24px, 10vw, 170px); }
.portfolio-page.layout-columns { max-width: 1440px; margin: 0 auto; }
.portfolio-page.layout-dense { max-width: 1180px; margin: 0 auto; }
.site-header {
  align-items: flex-start;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 20px;
  justify-content: space-between;
  padding: 12px 0 22px;
}
.brand { min-width: 0; }
.brand strong { display: block; font-size: 16px; letter-spacing: .04em; }
.brand span, .header-meta { color: var(--muted); font-size: 12px; font-weight: 700; }
.header-meta { text-align: right; }
.eyebrow {
  color: var(--accent);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .12em;
  margin: 0 0 12px;
  text-transform: uppercase;
}
.hero {
  align-items: center;
  display: grid;
  gap: clamp(32px, 7vw, 110px);
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, .75fr);
  min-height: 620px;
  padding: 54px 0 72px;
}
.hero-copy { min-width: 0; }
.hero h1 {
  font-size: clamp(44px, 8vw, 112px);
  letter-spacing: -.075em;
  line-height: .93;
  margin: 0;
  max-width: 860px;
}
.hero-summary { color: var(--muted); font-size: clamp(18px, 2vw, 25px); line-height: 1.35; margin: 28px 0 0; max-width: 680px; }
.hero-tagline { color: var(--accent); font-size: 14px; font-weight: 750; margin: 18px 0 0; }
.hero-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 16px; margin-top: 30px; }
.buttons { display: flex; flex-wrap: wrap; gap: 10px; }
.button { border: 1px solid var(--ink); display: inline-flex; font-size: 13px; font-weight: 800; padding: 11px 15px; text-decoration: none; }
.button.primary { background: var(--ink); color: var(--wash); }
.button.ghost { background: transparent; }
.pills { display: flex; flex-wrap: wrap; gap: 7px; }
.pill { border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 11px; padding: 5px 9px; }
.hero-art {
  aspect-ratio: 1 / 1;
  background: var(--soft);
  border: 1px solid var(--line);
  min-width: 0;
  overflow: hidden;
  position: relative;
}
.art-orbit, .art-core { left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); }
.art-orbit { border: 1px solid var(--accent); border-radius: 50%; height: 66%; opacity: .65; width: 66%; }
.art-orbit-two { height: 42%; transform: translate(-50%, -50%) rotate(38deg) skewX(-18deg); width: 88%; }
.art-core { background: var(--accent); height: 18%; width: 18%; }
.art-token { bottom: 16px; color: var(--accent); font-size: 11px; font-weight: 850; left: 16px; letter-spacing: .12em; position: absolute; }
.art-grid { background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 28px 28px; }
.art-signal .art-orbit-one { border-radius: 0; height: 32%; transform: translate(-50%, -50%) rotate(45deg); width: 32%; }
.art-signal .art-orbit-two { border-radius: 0; height: 82%; transform: translate(-50%, -50%) rotate(45deg); width: 82%; }
.art-signal .art-core { border-radius: 50%; }
.art-archive { background: repeating-linear-gradient(135deg, var(--soft), var(--soft) 12px, transparent 12px, transparent 24px); }
.art-archive .art-orbit-one { border-radius: 0; height: 52%; width: 52%; }
.art-scribble { background: var(--paper); }
.art-scribble .art-orbit-one { border-width: 4px; border-style: dashed; }
.art-scribble .art-orbit-two { border-width: 3px; border-style: dotted; }
.art-quiet { background: transparent; }
.art-quiet .art-orbit-one { border-color: var(--line); }
.art-quiet .art-orbit-two { border-color: var(--line); }
.art-quiet .art-core { background: var(--ink); }
.art-fire { background: linear-gradient(145deg, var(--accent), #ffb800); }
.art-fire .art-orbit { border-color: var(--paper); }
.art-fire .art-core { background: var(--paper); }
.art-tiles { background: var(--paper); }
.art-tiles .art-orbit { border-radius: 0; transform: translate(-50%, -50%) rotate(12deg); }
.art-night { background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 42%), var(--paper); }
.art-night .art-orbit { border-color: var(--accent); }
.art-pattern { background-image: radial-gradient(var(--accent) 2px, transparent 2px); background-size: 18px 18px; }
.art-pattern .art-orbit-one { border-radius: 0; transform: translate(-50%, -50%) rotate(30deg); }
.art-axis { background: linear-gradient(90deg, transparent 49.5%, var(--accent) 49.5%, var(--accent) 50.5%, transparent 50.5%); }
.art-axis .art-orbit-one { border-radius: 0; height: 78%; width: 18%; }
.art-columns { background: linear-gradient(90deg, var(--soft) 0 31%, transparent 31% 34%, var(--soft) 34% 65%, transparent 65% 68%, var(--soft) 68%); }
.art-columns .art-orbit { border-radius: 0; }
.art-pixel { image-rendering: pixelated; }
.art-pixel .art-orbit { border-radius: 0; border-width: 8px; }
.art-pixel .art-core { box-shadow: 12px 0 var(--accent), 0 12px var(--accent), -12px 0 var(--accent), 0 -12px var(--accent); }
.art-collage { background: linear-gradient(125deg, var(--accent) 0 33%, var(--soft) 33% 66%, var(--paper) 66%); }
.art-collage .art-orbit-one { border-radius: 0; transform: translate(-50%, -50%) rotate(-24deg); }
.art-ink { background: var(--paper); }
.art-ink .art-orbit-one { border-width: 9px; border-color: var(--ink); }
.art-ink .art-orbit-two { border-color: var(--ink); }
.art-ink .art-core { background: var(--ink); }
.art-grain { background: radial-gradient(color-mix(in srgb, var(--accent) 35%, transparent) 1px, transparent 1px), var(--soft); background-size: 7px 7px; }
.art-grain .art-orbit-one { border-radius: 0; transform: translate(-50%, -50%) rotate(18deg); }
.portfolio-section { border-top: 1px solid var(--line); padding: 62px 0; }
.section-heading { align-items: end; display: flex; gap: 24px; justify-content: space-between; margin-bottom: 28px; }
.section-heading h2 { font-size: clamp(28px, 4vw, 58px); letter-spacing: -.055em; line-height: .98; margin: 0; max-width: 760px; }
.section-heading > p:last-child { color: var(--muted); margin: 0; max-width: 360px; }
.audience-grid, .transformation-grid, .card-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.audience-grid article, .transformation-grid article, .card { background: var(--paper); border: 1px solid var(--line); min-width: 0; padding: 20px; }
.audience-grid ul, .transformation-grid p { color: var(--muted); margin: 0; }
.transformation-grid article { min-height: 150px; }
.transformation-grid article:nth-child(2) { background: var(--accent); color: var(--paper); }
.transformation-grid article:nth-child(2) .eyebrow { color: currentColor; opacity: .8; }
.card-grid .card { border-radius: 0; }
.card h3 { font-size: 21px; letter-spacing: -.025em; line-height: 1.05; margin: 0; }
.card p { color: var(--muted); margin: 12px 0 0; }
.card .eyebrow { margin-bottom: 10px; }
.signal-section ul { columns: 2; column-gap: 40px; list-style: none; margin: 0; padding: 0; }
.signal-section li { border-bottom: 1px solid var(--line); break-inside: avoid; color: var(--muted); padding: 12px 0; }
.stack-section .pills { max-width: 800px; }
.cta-band { align-items: end; background: var(--accent); color: var(--paper); display: flex; gap: 24px; justify-content: space-between; padding: 30px; }
.cta-band .eyebrow { color: currentColor; opacity: .75; }
.cta-band h2 { font-size: clamp(28px, 4vw, 54px); letter-spacing: -.055em; line-height: .98; margin: 0; max-width: 620px; }
.cta-band p:last-child { margin: 14px 0 0; max-width: 580px; opacity: .82; }
.cta-band .button { border-color: var(--paper); color: var(--paper); }
.cta-band .button.primary { background: var(--paper); color: var(--accent); }
.footer { color: var(--muted); font-size: 12px; margin: 22px 0 0; }
.layout-split .hero { grid-template-columns: minmax(0, .75fr) minmax(280px, 1fr); }
.layout-split .hero-art { order: -1; }
.layout-dense .hero { min-height: 500px; padding-bottom: 48px; padding-top: 40px; }
.layout-dense .portfolio-section { padding-bottom: 42px; padding-top: 42px; }
.layout-playful .hero-art { border-radius: 28px; transform: rotate(2deg); }
.layout-playful .card { border-radius: 18px; }
.layout-pixel .button, .layout-pixel .card, .layout-pixel .hero-art { border-width: 2px; box-shadow: 4px 4px 0 var(--ink); }
.layout-collage .hero h1 { text-transform: uppercase; }
.layout-collage .portfolio-section:nth-of-type(odd) { transform: translateX(12px) rotate(-.5deg); }
.layout-ink .button { border-radius: 999px; }
.layout-lab .hero-art { border-radius: 50%; }
${currentWorkStyles()}
@media (max-width: 760px) {
  .portfolio-page { padding-left: 16px; padding-right: 16px; }
  .hero, .layout-split .hero { grid-template-columns: 1fr; min-height: auto; padding: 66px 0 54px; }
  .layout-split .hero-art { order: 0; }
  .hero-art { max-width: 420px; width: 100%; }
  .section-heading, .cta-band { align-items: flex-start; flex-direction: column; }
  .audience-grid, .transformation-grid, .card-grid { grid-template-columns: 1fr; }
  .signal-section ul { columns: 1; }
  .layout-axis { padding-left: 16px; padding-right: 16px; }
}
`;
}

export function renderPortfolio(metadata, template) {
  const theme = themes[template];

  if (!theme) {
    throw new Error(`Unknown portfolio template: ${template}`);
  }

  const t = labelsFor(metadata.locale);
  const links = [
    metadata.cta.primary,
    metadata.cta.secondary?.url ? metadata.cta.secondary : null,
  ].filter(Boolean);
  const stack = [
    ...metadata.builderStack.tools,
    ...metadata.builderStack.agentCapabilities,
    ...metadata.builderStack.automationCapabilities,
    ...metadata.builderStack.technicalTags,
  ];
  const accent = accentColor(metadata, theme.accent);
  const body = `<main class="portfolio-page ${theme.className}" style="--accent: ${accent}">
  <header class="site-header">
    <div class="brand">
      <strong>${escapeHtml(metadata.identity.name)}</strong>
      <span>${escapeHtml(metadata.identity.title || t.aiBuilder)}</span>
    </div>
    <div class="header-meta">${escapeHtml(metadata.identity.location || '')}</div>
  </header>

  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">${escapeHtml(t.aiBuilder)}</p>
      <h1>${escapeHtml(metadata.positioning.headline)}</h1>
      ${metadata.positioning.tagline ? `<p class="hero-tagline">${escapeHtml(metadata.positioning.tagline)}</p>` : ''}
      <p class="hero-summary">${escapeHtml(metadata.positioning.summary)}</p>
      <div class="hero-actions">
        <div class="buttons">${renderButtons(links)}</div>
        ${renderPillList(metadata.positioning.keywords)}
      </div>
    </div>
    ${renderArt(theme)}
  </section>

  ${renderCurrentWorkSection(metadata)}
  ${renderAudience(metadata)}
  ${renderTransformation(metadata)}
  ${metadata.offers.length ? `<section class="portfolio-section"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(t.offers)}</p><h2>${escapeHtml(t.waysWorkTogether)}</h2></div><p>${escapeHtml(t.howWorkDelivered)}</p></div><div class="card-grid">${renderNamedCards(metadata.offers.slice(0, 6))}</div></section>` : ''}
  ${metadata.products.length ? `<section class="portfolio-section"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(t.products)}</p><h2>${escapeHtml(t.thingsBeingBuilt)}</h2></div><p>${escapeHtml(t.publicArtifacts)}</p></div><div class="card-grid">${renderNamedCards(metadata.products.slice(0, 6))}</div></section>` : ''}
  ${renderCaseCards(metadata)}
  ${renderProofSignals(metadata)}
  ${renderFeatured(metadata)}
  ${stack.length ? renderStack(metadata) : ''}

  <section class="portfolio-section">
    <div class="cta-band">
      <div>
        <p class="eyebrow">${escapeHtml(t.nextStep)}</p>
        <h2>${escapeHtml(metadata.cta.primary.label || t.bookConversation)}</h2>
        <p>${escapeHtml(metadata.cta.note || t.defaultCtaNote)}</p>
      </div>
      <div class="buttons">${renderButtons(links)}</div>
    </div>
    <p class="footer">${escapeHtml(t.footer)}</p>
  </section>
</main>`;

  return pageShell({
    metadata,
    title: `${metadata.identity.name} - ${metadata.positioning.headline}`,
    description: metadata.positioning.summary,
    css: portfolioCss(),
    body,
  });
}
