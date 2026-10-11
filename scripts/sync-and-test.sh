#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
CHECK_ONLY=false

usage() {
  cat <<'USAGE'
Usage: ./scripts/sync-and-test.sh [--check-only] [--port PORT]

Sync source files into public/, run JavaScript/JSON checks, verify the local HTTP
endpoints, then start a local preview server unless --check-only is supplied.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check-only) CHECK_ONLY=true; shift ;;
    --port)
      [[ $# -ge 2 ]] || { echo "Missing value for --port" >&2; exit 2; }
      PORT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

cd "$ROOT_DIR"

command -v node >/dev/null || { echo "node is required" >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 1; }
command -v curl >/dev/null || { echo "curl is required" >&2; exit 1; }

mkdir -p public
cp index.html styles.css app.js manus-routes.json public/

node --check app.js
node --check public/app.js
python3 -m json.tool manus-routes.json >/dev/null
python3 -m json.tool public/manus-routes.json >/dev/null
test -s public/index.html
test -s public/styles.css
test -s public/app.js

echo "Synced source files to public/ and passed syntax checks."

if [[ "$CHECK_ONLY" == true ]]; then
  exit 0
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory public >/tmp/web-icha-preview-"$PORT".log 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _ in {1..20}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then break; fi
  sleep 0.25
done

curl -fsSI "http://127.0.0.1:${PORT}/" >/dev/null
curl -fsS "http://127.0.0.1:${PORT}/manus-routes.json" | python3 -m json.tool >/dev/null

echo "Local preview is ready: http://127.0.0.1:${PORT}"
echo "Press Ctrl+C to stop the preview."
wait "$SERVER_PID"
