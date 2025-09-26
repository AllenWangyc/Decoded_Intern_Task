import { Schema, model } from 'mongoose';

const AiParsedSchema = new Schema({
  appName: { type: String, default: 'My App' },
  entities: { type: [String], default: [] },
  roles: { type: [String], default: [] },
  features: { type: [String], default: [] },
}, { _id: false });

const RequirementSchema = new Schema({
  rawDescription: { type: String, required: true },
  aiParsed: { type: AiParsedSchema, required: true },
  meta: {
    createdAt: { type: Date, default: Date.now },
    model: String,
    promptVersion: String,
    source: String,
  },
  owner: { type: Schema.Types.ObjectId, ref: 'users', required: false },
});

export const Requirement = model('requirements', RequirementSchema);
