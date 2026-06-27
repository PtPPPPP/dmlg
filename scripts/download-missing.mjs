// scripts/download-missing.mjs
// 定向下载剩余运动员图片 — 使用已知正确文件名
import { mkdirSync, existsSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { ProxyAgent, fetch as uf } from 'undici';

const ROOT = resolve(import.meta.dirname || '.', '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'athletes');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const proxyUrl = process.env.https_proxy || process.env.http_proxy;
const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;

// 从 Wikimedia API 获取图片 URL 并下载
async function fetchAndDownload(id, filename) {
  const API = 'https://commons.wikimedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query', titles: 'File:' + filename,
    prop: 'imageinfo', iiprop: 'url', iiurlwidth: '800', format: 'json',
  });

  // 获取正确 URL
  const resp = await uf(`${API}?${params}`, { dispatcher, signal: AbortSignal.timeout(30000) });
  const data = await resp.json();
  const page = Object.values(data.query.pages)[0];
  const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
  if (!url) throw new Error('API 未返回 URL');

  // 下载
  const dl = await uf(url, { dispatcher, signal: AbortSignal.timeout(30000) });
  if (!dl.ok) throw new Error(`HTTP ${dl.status}`);
  const buf = Buffer.from(await dl.arrayBuffer());
  if (buf.length < 3000) throw new Error(`文件太小 ${buf.length}B`);

  const magic = buf.slice(0, 4).toString('hex');
  let ext = '.jpg';
  if (magic.startsWith('89504e47')) ext = '.png';
  if (magic.startsWith('52494646')) ext = '.webp';

  writeFileSync(join(OUT_DIR, `${id}${ext}`), buf);
  return `${(buf.length / 1024).toFixed(0)}KB${ext}`;
}

// 已知正确文件名映射
const TARGETS = [
  // 搜索确认的正确文件名
  ['gabby-thomas', 'Gabby Thomas (2024).jpg'],
  ['marcell-jacobs', 'Marcell Jacobs (Roma 2024).jpg'],
  ['hansle-parchment', 'Hansle Parchment (JAM) 2015.jpg'],
  ['tobi-amusan', 'Tobi Amusan Oregon 2022.jpg'],
  ['sifan-hassan', 'Sifan Hassan Beijing 2015.jpg'],
  ['emmanuel-wanyonyi', 'Emmanuel Wanyonyi (KEN) 2023.jpg'],
  ['devynne-charlton', "2025 World Athletics Indoor Championships – Women's 60 metres hurdles 10.jpg"],
  ['shaunae-miller-uibo', 'Shaunae Miller-Uibo at Doha 2019 (cropped).jpg'],
  ['muzala-samukonga', 'Muzala Samukonga (ZAM) 2024.jpg'],
  ['kurtis-marschall', 'Kurtis Marschall (AUS) 2023.jpg'],
  ['mattia-furlani', 'Mattia Furlani (ITA) 2023.jpg'],
  ['tajay-gayle', 'Tajay Gayle (JAM) 2019.jpg'],
  ['ferdinand-omanyala', 'Ferdinand Omanyala Budapest 2023.jpg'],
  ['kenneth-bednarek', 'Kenneth Bednarek (USA).jpg'],
  ['trayvon-bromell', 'Trayvon Bromell Beijing 2015 (cropped).jpg'],
  ['iryna-gerashchenko', 'Iryna Gerashchenko at Paris 2024.png'],
  ['kristjan-ceh', 'Kristjan Čeh Oregon 2022.jpg'],
  ['jorinde-van-klinken', 'Jorinde van Klinken – 2023 Mount SAC Relays.jpg'],
  ['jordan-geist', "2022-05-01 ALBA Berlin gegen MLP Academics Heidelberg (Basketball-Bundesliga 2021-22) by Sandro Halank–055.jpg"],
  // 原文件名可能正确但被 429 打断的
  ['joe-kovacs', 'Joe Kovacs (USA) 2016.jpg'],
  ['shericka-jackson', 'Shericka Jackson at Doha 2019 (cropped).jpg'],
  // 其余用近似文件名尝试
  ['peruth-chemutai', 'Peruth Chemutai (UGA) 2016.jpg'],
  ['winfred-yavi', 'Winfred Yavi (BHR) 2019.jpg'],
  ['miltiadis-tentoglou', 'Miltiadis Tentoglou Budapest 2023.jpg'],
  ['yuliia-levchenko', 'Yuliya Levchenko at the 2020 Summer Olympics (1).jpg'],
  ['matthew-denny', 'Matthew Denny 2018.jpg'],
  ['feng-bin', 'Feng Bin Oregon 2022.jpg'],
  ['aaliyah-butler', 'Aaliyah Butler.jpg'],
  ['sifan-hassan', 'Sifan Hassan with two gold medals at 2019 World Athletics Championships.jpg'],
  ['rachid-muratake', 'Rachid Muratake 2025 Nakayama Racecourse.jpg'],
];

console.log(`🎯 定向下载 ${TARGETS.length} 位运动员\n`);

let success = 0, failed = 0;
for (let i = 0; i < TARGETS.length; i++) {
  const [id, filename] = TARGETS[i];
  const num = String(i + 1).padStart(2, ' ');

  // 已存在跳过
  const existing = ['.jpg', '.png', '.webp'].map(ext => join(OUT_DIR, `${id}${ext}`)).find(p => existsSync(p));
  if (existing && statSync(existing).size > 5000) {
    process.stdout.write(`  [${num}/${TARGETS.length}] ${id} ... ⏭️ 已存在\n`);
    success++;
    continue;
  }

  process.stdout.write(`  [${num}/${TARGETS.length}] ${id} ... `);

  // 重试
  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    try {
      const size = await fetchAndDownload(id, filename);
      process.stdout.write(`✅ ${size}\n`);
      success++;
      ok = true;
    } catch (e) {
      if (e.message.includes('429') || e.message.includes('timeout')) {
        process.stdout.write(`⏳ `);
        await new Promise(r => setTimeout(r, (attempt + 1) * 8000));
        continue;
      }
      if (attempt === 2) {
        process.stdout.write(`❌ ${e.message}\n`);
        failed++;
      } else {
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  // 间隔 5 秒
  if (i < TARGETS.length - 1) await new Promise(r => setTimeout(r, 5000));
}

console.log(`\n📊 新增成功: ${success - 37}, 失败: ${failed}`);

const { readdirSync } = await import('fs');
const files = readdirSync(OUT_DIR).filter(f => /\.(jpg|png|webp)$/.test(f));
const totalSize = files.reduce((s, f) => s + statSync(join(OUT_DIR, f)).size, 0);
console.log(`\n📁 总计 ${files.length} 个图片, ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
