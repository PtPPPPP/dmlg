/**
 * 错误状态组件 — 请求失败时显示
 */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = '加载失败',
  message = '数据加载出错，请稍后重试',
  onRetry,
  className = 'py-20',
}: ErrorStateProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors"
        >
          重试
        </button>
      )}
    </div>
  );
}
