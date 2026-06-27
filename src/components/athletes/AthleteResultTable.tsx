import type { CompetitionResult } from '../../data';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { SourceLink } from '../data/SourceLink';
import { VerificationBadge } from '../data/VerificationBadge';

interface AthleteResultTableProps {
  results: CompetitionResult[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyClassName?: string;
}

export default function AthleteResultTable({
  results,
  emptyTitle = '暂无比赛记录',
  emptyDescription = '数据同步或手动导入后会在这里显示。',
  emptyClassName,
}: AthleteResultTableProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title={emptyTitle}
        description={emptyDescription}
        className={emptyClassName}
      />
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <article
          key={result.id}
          className="rounded-lg border border-white/5 bg-white/5 px-4 py-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {result.competitionName}
                </h3>
                {result.competitionGroup && (
                  <Badge label={result.competitionGroup} variant="default" />
                )}
                <VerificationBadge verified={result.source.verified} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{result.date}</span>
                {result.venue && <span>· {result.venue}</span>}
                {result.city && <span>· {result.city}</span>}
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-lg font-bold text-white">{result.mark}</div>
              <div className="text-xs text-slate-400">{result.event}</div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {result.place != null && (
              <Badge label={`#${result.place}`} variant="default" />
            )}
            {result.round && (
              <span className="text-xs text-slate-500">{result.round}</span>
            )}
            {result.wind && (
              <span className="text-xs text-slate-500">风速 {result.wind}</span>
            )}
            {result.recordTags?.map((tag) => (
              <Badge key={`${result.id}-${tag}`} label={tag} variant="gold" />
            ))}
          </div>

          <SourceLink
            sourceName={result.source.sourceName}
            sourceUrl={result.source.sourceUrl}
            updatedAt={result.source.updatedAt}
            className="mt-2"
          />
        </article>
      ))}
    </div>
  );
}
