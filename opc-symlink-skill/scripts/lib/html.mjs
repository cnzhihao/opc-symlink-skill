import { normalizeTemplateName } from './templates.mjs';

export { normalizeTemplateName };

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

  if (!url || /[\u0000-\u001f\u007f]/.test(url)) {
    return '';
  }

  if (/^(mailto:|tel:)/i.test(url)) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      return new URL(url).hostname ? url : '';
    } catch {
      return '';
    }
  }

  return '';
}

export function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function localeKey(locale = 'en') {
  return String(locale).toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const labelSets = {
  en: {
    after: 'After',
    aiBuilder: 'AI builder',
    audience: 'Audience',
    audienceFit: 'Audience fit',
    before: 'Before',
    bestFit: 'Best fit',
    bookConversation: 'Book a conversation',
    builderOsTitle: 'AI builder operating system',
    builderStack: 'Builder stack',
    capabilities: 'Capabilities',
    cases: 'Cases',
    collaborationInterfaces: 'Collaboration interfaces',
    currentWork: 'Current Work',
    currentWorkDefault: 'What I am working on now',
    currentWorkUpdates: 'Recent updates',
    currentBuilds: 'Current builds',
    defaultAudience: 'AI builders and operators who need leverage.',
    defaultAudienceBuilderOs: 'Teams and founders building with AI.',
    defaultCtaNote:
      'If this sounds like the problem you are trying to solve, start with a focused conversation.',
    defaultMechanism:
      'AI agents, automation, product judgment, and technical delivery.',
    defaultMechanismBuilderOs: 'Turns scattered AI ideas into working systems.',
    defaultProofCta:
      'Start with a focused conversation about your AI workflow, product, or delivery system.',
    defaultTransformationAfter:
      'A sharper workflow, product, or operating system that compounds.',
    defaultTransformationBefore:
      'Scattered tools, slow processes, and unclear AI adoption.',
    desiredOutcome: 'Desired outcome',
    footer: 'Generated from confirmed public packaging metadata.',
    historyExport: 'export available',
    historyLongTerm: 'long-term retention',
    historyRetention: 'day retention',
    historyVisible: 'visible',
    howWorkDelivered: 'How the work gets delivered.',
    howWorkMade: 'How the work gets made.',
    interfaces: 'Interfaces',
    item: 'Item',
    mechanisms: 'Mechanism',
    nextStep: 'Next step',
    notFor: 'Not for',
    offer: 'Offer',
    offers: 'Offers',
    operatingBrief: 'Operating brief',
    pain: 'Pain',
    products: 'Products',
    productsInMotion: 'Products and systems in motion.',
    proof: 'Proof',
    proofFirstProfile: 'Proof-led profile',
    proofEvidence: 'Evidence with a name, a problem, and a result.',
    proofSignals: 'Public signals',
    proofSummary: 'Proof summary',
    publicArtifacts: 'Public artifacts and tools.',
    publicItem: 'Public item',
    publicLogs: 'Public logs',
    reasonsToBelieve: 'Reasons to believe.',
    stack: 'Stack',
    strangerTrust: 'Signals a stranger can trust.',
    testimonials: 'Testimonials',
    theirPain: 'Their pain',
    thingsBeingBuilt: 'Things being built.',
    toolsModelsSurface: 'Tools, models, and technical surface area.',
    transformation: 'Transformation',
    transformationTitle: 'From manual work to useful AI systems.',
    waysPlugIn: 'Ways to plug into the work.',
    waysWorkTogether: 'Ways to work together.',
    whatOthersSay: 'What others say.',
    writingDemosArtifacts: 'Writing, demos, and artifacts.',
  },
  zh: {
    after: '之后',
    aiBuilder: 'AI 构建者',
    audience: '目标客群',
    audienceFit: '适合谁',
    before: '之前',
    bestFit: '最适合',
    bookConversation: '预约沟通',
    builderOsTitle: 'AI 构建者工作台',
    builderStack: '构建栈',
    capabilities: '能力',
    cases: '案例',
    collaborationInterfaces: '合作接口',
    currentWork: '当前工作',
    currentWorkDefault: '正在做什么',
    currentWorkUpdates: '最近更新',
    currentBuilds: '正在构建',
    defaultAudience: '需要 AI 杠杆的创造者和运营者。',
    defaultAudienceBuilderOs: '正在用 AI 构建产品的团队和创始人。',
    defaultCtaNote: '如果这正是你想解决的问题，可以先从一次聚焦沟通开始。',
    defaultMechanism: 'AI 智能体、自动化、产品判断和技术交付。',
    defaultMechanismBuilderOs: '把分散的 AI 想法变成能工作的系统。',
    defaultProofCta: '从一次聚焦沟通开始，讨论你的 AI 工作流、产品或交付系统。',
    defaultTransformationAfter:
      '一个更清晰、可复用、会持续复利的工作流或产品系统。',
    defaultTransformationBefore:
      '分散的工具、重复的手工执行和不清晰的 AI 落地路径。',
    desiredOutcome: '理想结果',
    footer: '基于已确认的公开包装信息生成。',
    historyExport: '可导出',
    historyLongTerm: '长期保留',
    historyRetention: '天保留',
    historyVisible: '条可见',
    howWorkDelivered: '这些能力如何被交付。',
    howWorkMade: '这些系统如何被构建。',
    interfaces: '合作接口',
    item: '条目',
    mechanisms: '方法',
    nextStep: '下一步',
    notFor: '不适合',
    offer: '服务',
    offers: '服务',
    operatingBrief: '工作简报',
    pain: '痛点',
    products: '产品',
    productsInMotion: '正在推进的产品和系统。',
    proof: '可信证明',
    proofFirstProfile: '可信证明优先',
    proofEvidence: '带着名称、问题与结果的证据。',
    proofSignals: '公开信号',
    proofSummary: '可信信号',
    publicArtifacts: '公开作品和工具。',
    publicItem: '公开内容',
    publicLogs: '公开记录',
    reasonsToBelieve: '为什么值得相信。',
    stack: '技术栈',
    strangerTrust: '陌生访客可以信任的信号。',
    testimonials: '推荐语',
    theirPain: '他们的痛点',
    thingsBeingBuilt: '正在构建的东西。',
    toolsModelsSurface: '工具、模型和技术能力边界。',
    transformation: '转变',
    transformationTitle: '从手工执行到可用的 AI 系统。',
    waysPlugIn: '可以如何接入这项工作。',
    waysWorkTogether: '可以如何合作。',
    whatOthersSay: '别人怎么说。',
    writingDemosArtifacts: '文章、演示和公开作品。',
  },
};

export function labelsFor(locale = 'en') {
  return labelSets[localeKey(locale)];
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) {
    result[key] = isPlainObject(value)
      ? deepMerge(result[key] || {}, value)
      : value;
  }

  return result;
}

