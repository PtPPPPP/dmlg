import { Router } from 'express';
import { dataService } from '../services/data.js';
import { validate } from '../middleware/validate.js';
import { resultQuerySchema } from '../schemas/result.schema.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

const router = Router();

/**
 * GET /api/results
 * 查询比赛结果（支持筛选、分页）
 */
router.get('/', validate(resultQuerySchema, 'query'), (req, res) => {
  const { athleteId, event, competition, year, verified, page, limit, sort, order } =
    (req as any).validated;

  let results = dataService.getResults();

  // 筛选
  if (athleteId) {
    results = results.filter((r) => r.athleteId === athleteId);
  }
  if (event) {
    results = results.filter((r) => r.event === event);
  }
  if (competition) {
    results = results.filter((r) => r.competitionSlug === competition);
  }
  if (year) {
    results = results.filter((r) => new Date(r.date).getFullYear() === year);
  }
  if (verified) {
    results = results.filter((r) => r.source?.verified === verified);
  }

  // 排序
  const sortField = sort ?? 'date';
  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  sendPaginated(res, paged, total, page, limit);
});

/**
 * GET /api/results/events
 * 获取所有比赛项目
 */
router.get('/events', (req, res) => {
  sendSuccess(res, dataService.getEvents());
});

/**
 * GET /api/results/competitions
 * 获取所有赛事名称
 */
router.get('/competitions', (req, res) => {
  const results = dataService.getResults();
  const competitions = [...new Set(results.map((r) => r.competitionName))].sort();
  sendSuccess(res, competitions);
});

export default router;
