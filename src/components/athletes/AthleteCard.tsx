import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  competitionResults,
  getEventById,
  getAthleteDisplayLatestResult,
  getTaggedResultsByAthleteId,
  EVENT_CATEGORY_TAG_CLASS,
} from '../../data';
import type { Athlete, EventCategory } from '../../data';
import { SourceLink } from '../data/SourceLink';
import { VerificationBadge } from '../data/VerificationBadge';
import AthleteImage from './AthleteImage';

interface AthleteCardProps {
  athlete: Athlete;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function getCategoryFromAthlete(athlete: Athlete): EventCategory {
  const event = getEventById(athlete.mainEvent);
  if (event) return event.category;
  return 'sprints';
}

const GENDER_LABEL = { male: '♂', female: '♀' } as const;

function AthleteCard({ athlete, isFavorite, onToggleFavorite }: AthleteCardProps) {
  const category = getCategoryFromAthlete(athlete);
  const topPB = useMemo(
    () => getTaggedResultsByAthleteId(competitionResults, athlete, 'PB')[0],
    [athlete.id]
  );
  const displayResult = useMemo(
    () => getAthleteDisplayLatestResult(athlete, competitionResults),
    [athlete.id]
  );

  return (
    <div className="glass-card-hover group relative overflow-hidden">
      {/* ── 顶部照片区域 ── */}
      <div className="relative">
        <AthleteImage athlete={athlete} variant="card" />

        {/* 图片上的叠加信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-end justify-between">
            <div className="min-w-0">
              <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg truncate">
                {athlete.name}
              </h3>
              <p className="text-xs text-white/70 mt-0.5 drop-shadow">
                {athlete.country} · {GENDER_LABEL[athlete.gender]} · {athlete.englishName}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(athlete.id);
              }}
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/20 backdrop-blur-sm"
              aria-label={isFavorite ? '取消收藏' : '加入收藏'}
            >
              <svg
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? 'text-track-gold fill-track-gold drop-shadow' : 'text-white/60'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                fill={isFavorite ? 'currentColor' : 'none'}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── 信息区域 ── */}
      <div className="p-5">
        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={EVENT_CATEGORY_TAG_CLASS[category]}>
            {athlete.mainEvent}
          </span>
          {athlete.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* PB */}
        {topPB && (
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-slate-500">PB · {topPB.event}</div>
              <VerificationBadge verified={topPB.source.verified} />
            </div>
            <div className="text-lg font-bold text-white">{topPB.mark}</div>
            <SourceLink
              sourceName={topPB.source.sourceName}
              sourceUrl={topPB.source.sourceUrl}
              updatedAt={topPB.source.updatedAt}
            />
          </div>
        )}

        {/* 技术特点 */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-1.5">技术特点</p>
          <div className="flex flex-wrap gap-1">
            {athlete.strengths.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-brand-500/10 px-2 py-0.5 text-xs text-brand-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 最近比赛 */}
        {displayResult && (
          <div className="mb-4 rounded-lg bg-white/5 px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">最近比赛</span>
              <span className="text-xs text-slate-600">{displayResult.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{displayResult.mark}</span>
              <span className="text-xs text-slate-400">{displayResult.event}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs text-slate-500 truncate">{displayResult.competitionName}</span>
              <VerificationBadge verified={displayResult.source.verified} />
            </div>
            <SourceLink
              sourceName={displayResult.source.sourceName}
              sourceUrl={displayResult.source.sourceUrl}
              updatedAt={displayResult.source.updatedAt}
              className="mt-1"
            />
          </div>
        )}

        {!displayResult && (
          <div className="mb-4 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs text-slate-500">
            暂无最近比赛记录
          </div>
        )}

        {/* 详情链接 */}
        <Link
          to={`/athletes/${athlete.id}`}
          className="flex items-center justify-center gap-1 rounded-lg bg-white/5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          查看详情
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default memo(AthleteCard);
