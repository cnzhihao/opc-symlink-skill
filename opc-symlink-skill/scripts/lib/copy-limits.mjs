import { asArray, localeKey } from './html.mjs';

const cjkPattern = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

const copyLimits = {
  'identity.name': { zh: 12, en: 28 },
  'identity.title': { zh: 18, en: 40 },
  'positioning.headline': { zh: 28, en: 70 },
  'positioning.tagline': { zh: 20, en: 56 },
  'positioning.summary': { zh: 90, en: 180 },
  'positioning.differentiator': { zh: 50, en: 120 },
  'positioning.keywords[]': { zh: 12, en: 28 },
  'audience.primary': { zh: 28, en: 70 },
  'audience.painPoints[]': { zh: 26, en: 80 },
  'audience.desiredOutcomes[]': { zh: 26, en: 80 },
  'audience.notFor[]': { zh: 24, en: 70 },
  'transformation.from': { zh: 36, en: 90 },
  'transformation.to': { zh: 36, en: 90 },
  'transformation.mechanism': { zh: 36, en: 90 },
  'offers[].name': { zh: 18, en: 46 },
  'offers[].outcome': { zh: 36, en: 90 },
  'offers[].description': { zh: 36, en: 90 },
  'products[].name': { zh: 18, en: 46 },
  'products[].value': { zh: 36, en: 90 },
  'products[].description': { zh: 36, en: 90 },
  'proof.cases[].name': { zh: 20, en: 52 },
  'proof.cases[].problem': { zh: 34, en: 90 },
  'proof.cases[].result': { zh: 34, en: 90 },
  'proof.publicProjects[]': { zh: 30, en: 90 },
  'proof.credibility[]': { zh: 30, en: 90 },
  'proof.metrics[]': { zh: 30, en: 90 },
  'cta.primary.label': { zh: 8, en: 22 },
  'cta.secondary.label': { zh: 8, en: 22 },
  'cta.note': { zh: 36, en: 90 },
  'currentWork.headline': { zh: 28, en: 70 },
  'currentWork.summary': { zh: 90, en: 180 },
  'currentWork.status.label': { zh: 18, en: 40 },
  'currentWork.status.note': { zh: 36, en: 90 },
  'currentWork.items[].title': { zh: 24, en: 52 },
  'currentWork.items[].summary': { zh: 80, en: 180 },
  'currentWork.items[].tags[]': { zh: 12, en: 28 },
  'currentWork.items[].links[].label': { zh: 18, en: 40 },
  'currentWork.updates[].date': { zh: 24, en: 40 },
  'currentWork.updates[].title': { zh: 28, en: 70 },
  'currentWork.updates[].summary': { zh: 90, en: 180 },
  'currentWork.updates[].links[].label': { zh: 18, en: 40 },
};

function charCount(value) {
  return Array.from(String(value || '').trim()).length;
}

function pathValue(object, pathName) {
  return pathName.split('.').reduce((current, key) => {
    return current?.[key];
  }, object);
}

function addScalarError(errors, metadata, rulePath, actualPath, value) {
  const text = String(value || '').trim();

  if (!text) {
    return;
  }

  const locale = localeKey(metadata.locale);
  const limit = copyLimits[rulePath]?.[locale];
  const length = charCount(text);

  if (limit && length > limit) {
    errors.push({
      path: actualPath,
      length,
      limit,
      message: `${actualPath} is ${length} characters; limit is ${limit}. Shorten this metadata field before rendering.`,
    });
  }

  if (locale === 'en' && cjkPattern.test(text)) {
    errors.push({
      path: actualPath,
      length,
      limit,
      message: `${actualPath} contains Chinese/Japanese/Korean characters in the English locale. Translate or transliterate this visible copy.`,
    });
  }
}

function validateArray(errors, metadata, rulePath, arrayPath) {
  asArray(pathValue(metadata, arrayPath)).forEach((item, index) => {
    addScalarError(errors, metadata, rulePath, `${arrayPath}[${index}]`, item);
  });
}

