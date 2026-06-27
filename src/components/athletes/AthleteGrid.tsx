import { memo } from 'react';
import type { Athlete } from '../../data';
import AthleteCard from './AthleteCard';

interface AthleteGridProps {
  athletes: Athlete[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

function AthleteGrid({
  athletes,
  isFavorite,
  onToggleFavorite,
}: AthleteGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {athletes.map((athlete) => (
        <AthleteCard
          key={athlete.id}
          athlete={athlete}
          isFavorite={isFavorite(athlete.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default memo(AthleteGrid);

