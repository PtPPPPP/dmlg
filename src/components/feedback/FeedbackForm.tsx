import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { saveFeedback, exportFeedbackAsJson, clearFeedback, getAllFeedback } from './feedbackStorage';

const CATEGORIES = [
  { value: 'bug', label: '🐛 Bug 反馈', icon: '🐛' },
  { value: 'feature', label: '💡 功能建议', icon: '💡' },
  { value: 'data', label: '📊 数据纠错', icon: '📊' },
  { value: 'other', label: '💬 其他建议', icon: '💬' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

export default function FeedbackForm() {
  const location = useLocation();
  const [category, setCategory] = useState<Category>('feature');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    saveFeedback({
      category,
      message: message.trim(),
      contact: contact.trim() || undefined,
      page: location.pathname,
    });

    setSubmitted(true);
    setMessage('');
    setContact('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleExport = () => {
    const json = exportFeedbackAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const feedbackCount = getAllFeedback().length;

  return (
    <section className="border-t border-white/10 bg-slate-900/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-white">意见反馈</h2>
          <p className="mt-1 text-xs text-slate-400">
            发现数据有误？有功能建议？欢迎留言告诉我们
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`
                  rounded-full px-3 py-1.5 text-xs font-medium transition-all
                  ${
                    category === cat.value
                      ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-300'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Message */}
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                category === 'data'
                  ? '请描述哪条数据有误，正确数据是什么，以及来源链接（如有）…'
                  : category === 'bug'
                    ? '请描述你遇到的问题，包括在哪个页面、做了什么操作…'
                    : '请描述你的建议或想法…'
              }
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white
                         placeholder-slate-500 outline-none transition-colors
                         focus:border-brand-500/50 focus:bg-white/[0.07] resize-none"
              required
            />
          </div>

          {/* Contact (optional) */}
          <div>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="联系方式（可选，方便我们回复你）"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white
                         placeholder-slate-500 outline-none transition-colors
                         focus:border-brand-500/50 focus:bg-white/[0.07]"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!message.trim()}
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white
                         transition-all hover:bg-brand-600 active:scale-[0.98]
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitted ? '✓ 已提交' : '提交反馈'}
            </button>

            {/* Admin toggle */}
            <button
              type="button"
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              {feedbackCount > 0 ? `${feedbackCount} 条留言` : ''}
            </button>
          </div>
        </form>

        {/* Success toast */}
        {submitted && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-2.5 text-sm text-green-400 animate-pulse">
            <span>✓</span>
            <span>感谢反馈！我们会认真查看每一条建议</span>
          </div>
        )}

        {/* Admin panel (hidden by default) */}
        {showAdmin && feedbackCount > 0 && (
          <div className="mt-4 glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                管理面板 · {feedbackCount} 条留言
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="rounded-lg bg-white/5 px-3 py-1 text-xs text-slate-400
                             hover:bg-white/10 hover:text-white transition-colors"
                >
                  导出 JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('确定清空所有留言？')) {
                      clearFeedback();
                      setShowAdmin(false);
                    }
                  }}
                  className="rounded-lg bg-red-500/10 px-3 py-1 text-xs text-red-400
                             hover:bg-red-500/20 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto">
              {getAllFeedback().slice(0, 10).map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>
                      {CATEGORIES.find((c) => c.value === fb.category)?.icon}
                    </span>
                    <span>{new Date(fb.createdAt).toLocaleString('zh-CN')}</span>
                    <span className="text-slate-600">· {fb.page}</span>
                    {fb.contact && (
                      <span className="text-brand-400">· {fb.contact}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-300 whitespace-pre-wrap">
                    {fb.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
