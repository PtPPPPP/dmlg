/**
 * 数据加载服务
 *
 * 从 server/data/ 目录加载 JSON 数据（由 scripts/export-data.ts 生成）
 * 后续可替换为数据库查询
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../../data');

// 数据缓存（启动时加载一次）
let _athletes: any[] | null = null;
let _results: any[] | null = null;
let _events: any[] | null = null;
let _dataMeta: any | null = null;

function loadJSON<T>(filename: string): T {
  try {
    const raw = readFileSync(resolve(DATA_DIR, filename), 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`⚠️ 数据文件 ${filename} 不存在，请先运行: npx tsx scripts/export-data.ts`);
    return (Array.isArray([]) ? [] : {}) as T;
  }
}

function getAthletes(): any[] {
  if (!_athletes) _athletes = loadJSON<any[]>('athletes.json');
  return _athletes;
}

function getResults(): any[] {
  if (!_results) _results = loadJSON<any[]>('results.json');
  return _results;
}

function getEvents(): any[] {
  if (!_events) _events = loadJSON<any[]>('events.json');
  return _events;
}

function getDataMeta(): any {
  if (!_dataMeta) _dataMeta = loadJSON<any>('meta.json');
  return _dataMeta;
}

// ── 查询函数 ──

function getAthleteById(id: string) {
  return getAthletes().find((a) => a.id === id);
}

function searchAthletes(query: string, filters?: { country?: string; gender?: string; event?: string }) {
  let result = getAthletes();

  if (query) {
    const q = query.toLowerCase();
    result = result.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.englishName.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    );
  }

  if (filters?.country) {
    result = result.filter((a) => a.country === filters.country);
  }

  if (filters?.gender) {
    result = result.filter((a) => a.gender === filters.gender);
  }

  if (filters?.event) {
    result = result.filter((a) => a.events.includes(filters.event));
  }

  return result;
}

function getResultsByAthleteId(athleteId: string) {
  return getResults()
    .filter((r) => r.athleteId === athleteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getResultsByEvent(event: string) {
  return getResults()
    .filter((r) => r.event === event)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getResultsByCompetition(competitionSlug: string) {
  return getResults()
    .filter((r) => r.competitionSlug === competitionSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getEventById(id: string) {
  return getEvents().find((e) => e.id === id);
}

function getEventsByCategory(category: string) {
  return getEvents().filter((e) => e.category === category);
}

function getAllCountries() {
  const countries = new Set(getAthletes().map((a) => a.country));
  return Array.from(countries).sort();
}

export const dataService = {
  getAthletes,
  getResults,
  getEvents,
  getDataMeta,
  getAthleteById,
  searchAthletes,
  getResultsByAthleteId,
  getResultsByEvent,
  getResultsByCompetition,
  getEventById,
  getEventsByCategory,
  getAllCountries,
};
