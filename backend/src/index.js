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

const allowlist = [
  'https://decoded-intern-task-client.netlify.app',
  'http://localhost:5173',
];

function corsOptionsDelegate(req, cb) {
  const origin = req.header('Origin');
  const allowed = !origin || allowlist.some((x) =>
    x instanceof RegExp ? x.test(origin) : x === origin
  );
  cb(null, {
    origin: allowed,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

// Trust proxy
if (config.trustProxy) {
  app.set('trust proxy', 1);
}

// Env middleware
if (config.isProd) {
  app.use(helmet());
  if (config.enableCompression) app.use(compression());
} else {
  app.use(morgan('dev'));
}

app.use(cors(corsOptionsDelegate));
// 关键：让所有预检都返回 CORS 头
app.options('*', cors(corsOptionsDelegate));

// CORS
// app.use(cors(config.corsOptions));

app.use(express.json());

// Dependencies and routes
if (!config.OPENAI_API_KEY) {
  console.warn('[warn] OPENAI_API_KEY not set — /api/extract will fail when called.');
}
const ai = makeAiClient(config.OPENAI_API_KEY);
app.use('/api', makeApiRouter(ai));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

// General error handling
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  const payload = { error: 'Internal Server Error' };
  if (!config.isProd) payload.stack = err?.stack;
  res.status(err.status || 500).json(payload);
});

// Start & Connect DB
await connectDB(config.MONGO_URI);

const server = app.listen(config.PORT, () =>
  console.log(`[${config.NODE_ENV}] API listening on: ${config.PORT}`)
);

// Shut the server
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
