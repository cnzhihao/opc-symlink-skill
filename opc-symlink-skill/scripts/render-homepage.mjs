#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { normalizeMetadata, normalizeTemplateName } from './lib/html.mjs';
import { renderBuilderOs } from './templates/builder-os.mjs';
import { renderProductLed } from './templates/product-led.mjs';
import { renderProofFirst } from './templates/proof-first.mjs';

const templates = {
  'product-led': renderProductLed,
  'builder-os': renderBuilderOs,
  'proof-first': renderProofFirst,
};

function parseArgs(argv) {
  const positional = [];
  let template = '';

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--template' || arg === '-t') {
      template = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--template=')) {
      template = arg.split('=').slice(1).join('=');
      continue;
    }

    if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  return {
    inputPath: positional[0],
    outputPath: positional[1] || 'personal-homepage.html',
    template,
  };
}

const { inputPath, outputPath, template } = parseArgs(process.argv.slice(2));

if (!inputPath) {
  console.error(
    'Usage: node render-homepage.mjs metadata.json [output.html] --template product-led|builder-os|proof-first',
  );
  process.exit(1);
}

const rawMetadata = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const metadata = normalizeMetadata(rawMetadata);
const selectedTemplate = normalizeTemplateName(
  template || metadata.style.template,
);

if (!selectedTemplate) {
  console.error(
    'Missing template. Choose --template product-led, --template builder-os, --template proof-first, or set style.template in metadata.',
  );
  process.exit(1);
}

const render = templates[selectedTemplate];

if (!render) {
  console.error(
    `Unknown template "${selectedTemplate}". Expected product-led, builder-os, or proof-first.`,
  );
  process.exit(1);
}

const html = render(metadata);
const resolvedOutput = path.resolve(outputPath);
const resolvedInput = path.resolve(inputPath);

if (resolvedInput === resolvedOutput) {
  console.error(
    'Refusing to overwrite input metadata. Use separate metadata JSON and output HTML paths.',
  );
  process.exit(1);
}

fs.writeFileSync(resolvedOutput, html);
console.log(resolvedOutput);
