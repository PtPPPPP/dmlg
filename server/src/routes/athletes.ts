import { Router } from 'express';
import { dataService } from '../services/data.js';
import { validate } from '../middleware/validate.js';
import { athleteQuerySchema } from '../schemas/athlete.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

const router = Router();

/**
 * GET /api/athletes
 * 查询运动员列表（支持搜索、筛选、分页）
 */
router.get('/', validate(athleteQuerySchema, 'query'), (req, res) => {
  const { q, country, gender, event, page, limit } = (req as any).validated;

  let athletes = dataService.searchAthletes(q ?? '', { country, gender, event });

  const total = athletes.length;
  const start = (page - 1) * limit;
  const paged = athletes.slice(start, start + limit);

  sendPaginated(res, paged, total, page, limit);
});

/**
 * GET /api/athletes/countries
 * 获取所有国家列表
 */
router.get('/countries', (req, res) => {
  sendSuccess(res, dataService.getAllCountries());
});

/**
 * GET /api/athletes/:id
 * 获取运动员详情
 */
router.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  const { id } = (req as any).validated;
  const athlete = dataService.getAthleteById(id);

  if (!athlete) {
    throw new NotFoundError('运动员', id);
  }

  // 附带最近比赛结果
  const recentResults = dataService.getResultsByAthleteId(id).slice(0, 5);

  sendSuccess(res, { ...athlete, recentResults });
});

/**
 * GET /api/athletes/:id/results
 * 获取运动员比赛记录
 */
router.get('/:id/results', validate(idParamSchema, 'params'), (req, res) => {
  const { id } = (req as any).validated;
  const athlete = dataService.getAthleteById(id);

  if (!athlete) {
    throw new NotFoundError('运动员', id);
  }

  const results = dataService.getResultsByAthleteId(id);
  sendSuccess(res, results);
});

export default router;
