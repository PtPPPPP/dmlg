import { Link } from 'react-router-dom';
import {
  competitionResults,
  getLatestResultsByAthleteId,
  getTaggedResultsByAthleteId,
  STYLE_LABELS,
} from '../../data';
import type { Athlete, StyleProfileKey } from '../../data';
import RadarChart from '../ui/RadarChart';
import { SourceLink } from '../data/SourceLink';
import { VerificationBadge } from '../data/VerificationBadge';
import { EmptyState } from '../ui/EmptyState';
import AthleteImage from '../athletes/AthleteImage';

interface ComparePanelProps {
  athlete1: Athlete;
  athlete2: Athlete;
}

function StyleBar({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: number;
  value2: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
      </div>
      <div className="flex gap-1">
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${value1}%` }}
          />
        </div>
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-track-gold transition-all duration-500"
            style={{ width: `${value2}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-brand-400 font-medium">{value1}</span>
        <span className="text-track-gold font-medium">{value2}</span>
      </div>
    </div>
  );
}

const STYLE_KEYS: StyleProfileKey[] = [
  'speed',
  'endurance',
  'power',
  'technique',
  'consistency',
  'mentality',
];

function RecentResultsSection({ athlete }: { athlete: Athlete }) {
  const results = getLatestResultsByAthleteId(competitionResults, athlete.id, 3);
  if (results.length === 0) {
    return (
      <div className="mb-4 rounded-lg border border-white/5 bg-white/5 px-3 py-4">
        <EmptyState
          icon="📭"
          title="暂无最近比赛"
          description="数据同步或手动导入后会在这里显示"
          className="py-6"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-500 mb-2">最近比赛</p>
      <div className="space-y-2">
        {results.map((r) => (
          <div key={r.id} className="rounded-lg bg-white/5 px-3 py-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300 truncate max-w-[60%]">{r.competitionName}</span>
              <span className="text-sm font-bold text-white">{r.mark}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">{r.date}</span>
              <VerificationBadge verified={r.source.verified} />
            </div>
            <SourceLink
              sourceName={r.source.sourceName}
              sourceUrl={r.source.sourceUrl}
              updatedAt={r.source.updatedAt}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TaggedResultSection({ athlete, tag }: { athlete: Athlete; tag: 'PB' | 'SB' }) {
  const results = getTaggedResultsByAthleteId(competitionResults, athlete, tag).slice(0, 2);

  if (results.length === 0) {
    return (
      <div className="rounded-lg bg-white/5 px-4 py-2.5 text-sm text-slate-500">
        暂无 {tag} 数据
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <div
          key={`${tag}-${result.id}`}
          className="rounded-lg bg-white/5 px-4 py-2.5"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="text-sm text-slate-400">{tag} · {result.event}</span>
            <span className="text-lg font-bold text-white">{result.mark}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">{result.date}</span>
            <VerificationBadge verified={result.source.verified} />
          </div>
          <SourceLink
            sourceName={result.source.sourceName}
            sourceUrl={result.source.sourceUrl}
            updatedAt={result.source.updatedAt}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
}

export default function ComparePanel({ athlete1, athlete2 }: ComparePanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <AthleteImage
            athlete={athlete1}
            variant="compare"
            className="h-14 w-14 flex-shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{athlete1.name}</h2>
            <p className="text-sm text-slate-400">
              {athlete1.country} · {athlete1.mainEvent}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <TaggedResultSection athlete={athlete1} tag="PB" />
          <TaggedResultSection athlete={athlete1} tag="SB" />
        </div>

        <RecentResultsSection athlete={athlete1} />

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">优势特点</p>
          <div className="flex flex-wrap gap-1.5">
            {athlete1.strengths.map((s) => (
              <span
                key={s}
                className="rounded-md bg-brand-500/10 px-2.5 py-1 text-xs text-brand-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/athletes/${athlete1.id}`}
          className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          → 查看完整资料
        </Link>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <AthleteImage
            athlete={athlete2}
            variant="compare"
            className="h-14 w-14 flex-shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{athlete2.name}</h2>
            <p className="text-sm text-slate-400">
              {athlete2.country} · {athlete2.mainEvent}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <TaggedResultSection athlete={athlete2} tag="PB" />
          <TaggedResultSection athlete={athlete2} tag="SB" />
        </div>

        <RecentResultsSection athlete={athlete2} />

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">优势特点</p>
          <div className="flex flex-wrap gap-1.5">
            {athlete2.strengths.map((s) => (
              <span
                key={s}
                className="rounded-md bg-track-gold/10 px-2.5 py-1 text-xs text-track-gold"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/athletes/${athlete2.id}`}
          className="text-sm text-track-gold hover:text-yellow-300 transition-colors"
        >
          → 查看完整资料
        </Link>
      </div>

      <div className="lg:col-span-2 glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6 text-center">
          风格雷达图对比
        </h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="text-center">
            <RadarChart profile={athlete1.styleProfile} size={200} />
            <p className="text-sm font-medium text-brand-400 mt-2">
              {athlete1.name}
            </p>
          </div>
          <div className="text-center">
            <RadarChart profile={athlete2.styleProfile} size={200} />
            <p className="text-sm font-medium text-track-gold mt-2">
              {athlete2.name}
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-lg mx-auto space-y-3">
          <p className="text-sm font-semibold text-slate-400 text-center mb-3">
            技术特点数值对比
          </p>
          {STYLE_KEYS.map((key) => (
            <StyleBar
              key={key}
              label={STYLE_LABELS[key]}
              value1={athlete1.styleProfile[key]}
              value2={athlete2.styleProfile[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
