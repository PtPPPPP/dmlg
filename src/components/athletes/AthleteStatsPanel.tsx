import { memo } from 'react';
import { getTaggedResultsByAthleteId } from '../../data';
import type { CompetitionResult, Athlete } from '../../data';
import StatBadge from './StatBadge';

interface AthleteStatsPanelProps {
  athlete: Athlete;
  results: CompetitionResult[];
}

function AthleteStatsPanel({ athlete, results }: AthleteStatsPanelProps) {
  const pb = getTaggedResultsByAthleteId(results, athlete, 'PB')[0];
  const sb = getTaggedResultsByAthleteId(results, athlete, 'SB')[0];

  return (
    <div className="grid grid-cols-2 gap-3">
      {pb ? (
        <div className="col-span-2">
          <StatBadge label={`PB (${pb.event})`} value={pb.mark} highlight />
        </div>
      ) : (
        <div className="col-span-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-500">
          暂无 PB 数据
        </div>
      )}
      {sb ? (
        <StatBadge label={`SB (${sb.event})`} value={sb.mark} />
      ) : (
        <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-500">
          暂无 SB 数据
        </div>
      )}
      <StatBadge label="大赛荣誉" value={`${athlete.majorHonors.length} 项`} />
    </div>
  );
}

export default memo(AthleteStatsPanel);

