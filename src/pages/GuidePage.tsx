export default function GuidePage() {
  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="py-8">
          <h1 className="text-3xl font-extrabold text-white">新手科普</h1>
          <p className="mt-2 text-slate-400">
            从零开始了解钻石联赛和田径运动
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              1. 钻石联赛是什么？
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3">
              <p>
                钻石联赛（Diamond League）是世界田联（World Athletics）主办的年度顶级田径系列赛。
                每年通常从 4-5 月开始，到 9 月结束，在全球各大城市举办约 14-15 站比赛。
              </p>
              <p>
                钻石联赛汇聚了全世界最优秀的田径运动员。与奥运会（每 4 年一届）和世锦赛（每 2 年一届）不同，
                钻石联赛是年度系列赛，让运动员有更多机会在顶级舞台上竞技，也为观众提供了更多欣赏高水平田径比赛的机会。
              </p>
              <p>
                每站比赛约进行 2-3 小时，包含 13-15 个项目。运动员在各站比赛中根据名次获得积分，
                每个项目积分最高的运动员获得参加总决赛的资格。总决赛冠军获得"Diamond Trophy"（钻石奖杯）、
                奖金以及下一年世锦赛的外卡资格。
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              2. 钻石联赛 vs 奥运会 vs 世锦赛
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">对比维度</th>
                    <th className="text-left py-3 px-4 text-brand-300 font-medium">钻石联赛</th>
                    <th className="text-left py-3 px-4 text-track-gold font-medium">奥运会</th>
                    <th className="text-left py-3 pl-4 text-slate-300 font-medium">世锦赛</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-4 text-slate-300">频率</td>
                    <td className="py-3 px-4">每年一届（系列赛）</td>
                    <td className="py-3 px-4">每 4 年一届</td>
                    <td className="py-3 pl-4">每 2 年一届</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-4 text-slate-300">赛制</td>
                    <td className="py-3 px-4">多站积分赛 + 总决赛</td>
                    <td className="py-3 px-4">单次锦标赛</td>
                    <td className="py-3 pl-4">单次锦标赛</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-4 text-slate-300">荣誉</td>
                    <td className="py-3 px-4">钻石奖杯 + 奖金</td>
                    <td className="py-3 px-4">奥运金牌（最高荣誉）</td>
                    <td className="py-3 pl-4">世界冠军头衔</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-4 text-slate-300">参赛门槛</td>
                    <td className="py-3 px-4">世界排名 + 组委会邀请</td>
                    <td className="py-3 px-4">达标成绩 + 国家选拔</td>
                    <td className="py-3 pl-4">达标成绩 + 国家选拔</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-slate-300">商业性</td>
                    <td className="py-3 px-4">强（出场费 + 奖金）</td>
                    <td className="py-3 px-4">弱（无奖金）</td>
                    <td className="py-3 pl-4">弱（有奖金但较少）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              3. 田径成绩术语速查
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { term: 'PB', full: 'Personal Best', desc: '个人最好成绩，运动员在所有比赛中取得的最佳成绩' },
                { term: 'SB', full: 'Season Best', desc: '赛季最好成绩，当前自然年内取得的最佳成绩' },
                { term: 'WL', full: 'World Leading', desc: '赛季世界领先成绩，当年度全世界最佳成绩' },
                { term: 'WR', full: 'World Record', desc: '世界纪录，需经世界田联官方认证' },
                { term: 'MR', full: 'Meeting Record', desc: '赛会纪录，该赛事历史上的最佳成绩' },
                { term: 'NR', full: 'National Record', desc: '国家纪录，该国的历史最佳成绩' },
                { term: 'OR', full: 'Olympic Record', desc: '奥运会纪录' },
                { term: 'CR', full: 'Championship Record', desc: '世锦赛纪录' },
                { term: 'DNF', full: 'Did Not Finish', desc: '未完赛，中途退赛' },
                { term: 'DNS', full: 'Did Not Start', desc: '未出赛，报名但未参加' },
                { term: 'DQ', full: 'Disqualified', desc: '被取消资格，通常是犯规' },
                { term: 'q', full: 'Qualified', desc: '获得晋级资格（如预赛晋级决赛）' },
              ].map((item) => (
                <div
                  key={item.term}
                  className="rounded-lg bg-white/5 p-4 border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs font-bold text-brand-300">
                      {item.term}
                    </span>
                    <span className="text-xs text-slate-500">{item.full}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              4. 普通观众看田径比赛应该关注什么？
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-1">短跑 / 跨栏项目</h3>
                <p>
                  关注起跑反应、30 米处的领先者、最后 20 米的冲刺。跨栏还要看栏间步数和节奏。
                  不要只看谁先冲线——观察每位选手不同阶段的表现更有趣。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">中长跑项目</h3>
                <p>
                  关注比赛节奏和战术——前领还是跟跑？什么时候开始加速？注意每圈的分段时间。
                  中长跑的魅力在于战术博弈，起跑最快的人不一定赢，最后 200 米才是高潮。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">跳跃项目</h3>
                <p>
                  关注助跑节奏和技术动作。跳高看弧线助跑和过杆曲线，撑竿跳看撑竿的弯曲和弹射。
                  每位选手通常有 3 次试跳机会，关键高度的"生死一跳"最具观赏性。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">投掷项目</h3>
                <p>
                  关注技术动作的流畅性和出手角度。好的投掷看起来毫不费力——实际上是全身力量的完美协调。
                  男子铅球 7.26kg，想象一下把它推到 23 米以外是什么概念。
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="glass-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              5. 为什么运动员参加钻石联赛？
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3">
              <p>
                对于职业田径运动员来说，钻石联赛是重要的收入来源和竞技平台：
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <span className="font-semibold text-white">出场费：</span>
                  顶级运动员被邀请参赛即可获得出场费，这是田径选手的主要收入之一。
                </li>
                <li>
                  <span className="font-semibold text-white">比赛奖金：</span>
                  各站名次成绩和总决赛冠军都有丰厚奖金。
                </li>
                <li>
                  <span className="font-semibold text-white">世界排名积分：</span>
                  钻石联赛是获取世界田联排名积分的重要途径，影响大赛种子席位。
                </li>
                <li>
                  <span className="font-semibold text-white">世锦赛外卡：</span>
                  钻石联赛总冠军可以获得下一年世锦赛的参赛资格。
                </li>
                <li>
                  <span className="font-semibold text-white">保持竞技状态：</span>
                  在非奥运/世锦赛年份，钻石联赛是维持比赛感觉的重要平台。
                </li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-2">⚠ 免责声明</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              本站为田径科普项目。所有运动员资料、成绩数据和项目描述仅供学习参考。
              真实成绩请以 World Athletics（世界田联）官方公布的数据为准。
              本站数据持续由人工校验更新，如有不准确之处，欢迎指正。
              部分运动员资料中的具体成绩、日期和荣誉细节需要在后续版本中进行核实和修正。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
