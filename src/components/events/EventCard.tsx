import { memo } from 'react';
import { Link } from 'react-router-dom';
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_TAG_CLASS } from '../../data';
import type { TrackEvent } from '../../data';

interface EventCardProps {
  event: TrackEvent;
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="glass-card-hover group overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{event.name}</h3>
            <p className="text-xs text-slate-500">{event.englishName}</p>
          </div>
          <span className={EVENT_CATEGORY_TAG_CLASS[event.category]}>
            {EVENT_CATEGORY_LABELS[event.category]}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            关键技术
          </p>
          <div className="space-y-1.5">
            {event.keyTechniques.slice(0, 3).map((tech, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                <span className="text-xs text-slate-400">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            观赛重点
          </p>
          <ul className="space-y-1">
            {event.watchingPoints.slice(0, 2).map((point, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="mt-0.5 text-track-gold">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {event.commonTerms.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              常见术语
            </p>
            <div className="flex flex-wrap gap-1.5">
              {event.commonTerms.slice(0, 3).map((t) => (
                <span
                  key={t.term}
                  className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400 border border-white/5"
                  title={t.explanation}
                >
                  {t.term}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.representativeAthleteIds.length > 0 && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs text-slate-500 mb-2">代表运动员</p>
            <div className="flex flex-wrap gap-1.5">
              {event.representativeAthleteIds.slice(0, 3).map((id) => (
                <Link
                  key={id}
                  to={`/athletes/${id}`}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  → 查看
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(EventCard);
