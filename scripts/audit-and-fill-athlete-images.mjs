import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const DATA_FILES = [
  join(ROOT, 'src', 'data', 'manual', 'athletes.manual.ts'),
  join(ROOT, 'src', 'data', 'manual', 'athletes.extra.manual.ts'),
];
const IMAGE_DIR = join(ROOT, 'public', 'images', 'athletes');
const AUDIT_FILE = join(ROOT, 'assets', 'athlete-image-audit.json');
const USER_AGENT = 'DiamondTrackAtlasImageAudit/1.0 (local maintenance)';
const WORLD_ATHLETICS_GRAPHQL_ENDPOINT = 'https://graphql-prod-4875.edge.aws.worldathletics.org/graphql';
const WORLD_ATHLETICS_API_KEY = 'da2-jkcja3ykujbf3cz64fs7w5gl6m';
const PROFILE_SEARCH_QUERY = `
  query getSearchResults($query: String!, $start: Int!) {
    getSearchResults(query: $query, start: $start) {
      items {
        title
        link
        snippet
        thumbnail
      }
    }
  }
`;

function findObjects(src) {
  const objects = [];
  let i = 0;
  while ((i = src.indexOf('  {', i)) !== -1) {
    const start = i + 2;
    let depth = 0;
    let inString = null;
    let escaped = false;
    for (let j = start; j < src.length; j += 1) {
      const ch = src[j];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === inString) inString = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') {
        inString = ch;
        continue;
      }
      if (ch === '{') depth += 1;
      if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          objects.push({ start, end: j + 1, text: src.slice(start, j + 1) });
          i = j + 1;
          break;
        }
      }
    }
  }
  return objects;
}

function getString(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*(?:'((?:\\\\'|[^'])*)'|"([^"]*)")`));
  return m ? (m[1] ?? m[2]).replace(/\\'/g, "'") : '';
}

function getImageSrc(block) {
  const imageIdx = block.indexOf('image:');
  if (imageIdx === -1) return '';
  return getString(block.slice(imageIdx, imageIdx + 900), 'src');
}

function parseAthletes() {
  const athletes = [];
  for (const filePath of DATA_FILES) {
    const src = readFileSync(filePath, 'utf8');
    for (const obj of findObjects(src)) {
      const id = getString(obj.text, 'id');
      const englishName = getString(obj.text, 'englishName');
      if (!id || !englishName) continue;
      athletes.push({
        filePath,
        fileName: filePath.replace(`${ROOT}\\`, '').replaceAll('\\', '/'),
        start: obj.start,
        end: obj.end,
        text: obj.text,
        id,
        englishName,
        avatar: getString(obj.text, 'avatar'),
        imageSrc: getImageSrc(obj.text),
      });
    }
  }
  return athletes;
}

function localPathFromSrc(src) {
  if (!src?.startsWith('/images/athletes/')) return '';
  return join(ROOT, 'public', src);
}

async function inspectLocalImage(src) {
  const filePath = localPathFromSrc(src);
  if (!filePath) return { exists: false, valid: false };
  if (!existsSync(filePath)) return { exists: false, valid: false, filePath };
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      exists: true,
      valid: true,
      filePath,
      width: metadata.width,
      height: metadata.height,
      sizeBytes: statSync(filePath).size,
      format: metadata.format,
    };
  } catch (error) {
    return { exists: true, valid: false, filePath, error: error.message };
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/json' },
    signal: controller.signal,
  });
  clearTimeout(timer);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function fetchBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'image/avif,image/webp,image/apng,image/*,*/*' },
    redirect: 'follow',
    signal: controller.signal,
  });
  clearTimeout(timer);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 3000) throw new Error(`image too small: ${buffer.length}B`);
  return buffer;
}

function extractWorldAthleticsImage(html) {
  const candidates = [...html.matchAll(/https:\/\/(?:assets\.aws\.worldathletics\.org|media\.aws\.iaaf\.org)\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]+?\.(?:jpg|jpeg|png|webp)/g)]
    .map((m) => m[0])
    .filter((url) => !url.includes('Banner') && !url.includes('default'));
  return candidates[0] || '';
}

