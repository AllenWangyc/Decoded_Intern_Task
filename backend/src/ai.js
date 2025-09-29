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
      Extract app requirements as STRICT JSON.

      Return ONLY a JSON object with keys exactly:
      - appName: string
      - entities: string[]
      - roles: string[]
      - features: string[]
      - roleEntityMap: { [role: string]: string[] }
      - featureEntityMap: { [feature: string]: string[] }
      - entityFields: {
        [entity: string]: Array<{
          name: string,
          label: string,
          type: "text"|"email"|"number"|"date"|"switch"|"textarea",
        }>
  }


      Rules:
      - All entity names in *Map values* MUST be chosen from "entities".
      - If unsure, use an empty array.
      - Prefer 1-2 most relevant entities per mapping.
      - Prefer 2-3 high-signal fields per entity.
      - Do not include any text outside the JSON.

      Text: """${description}"""`;

      const res = await client.responses.create({
        model: MODEL,
        input: prompt
      });

      const text = res.output_text || '';

      let parsed;
      
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error('[ai] JSON parse error:', e, text);
        throw new Error('AI did not return valid JSON');
      }

      return {
        appName: parsed.appName || 'My App',
        entities: parsed.entities || [],
        roles: parsed.roles || [],
        features: parsed.features || [],
        roleEntityMap: parsed.roleEntityMap || {},
        featureEntityMap: parsed.featureEntityMap || {},
        entityFields: parsed.entityFields || [],
        _raw: text,
        _model: MODEL,
      };
    }
  }
}