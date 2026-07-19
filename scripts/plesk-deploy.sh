#!/usr/bin/env bash
# Plesk Git "Additional deployment actions": bash scripts/plesk-deploy.sh
# The Document Root must point at this repository's dist/ directory.

set -uo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${PATH:-}"

echo "▸ Dietrich Klinghardt landing deploy"

for d in /opt/plesk/node/*/bin; do
  [ -x "$d/node" ] && export PATH="$d:$PATH"
done

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
export HOME="${HOME:-$PWD}"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node not found on PATH or under /opt/plesk/node."
  exit 1
fi

set -e
if [ -f package-lock.json ] && command -v npm >/dev/null 2>&1; then
  npm ci --include=dev --no-audit --no-fund
  npm run build
elif command -v npm >/dev/null 2>&1; then
  npm install --include=dev --no-audit --no-fund
  npm run build
else
  echo "ERROR: npm was not found next to node."
  exit 1
fi

echo "✓ Build complete → dist/"
