const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '4000', 10);

// Production：allow access from configured origins and localhost
const originList = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Allow access by localhost
originList.push('http://localhost:5173');

const corsOptions = isProd
  ? {
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (originList.includes(origin)) return cb(null, true);
        return cb(new Error(`Not allowed by CORS: ${origin}`));
      },
      // credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  : true;

export const config = {
  NODE_ENV,
  isProd,
  PORT,

  originList,

  // Key credentials
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  MONGO_URI: process.env.MONGO_URI,

  // Network/Security
  corsOptions,
  trustProxy: process.env.TRUST_PROXY === '1',
  enableCompression: process.env.ENABLE_COMPRESSION !== '0',

  // Other extensions
  logLevel: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
};