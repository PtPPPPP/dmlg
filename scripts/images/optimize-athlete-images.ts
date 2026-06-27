/**
 * 运动员图片优化脚本
 *
 * 功能：
 * 1. 读取 assets/raw-athlete-images/ 下的原始图片
 * 2. 转换为 WebP 格式
 * 3. 限制最大宽度 1200px
 * 4. 保持合理质量 (80%)
 * 5. 输出到 public/images/athletes/
 * 6. 输出压缩前后大小报告
 *
 * 使用方法：
 *   npm run images:optimize
 *
 * 依赖：
 *   npm install -D sharp
 */

import { readdir, stat, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const RAW_DIR = join(process.cwd(), 'assets', 'raw-athlete-images');
const OUT_DIR = join(process.cwd(), 'public', 'images', 'athletes');
const MAX_WIDTH = 1200;
const QUALITY = 80;

async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // ignore
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadSharp(): Promise<any> {
  // Use eval to avoid TypeScript static analysis of the import
  return new Function('return import("sharp")')();
}

async function main() {
  // Dynamic import for sharp (optional dependency)
  let sharpModule;
  try {
    sharpModule = await loadSharp();
  } catch {
    console.error('❌ sharp 未安装。请运行: npm install -D sharp');
    process.exit(1);
  }
  const sharp = sharpModule.default ?? sharpModule;

  await ensureDir(OUT_DIR);

  let files: string[];
  try {
    files = (await readdir(RAW_DIR)).filter((f) =>
      /\.(jpg|jpeg|png|webp|avif|tiff)$/i.test(f)
    );
  } catch {
    console.error(`❌ 无法读取目录: ${RAW_DIR}`);
    console.error('请将原始图片放入 assets/raw-athlete-images/ 目录');
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('⚠️  assets/raw-athlete-images/ 中没有找到图片文件');
    console.log('支持格式: jpg, jpeg, png, webp, avif, tiff');
    return;
  }

  console.log(`📸 找到 ${files.length} 张图片，开始优化...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const inputPath = join(RAW_DIR, file);
    const { name } = parse(file);
    const outputPath = join(OUT_DIR, `${name}.webp`);

    const originalSize = (await stat(inputPath)).size;
    totalOriginal += originalSize;

    try {
      const info = await sharp(inputPath)
        .resize(MAX_WIDTH, undefined, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const optimizedSize = info.size;
      totalOptimized += optimizedSize;

      const ratio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      const origKB = (originalSize / 1024).toFixed(0);
      const optKB = (optimizedSize / 1024).toFixed(0);

      console.log(
        `  ✓ ${file} → ${name}.webp  (${origKB}KB → ${optKB}KB, -${ratio}%)`
      );
    } catch (err) {
      console.error(`  ✗ ${file}: 处理失败 - ${err}`);
    }
  }

  console.log('\n📊 汇总：');
  console.log(`  原始总大小: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  优化后总大小: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `  节省: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`
  );
  console.log(`\n✅ 输出目录: ${OUT_DIR}`);
}

main().catch(console.error);
