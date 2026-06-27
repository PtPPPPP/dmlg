import { useState, useCallback } from 'react';
import { competitionResults, dataMeta } from '../data';
import DataFreshnessBadge from '../components/data/DataFreshnessBadge';
import type { CompetitionResult } from '../data';
import { validateCompetitionResult } from '../data';

interface ValidationError {
  id: string;
  field: string;
  message: string;
}

export default function DataAdmin() {
  const [jsonInput, setJsonInput] = useState('');
  const [parseResult, setParseResult] = useState<{ count: number; errors: ValidationError[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const currentCount = competitionResults.length;

  const handleValidate = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      const allErrors: ValidationError[] = [];
      for (const record of records) {
        allErrors.push(...validateCompetitionResult(record as CompetitionResult));
      }
      setParseResult({ count: records.length, errors: allErrors });
    } catch {
      setParseResult({ count: 0, errors: [{ id: 'parse', field: 'json', message: 'JSON 解析失败，请检查格式' }] });
    }
  }, [jsonInput]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(competitionResults, null, 2);
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleDownload = useCallback(() => {
    const data = JSON.stringify(competitionResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competition-results.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-white">数据管理</h1>
            <DataFreshnessBadge />
          </div>
          <p className="text-slate-400">
            本地数据维护工具 — 导入、校验、导出比赛记录数据
          </p>
        </div>

        {/* Status cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="glass-card p-5">
            <div className="text-xs text-slate-500 mb-1">当前记录数</div>
            <div className="text-2xl font-bold text-white">{currentCount}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-xs text-slate-500 mb-1">数据最后更新</div>
            <div className="text-2xl font-bold text-white">{dataMeta.lastManualUpdate}</div>
          </div>
          <div className="glass-card p-5">
            <div className="text-xs text-slate-500 mb-1">数据状态</div>
            <div className="text-2xl font-bold text-white">
              <DataFreshnessBadge />
            </div>
          </div>
        </div>

        {/* Import & Validate */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">导入 & 校验 JSON 数据</h2>
          <p className="text-xs text-slate-500 mb-3">
            将原始比赛记录 JSON 粘贴到下方，点击校验检查字段完整性和数据格式。
            校验通过后建议保存为 <code className="text-brand-300">data-import/raw/manual-results.json</code>，
            再运行 <code className="text-brand-300">npm run data:normalize</code> 生成正式数据。
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`[\n  {\n    "id": "athlete-id-20260526-100m",\n    "athleteId": "athlete-id",\n    "athleteName": "Athlete Name",\n    "athleteEnglishName": "Athlete Name",\n    "competitionName": "Competition",\n    "competitionSlug": "competition-2026",\n    "date": "2026-05-26",\n    "event": "100m",\n    "eventCategory": "sprints",\n    "mark": "9.80s",\n    "source": {\n      "sourceName": "Diamond League",\n      "sourceUrl": "https://www.diamondleague.com/",\n      "sourceType": "diamond-league",\n      "updatedAt": "2026-05-26",\n      "verified": "pending"\n    }\n  }\n]`}
            rows={12}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white font-mono outline-none focus:border-brand-500/50 resize-y"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleValidate}
              disabled={!jsonInput.trim()}
              className="rounded-lg bg-brand-500/20 px-5 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              校验数据
            </button>
            <button
              onClick={() => setJsonInput('')}
              className="rounded-lg bg-white/5 px-5 py-2 text-sm font-medium text-slate-400 hover:bg-white/10 transition-colors"
            >
              清空
            </button>
          </div>

          {parseResult && (
            <div className="mt-4 rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-white">
                  解析结果：
                </span>
                <span className="text-sm text-slate-300">{parseResult.count} 条记录</span>
                {parseResult.errors.length === 0 ? (
                  <span className="rounded-full bg-green-400/10 px-2.5 py-0.5 text-xs text-green-400 border border-green-400/30">
                    全部通过
                  </span>
                ) : (
                  <span className="rounded-full bg-red-400/10 px-2.5 py-0.5 text-xs text-red-400 border border-red-400/30">
                    {parseResult.errors.length} 个问题
                  </span>
                )}
              </div>
              {parseResult.errors.length > 0 && (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {parseResult.errors.map((err, i) => (
                    <div
                      key={i}
                      className="rounded bg-red-400/5 border border-red-400/10 px-3 py-1.5 text-xs text-slate-300"
                    >
                      <span className="text-red-400 font-medium">[{err.id}]</span>{' '}
                      <span className="text-slate-500">{err.field}:</span> {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">导出当前数据</h2>
          <p className="text-xs text-slate-500 mb-3">
            将内存中的比赛记录导出为 JSON，用于备份或通过 normalize 脚本处理。
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="rounded-lg bg-brand-500/20 px-5 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors"
            >
              {copied ? '已复制到剪贴板' : '复制 JSON 数据'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg bg-white/5 px-5 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              下载 JSON 文件
            </button>
          </div>
        </div>

        {/* CLI script hint */}
        <div className="mt-8 rounded-lg border border-white/5 bg-white/5 p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            命令行工具
          </h3>
          <p className="text-xs text-slate-500 mb-2">
            运行本地脚本对原始数据进行标准化处理：
          </p>
          <pre className="rounded bg-slate-950 px-4 py-3 text-xs text-slate-300 font-mono">
            npm run data:normalize
          </pre>
          <p className="text-xs text-slate-500 mt-2">
            脚本位置：<code className="text-brand-300">scripts/data/normalize-results.ts</code>，
            原始数据目录：<code className="text-brand-300">data-import/raw/manual-results.json</code>
          </p>
        </div>
      </div>
    </div>
  );
}
