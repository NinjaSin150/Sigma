require('dotenv').config();
const path = require('path');
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const apiKey = process.env.NINJASIN_OPENAI_KEY || process.env.OPENAI_API_KEY;
const demoMode = String(process.env.DEMO_MODE || '').toLowerCase() === 'true';

const openai = apiKey ? new OpenAI({ apiKey }) : null;

function buildDemoScript(prompt, enabledOptions) {
  return [
    'Scene Timeline',
    `- 00:00-00:20: Establishing shot based on prompt: "${prompt}".`,
    '- 00:20-01:00: Character action beats and environment interaction.',
    '',
    'Camera Plan',
    '- Wide establishing dolly-in, then medium tracking shot.',
    '- Hero close-up at impact beat with slow-motion ramp.',
    '',
    'Lighting Plan',
    '- Cool key light + magenta rim for cyber-ninja style.',
    '- Add volumetric fog for depth and silhouette contrast.',
    '',
    'Character + Rig Notes',
    '- Use biped rig with IK legs and FK/IK arm switch.',
    '- Add cloth secondary motion on scarf/strap accessories.',
    '',
    'Render + Export Settings',
    '- 4K output, cinematic motion blur, 24fps timeline.',
    '- Export .blend and H.264 MP4 preview.',
    '',
    'Final QA Checklist',
    `- Enabled options: ${enabledOptions || 'none'}.`,
    '- Verify no mesh intersections during jumps/spins.',
    '- Confirm camera cuts match soundtrack accents.'
  ].join('\n');
}

app.post('/generate', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const optionList = Object.entries(options)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([name]) => name)
      .join(', ');

    if (!openai) {
      if (demoMode) {
        return res.json({
          script: buildDemoScript(prompt.trim(), optionList),
          mode: 'demo'
        });
      }

      return res.status(500).json({
        error: 'Missing API key in environment.',
        setup: 'Create a .env file in the project root with:\nNINJASIN_OPENAI_KEY=PASTE_YOUR_OPENAI_API_KEY_HERE\nDEMO_MODE=true (optional, runs without API key)\nPORT=3000'
      });
    }

    const instruction = [
      'You are Gaurd AI for NinjaSin.',
      'Generate a concise animation production script with these sections:',
      '1) Scene Timeline',
      '2) Camera Plan',
      '3) Lighting Plan',
      '4) Character + Rig Notes',
      '5) Render + Export Settings',
      '6) Final QA Checklist',
      optionList ? `Enabled options: ${optionList}.` : 'No extra options enabled.',
      `User prompt: ${prompt.trim()}`
    ].join('\n');

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: instruction
    });

    const script = response.output_text?.trim();

    if (!script) {
      return res.status(502).json({ error: 'Model returned no output.' });
    }

    return res.json({ script, mode: 'live' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate animation script.' });
  }
});

app.listen(port, () => {
  const modeLabel = openai ? 'live API mode' : (demoMode ? 'demo mode' : 'no-key mode');
  console.log(`NinjaSin AI server running on http://localhost:${port} (${modeLabel})`);
});
