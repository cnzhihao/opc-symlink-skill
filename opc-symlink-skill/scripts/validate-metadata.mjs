#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  localizedRawMetadata,
  normalizeMetadata,
  safeUrl,
} from './lib/html.mjs';
import { formatCopyLimitErrors, validateMetadataCopy } from './lib/copy-limits.mjs';
import {
  DEFAULT_TEMPLATE_ID,
  isHostedTemplateId,
  normalizeTemplateName,
} from './lib/templates.mjs';

const MAX_METADATA_BYTES = 256 * 1024;

function parseArgs(argv) {
  const positional = [];
  let template = '';
  let allowSingleLanguage = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--single-language') {
      allowSingleLanguage = true;
      continue;
    }

    if (arg === '--template' || arg === '-t') {
      template = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--template=')) {
      template = arg.slice('--template='.length);
      continue;
    }

    if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  return {
    inputPath: positional[0],
    template,
    allowSingleLanguage,
  };
}

function fail(message) {
  console.error(`Metadata validation failed: ${message}`);
  process.exit(1);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function collectInvalidUrls(value, currentPath = '$', errors = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectInvalidUrls(item, `${currentPath}[${index}]`, errors);
    });
    return errors;
  }

  if (!isPlainObject(value)) {
    return errors;
  }

  Object.entries(value).forEach(([key, item]) => {
    const itemPath = `${currentPath}.${key}`;

    if (key.toLowerCase() === 'url' && String(item || '').trim() && !safeUrl(item)) {
      errors.push(`${itemPath} must use http://, https://, mailto:, or tel:`);
    }

    collectInvalidUrls(item, itemPath, errors);
  });

  return errors;
}

const { inputPath, template, allowSingleLanguage } = parseArgs(
  process.argv.slice(2),
);

if (!inputPath) {
  console.error(
    'Usage: node validate-metadata.mjs metadata.json [--template gridline] [--single-language]',
  );
  process.exit(1);
}

const resolvedInput = path.resolve(inputPath);

if (!fs.existsSync(resolvedInput)) {
  fail(`metadata file does not exist: ${resolvedInput}`);
}

const rawJson = fs.readFileSync(resolvedInput, 'utf8');

if (Buffer.byteLength(rawJson, 'utf8') > MAX_METADATA_BYTES) {
  fail(
    `metadata is ${Buffer.byteLength(rawJson, 'utf8')} bytes; the hosted upload limit is ${MAX_METADATA_BYTES} bytes (256 KB)`,
  );
}

let rawMetadata;

try {
  rawMetadata = JSON.parse(rawJson);
} catch (error) {
  fail(`could not parse JSON: ${error.message}`);
}

if (!isPlainObject(rawMetadata)) {
  fail('metadata root must be a JSON object');
}

const hasBilingualMetadata = Boolean(
  rawMetadata.locales && rawMetadata.locales['zh-CN'] && rawMetadata.locales.en,
);

if (!hasBilingualMetadata && !allowSingleLanguage) {
  fail(
    'bilingual metadata is required by default; add locales.zh-CN and locales.en, or pass --single-language only when explicitly requested',
  );
}

const selectedTemplate = normalizeTemplateName(
  template || rawMetadata.style?.template || DEFAULT_TEMPLATE_ID,
);

if (!isHostedTemplateId(selectedTemplate)) {
  fail(`invalid template "${selectedTemplate}"`);
}

if (
  rawMetadata.style?.template &&
  normalizeTemplateName(rawMetadata.style.template) !== selectedTemplate
) {
  fail(
    `--template "${selectedTemplate}" does not match style.template "${rawMetadata.style.template}"`,
  );
}

const invalidUrls = collectInvalidUrls(rawMetadata);

if (invalidUrls.length) {
  fail(invalidUrls.join('\n'));
}

try {
  const localizedMetadata = localizedRawMetadata(rawMetadata).map((item) => {
    return normalizeMetadata(item.raw);
  });

  localizedMetadata.forEach((metadata) => {
    const localizedTemplate = metadata.style?.template;

    if (
      localizedTemplate &&
      normalizeTemplateName(localizedTemplate) !== selectedTemplate
    ) {
      throw new Error(
        `localized style.template "${localizedTemplate}" does not match selected template "${selectedTemplate}"`,
      );
    }
  });

  const copyErrors = localizedMetadata.flatMap((metadata) => {
    return validateMetadataCopy(metadata);
  });

  if (copyErrors.length) {
    fail(formatCopyLimitErrors(copyErrors));
  }
} catch (error) {
  fail(error.message);
}

console.log(`Valid metadata: ${resolvedInput}`);
console.log(`Template: ${selectedTemplate}`);
console.log(`Size: ${Buffer.byteLength(rawJson, 'utf8')} bytes`);
