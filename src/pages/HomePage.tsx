import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import AthleteGrid from '../components/athletes/AthleteGrid';
import DataFreshnessBadge from '../components/data/DataFreshnessBadge';
import { athletes, dataMeta } from '../data';
import { useFavorites } from '../hooks/useFavorites';

const FEATURED_IDS = [
  'noah-lyles',
  'sydney-mclaughlin-levrone',
  'mondo-duplantis',
  'faith-kipyegon',
  'karsten-warholm',
  'sha-carri-richardson',
];

const ENTRY_LINKS = [
  { path: '/athletes', label: '运动员图鉴', desc: '浏览所有运动员卡片，按项目、国家筛选', icon: '👥', color: 'from-brand-500/20 to-brand-700/20 border-brand-500/30' },
  { path: '/events', label: '项目科普', desc: '了解每个田径项目的技术特点和观赛重点', icon: '📖', color: 'from-track-sprint/10 to-track-hurdle/10 border-track-sprint/30' },
  { path: '/compare', label: '数据对比', desc: '选择两位运动员进行全方位对比', icon: '📊', color: 'from-track-jump/10 to-track-throw/10 border-track-jump/30' },
  { path: '/guide', label: '新手科普', desc: '了解钻石联赛和田径运动的基础知识', icon: '💡', color: 'from-track-distance/10 to-brand-500/10 border-track-distance/30' },
];

export default function Home() {
  const { isFavorite, toggleFavorite } = useFavorites();
  // 缓存推荐运动员列表，避免每次渲染重新查找
  const featured = useMemo(
    () => FEATURED_IDS.map((id) => athletes.find((a) => a.id === id)).filter(Boolean) as typeof athletes,
    []
  );

  return (
    <div>
      <HeroSection />

      {/* Entry links */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            探索田径世界
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENTRY_LINKS.map((entry) => (
              <Link
                key={entry.path}
                to={entry.path}
                className={`glass-card-hover p-6 border bg-gradient-to-br ${entry.color}`}
              >
                <div className="text-3xl mb-3">{entry.icon}</div>
                <h3 className="font-bold text-white mb-1.5">{entry.label}</h3>
                <p className="text-sm text-slate-400">{entry.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data status bar */}
      <section className="border-t border-white/5 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span>数据更新至：{dataMeta.lastManualUpdate}</span>
            <span>·</span>
            <span>
              最新完成站：
              {(dataMeta.latestCompletedMeet ?? '暂无').replace(' Diamond League 2026', ' 2026')}
              {dataMeta.latestCompletedMeetDate ? `（${dataMeta.latestCompletedMeetDate}）` : ''}
            </span>
            <span>·</span>
            <span>
              下一站：
              {(dataMeta.nextMeet ?? '暂无').replace(' Diamond League 2026', ' 2026')}
              {dataMeta.nextMeetDate ? `（${dataMeta.nextMeetDate}）` : ''}
            </span>
            <DataFreshnessBadge />
          </div>
        </div>
      </section>

      {/* Featured athletes */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">精选运动员</h2>
              <p className="text-sm text-slate-500 mt-1">
                各项目代表选手，点击查看详细资料
              </p>
            </div>
            <Link
              to="/athletes"
              className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              查看全部
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <AthleteGrid
            athletes={featured}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </section>
    </div>
  );
}
