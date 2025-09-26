import { Requirement } from '../models/requirements.model.js';

export const requirementsController = {
  // POST /extract
  async create(req, res, next, ai) {
    try {
      const { description } = req.body || {};
      if (!description || description.trim().length < 5) {
        return res.status(400).json({ error: 'description is required (>=5 chars)' });
      }

      const parsed = await ai.extract(description);

      const doc = await Requirement.create({
        rawDescription: description,
        aiParsed: {
          appName: parsed.appName,
          entities: parsed.entities,
          roles: parsed.roles,
          features: parsed.features,
        },
        meta: { model: parsed._model, promptVersion: 'v1', source: 'web_form' },
      });

      res.status(201).json(doc);
    } catch (err) {
      if (String(err?.message || '').toLowerCase().includes('openai')) {
        return res.status(502).json({ error: 'AI service unavailable', code: 'AI_UPSTREAM' });
      }
      next(err);
    }
  },

  // GET /requirements/:id
  async getById(req, res, next) {
    try {
      const doc = await Requirement.findById(req.params.id).lean();
      if (!doc) return res.status(404).json({ error: 'not found' });
      res.json(doc);
    } catch (err) { next(err); }
  },

  // GET /requirements
  async list(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
      const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

      const [items, total] = await Promise.all([
        Requirement.find({})
          .sort({ 'meta.createdAt': -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Requirement.countDocuments({}),
      ]);

      res.json({ items, total });
    } catch (err) { next(err); }
  }
};
