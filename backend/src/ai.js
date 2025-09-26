import OpenAI from 'openai';

const MODEL = 'gpt-5-nano';

export function makeAiClient(apiKey) {
  if (!apiKey) {
    console.warn('[ai] OPENAI_API_KEY not set — /api/extract will throw if called.');
  }

  const client = new OpenAI({apiKey});

  return {
    async extract(description) {
      const prompt = `
      Extract the following 4 items from the app idea. 
      Output as labeled lines only.

      - App Name: <name>
      - Entities: <comma separated>
      - Roles: <comma separated>
      - Features: <comma separated>

      Text: """${description}"""`;

      const res = await client.responses.create({
        model: MODEL,
        input: prompt
      });

      const text = res.output_text || '';

      const pick = (label) => {
        const m = new RegExp(`${label}:\\s*([^\\n]+)`, 'i').exec(text);
        return (m?.[1] || '').trim();
      };
      const split = (s) => s.split(',').map(v => v.trim()).filter(Boolean);

      return {
        appName: pick('App Name') || 'My App',
        entities: split(pick('Entities')),
        roles: split(pick('Roles')),
        features: split(pick('Features')),
        _raw: text,
        _model: MODEL,
      };
    }
  }
}