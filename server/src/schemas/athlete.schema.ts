import { z } from 'zod';
import { paginationSchema, searchSchema } from './common.schema.js';

/**
 * 运动员相关校验 schema
 */

export const athleteQuerySchema = searchSchema.extend({
  country: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  event: z.string().optional(),
  category: z.string().optional(),
});
