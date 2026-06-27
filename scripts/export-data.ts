/**
 * 将前端数据导出为 JSON 格式，供后端使用
 *
 * 运行: npx tsx scripts/export-data.ts
 */

import { athletes } from '../src/data/manual/athletes.manual.js';
import { trackEvents } from '../src/data/manual/events.manual.js';
import { competitionResults } from '../src/data/generated/competitionResults.generated.js';
import { dataMeta } from '../src/data/generated/dataMeta.generated.js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, '../server/data');

// 确保目录存在
import { mkdirSync } from 'fs';
mkdirSync(outputDir, { recursive: true });

writeFileSync(resolve(outputDir, 'athletes.json'), JSON.stringify(athletes, null, 2));
writeFileSync(resolve(outputDir, 'results.json'), JSON.stringify(competitionResults, null, 2));
writeFileSync(resolve(outputDir, 'events.json'), JSON.stringify(trackEvents, null, 2));
writeFileSync(resolve(outputDir, 'meta.json'), JSON.stringify(dataMeta, null, 2));

console.log('✅ 数据导出完成:');
console.log(`  - athletes: ${athletes.length} 条`);
console.log(`  - results: ${competitionResults.length} 条`);
console.log(`  - events: ${trackEvents.length} 条`);
console.log(`  - 输出目录: ${outputDir}`);
