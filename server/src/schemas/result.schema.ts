import { z } from 'zod';
import { paginationSchema } from './common.schema.js';

/**
 * 比赛结果相关校验 schema
 */

export const resultQuerySchema = paginationSchema.extend({
  athleteId: z.string().optional(),
  event: z.string().optional(),
  competition: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  verified: z.enum(['verified', 'pending', 'unverified']).optional(),
});
