import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🏟️</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">404</h1>
        <p className="text-lg text-slate-400 mb-8">
          这个页面不存在，可能已被移除或链接有误
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-brand-500/20 px-5 py-2.5 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors"
          >
            返回首页
          </Link>
          <Link
            to="/athletes"
            className="rounded-lg bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
          >
            运动员图鉴
          </Link>
        </div>
      </div>
    </div>
  );
}
