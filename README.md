# NinjaSin AI

You can run this project directly in Codex without GitHub deployment.

## Option A: Run with real OpenAI API (live mode)

Create a `.env` file in the project root:

```env
NINJASIN_OPENAI_KEY=PASTE_YOUR_OPENAI_API_KEY_HERE
PORT=3000
```

## Option B: Run without any API key (demo mode)

If you just want to test the full UI/backend flow in Codex, use:

```env
DEMO_MODE=true
PORT=3000
```

## Start

```bash
npm install
npm start
```

Then open `http://localhost:3000`.
