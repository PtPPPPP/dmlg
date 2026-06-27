import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 全局错误边界 — 捕获子组件渲染错误，显示兜底 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="glass-card p-8 text-center max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-lg font-bold text-white mb-2">页面出错了</h2>
            <p className="text-sm text-slate-400 mb-4">
              {this.state.error?.message ?? '发生了未知错误，请刷新页面重试'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/30 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
