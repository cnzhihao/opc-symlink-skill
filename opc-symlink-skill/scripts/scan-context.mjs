#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const rootArg = args.find((arg) => !arg.startsWith('-')) || '.';
const root = path.resolve(rootArg);
const asJson = args.includes('--json');
const memoryMonths = 3;
const memoryCutoff = Date.now() - memoryMonths * 30 * 24 * 60 * 60 * 1000;

const skipDirs = new Set([
  '.git',
  '.next',
  '.turbo',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.cache',
  '.vercel',
  '.wrangler',
]);

const sensitivePatterns = [
  /\.env/i,
  /secret/i,
  /credential/i,
  /private[-_]?key/i,
  /\.pem$/i,
  /\.key$/i,
  /password/i,
  /token/i,
];

const strongNames = [
  'user.md',
  'memory.md',
  'soul.md',
  'profile.md',
  'about.md',
  'bio.md',
  'personal.md',
];

const publicSignals = [
  'readme.md',
  'package.json',
  'launch.md',
  'pitch.md',
  'press.md',
  'manifesto.md',
];

const contentDirSignals = [
  `${path.sep}blog${path.sep}`,
  `${path.sep}content${path.sep}`,
  `${path.sep}posts${path.sep}`,
];

const profileWords = new Set([
  'profile',
  'about',
  'bio',
  'intro',
  'homepage',
  'persona',
]);

function isTextFile(filePath) {
  return /\.(mdx?|txt|json)$/i.test(filePath);
}

function isInMemoryDir(filePath) {
  return path
    .relative(root, filePath)
    .split(path.sep)
    .some((part) => /^memories?$/i.test(part));
}

function isSensitive(filePath) {
  return sensitivePatterns.some((pattern) => pattern.test(filePath));
}

function reasonFor(filePath, stat) {
  const base = path.basename(filePath).toLowerCase();
  const normalized = filePath.toLowerCase();
  const nameWithoutExt = base.replace(/\.(mdx?|txt|json)$/i, '');
  const isTextCandidate = isTextFile(base);

  if (
    isTextCandidate &&
    isInMemoryDir(filePath) &&
    stat.mtimeMs >= memoryCutoff
  ) {
    return `recent memory folder entry (${memoryMonths} months)`;
  }

  if (strongNames.includes(base)) {
    return 'direct personal or memory file';
  }

  if (publicSignals.includes(base)) {
    return 'public project or product signal';
  }

  if (
    contentDirSignals.some((segment) => normalized.includes(segment)) &&
    /\.(md|mdx|txt|json)$/i.test(filePath)
  ) {
    return 'public content or documentation signal';
  }

  if (
    isTextCandidate &&
    nameWithoutExt
      .split(/[^a-z0-9]+/i)
      .some((part) => profileWords.has(part))
  ) {
    return 'profile-like filename';
  }

  return '';
}

function excerpt(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter((line) => line.trim())
      .slice(0, 16)
      .join('\n')
      .slice(0, 1800);
  } catch {
    return '';
  }
}

function score(item) {
  if (item.reason.startsWith('recent memory folder entry')) {
    return 110;
  }

  if (item.reason === 'direct personal or memory file') {
    return 100;
  }

  if (item.reason === 'profile-like filename') {
    return 80;
  }

  if (item.path.split(path.sep).length <= 2) {
    return 60;
  }

  if (/content\/(author|blog)\//i.test(item.path)) {
    return 45;
  }

  return 30;
}

function walk(dir, depth = 0, found = []) {
  if (depth > 6 || found.length >= 120) {
    return found;
  }

  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(fullPath, depth + 1, found);
      }
      continue;
    }

    if (!entry.isFile() || isSensitive(fullPath)) {
      continue;
    }

    const stat = fs.statSync(fullPath);
    const reason = reasonFor(fullPath, stat);
    if (!reason) {
      continue;
    }

    if (stat.size > 300_000) {
      continue;
    }

    found.push({
      path: path.relative(root, fullPath),
      reason,
      bytes: stat.size,
      modifiedAt: stat.mtime.toISOString(),
      excerpt: excerpt(fullPath),
    });
  }

  return found;
}

const result = {
  root,
  generatedAt: new Date().toISOString(),
  memoryWindow: {
    months: memoryMonths,
    cutoff: new Date(memoryCutoff).toISOString(),
  },
  candidates: walk(root)
    .sort((a, b) => score(b) - score(a) || a.path.localeCompare(b.path))
    .slice(0, args.includes('--all') ? 120 : 35),
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Scanned ${root}`);
  for (const item of result.candidates) {
    console.log(`- ${item.path} (${item.reason}, ${item.bytes} bytes)`);
  }
}
