import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import { makeAiClient } from './ai.js';
import { makeApiRouter } from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const ai = makeAiClient(process.env.OPENAI_API_KEY);
app.use('/api', makeApiRouter(ai));

// Error handling
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
console.log(process.env.MONGO_URI);
await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log(`API listening on port: ${PORT}`));
