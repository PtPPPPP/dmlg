/**
 * 钻石田径图鉴 — 统一领域类型
 * 所有类型均由此文件定义，其他文件从这里 import。
 */

/* ── 基础枚举 ── */

export type Gender = 'male' | 'female';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type ResultSourceType = 'diamond-league' | 'world-athletics' | 'manual' | 'news' | 'unknown';

export type MarkUnit = 's' | 'm' | 'points' | 'time' | 'unknown';

export type EventCategory =
  | 'sprints'
  | 'middle-distance'
  | 'long-distance'
  | 'hurdles'
  | 'jumps'
  | 'throws'
  | 'combined'
  | 'other';

/* ── 运动员图片 ── */

export type ImageUsageStatus =
  | 'verified'
  | 'pending'
  | 'unavailable'
  | 'placeholder';

export interface AthleteImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
  sourceName?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  usageStatus: ImageUsageStatus;
  notes?: string;
}

/* ── 数据来源 ── */

export interface ResultSource {
  sourceName: string;
  sourceUrl: string;
  sourceType: ResultSourceType;
  updatedAt: string;
  verified: VerificationStatus;
  notes?: string;
}

/* ── 比赛结果 ── */

export interface CompetitionResult {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteEnglishName: string;
  country?: string;
  competitionName: string;
  competitionSlug: string;
  competitionGroup?: string;
  venue?: string;
  city?: string;
  countryCode?: string;
  date: string;
  event: string;
  eventCategory: EventCategory;
  round?: string;
  place?: number;
  mark: string;
  markValue?: number;
  markUnit?: MarkUnit;
  wind?: string;
  reactionTime?: string;
  points?: number;
  recordTags?: string[];
  source: ResultSource;
}

/* ── 运动员 ── */

export interface PersonalBest {
  event: string;
  result: string;
  date?: string;
  location?: string;
}

export interface SeasonBest {
  event: string;
  result: string;
  year: number;
}

export interface StyleProfile {
  speed: number;
  endurance: number;
  power: number;
  technique: number;
  consistency: number;
  mentality: number;
}

export type StyleProfileKey = keyof StyleProfile;

export interface Athlete {
  id: string;
  name: string;
  englishName: string;
  country: string;
  countryCode?: string;
  gender: Gender;
  birthYear?: number;
  events: string[];
  mainEvent: string;
  /** @deprecated 使用 image 字段代替 */
  avatar?: string;
  image?: AthleteImage;
  gallery?: AthleteImage[];
  tags: string[];
  personalBest: PersonalBest[];
  seasonBest?: SeasonBest[];
  diamondLeagueHighlights: string[];
  majorHonors: string[];
  styleProfile: StyleProfile;
  strengths: string[];
  weaknessOrRisks?: string[];
  story: string;
  watchingTips: string[];
  similarAthleteIds: string[];
  sources?: string[];
  notes?: string;
}

/* ── 田径项目 ── */

export interface TrackEvent {
  id: string;
  name: string;
  englishName: string;
  category: EventCategory;
  gender: 'male' | 'female' | 'both';
  description: string;
  keyTechniques: string[];
  watchingPoints: string[];
  commonTerms: { term: string; explanation: string }[];
  representativeAthleteIds: string[];
  diamondLeagueEvent: boolean;
}

/* ── 元数据 ── */

export interface DataMeta {
  lastManualUpdate: string;
  lastAutoSync?: string;
  latestCompletedMeet?: string;
  latestCompletedMeetDate?: string;
  nextMeet?: string;
  nextMeetDate?: string;
  dataPolicy: string;
  recommendedSources: { name: string; url: string }[];
}
