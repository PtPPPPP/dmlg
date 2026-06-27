import { memo } from 'react';
import { EVENT_CATEGORY_TAG_CLASS } from '../../data';
import type { Athlete, EventCategory } from '../../data';
import AthleteImage from './AthleteImage';

interface AthleteProfileHeaderProps {
  athlete: Athlete;
  category: EventCategory;
  eventCategoryLabel: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function AthleteProfileHeader({
  athlete,
  category,
  eventCategoryLabel,
  isFavorite,
  onToggleFavorite,
}: AthleteProfileHeaderProps) {
  const genderLabel = athlete.gender === 'male' ? '男' : '女';

  return (
    <div className="flex-1">
      {/* Hero 大图 */}
      <div className="mb-6">
        <AthleteImage athlete={athlete} variant="hero" showCredit />
      </div>

      {/* 头像 + 基本信息 */}
      <div className="mb-6 flex items-start gap-5">
        <AthleteImage athlete={athlete} variant="avatar" className="h-20 w-20 flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
            {athlete.name}
          </h1>
          <p className="mt-1 text-slate-400">
            {athlete.englishName} · {athlete.country} · {genderLabel}
          </p>
          {athlete.birthYear && (
            <p className="mt-0.5 text-sm text-slate-500">
              出生年份：{athlete.birthYear}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={EVENT_CATEGORY_TAG_CLASS[category]}>
              {eventCategoryLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              主项：{athlete.mainEvent}
            </span>
            {athlete.events
              .filter((event) => event !== athlete.mainEvent)
              .map((event) => (
                <span
                  key={event}
                  className="inline-flex items-center rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-500"
                >
                  副项：{event}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {athlete.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 收藏按钮 */}
      <button
        onClick={() => onToggleFavorite(athlete.id)}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
          isFavorite
            ? 'border border-track-gold/30 bg-track-gold/15 text-track-gold'
            : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
        }`}
      >
        <svg
          className="h-5 w-5"
          fill={isFavorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        {isFavorite ? '已收藏' : '加入收藏'}
      </button>
    </div>
  );
}

export default memo(AthleteProfileHeader);
