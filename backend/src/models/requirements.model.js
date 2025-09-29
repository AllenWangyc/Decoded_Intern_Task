import { Schema, model } from 'mongoose';

const FieldSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },          // lower_snake_case
    label: { type: String, required: true, trim: true },         // Title Case
    type: {
      type: String,
      required: true,
      enum: ['text', 'email', 'number', 'date', 'select', 'switch', 'textarea'],
    },
    options: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const AiParsedSchema = new Schema({
  appName: { 
    type: String, 
    default: 'My App' 
  },
  entities: { 
    type: [String], 
    default: [] 
  },
  roles: { 
    type: [String], 
    default: [] 
  },
  features: { 
    type: [String], 
    default: [] 
  },
  roleEntityMap: { 
    type: Map, 
    of: [String], 
    default: {} 
  },
  featureEntityMap: { 
    type: Map, 
    of: [String], 
    default: {} 
  },
  entityFields: {
      type: Map,
      of: [FieldSchema],
      default: {},
    },
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
