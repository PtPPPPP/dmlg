import morgan from 'morgan';

/**
 * 请求日志中间件
 * - 开发环境：彩色简洁格式
 * - 生产环境：JSON 格式（便于日志收集）
 */

export const requestLogger = process.env.NODE_ENV === 'production'
  ? morgan('{"method":":method","url":":url","status":":status","response_time":":response-time"}', {
      stream: { write: (msg) => console.log(msg.trim()) },
    })
  : morgan('dev');
