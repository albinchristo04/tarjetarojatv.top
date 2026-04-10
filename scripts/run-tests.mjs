import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function collectTestFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectTestFiles(fullPath));
      continue;
    }

    if (entry.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

const testsDir = resolve(process.cwd(), 'tests');
const testFiles = collectTestFiles(testsDir).sort();

if (testFiles.length === 0) {
  console.error(`No test files found under ${testsDir}`);
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', ...testFiles],
  {
    stdio: 'inherit',
  }
);

process.exit(result.status ?? 1);
