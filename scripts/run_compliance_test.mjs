import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

process.argv = ['node', 'scripts/test-gate-engine.mjs', '/api/compliance/metrics', ...process.argv.slice(2)];
await import('./test-gate-engine.mjs');
process.exit(0);
