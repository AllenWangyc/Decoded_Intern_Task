import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { config } from './config.js';
import { connectDB } from './db.js';
import { makeAiClient } from './ai.js';
import { makeApiRouter } from './routes/index.js';


const app = express();

// 信任反向代理（Render / Nginx 后面建议打开，能拿到正确的 req.ip、协议等）
if (config.trustProxy) {
  app.set('trust proxy', 1);
}

// 按环境中间件
if (config.isProd) {
  app.use(helmet());                         // 基本安全头
  if (config.enableCompression) app.use(compression()); // gzip/br 压缩
} else {
  app.use(morgan('dev'));                    // 开发日志
}

// CORS 与解析
app.use(cors(config.corsOptions));
app.use(express.json());

// 依赖与路由
if (!config.OPENAI_API_KEY) {
  console.warn('[warn] OPENAI_API_KEY not set — /api/extract will fail when called.');
}
const ai = makeAiClient(config.OPENAI_API_KEY);
app.use('/api', makeApiRouter(ai));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

// 统一错误处理（开发输出 stack，生产隐藏内部细节）
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  const payload = { error: 'Internal Server Error' };
  if (!config.isProd) payload.stack = err?.stack;
  res.status(err.status || 500).json(payload);
});

// 启动 & 连接数据库
await connectDB(config.MONGO_URI);

const server = app.listen(config.PORT, () =>
  console.log(`[${config.NODE_ENV}] API listening on: ${config.PORT}`)
);

// 优雅关停（Render 会发 SIGTERM）
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