export function localizedRawMetadata(rawMetadata) {
  const locales = rawMetadata.locales || rawMetadata.localizations;

  if (!isPlainObject(locales) || !Object.keys(locales).length) {
    return [{ locale: rawMetadata.locale || 'en', raw: rawMetadata }];
  }

  const base = { ...rawMetadata };
  delete base.locales;
  delete base.localizations;

  const preferredOrder = ['zh-CN', 'zh', 'en'];

  return Object.entries(locales)
    .sort(([a], [b]) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);
      return (
        (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex) ||
        a.localeCompare(b)
      );
    })
    .map(([locale, localized]) => {
      return {
        locale,
        raw: deepMerge(base, { ...localized, locale }),
      };
    });
}

function requireText(object, pathName) {
  const value = pathName.split('.').reduce((current, key) => {
    return current?.[key];
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
  const labels = labelsFor(metadata.locale);

  return asArray(metadata.work?.services).map((item) => ({
    name: item.name || '',
    type: item.type || 'delivery',
    audience: item.audience || '',
    outcome: item.outcome || item.description || '',
    description: item.description || item.outcome || '',
    ctaLabel: item.ctaLabel || labels.bookConversation,
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
  const labels = labelsFor(metadata.locale);

  return {
    primary: {
      label:
        primary.label ||
        metadata.collaboration?.callToAction ||
        labels.bookConversation,
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
        metadata.audience?.primary || metadata.collaboration?.bestFit || '',
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
        metadata.builderStack?.automationCapabilities
      ),
      technicalTags: asArray(metadata.builderStack?.technicalTags),
    },
    content: {
      featured: asArray(metadata.content?.featured),
      links,
    },
    currentWork: isPlainObject(metadata.currentWork)
      ? metadata.currentWork
      : undefined,
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

export function renderPillList(items = []) {
  const pills = renderPills(items);

  return pills ? `<div class="pills">${pills}</div>` : '';
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
      const title = escapeHtml(
        item.name || item.title || options.fallbackTitle || labelsFor().item
      );
      const eyebrow = item.status || item.type || item.audience || '';
      const rawBody =
        item.value ||
        item.outcome ||
        item.description ||
        item.result ||
        item.problem ||
        '';
      const plainTitle = item.name || item.title || options.fallbackTitle || '';
      const body =
        String(rawBody || '').trim() === String(plainTitle || '').trim()
          ? ''
          : rawBody;
      const url = safeUrl(item.url || '');
      const titleHtml = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${title}</a>`
        : title;

      return `<article class="card">${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}<h3>${titleHtml}</h3>${body ? `<p>${escapeHtml(body)}</p>` : ''}</article>`;
    })
    .join('');
}

function hasCurrentWorkContent(currentWork) {
  if (!isPlainObject(currentWork)) {
    return false;
  }

  return Boolean(
    currentWork.headline ||
      currentWork.summary ||
      currentWork.status?.label ||
      currentWork.status?.note ||
      (currentWork.items && currentWork.items.length > 0) ||
      (currentWork.updates && currentWork.updates.length > 0)
  );
}

function renderCurrentWorkLinks(links = []) {
  const rendered = asArray(links)
    .map((link) => {
      const url = safeUrl(link?.url || '');

      if (!url) {
        return '';
      }

      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label || url)}</a>`;
    })
    .filter(Boolean)
    .join('');

  return rendered ? `<div class="current-work-links">${rendered}</div>` : '';
}

function renderCurrentWorkHistory(currentWork, t) {
  const history = currentWork.history;

  if (!isPlainObject(history)) {
    return '';
  }

  const parts = [
    history.visibleCount === undefined
      ? ''
      : `${history.visibleCount} ${t.historyVisible}`,
    history.retentionDays
      ? `${history.retentionDays} ${t.historyRetention}`
      : t.historyLongTerm,
    history.exportAvailable ? t.historyExport : '',
  ].filter(Boolean);

  return `<p class="current-work-history">${escapeHtml(t.currentWork)}: ${escapeHtml(parts.join(' / '))}</p>`;
}

export function renderCurrentWorkSection(metadata) {
  const currentWork = metadata.currentWork;

  if (!hasCurrentWorkContent(currentWork)) {
    return '';
  }

  const t = labelsFor(metadata.locale);
  const items = asArray(currentWork.items);
  const updates = asArray(currentWork.updates);
  const statusLabel =
    currentWork.status?.label || currentWork.status?.availability || '';

  return `<section class="current-work-section" id="current-work">
  <div class="current-work-shell">
    <p class="eyebrow">${t.currentWork}</p>
    <h2>${escapeHtml(currentWork.headline || t.currentWorkDefault)}</h2>
    ${currentWork.summary ? `<p class="current-work-summary">${escapeHtml(currentWork.summary)}</p>` : ''}
    ${
      statusLabel || currentWork.status?.note
        ? `<div class="current-work-status">
      ${statusLabel ? `<span>${escapeHtml(statusLabel)}</span>` : ''}
      ${currentWork.status?.note ? `<p>${escapeHtml(currentWork.status.note)}</p>` : ''}
    </div>`
        : ''
    }
    ${
      items.length
        ? `<div class="current-work-grid">
      ${items
        .map((item) => {
          const title = item?.title || t.currentWork;
          const body = item?.summary || '';
          const tags = asArray(item?.tags)
            .map((tag) => `<span>${escapeHtml(tag)}</span>`)
            .join('');

          return `<article class="current-work-card">
  <div class="current-work-card-top">
    <h3>${escapeHtml(title)}</h3>
    ${item?.status ? `<span>${escapeHtml(item.status)}</span>` : ''}
  </div>
  ${body ? `<p>${escapeHtml(body)}</p>` : ''}
  ${tags ? `<div class="current-work-tags">${tags}</div>` : ''}
  ${renderCurrentWorkLinks(item?.links)}
</article>`;
        })
        .join('')}
    </div>`
        : ''
    }
    ${
      updates.length
        ? `<div class="current-work-updates">
      <h3>${t.currentWorkUpdates}</h3>
      ${updates
        .map((update) => {
          return `<article class="current-work-update">
  <time>${escapeHtml(update?.date || '')}</time>
  <div>
    <h4>${escapeHtml(update?.title || t.currentWork)}</h4>
    ${update?.summary ? `<p>${escapeHtml(update.summary)}</p>` : ''}
    ${renderCurrentWorkLinks(update?.links)}
  </div>
</article>`;
        })
        .join('')}
    </div>`
        : ''
    }
    ${renderCurrentWorkHistory(currentWork, t)}
  </div>
</section>`;
}

export function currentWorkStyles() {
  return `
.current-work-section {
  border-top: 1px solid var(--line, #dfe4ec);
  padding: 44px 0;
}
.current-work-shell {
  display: grid;
  gap: 0;
  max-width: 980px;
  margin: 0 auto;
}
.current-work-summary {
  color: var(--muted, #5d6675);
  font-size: 18px;
  margin: 16px 0 0;
  max-width: 760px;
}
.current-work-status {
  align-items: center;
  border-bottom: 1px solid var(--line, #dfe4ec);
  border-top: 1px solid var(--line, #dfe4ec);
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin-top: 22px;
  padding: 14px 0;
}
.current-work-status span {
  background: var(--accent, #2563eb);
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  padding: 5px 10px;
  text-transform: uppercase;
}
.current-work-status p {
  color: var(--muted, #5d6675);
  margin: 0;
}
.current-work-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-top: 28px;
}
.current-work-card {
  background: var(--paper, var(--panel, #fff));
  border: 1px solid var(--line, #dfe4ec);
  border-radius: 8px;
  min-width: 0;
  padding: 18px;
}
.current-work-card-top {
  align-items: flex-start;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
.current-work-card h3,
.current-work-updates h3,
.current-work-update h4 {
  color: var(--ink, #101522);
  letter-spacing: 0;
  line-height: 1.2;
  margin: 0;
}
.current-work-card-top span {
  background: var(--ink, #101522);
  border-radius: 999px;
  color: #fff;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
}
.current-work-card p,
.current-work-update p {
  color: var(--muted, #5d6675);
  margin: 10px 0 0;
}
.current-work-tags,
.current-work-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}
.current-work-tags span {
  background: color-mix(in srgb, var(--accent, #2563eb) 12%, transparent);
  border-radius: 999px;
  color: var(--ink, #101522);
  font-size: 12px;
  padding: 3px 8px;
}
.current-work-links a {
  color: var(--ink, #101522);
  font-weight: 650;
  text-underline-offset: 3px;
}
.current-work-updates {
  margin-top: 36px;
}
.current-work-updates > h3 {
  font-size: 18px;
  margin-bottom: 14px;
}
.current-work-update {
  display: grid;
  gap: 16px;
  grid-template-columns: 120px minmax(0, 1fr);
  padding: 16px 0;
  border-top: 1px solid var(--line, #dfe4ec);
}
.current-work-update time {
  color: var(--accent, #2563eb);
  font-size: 13px;
  font-weight: 750;
}
.current-work-history {
  color: var(--muted, #5d6675);
  font-size: 13px;
  margin: 28px 0 0;
}
@media (max-width: 640px) {
  .current-work-update { grid-template-columns: 1fr; gap: 4px; }
}
`;
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

  return JSON.stringify(json)
    .replaceAll('&', '\\u0026')
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e');
}

export const RENDER_FINGERPRINT_PLACEHOLDER = '__OPC_SYMLINK_FINGERPRINT__';

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
  <meta name="opc-symlink-render-fingerprint" content="${RENDER_FINGERPRINT_PLACEHOLDER}">
  <style>${css}</style>
  <script type="application/ld+json">${renderJsonLd(metadata)}</script>
</head>
<body>
${body}
</body>
</html>
`;
}
