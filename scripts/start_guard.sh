#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
API_URL="http://127.0.0.1:8000"
APP_URL="http://127.0.0.1:8080"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then kill "$FRONTEND_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT

cd "$BACKEND_DIR"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -r requirements.txt >/dev/null
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cd "$FRONTEND_DIR"
python3 -m http.server 8080 --bind 127.0.0.1 >/dev/null 2>&1 &
FRONTEND_PID=$!

sleep 1

open_url() {
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$APP_URL" >/dev/null 2>&1 && return 0
  fi
  if command -v open >/dev/null 2>&1; then
    open "$APP_URL" >/dev/null 2>&1 && return 0
  fi
  if command -v start >/dev/null 2>&1; then
    start "$APP_URL" >/dev/null 2>&1 && return 0
  fi
  return 1
}

if open_url; then
  echo "Opened Guard in browser: $APP_URL"
else
  echo "Could not auto-open browser. Open this URL manually: $APP_URL"
fi

echo "Backend API running at: $API_URL"
echo "Press Ctrl+C to stop services."
wait
