import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  competitionResults,
  dataMeta,
  getAthleteById,
  getEventById,
  getSimilarAthletes,
  getResultsForAthlete,
  getTaggedResultsByAthleteId,
  EVENT_CATEGORY_LABELS,
} from '../data';
import { useFavorites } from '../hooks/useFavorites';
import RadarChart from '../components/ui/RadarChart';
import DataFreshnessBadge from '../components/data/DataFreshnessBadge';
import ImageCredit from '../components/data/ImageCredit';
import AthleteProfileHeader from '../components/athletes/AthleteProfileHeader';
import AthleteResultTable from '../components/athletes/AthleteResultTable';
import AthleteStatsPanel from '../components/athletes/AthleteStatsPanel';
import AthleteImage from '../components/athletes/AthleteImage';


export default function AthleteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const athlete = id ? getAthleteById(id) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!athlete) {
    return (
      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="text-5xl mb-4">🏃</div>
          <h1 className="text-2xl font-bold text-white mb-2">运动员未找到</h1>
          <p className="text-slate-400 mb-6">该运动员资料可能已被移除或链接有误</p>
          <Link
            to="/athletes"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors"
          >
            ← 返回运动员图鉴
          </Link>
        </div>
      </div>
    );
  }

  // 缓存运动员详情页的计算结果
  const mainEventData = useMemo(() => getEventById(athlete.mainEvent), [athlete.mainEvent]);
  const category = mainEventData?.category ?? 'sprints';
  const similar = useMemo(() => getSimilarAthletes(athlete.id), [athlete.id]);
  const fav = isFavorite(athlete.id);
  const recentCompetitionResults = useMemo(
    () => getResultsForAthlete(competitionResults, athlete).slice(0, 5),
    [athlete.id]
  );
  const featuredResults = useMemo(() => [
    ...getTaggedResultsByAthleteId(competitionResults, athlete, 'PB'),
    ...getTaggedResultsByAthleteId(competitionResults, athlete, 'SB'),
  ].filter(
    (result, index, all) => all.findIndex((item) => item.id === result.id) === index
  ), [athlete.id]);
  const seasonBestResults = useMemo(
    () => getTaggedResultsByAthleteId(competitionResults, athlete, 'SB').slice(0, 3),
    [athlete.id]
  );

  const eventCategoryLabel = EVENT_CATEGORY_LABELS[category];

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb + data status */}
        <div className="py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-300 transition-colors">首页</Link>
            <span>/</span>
            <Link to="/athletes" className="hover:text-slate-300 transition-colors">运动员图鉴</Link>
            <span>/</span>
            <span className="text-slate-300">{athlete.name}</span>
          </nav>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>数据更新至：{dataMeta.lastManualUpdate}</span>
            <span>·</span>
            <span>
              最新完成站：
              {(dataMeta.latestCompletedMeet ?? '暂无').replace(' Diamond League 2026', ' 2026')}
            </span>
            <DataFreshnessBadge />
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <AthleteProfileHeader
              athlete={athlete}
              category={category}
              eventCategoryLabel={eventCategoryLabel}
              isFavorite={fav}
              onToggleFavorite={toggleFavorite}
            />

            {/* Right: Stats grid */}
            <div className="lg:w-80 flex-shrink-0">
              <AthleteStatsPanel athlete={athlete} results={competitionResults} />
            </div>
          </div>

          {/* 图片来源信息 */}
          {athlete.image && athlete.image.usageStatus !== 'placeholder' && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <ImageCredit image={athlete.image} />
            </div>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: Story, honors, techniques */}
          <div className="lg:col-span-2 space-y-8">
            {/* Style profile */}
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">技术风格画像</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <RadarChart profile={athlete.styleProfile} size={220} />
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">
                    优势特点
                  </h3>
                  <ul className="space-y-1.5">
                    {athlete.strengths.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  {athlete.weaknessOrRisks && athlete.weaknessOrRisks.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2 mt-4">
                        待提升 / 风险点
                      </h3>
                      <ul className="space-y-1.5">
                        {athlete.weaknessOrRisks.map((w) => (
                          <li
                            key={w}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-600" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* PB & Results */}
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">代表成绩</h2>
                <DataFreshnessBadge />
              </div>
              <AthleteResultTable
                results={featuredResults}
                emptyTitle="暂无 PB / SB 数据"
                emptyDescription="PB / SB 只展示有来源和核验状态的比赛记录。"
              />
            </section>

            {/* Recent competition results */}
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">最近比赛记录</h2>
              <AthleteResultTable results={recentCompetitionResults} />
            </section>

            {/* Major honors */}
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">主要荣誉</h2>
              <ul className="space-y-2">
                {athlete.majorHonors.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex-shrink-0 text-track-gold">★</span>
                    <span className="text-slate-300">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Diamond League highlights */}
            {athlete.diamondLeagueHighlights.length > 0 && (
              <section className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4">
                  钻石联赛亮点
                </h2>
                <ul className="space-y-2">
                  {athlete.diamondLeagueHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex-shrink-0 text-brand-400">◆</span>
                      <span className="text-slate-300">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Story */}
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">人物故事</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {athlete.story}
              </p>
            </section>

            {/* Watching tips */}
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">观赛指南</h2>
              <ul className="space-y-3">
                {athlete.watchingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            <section className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
                赛季最佳
              </h3>
              <AthleteResultTable
                results={seasonBestResults}
                emptyTitle="暂无 SB 数据"
                emptyDescription="赛季最佳只展示比赛记录中标注 SB 的成绩。"
                emptyClassName="py-6"
              />
            </section>

            {/* Data notes */}
            {athlete.notes && (
              <section className="glass-card p-5 border-amber-500/20">
                <h3 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wide">
                  ⚠ 数据说明
                </h3>
                <p className="text-xs text-slate-400">{athlete.notes}</p>
              </section>
            )}

            {/* Similar athletes */}
            {similar.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">
                  相关运动员
                </h3>
                <div className="space-y-3">
                  {similar.slice(0, 3).map((sa) => (
                    <Link
                      key={sa.id}
                      to={`/athletes/${sa.id}`}
                      className="block glass-card-hover p-4"
                    >
                      <div className="flex items-center gap-3">
                        <AthleteImage
                          athlete={sa}
                          variant="avatar"
                          className="h-10 w-10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {sa.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {sa.country} · {sa.mainEvent}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
