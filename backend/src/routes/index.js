import express from 'express';
import { makeRequirementsRouter } from './requirements.route.js';
// import { makeUsersRouter } from './users.routes.js';

export function makeApiRouter(ai) {
  const router = express.Router();

  // health check
  router.get('/health', (_req, res) => res.json({ ok: true }));

  // 资源路由
  router.use(makeRequirementsRouter(ai));  // /extract, /requirements...
  // router.use(makeUsersRouter(deps));         // /users/me/requirements ...

  return router;
}
