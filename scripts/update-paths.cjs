// scripts/update-paths.cjs
// 将已下载的图片路径更新到数据文件
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'athletes');
const files = [
  path.join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  path.join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];

const dlFiles = fs.readdirSync(OUT).filter(f => f.endsWith('.webp')).map(f => f.replace('.webp', ''));
console.log('Downloaded images:', dlFiles.length);

let totalUp = 0;
for (const dfp of files) {
  let c = fs.readFileSync(dfp, 'utf-8');
  let up = 0;

  for (const id of dlFiles) {
    const escapedId = id.replace(/[-]/g, '[-]');
    const avatarRe = new RegExp('(\\s*avatar:\\s*)' + escapedId + "'[^']*'", 'g');
    const srcRe = new RegExp('(\\s*src:\\s*)' + escapedId + "'[^']*'", 'g');
    const newRef = `'/images/athletes/${id}.webp'`;

    if (avatarRe.test(c)) {
      c = c.replace(avatarRe, '$1' + newRef + "'");
      up++;
    }
    if (srcRe.test(c)) {
      c = c.replace(srcRe, '$1' + newRef + "'");
      up++;
    }
  }

  if (up > 0) {
    fs.writeFileSync(dfp, c, 'utf-8');
    console.log(path.basename(dfp) + ': updated ' + up + ' refs');
    totalUp += up;
  } else {
    console.log(path.basename(dfp) + ': skipped');
  }
}

console.log('Total updates:', totalUp);
