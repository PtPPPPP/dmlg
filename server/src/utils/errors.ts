/**
 * 自定义错误类 — 统一错误处理
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      404,
      'NOT_FOUND',
      id ? `${resource}（${id}）不存在` : `${resource}不存在`
    );
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super(400, 'VALIDATION_ERROR', '请求参数校验失败', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = '无权访问') {
    super(403, 'FORBIDDEN', message);
  }
}
