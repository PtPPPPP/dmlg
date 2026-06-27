/**
 * 从 Wikimedia Commons 下载运动员照片
 *
 * 功能：
 * 1. 解析运动员数据文件，提取所有图片 URL
 * 2. 下载图片到 assets/raw-athlete-images/
 * 3. 记录下载成功/失败的运动员
 *
 * 使用方法：
 *   npx tsx scripts/download-athlete-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const RAW_DIR = join(ROOT, 'assets', 'raw-athlete-images');
const REPORT_FILE = join(ROOT, 'assets', 'download-report.json');

// 从数据文件中提取运动员 ID 和图片 URL 的简单解析
// 直接硬编码从源文件中提取的数据
interface AthleteImageInfo {
  id: string;
  name: string;
  imageUrl: string;
}

function extractImageUrls(): AthleteImageInfo[] {
  // 读取运动员数据文件
  const manualPath = join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts');
  const extraPath = join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts');

  const results: AthleteImageInfo[] = [];

  for (const filePath of [manualPath, extraPath]) {
    const content = require('fs').readFileSync(filePath, 'utf-8');

    // 匹配运动员数据块中的 id, name(englishName), image.src
    const blocks = content.split(/\n\s*\n/);
    for (const block of blocks) {
      const idMatch = block.match(/id:\s*'([^']+)'/);
      const nameMatch = block.match(/englishName:\s*'([^']+)'/);
      const srcMatch = block.match(/src:\s*'([^']+)'/);

      if (idMatch && nameMatch && srcMatch) {
        const url = srcMatch[1];
        if (url.includes('upload.wikimedia.org')) {
          results.push({
            id: idMatch[1],
            name: nameMatch[1],
            imageUrl: url,
          });
        }
      }
    }
  }

  return results;
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    // 使用 curl 下载
    execSync(
      `curl -sS -L -o "${outputPath}" --max-time 30 --connect-timeout 10 --retry 2 "${url}"`,
      { stdio: 'pipe' }
    );

    // 检查文件大小，太小的文件可能是错误页面
    const stats = require('fs').statSync(outputPath);
    if (stats.size < 1000) {
      // 可能不是有效图片
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('📸 运动员照片下载工具\n');

  if (!existsSync(RAW_DIR)) {
    mkdirSync(RAW_DIR, { recursive: true });
  }

  const athletes = extractImageUrls();
  console.log(`找到 ${athletes.length} 位有 Wikimedia 图片的运动员\n`);

  const report: { success: string[]; failed: { id: string; name: string; url: string; reason: string }[] } = {
    success: [],
    failed: [],
  };

  // 并发控制：每次下载 5 张
  const batchSize = 5;
  for (let i = 0; i < athletes.length; i += batchSize) {
    const batch = athletes.slice(i, i + batchSize);
    const promises = batch.map(async (athlete) => {
      const ext = athlete.imageUrl.includes('.png') ? '.png' : '.jpg';
      const outputPath = join(RAW_DIR, `${athlete.id}${ext}`);

      console.log(`  [${i + batch.indexOf(athlete) + 1}/${athletes.length}] 下载 ${athlete.name} ...`);

      const success = await downloadImage(athlete.imageUrl, outputPath);
      if (success) {
        report.success.push(athlete.id);
        console.log(`    ✅ ${athlete.id}${ext}`);
      } else {
        report.failed.push({
          id: athlete.id,
          name: athlete.name,
          url: athlete.imageUrl,
          reason: '下载失败或文件过小',
        });
        console.log(`    ❌ ${athlete.name} 下载失败`);
      }
    });

    await Promise.all(promises);
    // 批次间稍作等待，避免请求过快
    if (i + batchSize < athletes.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log('\n📊 下载报告：');
  console.log(`  成功: ${report.success.length}`);
  console.log(`  失败: ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.log('\n❌ 失败列表：');
    for (const f of report.failed) {
      console.log(`  - ${f.name} (${f.id}): ${f.reason}`);
    }
  }

  // 保存报告
  if (!existsSync(join(ROOT, 'assets'))) {
    mkdirSync(join(ROOT, 'assets'), { recursive: true });
  }
  writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`\n📁 报告已保存到: ${REPORT_FILE}`);
  console.log(`📁 图片保存在: ${RAW_DIR}`);
}

main().catch(console.error);
