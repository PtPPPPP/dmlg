import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { config } from '../config/index.js';

/**
 * 全局错误处理中间件
 * - 与 shared/api-types.ts 的 ApiResponse 错误格式一致
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // AppError — 已知业务错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // 未知错误 — 记录日志，返回通用消息
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  const statusCode = 500;
  const message = config.NODE_ENV === 'production'
    ? '服务器内部错误，请稍后重试'
    : err.message;

  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
}
