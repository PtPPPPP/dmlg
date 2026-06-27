import type { Response } from 'express';

/**
 * 统一响应格式 — 与 shared/api-types.ts 保持一致
 */

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: null;
}

interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string) {
  const body: ApiResponse<T> = { success: true, data, message };
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const body: PaginatedApiResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json(body);
}

export function sendCreated<T>(res: Response, data: T) {
  return sendSuccess(res, data, 201, '创建成功');
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}
