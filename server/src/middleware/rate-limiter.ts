import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

/**
 * Rate Limit 中间件
 * - 限制每个 IP 的请求频率
 * - 超限返回 429
 */
export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: '请求过于频繁，请稍后重试',
    },
  },
});
