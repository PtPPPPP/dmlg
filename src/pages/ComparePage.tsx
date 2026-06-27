import { useState, useMemo } from 'react';
import { athletes, getAthleteById } from '../data';
import { useFavorites } from '../hooks/useFavorites';
import ComparePanel from '../components/compare/ComparePanel';

export default function ComparePage() {
  const { favorites } = useFavorites();
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');

  const athlete1 = selected1 ? getAthleteById(selected1) : undefined;
  const athlete2 = selected2 ? getAthleteById(selected2) : undefined;

  const favoriteAthletes = useMemo(
    () => favorites.map((id) => athletes.find((a) => a.id === id)).filter(Boolean) as typeof athletes,
    [favorites]
  );

  const allAthletes = useMemo(
    () =>
      [...athletes].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    []
  );

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="py-8">
          <h1 className="text-3xl font-extrabold text-white">数据对比</h1>
          <p className="mt-2 text-slate-400">
            选择两位运动员进行全方位对比，包括基本信息、成绩、技术特点
          </p>
        </div>

        {/* Selection area */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-slate-400 mb-3 block">
              选择运动员 A
            </label>
            <select
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50"
            >
              <option value="">请选择运动员...</option>
              <optgroup label="我的收藏">
                {favoriteAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    ★ {a.name} ({a.country})
                  </option>
                ))}
              </optgroup>
              <optgroup label="全部运动员">
                {allAthletes
                  .filter((a) => !favorites.includes(a.id))
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.country} · {a.mainEvent})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-slate-400 mb-3 block">
              选择运动员 B
            </label>
            <select
              value={selected2}
              onChange={(e) => setSelected2(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50"
            >
              <option value="">请选择运动员...</option>
              <optgroup label="我的收藏">
                {favoriteAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    ★ {a.name} ({a.country})
                  </option>
                ))}
              </optgroup>
              <optgroup label="全部运动员">
                {allAthletes
                  .filter((a) => !favorites.includes(a.id))
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.country} · {a.mainEvent})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Comparison */}
        {athlete1 && athlete2 ? (
          <ComparePanel athlete1={athlete1} athlete2={athlete2} />
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              请选择两位运动员
            </h3>
            <p className="text-sm text-slate-500">
              使用上方下拉菜单选择运动员，或先从
              <a href="/athletes" className="text-brand-400 hover:text-brand-300 mx-1">
                运动员图鉴
              </a>
              中收藏感兴趣的选手，便于快速选择
            </p>
          </div>
        )}

        {((athlete1 && !athlete2) || (!athlete1 && athlete2)) && (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-400">请再选择一位运动员完成对比</p>
          </div>
        )}
      </div>
    </div>
  );
}
