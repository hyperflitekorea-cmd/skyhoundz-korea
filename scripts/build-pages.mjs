import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const files = new Set(['index.html', '.nojekyll', 'assets/fonts/Barlow-OFL.txt', 'assets/fonts/Pretendard-LICENSE.txt']);
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))(?:\?[^"#]*)?"/g)) {
  if (!/^https?:/.test(match[1])) files.add(match[1]);
}
for (const file of [...files]) {
  if (file === '.nojekyll') continue;
  const text = readFileSync(resolve(root, file), 'utf8').replace(/^\s*\/\/.*$/gm, '');
  for (const match of text.matchAll(/assets\/[A-Za-z0-9_./-]+\.(?:png|webp|jpe?g|svg|woff2?|ttf)/g)) {
    if (!existsSync(resolve(root, match[0]))) throw new Error(`Missing asset: ${match[0]} (${file})`);
    files.add(match[0]);
  }
}
// Prevent a stale, unrelated file from silently entering a future deployment.
function inspectOutput(directory, prefix = '') {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) inspectOutput(resolve(directory, entry.name), relative + '/');
    else if (!files.has(relative)) throw new Error(`Unexpected file in dist: ${relative}. Use a fresh output directory.`);
  }
}
inspectOutput(output);
for (const file of files) {
  const destination = resolve(output, file);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(root, file), destination);
}
writeFileSync(resolve(root, '.deploy-files.json'), JSON.stringify([...files].sort(), null, 2) + '\n');
console.log(`Ready: ${files.size} website files in dist; planning notes and local tools excluded.`);

