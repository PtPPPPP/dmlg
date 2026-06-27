import app from './app.js';
import { config } from './config/index.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`
🚀 stdm-api 已启动
   - 地址: http://localhost:${PORT}
   - 环境: ${config.NODE_ENV}
   - CORS: ${config.CORS_ORIGIN}

📡 API 接口:
   - GET /api/health          健康检查
   - GET /api/athletes        运动员列表
   - GET /api/athletes/:id    运动员详情
   - GET /api/results         比赛结果
   - GET /api/events          田径项目
  `);
});
