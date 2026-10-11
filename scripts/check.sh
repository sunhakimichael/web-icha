#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3000}"
SERVE=false

usage() {
  cat <<'USAGE'
Usage: ./scripts/check.sh [--serve] [--port PORT]

Run static checks on public/ (JS syntax, missing assets, translations, CSP hash,
JSON). With --serve, start a local preview server afterwards.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --serve) SERVE=true; shift ;;
    --port)
      [[ $# -ge 2 ]] || { echo "Missing value for --port" >&2; exit 2; }
      PORT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

command -v node >/dev/null || { echo "node is required" >&2; exit 1; }
node "$ROOT_DIR/scripts/check.mjs"

if [[ "$SERVE" == true ]]; then
  command -v python3 >/dev/null || { echo "python3 is required" >&2; exit 1; }
  echo "Local preview: http://127.0.0.1:${PORT}  (Ctrl+C to stop)"
  exec python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT_DIR/public"
fi
