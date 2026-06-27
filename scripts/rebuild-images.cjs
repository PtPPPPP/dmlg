// scripts/rebuild-images.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { ProxyAgent, fetch: uf } = require('undici');

(async () => {
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'athletes');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const proxyUrl = process.env.https_proxy || process.env.http_proxy;
const disp = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;

function parse(f) {
  const lines = fs.readFileSync(f, 'utf-8').split('\n');
  const r = []; let c = null;
  for (const l of lines) {
    if (/^\s*\{\s*$/.test(l)) { if (c?.id && c?.url) r.push(c); c = { id: null, name: null, url: null }; continue; }
    if (!c) continue;
    const m1 = l.match(/^\s*id:\s*'([^']+)'/); if (m1) c.id = m1[1];
    const m2 = l.match(/^\s*englishName:\s*'([^']+)'/); if (m2) c.name = m2[1];
    const m3 = l.match(/^\s*src:\s*'([^']+)'/); if (m3) c.url = m3[1];
  }
  if (c?.id && c?.url) r.push(c);
  return r;
}

const files = [
  path.join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  path.join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];
const seen = new Set();
const athletes = [];
for (const f of files) for (const a of parse(f)) {
  if (a.url?.includes('upload.wikimedia.org') && !seen.has(a.id)) { seen.add(a.id); athletes.push(a); }
}
console.log('athletes with URLs:', athletes.length);

function getFilename(url) {
  const m = url.match(/\/([0-9]+px-)?([^\/]+\.(jpg|jpeg|png|gif|svg|webp))$/i);
  return m ? decodeURIComponent(m[2]) : null;
}

// API resolve
const API = 'https://commons.wikimedia.org/w/api.php';
async function resolveUrls() {
  const map = new Map();
  const BATCH = 50;
  for (let i = 0; i < athletes.length; i += BATCH) {
    const batch = athletes.slice(i, i + BATCH);
    const titles = batch.map(a => 'File:' + (getFilename(a.url) || '')).filter(Boolean);
    const params = new URLSearchParams({ action: 'query', titles: titles.join('|'), prop: 'imageinfo', iiprop: 'url', iiurlwidth: '800', format: 'json' });
    for (let r = 0; r < 3; r++) {
      try {
        const resp = await uf(API + '?' + params, { dispatcher: disp, signal: AbortSignal.timeout(30000) });
        if (resp.status === 429) { await new Promise(x => setTimeout(x, 10000)); continue; }
        const data = await resp.json();
        for (const a of batch) {
          const fn = getFilename(a.url); if (!fn) continue;
          const page = Object.values(data.query.pages).find(p => p.title === 'File:' + fn);
          const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
          map.set(a.id, url || null);
        }
        break;
      } catch (e) { console.log('API error, retry:', e.message); await new Promise(x => setTimeout(x, 5000)); }
    }
    if (i + BATCH < athletes.length) await new Promise(x => setTimeout(x, 2000));
  }
  return map;
}

console.log('Resolving URLs via API...');
const urlMap = await resolveUrls();
const resolved = [...urlMap.values()].filter(Boolean).length;
console.log('Resolved:', resolved, '/', athletes.length);

// Download + convert to WebP
async function download(id, url) {
  for (let r = 0; r < 3; r++) {
    try {
      const resp = await uf(url, { dispatcher: disp, signal: AbortSignal.timeout(30000) });
      if (resp.status === 429) {
        const w = (r + 1) * 8000;
        process.stdout.write('429 ');
        await new Promise(x => setTimeout(x, w));
        continue;
      }
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const buf = Buffer.from(await resp.arrayBuffer());
      if (buf.length < 3000) throw new Error('too small ' + buf.length);
      const webpBuf = await sharp(buf).resize(800, undefined, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      fs.writeFileSync(path.join(OUT, id + '.webp'), webpBuf);
      return { size: webpBuf.length, orig: buf.length };
    } catch (e) {
      if (e.message.includes('429')) continue;
      if (r === 2) throw e;
      await new Promise(x => setTimeout(x, 5000));
    }
  }
  throw new Error('retry failed');
}

console.log('\nDownloading...');
let ok = 0, fail = 0;
for (let i = 0; i < athletes.length; i++) {
  const a = athletes[i];
  const n = String(i + 1).padStart(2, ' ');
  const fp = path.join(OUT, a.id + '.webp');
  if (fs.existsSync(fp) && fs.statSync(fp).size > 1000) { console.log(n + ' ' + a.id + ' skip'); ok++; continue; }
  const url = urlMap.get(a.id);
  if (!url) { console.log(n + ' ' + a.id + ' NO_URL'); fail++; continue; }
  process.stdout.write(n + ' ' + a.id + ' ... ');
  try {
    const r = await download(a.id, url);
    console.log('OK ' + Math.round(r.size / 1024) + 'KB');
    ok++;
  } catch (e) {
    console.log('FAIL ' + e.message);
    fail++;
  }
  if (i < athletes.length - 1) await new Promise(x => setTimeout(x, 3000));
}

console.log('\nDone. OK:', ok, 'FAIL:', fail);

// Update data files
console.log('\nUpdating data files...');
let totalUp = 0;
const dlFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.webp')).map(f => f.replace('.webp', ''));
for (const dfp of files) {
  let c = fs.readFileSync(dfp, 'utf-8');
  let up = 0;
  for (const id of dlFiles) {
    // 替换 avatar: 'https://...' → '/images/athletes/id.webp'
    // 替换 src: 'https://...' → '/images/athletes/id.webp'
    const avatarRe = new RegExp("(\\s*avatar:\\s*')" + id.replace(/[-]/g, '[-]') + "'[^']*'", 'g');
    const srcRe = new RegExp("(\\s*src:\\s*')" + id.replace(/[-]/g, '[-]') + "'[^']*'", 'g');
    const newRef = `'/images/athletes/${id}.webp'`;
    if (avatarRe.test(c)) { c = c.replace(avatarRe, '$1' + newRef + "'"); up++; }
    if (srcRe.test(c)) { c = c.replace(srcRe, '$1' + newRef + "'"); up++; }
  }
  if (up > 0) { fs.writeFileSync(dfp, c, 'utf-8'); console.log('  Updated', path.basename(dfp), ':', up); totalUp += up; }
  else console.log('  Skipped', path.basename(dfp));
}

const sz = dlFiles.reduce((s, id) => s + fs.statSync(path.join(OUT, id + '.webp')).size, 0);
console.log('\nTotal:', dlFiles.length, 'WebP images,', Math.round(sz / 1024 / 1024 * 10) / 10, 'MB');
})();
