import type { EventCategory, StyleProfileKey } from './types';

// Re-export ALL types so consumers can import everything from one place
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
} from './types';

export const STYLE_LABELS: Record<StyleProfileKey, string> = {
  speed: '速度',
  endurance: '耐力',
  power: '爆发力',
  technique: '技术',
  consistency: '稳定性',
  mentality: '心理素质',
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  sprints: '短跑',
  'middle-distance': '中长跑',
  'long-distance': '长跑',
  hurdles: '跨栏',
  jumps: '跳跃',
  throws: '投掷',
  combined: '全能',
  other: '其他',
};

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  sprints: 'bg-track-sprint/20 text-track-sprint border-track-sprint/30',
  'middle-distance': 'bg-track-distance/20 text-track-distance border-track-distance/30',
  'long-distance': 'bg-track-distance/20 text-track-distance border-track-distance/30',
  hurdles: 'bg-track-hurdle/20 text-track-hurdle border-track-hurdle/30',
  jumps: 'bg-track-jump/20 text-track-jump border-track-jump/30',
  throws: 'bg-track-throw/20 text-track-throw border-track-throw/30',
  combined: 'bg-white/10 text-slate-300 border-white/20',
  other: 'bg-white/5 text-slate-400 border-white/10',
};

export const EVENT_CATEGORY_TAG_CLASS: Record<EventCategory, string> = {
  sprints: 'event-tag-sprint',
  'middle-distance': 'event-tag-distance',
  'long-distance': 'event-tag-distance',
  hurdles: 'event-tag-hurdle',
  jumps: 'event-tag-jump',
  throws: 'event-tag-throw',
  combined: 'event-tag-sprint',
  other: 'event-tag-sprint',
};
