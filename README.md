# Guard AI Video Generator

Guard is now scaffolded as a runnable starter project with:

- **Backend API (FastAPI)** for projects and long-form generation jobs.
- **Job model** that supports durations up to **1020 seconds (17 minutes)**.
- **Chunking logic** for long jobs so they can be rendered in clip segments.
- **Stitcher utility** (FFmpeg scaffold) to combine generated clips into one export.
- **Simple frontend page** to create projects and queue jobs.
- **Branding starter** with a Guard logo asset (`frontend/assets/guard-logo.svg`) used by the UI.

## Project Structure

- `backend/` FastAPI service.
- `frontend/` static UI prototype.
- `worker/` stitcher and worker scaffolding.
- `scripts/` local run scripts.

## Quick Start

### 0) One-command start (auto-open)

```bash
./scripts/start_guard.sh
```

This starts backend + frontend and attempts to automatically open:

- App UI: `http://127.0.0.1:8080`
- API: `http://127.0.0.1:8000`

### 1) Run backend

```bash
./scripts/run_backend.sh
```

API: `http://localhost:8000`

### 2) Open frontend

Open `frontend/index.html` in your browser.

### 3) Test flow

1. Create a project.
2. Copy project ID.
3. Create a job with a duration up to 1020 seconds.
4. Observe `chunks_total` in the job response (10s chunking).

## API Endpoints

- `GET /health`
- `POST /projects`
- `GET /projects`
- `POST /jobs`
- `GET /jobs/{job_id}`

## Next Build Steps

- Replace in-memory stores with Postgres.
- Add Redis queue and background workers.
- Add real model inference per chunk.
- Persist chunk outputs in S3-compatible storage.
- Implement final stitched artifact upload + signed URL downloads.


## Testing

### Automated API tests

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. pytest -q
```

### Manual API smoke test (curl)

```bash
# terminal 1
./scripts/run_backend.sh

# terminal 2
curl http://localhost:8000/health

PROJECT_ID=$(curl -s -X POST http://localhost:8000/projects \
  -H 'Content-Type: application/json' \
  -d '{"name":"My First Guard Project"}' | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')

curl -s -X POST http://localhost:8000/jobs \
  -H 'Content-Type: application/json' \
  -d '{"project_id":"'"$PROJECT_ID"'","prompt":"cinematic anime hero scene","duration_seconds":120,"mode":"text_to_video"}'
```

### Manual frontend test

1. Start backend with `./scripts/run_backend.sh`.
2. Open `frontend/index.html` in browser.
3. Create project, then create job up to 1020 seconds.
4. Confirm response includes `chunks_total` and `status`.


### Mobile HTML app

You can open the mobile-optimized app directly:

- File: `frontend/guard-mobile.html`

If hosting locally and opening from your phone, start backend on your computer and set API URL in the page to your LAN IP (example: `http://192.168.1.20:8000`).
