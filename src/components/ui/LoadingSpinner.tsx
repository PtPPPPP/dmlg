/**
 * 加载中组件
 */

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  text = '加载中...',
  className = 'py-20',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mb-3" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
