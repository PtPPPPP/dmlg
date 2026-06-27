// scripts/download-images.mjs
// 完整方案：通过 Wikimedia API 获取正确图片 URL → 下载
import { readFileSync, mkdirSync, existsSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { ProxyAgent, fetch as uf } from 'undici';

const ROOT = resolve(import.meta.dirname || '.', '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'athletes');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const proxyUrl = process.env.https_proxy || process.env.http_proxy;
const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;
console.log(`🌐 代理: ${proxyUrl || '直连'}\n`);

// === 1. 解析运动员数据 ===
function parseAthletes(filePath) {
  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const athletes = [];
  let cur = null;
  for (const line of lines) {
    if (line.match(/^\s*\{\s*$/)) {
      if (cur?.id && cur?.url) athletes.push({ ...cur });
      cur = { id: null, name: null, url: null };
      continue;
    }
    if (!cur) continue;
    const m1 = line.match(/^\s*id:\s*'([^']+)'[,]?\s*$/);
    if (m1) { cur.id = m1[1]; continue; }
    const m2 = line.match(/^\s*englishName:\s*'([^']+)'[,]?\s*$/);
    if (m2) { cur.name = m2[1]; continue; }
    const m3 = line.match(/^\s*src:\s*'([^']+)'[,]?\s*$/);
    if (m3) cur.url = m3[1];
  }
  if (cur?.id && cur?.url) athletes.push(cur);
  return athletes;
}

const dataFiles = [
  join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];
const seen = new Set();
const athletes = [];
for (const f of dataFiles) {
  for (const a of parseAthletes(f)) {
    if (a.url?.includes('upload.wikimedia.org') && !seen.has(a.id)) {
      seen.add(a.id);
      athletes.push(a);
    }
  }
}
console.log(`📸 找到 ${athletes.length} 位运动员`);

// 从 URL 提取文件名
function getFilename(url) {
  // 取 thumb 路径最后一段，去掉宽度前缀
  const m = url.match(/\/([0-9]+px-)?([^\/]+\.(jpg|jpeg|png|gif|svg|webp))$/i);
  if (m) return decodeURIComponent(m[2]);
  // 非缩略图
  const m2 = url.match(/\/([^\/]+\.(jpg|jpeg|png|gif|svg|webp))$/i);
  return m2 ? decodeURIComponent(m2[1]) : null;
}

// === 2. 通过 Wikimedia API 批量获取正确 URL ===
const API = 'https://commons.wikimedia.org/w/api.php';

async function resolveUrls(athletes) {
  // 按50个一组批量查询
  const BATCH = 50;
  const resolved = new Map();

  for (let i = 0; i < athletes.length; i += BATCH) {
    const batch = athletes.slice(i, i + BATCH);
    const titles = batch.map(a => 'File:' + (getFilename(a.url) || '')).filter(Boolean);

    if (titles.length === 0) continue;

    console.log(`  🔍 查询 API (${i + 1}-${Math.min(i + BATCH, athletes.length)})...`);

    const params = new URLSearchParams({
      action: 'query',
      titles: titles.join('|'),
      prop: 'imageinfo',
      iiprop: 'url|size',
      iiurlwidth: '800',
      format: 'json',
    });

    let data;
    for (let retry = 0; retry < 3; retry++) {
      try {
        const resp = await uf(`${API}?${params}`, {
          dispatcher,
          headers: { 'User-Agent': 'DiamondAthleticsApp/1.0' },
          signal: AbortSignal.timeout(30000),
        });
        data = await resp.json();
        break;
      } catch (e) {
        if (retry < 2) { await new Promise(r => setTimeout(r, 3000)); continue; }
        console.error(`    ❌ API 错误: ${e.message}`);
        data = { query: { pages: {} } };
      }
    }

    // 匹配返回的页面到运动员
    const pages = data?.query?.pages || {};
    for (const a of batch) {
      const fname = getFilename(a.url);
      if (!fname) continue;

      const page = Object.values(pages).find(p => p.title === `File:${fname}`);
      if (page?.imageinfo?.[0]) {
        // 优先使用缩略图 URL（800px），回退到原始
        resolved.set(a.id, {
          thumbUrl: page.imageinfo[0].thumburl || page.imageinfo[0].url,
          fullUrl: page.imageinfo[0].url,
          width: page.imageinfo[0].thumbwidth || page.imageinfo[0].width,
        });
      } else {
        resolved.set(a.id, null); // 标记为未找到
      }
    }

    // API 间隔
    if (i + BATCH < athletes.length) await new Promise(r => setTimeout(r, 1000));
  }

  return resolved;
}

