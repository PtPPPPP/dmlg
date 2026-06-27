// scripts/update-image-paths.mjs
// 更新运动员数据文件：将有本地图片的运动员的 image.src/avatar 改为本地路径
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname || '.', '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'athletes');
const dataFiles = [
  join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];

// 获取已下载图片的 athleteId -> 本地路径映射
const imageMap = new Map();
for (const f of readdirSync(OUT_DIR)) {
  const extMatch = f.match(/^(.+)\.(jpg|png|webp)$/);
  if (extMatch) {
    const id = extMatch[1];
    const fullPath = join(OUT_DIR, f);
    const size = statSync(fullPath).size;
    if (size > 5000) {
      imageMap.set(id, `/images/athletes/${id}.${extMatch[2]}`);
    }
  }
}

console.log(`📁 已下载 ${imageMap.size} 张本地图片\n`);

for (const filePath of dataFiles) {
  let content = readFileSync(filePath, 'utf-8');
  let updated = 0;

  // 对每个运动员块，如果有本地图片就更新
  const lines = content.split('\n');
  const newLines = [];
  let currentId = null;

  for (const line of lines) {
    const idMatch = line.match(/^(\s*)id:\s*'([^']+)'(,?\s*)$/);
    if (idMatch) {
      currentId = idMatch[2];
    }

    // 替换 avatar 行
    if (currentId && imageMap.has(currentId)) {
      const avatarMatch = line.match(/^(\s*)avatar:\s*'[^']+',?\s*$/);
      if (avatarMatch) {
        newLines.push(`${avatarMatch[1]}avatar: '${imageMap.get(currentId)}',`);
        updated++;
        continue;
      }
    }

    // 替换 image.src 行
    if (currentId && imageMap.has(currentId)) {
      const srcMatch = line.match(/^(\s*)src:\s*'[^']+',?\s*$/);
      if (srcMatch) {
        newLines.push(`${srcMatch[1]}src: '${imageMap.get(currentId)}',`);
        updated++;
        continue;
      }
    }

    // 替换 alt 行（带前置空格的修复）
    if (currentId && imageMap.has(currentId)) {
      const altMatch = line.match(/^(\s*)alt:\s*' athlete portrait'(,?\s*)$/);
      if (altMatch) {
        // 不改 alt，但标记 usageStatus
        newLines.push(line);
        continue;
      }
    }

    newLines.push(line);
  }

  if (updated > 0) {
    writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    console.log(`✅ ${filePath.split(/manual[\\/]/)[1]}: 更新 ${updated} 处`);
  } else {
    console.log(`⏭️  ${filePath.split(/manual[\\/]/)[1]}: 无需更新`);
  }
}

console.log(`\n🎉 数据文件更新完成！`);
