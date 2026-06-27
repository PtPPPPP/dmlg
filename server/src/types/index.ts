import type { Request } from 'express';

/**
 * 扩展 Express Request 类型
 */

export interface PaginatedQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginatedQuery {
  q?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order: 'asc' | 'desc';
}

export function parsePagination(query: PaginatedQuery): PaginationParams {
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10)));
  const order = query.order === 'asc' ? 'asc' : 'desc';
  return { page, limit, sort: query.sort, order };
}
