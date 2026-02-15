#!/usr/bin/env node
/**
 * Cursor afterFileEdit hook: runs Playwright tests when a test file is created or refactored.
 * Triggered after the agent creates a new test file or edits an existing one.
 *
 * Payload (stdin): { file_path, workspace_roots, ... }
 * @see https://cursor.com/docs/agent/third-party-hooks
 */

const { spawn } = require('child_process');
const path = require('path');

const TEST_PATTERNS = [
  (p) => p.endsWith('.test.ts') || p.endsWith('.test.js'),
  (p) => p.endsWith('.spec.ts') || p.endsWith('.spec.js'),
  (p) => path.normalize(p).includes(path.sep + 'tests' + path.sep),
];

function isTestFile(filePath) {
  const normalized = path.normalize(filePath);
  return TEST_PATTERNS.some((fn) => fn(normalized));
}

function getRelativeTestPath(filePath, workspaceRoot) {
  const root = path.normalize(workspaceRoot);
  let normalized = path.normalize(filePath);
  if (path.isAbsolute(filePath) && normalized.startsWith(root)) {
    normalized = path.relative(root, normalized);
  }
  return normalized.replace(/\\/g, '/');
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => chunks.push(chunk));
    process.stdin.on('end', () => resolve(chunks.join('')));
    process.stdin.on('error', reject);
  });
}

async function main() {
  try {
    const raw = await readStdin();
    if (!raw.trim()) process.exit(0);

    const payload = JSON.parse(raw);
    const filePath = payload.file_path;
    const workspaceRoots = payload.workspace_roots || [];
    const workspaceRoot = workspaceRoots[0] || process.cwd();

    if (!filePath || !isTestFile(filePath)) {
      process.exit(0);
    }

    const relativePath = getRelativeTestPath(filePath, workspaceRoot);
    const cwd = path.isAbsolute(workspaceRoot) ? workspaceRoot : process.cwd();

    const child = spawn(
      'pnpm',
      ['exec', 'playwright', 'test', relativePath],
      {
        cwd,
        stdio: 'inherit',
        shell: true,
      }
    );

    child.on('close', (code) => process.exit(code ?? 0));
  } catch (err) {
    console.error('[cursor hook] after-file-edit:', err.message);
    process.exit(0);
  }
}

main();
