// scripts/convert-to-webp.mjs
// 将运动员图片从 jpg/png 转为 webp 格式
import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'athletes');
const DATA_FILES = [
  join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];

const MAX_WIDTH = 800;
const QUALITY = 80;

const files = readdirSync(OUT_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
console.log(`🔄 转换 ${files.length} 张图片为 WebP...\n`);

let totalOriginal = 0;
let totalWebp = 0;
const converted = new Map(); // id -> new ext

for (const file of files) {
  const inputPath = join(OUT_DIR, file);
  const { name } = file.match(/^(.+)\.(jpg|jpeg|png)$/i);
  const outputPath = join(OUT_DIR, `${name}.webp`);

  const originalSize = statSync(inputPath).size;
  totalOriginal += originalSize;

  try {
    const info = await sharp(inputPath)
      .resize(MAX_WIDTH, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const webpSize = info.size;
    totalWebp += webpSize;

    const ratio = ((1 - webpSize / originalSize) * 100).toFixed(1);
    console.log(`  ✅ ${file} → ${name}.webp (${(originalSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB, -${ratio}%)`);

    // 删除原始文件
    unlinkSync(inputPath);
    converted.set(name, '.webp');
  } catch (e) {
    console.error(`  ❌ ${file}: ${e.message}`);
    // 保留原文件
    const ext = file.match(/\.(jpg|jpeg|png)$/i)[0];
    converted.set(name, ext);
  }
}

console.log(`\n📊 压缩汇总:`);
console.log(`  原始: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`  WebP: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
console.log(`  节省: ${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%`);

// 更新数据文件中的图片路径扩展名
console.log(`\n📝 更新数据文件中的图片扩展名...`);
let totalUpdates = 0;
for (const filePath of DATA_FILES) {
  let content = readFileSync(filePath, 'utf-8');
  let updated = 0;

  for (const [id, ext] of converted) {
    // 检查所有可能的旧扩展名
    for (const oldExt of ['.jpg', '.jpeg', '.png']) {
      const oldPath = `/images/athletes/${id}${oldExt}`;
      const newPath = `/images/athletes/${id}${ext}`;

      if (content.includes(oldPath) && oldPath !== newPath) {
        content = content.replaceAll(oldPath, newPath);
        updated++;
      }
    }
  }

  if (updated > 0) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${filePath.split(/manual[\\/]/)[1]}: ${updated} 处`);
    totalUpdates += updated;
  } else {
    console.log(`  ⏭️  ${filePath.split(/manual[\\/]/)[1]}: 无需更新`);
  }
}

console.log(`\n🎉 转换完成！共更新 ${totalUpdates} 处引用`);
