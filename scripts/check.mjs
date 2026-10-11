// Static checks for the site in public/. Run via scripts/check.sh (locally and in CI).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const errors = [];
const fail = (message) => errors.push(message);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const files = walk(pub);
const read = (path) => readFileSync(path, 'utf8');
const rel = (path) => relative(root, path);
const ofType = (ext) => files.filter((file) => file.endsWith(ext));

// 1. JavaScript modules parse.
for (const file of ofType('.js')) {
  try {
    execFileSync(process.execPath, ['--input-type=module', '--check'], { input: read(file), stdio: 'pipe' });
  } catch (error) {
    fail(`${rel(file)}: syntax error\n${error.stderr}`);
  }
}

// 2. No leftovers from the Manus platform.
for (const file of [...ofType('.html'), ...ofType('.css'), ...ofType('.js')]) {
  if (read(file).includes('manus-storage')) fail(`${rel(file)}: still references /manus-storage`);
}

// 3. Every local asset reference exists.
const checkRef = (from, ref) => {
  const path = ref.split(/[?#]/)[0];
  if (!path || /^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ref)) return;
  const target = path.startsWith('/') ? join(pub, path) : join(dirname(from), path);
  if (!existsSync(target)) fail(`${rel(from)}: missing file for "${ref}"`);
};
for (const file of ofType('.html')) {
  const html = read(file);
  for (const [, ref] of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) checkRef(file, ref);
  for (const [, set] of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g))
    set.split(',').forEach((entry) => checkRef(file, entry.trim().split(/\s+/)[0]));
}
for (const file of ofType('.css'))
  for (const [, ref] of read(file).matchAll(/url\(['"]?([^'")]+)/g)) checkRef(file, ref);
for (const file of ofType('.js'))
  for (const [, ref] of read(file).matchAll(/from '(\.[^']+)'/g)) checkRef(file, ref);

// 4. Translations: both languages define the same keys, and every key used in HTML exists.
const { translations } = await import(join(pub, 'js/translations.js'));
const idKeys = Object.keys(translations.id);
const enKeys = Object.keys(translations.en);
idKeys.filter((key) => !enKeys.includes(key)).forEach((key) => fail(`translations: "${key}" missing in en`));
enKeys.filter((key) => !idKeys.includes(key)).forEach((key) => fail(`translations: "${key}" missing in id`));
for (const [, key] of read(join(pub, 'index.html')).matchAll(/data-i18n(?:-label)?="(\w+)"/g))
  if (!idKeys.includes(key)) fail(`index.html: unknown translation key "${key}"`);

// 5. The CSP hash in vercel.json matches every inline <script>.
const csp = read(join(root, 'vercel.json'));
for (const file of ofType('.html')) {
  for (const [, code] of read(file).matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = createHash('sha256').update(code).digest('base64');
    if (!csp.includes(`'sha256-${hash}'`))
      fail(`${rel(file)}: inline script hash sha256-${hash} not allowed by vercel.json CSP`);
  }
}

// 6. JSON files are valid.
for (const file of [join(root, 'vercel.json'), ...ofType('.json')]) {
  try {
    JSON.parse(read(file));
  } catch (error) {
    fail(`${rel(file)}: invalid JSON (${error.message})`);
  }
}

// 7. The WhatsApp number in static pages matches config.js.
const number = read(join(pub, 'js/config.js')).match(/whatsappNumber: '(\d+)'/)[1];
for (const file of ofType('.html'))
  for (const [, found] of read(file).matchAll(/wa\.me\/(\d+)/g))
    if (found !== number) fail(`${rel(file)}: wa.me/${found} differs from config.js (${number})`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ All checks passed (${files.length} files in public/).`);
