import { useState, useMemo } from 'react';
import { trackEvents, EVENT_CATEGORY_LABELS } from '../data';
import type { EventCategory } from '../data';
import EventCard from '../components/events/EventCard';

// 只显示有实际项目的类别
const categoriesWithEvents = new Set(trackEvents.map((e) => e.category));

const CATEGORIES: Array<{ value: EventCategory | 'all'; label: string }> = [
  { value: 'all', label: '全部项目' },
  ...Object.entries(EVENT_CATEGORY_LABELS)
    .filter(([key]) => categoriesWithEvents.has(key as EventCategory))
    .map(([value, label]) => ({
      value: value as EventCategory,
      label,
    })),
];

export default function Events() {
  const [category, setCategory] = useState<EventCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return trackEvents;
    return trackEvents.filter((e) => e.category === category);
  }, [category]);

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="py-8">
          <h1 className="text-3xl font-extrabold text-white">项目科普</h1>
          <p className="mt-2 text-slate-400">
            了解每个田径项目的技术特点、观赛重点和常见术语
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-white text-slate-900'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {category !== 'all' && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              {EVENT_CATEGORY_LABELS[category]}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} 个项目
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Diamond League note */}
        <div className="mt-12 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-2">
            关于钻石联赛项目
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            钻石联赛每个赛季包含约 14 站比赛，每站设置不同的项目。
            并非所有田径项目都在每站出现——组委会会根据场地、时间和市场因素选择当站的项目。
            运动员通过各站比赛积累积分，积分最高的选手获得年度钻石联赛总冠军（Diamond Trophy）。
            标注"钻石联赛项目"的项目代表该项目在钻石联赛赛程中定期出现。
          </p>
        </div>
      </div>
    </div>
  );
}
