import express from 'express';
import { makeRequirementsRouter } from './requirements.route.js';

export function makeApiRouter(ai) {
  const router = express.Router();

  // health check
  router.get('/health', (_req, res) => res.json({ ok: true }));

  router.use(makeRequirementsRouter(ai));

  return router;
}