function validateObjectArray(errors, metadata, rulePath, arrayPath, field) {
  asArray(pathValue(metadata, arrayPath)).forEach((item, index) => {
    addScalarError(
      errors,
      metadata,
      rulePath,
      `${arrayPath}[${index}].${field}`,
      item?.[field]
    );
  });
}

function validateNestedArray(
  errors,
  metadata,
  rulePath,
  arrayPath,
  nestedField
) {
  asArray(pathValue(metadata, arrayPath)).forEach((item, index) => {
    asArray(item?.[nestedField]).forEach((value, nestedIndex) => {
      addScalarError(
        errors,
        metadata,
        rulePath,
        `${arrayPath}[${index}].${nestedField}[${nestedIndex}]`,
        value
      );
    });
  });
}

function validateNestedObjectArray(
  errors,
  metadata,
  rulePath,
  arrayPath,
  nestedField,
  field
) {
  asArray(pathValue(metadata, arrayPath)).forEach((item, index) => {
    asArray(item?.[nestedField]).forEach((nestedItem, nestedIndex) => {
      addScalarError(
        errors,
        metadata,
        rulePath,
        `${arrayPath}[${index}].${nestedField}[${nestedIndex}].${field}`,
        nestedItem?.[field]
      );
    });
  });
}

export function validateMetadataCopy(metadata) {
  const errors = [];

  [
    'identity.name',
    'identity.title',
    'positioning.headline',
    'positioning.tagline',
    'positioning.summary',
    'positioning.differentiator',
    'audience.primary',
    'transformation.from',
    'transformation.to',
    'transformation.mechanism',
    'cta.primary.label',
    'cta.secondary.label',
    'cta.note',
    'currentWork.headline',
    'currentWork.summary',
    'currentWork.status.label',
    'currentWork.status.note',
  ].forEach((rulePath) => {
    addScalarError(
      errors,
      metadata,
      rulePath,
      rulePath,
      pathValue(metadata, rulePath)
    );
  });

  [
    ['positioning.keywords[]', 'positioning.keywords'],
    ['audience.painPoints[]', 'audience.painPoints'],
    ['audience.desiredOutcomes[]', 'audience.desiredOutcomes'],
    ['audience.notFor[]', 'audience.notFor'],
    ['proof.publicProjects[]', 'proof.publicProjects'],
    ['proof.credibility[]', 'proof.credibility'],
    ['proof.metrics[]', 'proof.metrics'],
  ].forEach(([rulePath, arrayPath]) => {
    validateArray(errors, metadata, rulePath, arrayPath);
  });

  [
    ['offers[].name', 'offers', 'name'],
    ['offers[].outcome', 'offers', 'outcome'],
    ['offers[].description', 'offers', 'description'],
    ['products[].name', 'products', 'name'],
    ['products[].value', 'products', 'value'],
    ['products[].description', 'products', 'description'],
    ['proof.cases[].name', 'proof.cases', 'name'],
    ['proof.cases[].problem', 'proof.cases', 'problem'],
    ['proof.cases[].result', 'proof.cases', 'result'],
    ['currentWork.items[].title', 'currentWork.items', 'title'],
    ['currentWork.items[].summary', 'currentWork.items', 'summary'],
    ['currentWork.updates[].date', 'currentWork.updates', 'date'],
    ['currentWork.updates[].title', 'currentWork.updates', 'title'],
    ['currentWork.updates[].summary', 'currentWork.updates', 'summary'],
  ].forEach(([rulePath, arrayPath, field]) => {
    validateObjectArray(errors, metadata, rulePath, arrayPath, field);
  });

  validateNestedArray(
    errors,
    metadata,
    'currentWork.items[].tags[]',
    'currentWork.items',
    'tags'
  );
  validateNestedObjectArray(
    errors,
    metadata,
    'currentWork.items[].links[].label',
    'currentWork.items',
    'links',
    'label'
  );
  validateNestedObjectArray(
    errors,
    metadata,
    'currentWork.updates[].links[].label',
    'currentWork.updates',
    'links',
    'label'
  );

  return errors;
}

export function formatCopyLimitErrors(errors) {
  return [
    'Metadata copy validation failed. Shorten or localize metadata, then run the renderer again.',
    ...errors.map((error) => `- ${error.message}`),
  ].join('\n');
}
