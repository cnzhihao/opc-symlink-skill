import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  HOSTED_TEMPLATE_IDS,
} from '../scripts/lib/templates.mjs';

const execFileAsync = promisify(execFile);
const skillRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const renderer = path.join(skillRoot, 'scripts/render-homepage.mjs');
const verifier = path.join(skillRoot, 'scripts/verify-homepage.mjs');
const validator = path.join(skillRoot, 'scripts/validate-metadata.mjs');
const fixture = path.join(skillRoot, 'evals/fixtures/metadata-current-work.json');

async function runNode(script, args) {
  return execFileAsync(process.execPath, [script, ...args], {
    cwd: skillRoot,
    maxBuffer: 4 * 1024 * 1024,
  });
}

test('the registry contains exactly the current 15 templates', () => {
  assert.deepEqual(HOSTED_TEMPLATE_IDS, [
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
  ]);
});

test('every current template renders and includes Current Work', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'opc-skill-eval-'));

  for (const template of HOSTED_TEMPLATE_IDS) {
    const outputPath = path.join(outputDir, `${template}.html`);
    await runNode(renderer, [fixture, outputPath, '--template', template]);
    const html = await readFile(outputPath, 'utf8');

    assert.match(html, new RegExp(`template-${template}`));
    assert.match(html, /Current Work|当前工作/);
    assert.match(html, /opc-symlink-render-fingerprint/);
  }
});

test('rendered output passes verification and tampering is rejected', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'opc-skill-eval-'));
  const outputPath = path.join(outputDir, 'homepage.html');

  await runNode(renderer, [fixture, outputPath, '--template', 'quiet-product']);
  await runNode(verifier, [fixture, outputPath]);

  const html = await readFile(outputPath, 'utf8');
  await writeFile(outputPath, html.replace('Building reusable AI workflows', 'Tampered copy'));

  await assert.rejects(
    runNode(verifier, [fixture, outputPath]),
    (error) => {
      return `${error.stdout || ''}${error.stderr || ''}`.includes(
        'fingerprint',
      );
    },
  );
});

test('unsupported legacy template names fail instead of aliasing', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'opc-skill-eval-'));
  const outputPath = path.join(outputDir, 'homepage.html');

  await assert.rejects(
    runNode(renderer, [fixture, outputPath, '--template', 'terminal']),
    (error) => {
      return `${error.stdout || ''}${error.stderr || ''}`.includes(
        'Unknown template "terminal"',
      );
    },
  );
});

test('unsafe URL schemes are omitted from rendered links', async () => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'opc-skill-eval-'));
  const metadataPath = path.join(outputDir, 'metadata.json');
  const outputPath = path.join(outputDir, 'homepage.html');
  const metadata = JSON.parse(await readFile(fixture, 'utf8'));

  metadata.locales['zh-CN'].cta.primary.url = 'javascript:alert(1)';
  metadata.locales.en.cta.primary.url = 'javascript:alert(1)';
  await writeFile(metadataPath, JSON.stringify(metadata));

  await assert.rejects(
    runNode(validator, [metadataPath, '--template', 'gridline']),
    (error) => {
      return `${error.stdout || ''}${error.stderr || ''}`.includes(
        'must use http://, https://, mailto:, or tel:',
      );
    },
  );

  metadata.locales['zh-CN'].cta.primary.url = 'https://example.com/call';
  metadata.locales.en.cta.primary.url = 'https://example.com/call';
  await writeFile(metadataPath, JSON.stringify(metadata));
  await runNode(renderer, [metadataPath, outputPath, '--template', 'gridline']);

  const html = await readFile(outputPath, 'utf8');
  assert.doesNotMatch(html, /href="javascript:/i);
});

test('CLI metadata preflight accepts the current contract and rejects mismatch', async () => {
  await runNode(validator, [fixture, '--template', 'gridline']);

  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'opc-skill-eval-'));
  const metadataPath = path.join(outputDir, 'metadata.json');
  const metadata = JSON.parse(await readFile(fixture, 'utf8'));
  metadata.style.template = 'quiet-product';
  await writeFile(metadataPath, JSON.stringify(metadata));

  await assert.rejects(
    runNode(validator, [metadataPath, '--template', 'gridline']),
    (error) => {
      return `${error.stdout || ''}${error.stderr || ''}`.includes(
        'does not match style.template',
      );
    },
  );
});