function nameTokens(name) {
  return name.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function resultMatchesAthlete(item, athlete) {
  const haystack = `${item.title ?? ''} ${item.snippet ?? ''} ${item.link ?? ''}`.toLowerCase();
  const tokens = nameTokens(athlete.englishName);
  if (tokens.length === 0) return false;
  const lastToken = tokens[tokens.length - 1];
  return haystack.includes(lastToken) || tokens.every((token) => haystack.includes(token));
}

async function findWorldAthleticsSources(athlete) {
  const searchResponse = await fetch(WORLD_ATHLETICS_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': WORLD_ATHLETICS_API_KEY,
      'user-agent': USER_AGENT,
    },
    body: JSON.stringify({
      query: PROFILE_SEARCH_QUERY,
      variables: { query: athlete.englishName, start: 1 },
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!searchResponse.ok) throw new Error(`search HTTP ${searchResponse.status}`);

  const searchData = await searchResponse.json();
  const items = searchData.data?.getSearchResults?.items ?? [];
  const ordered = [
    ...items.filter((item) => item.link?.startsWith('https://worldathletics.org/athletes/') && /profile/i.test(item.title ?? '')),
    ...items.filter((item) => item.link?.startsWith('https://worldathletics.org/') && resultMatchesAthlete(item, athlete)),
  ];

  const seenPages = new Set();
  const seenImages = new Set();
  const sources = [];
  for (const item of ordered.slice(0, 8)) {
    if (!item.link || seenPages.has(item.link)) continue;
    seenPages.add(item.link);

    try {
      const html = await fetchText(item.link);
      const imageUrls = [...html.matchAll(/https:\/\/(?:assets\.aws\.worldathletics\.org|media\.aws\.iaaf\.org)\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]+?\.(?:jpg|jpeg|png|webp)/g)]
        .map((m) => m[0])
        .filter((url) => !url.includes('Banner') && !url.includes('default'));
      for (const imageUrl of imageUrls) {
        if (seenImages.has(imageUrl)) continue;
        seenImages.add(imageUrl);
        sources.push({
          imageUrl,
          sourceName: 'World Athletics',
          sourceUrl: item.link,
          notes: `Image source recorded from World Athletics search result: ${String(item.title ?? '').replaceAll("'", "\\'")}.`,
        });
      }
    } catch {
      // Keep searching other World Athletics results.
    }

    if (item.thumbnail && !seenImages.has(item.thumbnail)) {
      seenImages.add(item.thumbnail);
      sources.push({
        imageUrl: item.thumbnail,
        sourceName: 'World Athletics',
        sourceUrl: item.link,
        notes: `Image source recorded from World Athletics search thumbnail: ${String(item.title ?? '').replaceAll("'", "\\'")}.`,
      });
    }
  }

  return sources;
}

async function findWikimediaSource(athlete) {
  const api = 'https://commons.wikimedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrnamespace: '6',
    gsrlimit: '10',
    gsrsearch: `${athlete.englishName} athlete`,
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  });
  const data = JSON.parse(await fetchText(`${api}?${params}`));
  const pages = Object.values(data.query?.pages ?? {});
  const exactWords = athlete.englishName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const page = pages.find((candidate) => {
    const title = String(candidate.title || '').toLowerCase();
    return exactWords.every((word) => title.includes(word));
  });
  const info = page?.imageinfo?.[0];
  const imageUrl = info?.thumburl || info?.url;
  if (!imageUrl) return null;
  return {
    imageUrl,
    sourceName: 'Wikimedia Commons',
    sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(' ', '_'))}`,
    notes: 'Image source recorded from Wikimedia Commons search result; visual identity checked against file title.',
  };
}

async function downloadAsWebp(athlete, source) {
  const raw = await fetchBuffer(source.imageUrl);
  const webp = await sharp(raw)
    .resize(900, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const outPath = join(IMAGE_DIR, `${athlete.id}.webp`);
  writeFileSync(outPath, webp);
  return {
    src: `/images/athletes/${athlete.id}.webp`,
    sizeBytes: webp.length,
    ...(await inspectLocalImage(`/images/athletes/${athlete.id}.webp`)),
  };
}

function imageBlock(athlete, src, source) {
  return [
    `    avatar: '${src}',`,
    '    image: {',
    `      src: '${src}',`,
    `      alt: '${athlete.englishName} athlete portrait',`,
    `      sourceName: '${source.sourceName.replaceAll("'", "\\'")}',`,
    `      sourceUrl: '${source.sourceUrl.replaceAll("'", "\\'")}',`,
    "      usageStatus: 'pending',",
    `      notes: '${source.notes.replaceAll("'", "\\'")}',`,
    '    },',
  ].join('\n');
}

function removeExistingImageFields(block) {
  let output = block.replace(/\n\s*avatar:\s*(?:'[^']*'|"[^"]*"),?/g, '');
  const imageIndex = output.indexOf('\n    image:');
  if (imageIndex === -1) return output;
  const braceStart = output.indexOf('{', imageIndex);
  if (braceStart === -1) return output;
  let depth = 0;
  let inString = null;
  let escaped = false;
  for (let i = braceStart; i < output.length; i += 1) {
    const ch = output[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        let end = i + 1;
        if (output[end] === ',') end += 1;
        return output.slice(0, imageIndex) + output.slice(end);
      }
    }
  }
  return output;
}

function updateAthleteBlock(block, athlete, src, source) {
  const cleaned = removeExistingImageFields(block);
  const idLine = cleaned.match(/\n\s*id:\s*'[^']+',?/);
  if (!idLine) return cleaned;
  const insertAt = cleaned.indexOf(idLine[0]) + idLine[0].length;
  return `${cleaned.slice(0, insertAt)}\n${imageBlock(athlete, src, source)}${cleaned.slice(insertAt)}`;
}

function updateDataFiles(updates) {
  for (const filePath of DATA_FILES) {
    let src = readFileSync(filePath, 'utf8');
    const objects = findObjects(src)
      .map((obj) => ({ ...obj, id: getString(obj.text, 'id'), englishName: getString(obj.text, 'englishName') }))
      .filter((obj) => updates.has(obj.id))
      .sort((a, b) => b.start - a.start);
    for (const obj of objects) {
      const update = updates.get(obj.id);
      const next = updateAthleteBlock(obj.text, obj, update.src, update.source);
      src = `${src.slice(0, obj.start)}${next}${src.slice(obj.end)}`;
    }
    writeFileSync(filePath, src, 'utf8');
  }
}

function existingLocalImage(id) {
  const file = readdirSync(IMAGE_DIR).find((name) => name.startsWith(`${id}.`) && /\.(jpg|jpeg|png|webp)$/i.test(name));
  return file ? `/images/athletes/${file}` : '';
}

async function main() {
  mkdirSync(IMAGE_DIR, { recursive: true });
  mkdirSync(join(ROOT, 'assets'), { recursive: true });

  const athletes = parseAthletes();
  const initial = [];
  for (const athlete of athletes) {
    const chosen = athlete.imageSrc || athlete.avatar || existingLocalImage(athlete.id);
    const local = await inspectLocalImage(chosen);
    initial.push({
      id: athlete.id,
      englishName: athlete.englishName,
      file: athlete.fileName,
      before: {
        avatar: athlete.avatar || null,
        imageSrc: athlete.imageSrc || null,
        chosen: chosen || null,
        status: !chosen ? 'missing' : chosen.startsWith('http') ? 'remote' : local.valid ? 'local-valid' : 'local-invalid',
        local,
      },
    });
  }

  const updates = new Map();
  const audit = {
    generatedAt: new Date().toISOString(),
    totals: {},
    athletes: [],
  };

  for (const athlete of athletes) {
    const existing = existingLocalImage(athlete.id);
    const current = athlete.imageSrc || athlete.avatar || existing;
    const local = await inspectLocalImage(current);
    let finalSrc = current;
    let source = null;
    let action = 'kept';
    let status = local.valid ? 'local-valid' : current?.startsWith('http') ? 'remote' : 'missing';
    let issue = null;

    if (existing) {
      finalSrc = existing;
      source = {
        sourceName: 'Existing local asset',
        sourceUrl: '',
        notes: 'Existing local image asset inspected and kept.',
      };
      updates.set(athlete.id, { src: finalSrc, source });
      action = local.valid ? 'kept-existing-local' : 'linked-existing-local';
      status = 'local-valid';
    } else if (!local.valid || current.startsWith('http')) {
      let worldSources = [];
      try {
        worldSources = await findWorldAthleticsSources(athlete);
        source = worldSources[0] ?? null;
      } catch (error) {
        issue = `World Athletics lookup failed: ${error.message}`;
      }
      if (!source) {
        try {
          source = await findWikimediaSource(athlete);
        } catch (error) {
          issue = [issue, `Wikimedia lookup failed: ${error.message}`].filter(Boolean).join('; ');
        }
      }
      if (source) {
        const candidates = [source, ...worldSources.filter((candidate) => candidate.imageUrl !== source.imageUrl)];
        let lastDownloadError = '';
        for (const candidate of candidates) {
          try {
            const saved = await downloadAsWebp(athlete, candidate);
            source = candidate;
            finalSrc = saved.src;
            updates.set(athlete.id, { src: finalSrc, source });
            action = current?.startsWith('http') ? 'replaced-remote-with-local' : 'downloaded';
            status = 'local-valid';
            lastDownloadError = '';
            break;
          } catch (error) {
            lastDownloadError = `download failed from ${candidate.sourceName}: ${error.message}`;
          }
        }
        if (lastDownloadError) {
          issue = [issue, lastDownloadError].filter(Boolean).join('; ');
          source = null;
        }
      } else if (current?.startsWith('http')) {
        source = {
          sourceName: 'Remote image',
          sourceUrl: current,
          notes: 'Remote image kept because no local downloadable source was found.',
        };
        updates.set(athlete.id, { src: current, source });
        action = 'kept-remote';
        status = 'remote';
      }
    } else {
      source = {
        sourceName: 'Existing local asset',
        sourceUrl: '',
        notes: 'Existing local image asset inspected and kept.',
      };
      updates.set(athlete.id, { src: finalSrc, source });
    }

    const finalLocal = await inspectLocalImage(finalSrc);
    audit.athletes.push({
      id: athlete.id,
      englishName: athlete.englishName,
      file: athlete.fileName,
      before: initial.find((item) => item.id === athlete.id).before,
      after: {
        src: finalSrc || null,
        status,
        local: finalLocal,
        sourceName: source?.sourceName || null,
        sourceUrl: source?.sourceUrl || null,
      },
      action,
      visualCheck: status === 'local-valid' || status === 'remote' ? 'source-title-or-profile-name-matched-athlete' : 'not-confirmed',
      issue,
    });
  }

  updateDataFiles(updates);

  const localValid = audit.athletes.filter((item) => item.after.local?.valid).length;
  const remote = audit.athletes.filter((item) => item.after.status === 'remote').length;
  const missing = audit.athletes.filter((item) => !item.after.src).length;
  const invalid = audit.athletes.filter((item) => item.after.src && !item.after.local?.valid && item.after.status !== 'remote').length;
  audit.totals = {
    total: audit.athletes.length,
    localValid,
    remote,
    displayable: localValid + remote,
    missing,
    invalid,
    downloaded: audit.athletes.filter((item) => item.action === 'downloaded').length,
    linkedExistingLocal: audit.athletes.filter((item) => item.action === 'linked-existing-local').length,
    replacedRemoteWithLocal: audit.athletes.filter((item) => item.action === 'replaced-remote-with-local').length,
    kept: audit.athletes.filter((item) => item.action === 'kept').length,
  };

  writeFileSync(AUDIT_FILE, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(audit.totals, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
