import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VerificationBadge } from '../components/ui/VerificationBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Badge } from '../components/ui/Badge'

describe('UI Components', () => {
  describe('VerificationBadge', () => {
    it('should render verified status', () => {
      render(<VerificationBadge verified="verified" />)
      expect(screen.getByText('已核验')).toBeDefined()
    })

    it('should render pending status', () => {
      render(<VerificationBadge verified="pending" />)
      expect(screen.getByText('待核验')).toBeDefined()
    })

    it('should render unverified status', () => {
      render(<VerificationBadge verified="unverified" />)
      expect(screen.getByText('未核验')).toBeDefined()
    })
  })

  describe('Badge', () => {
    it('should render with label', () => {
      render(<Badge label="测试标签" variant="default" />)
      expect(screen.getByText('测试标签')).toBeDefined()
    })

    it('should apply correct variant styles', () => {
      const { container } = render(<Badge label="已验证" variant="verified" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('green')
    })
  })

  describe('EmptyState', () => {
    it('should render title and description', () => {
      render(<EmptyState title="暂无数据" description="数据加载中" />)
      expect(screen.getByText('暂无数据')).toBeDefined()
      expect(screen.getByText('数据加载中')).toBeDefined()
    })

    it('should render custom icon', () => {
      render(<EmptyState title="空" icon="🔍" />)
      expect(screen.getByText('🔍')).toBeDefined()
    })

    it('should render action link when provided', () => {
      render(
        <EmptyState
          title="空"
          action={{ label: '返回首页', to: '/' }}
        />
      )
      expect(screen.getByText('返回首页')).toBeDefined()
    })
  })

  describe('ErrorState', () => {
    it('should render default error message', () => {
      render(<ErrorState />)
      expect(screen.getByText('加载失败')).toBeDefined()
      expect(screen.getByText('数据加载出错，请稍后重试')).toBeDefined()
    })

    it('should render custom error message', () => {
      render(<ErrorState title="网络错误" message="请检查网络连接" />)
      expect(screen.getByText('网络错误')).toBeDefined()
      expect(screen.getByText('请检查网络连接')).toBeDefined()
    })

    it('should render retry button when onRetry provided', () => {
      render(<ErrorState onRetry={() => {}} />)
      expect(screen.getByText('重试')).toBeDefined()
    })

    it('should not render retry button when onRetry not provided', () => {
      render(<ErrorState />)
      expect(screen.queryByText('重试')).toBeNull()
    })
  })

  describe('LoadingSpinner', () => {
    it('should render loading text', () => {
      render(<LoadingSpinner />)
      expect(screen.getByText('加载中...')).toBeDefined()
    })

    it('should render custom text', () => {
      render(<LoadingSpinner text="请稍候..." />)
      expect(screen.getByText('请稍候...')).toBeDefined()
    })
  })
})
