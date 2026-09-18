/**
 * The hosted OPC Symlink template registry.
 *
 * Keep this list in sync with the public platform contract. Template aliases
 * are deliberately not supported: an old name should fail loudly instead of
 * silently producing a different homepage.
 */
export const HOSTED_TEMPLATE_IDS = [
  'gridline',
  'split-signal',
  'cozy-archive',
  'handwritten',
  'quiet-product',
  'fireline',
  'tile-playground',
  'night-director',
  'pattern-field',
  'continuous-axis',
  'three-column',
  'pixel-arcade',
  'copy-collage',
  'ink-hover',
  'grainy-lab',
];

export const DEFAULT_TEMPLATE_ID = 'gridline';

export function normalizeTemplateName(value = '') {
  return String(value || '').trim();
}

export function isHostedTemplateId(value = '') {
  return HOSTED_TEMPLATE_IDS.includes(normalizeTemplateName(value));
}

export function templateListText() {
  return HOSTED_TEMPLATE_IDS.join(', ');
}
