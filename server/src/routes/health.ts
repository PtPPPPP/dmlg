import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

/**
 * GET /api/health
 * 健康检查
 */
router.get('/', (req, res) => {
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
