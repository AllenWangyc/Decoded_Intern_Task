import express from 'express';
import { requirementsController } from '../controllers/requirements.controller.js';

export function makeRequirementsRouter(ai) {
  const router = express.Router();

  router.post('/extract', (req, res, next) =>
    requirementsController.create(req, res, next, ai)
  );

  router.get('/requirements/:id', requirementsController.getById);

  router.get('/requirements', requirementsController.list);

  return router;
}
