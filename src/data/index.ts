/**
 * 钻石田径图鉴 — 统一数据出口
 *
 * 所有页面和组件必须从这个文件导入数据、类型和工具函数。
 * 禁止直接 import 零散数据文件或 domain 模块。
 */

// ── 原始数据 ──
import {
  athletes as manualAthletes,
  getAllCountries,
  getAllEvents,
  getAthleteById,
  getAthletesByCountry,
  getAthletesByEvent,
  getAthletesByGender,
  getSimilarAthletes,
  searchAthletes,
} from './manual/athletes.manual';
import {
  getEventById,
  getEventsByCategory,
  trackEvents,
} from './manual/events.manual';
import {
  competitionResults as generatedResults,
  getLatestResultDate,
  getLatestResults,
} from './generated/competitionResults.generated';
import { dataMeta, getFreshnessStatus } from './generated/dataMeta.generated';

// ── 工具函数 ──
export {
  getResultsByAthleteId,
  getResultsByAthleteName,
  getLatestResultByAthleteId,
  getLatestResultsByAthleteId,
  getResultsByCompetition,
  getResultsByEvent,
  getAthleteDisplayLatestResult,
  getResultsForAthlete,
  groupResultsByCompetition,
  getVerifiedResults,
  getPendingResults,
  getTaggedResultsByAthleteId,
  sortResultsByDateDesc,
  getResultsFreshnessStatus,
} from '../domain/athletics/resultUtils';

// ── 类型 ──
export type {
  Athlete,
  AthleteImage,
  CompetitionResult,
  DataMeta,
  EventCategory,
  Gender,
  ImageUsageStatus,
  MarkUnit,
  PersonalBest,
  ResultSource,
  ResultSourceType,
  SeasonBest,
  StyleProfile,
  StyleProfileKey,
  TrackEvent,
  VerificationStatus,
} from '../domain/athletics/types';

// ── 常量 ──
export {
  STYLE_LABELS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
  EVENT_CATEGORY_TAG_CLASS,
} from '../domain/athletics/constants';

// ── 校验 ──
export { validateCompetitionResult, validateCompetitionResults, validateDataMeta } from '../domain/athletics/validation';
export type { ValidationError } from '../domain/athletics/validation';

// ── 数据导出 ──
export const athletes = manualAthletes;
export const competitionResults = generatedResults;

export {
  dataMeta,
  getAllCountries,
  getAllEvents,
  getAthleteById,
  getAthletesByCountry,
  getAthletesByEvent,
  getAthletesByGender,
  getEventById,
  getEventsByCategory,
  getFreshnessStatus,
  getLatestResultDate,
  getLatestResults,
  getSimilarAthletes,
  searchAthletes,
  trackEvents,
};
