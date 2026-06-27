import { z } from 'zod';

/**
 * 通用校验 schema
 */

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = paginationSchema.extend({
  q: z.string().min(1).max(100).optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1).max(100),
});
