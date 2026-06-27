import { STYLE_LABELS } from '../../data';
import type { StyleProfile, StyleProfileKey } from '../../data';

interface RadarChartProps {
  profile: StyleProfile;
  size?: number;
}

const KEYS: StyleProfileKey[] = [
  'speed',
  'endurance',
  'power',
  'technique',
  'consistency',
  'mentality',
];

export default function RadarChart({ profile, size = 220 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const levels = 5;

  const angleStep = (2 * Math.PI) / KEYS.length;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function getGridPoint(index: number, level: number): { x: number; y: number } {
    const angle = startAngle + index * angleStep;
    const r = (level / levels) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const points = KEYS.map((_, i) => {
      const pt = getGridPoint(i, level + 1);
      return `${pt.x},${pt.y}`;
    }).join(' ');
    return points;
  });

  const dataPoints = KEYS.map((key, i) => {
    const pt = getPoint(i, profile[key]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto"
    >
      {gridPolygons.reverse().map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {KEYS.map((_, i) => {
        const pt = getGridPoint(i, levels);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={pt.x}
            y2={pt.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPoints}
        fill="rgba(51,142,255,0.15)"
        stroke="#338EFF"
        strokeWidth={2}
      />

      {KEYS.map((key, i) => {
        const pt = getPoint(i, profile[key]);
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={3}
            fill="#338EFF"
            className="transition-all duration-300"
          />
        );
      })}

      {KEYS.map((key, i) => {
        const pt = getGridPoint(i, levels + 1.1);
        return (
          <text
            key={key}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-400 text-[10px]"
          >
            {STYLE_LABELS[key]}
          </text>
        );
      })}
    </svg>
  );
}