console.log(`\n🔍 通过 Wikimedia API 解析正确 URL...`);
const urlMap = await resolveUrls(athletes);
const resolvedCount = [...urlMap.values()].filter(v => v !== null).length;
console.log(`  ✅ 解析成功: ${resolvedCount}/${athletes.length}\n`);

// === 3. 下载图片 ===
let success = 0, failed = 0, skipped = 0;
const report = { success: [], failed: [], skipped: [], missing: [] };

for (let i = 0; i < athletes.length; i++) {
  const a = athletes[i];
  const num = String(i + 1).padStart(2, ' ');
  const info = urlMap.get(a.id);

  // 已存在
  const existing = ['.jpg', '.png', '.webp'].map(ext => join(OUT_DIR, `${a.id}${ext}`)).find(p => existsSync(p));
  if (existing && statSync(existing).size > 5000) {
    process.stdout.write(`  [${num}/${athletes.length}] ${a.name} ... ⏭️ 已存在\n`);
    skipped++; success++;
    continue;
  }

  if (!info) {
    process.stdout.write(`  [${num}/${athletes.length}] ${a.name} ... ❌ API 未找到文件\n`);
    failed++;
    report.missing.push({ id: a.id, name: a.name, filename: getFilename(a.url) });
    continue;
  }

  process.stdout.write(`  [${num}/${athletes.length}] ${a.name} ... `);

  // 下载，带 429 重试
  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    try {
      const resp = await uf(info.thumbUrl, {
        dispatcher,
        headers: { 'User-Agent': 'DiamondAthleticsApp/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });

      if (resp.status === 429) {
        const wait = (attempt + 1) * 5000;
        process.stdout.write(`⏳429 `);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const buf = Buffer.from(await resp.arrayBuffer());
      if (buf.length < 3000) throw new Error(`文件太小 ${buf.length}B`);

      const magic = buf.slice(0, 4).toString('hex');
      let ext = '.jpg';
      if (magic.startsWith('89504e47')) ext = '.png';
      if (magic.startsWith('52494646')) ext = '.webp';

      writeFileSync(join(OUT_DIR, `${a.id}${ext}`), buf);
      process.stdout.write(`✅ ${(buf.length / 1024).toFixed(0)}KB${ext}\n`);
      success++;
      report.success.push(a.id);
      ok = true;
    } catch (e) {
      if (!ok && attempt === 2) {
        process.stdout.write(`❌ ${e.message}\n`);
        failed++;
        report.failed.push({ id: a.id, name: a.name, reason: e.message });
      }
    }
  }

  // 间隔
  if (i < athletes.length - 1) await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n📊 完成! 成功: ${success} (已有${skipped}), 失败: ${failed}`);
if (report.failed.length > 0) {
  console.log('\n❌ 下载失败:');
  for (const f of report.failed) console.log(`  - ${f.name} (${f.id}): ${f.reason}`);
}
if (report.missing.length > 0) {
  console.log('\n❓ API 未找到文件:');
  for (const f of report.missing) console.log(`  - ${f.name} (${f.id}): ${f.filename}`);
}

const { readdirSync } = await import('fs');
const dlFiles = readdirSync(OUT_DIR).filter(f => /\.(jpg|png|webp)$/.test(f));
const totalSize = dlFiles.reduce((s, f) => s + statSync(join(OUT_DIR, f)).size, 0);
console.log(`\n📁 ${dlFiles.length} 个图片文件, 总大小 ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
writeFileSync(join(ROOT, 'assets', 'download-report.json'), JSON.stringify(report, null, 2));
