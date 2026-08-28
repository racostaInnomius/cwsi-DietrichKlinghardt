#!/usr/bin/env bash
# Plesk Git "Additional deployment actions": bash scripts/plesk-deploy.sh
#
# Document Root must point at this repository's dist/ directory.
#
# The subscription's environment supplies the VITE_PUBLIC_* values; the build
# bakes them in, so a change there needs a redeploy, not just a restart. In
# particular VITE_PUBLIC_INDEXABLE decides whether the built pages carry
# noindex and whether robots.txt lets crawlers in — see docs/GO_LIVE.md.

set -uo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${PATH:-}"

echo "▸ Dietrich Klinghardt site deploy"

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
# Loud, because serving a preview build from the real domain (or the reverse)
# is invisible until a search engine notices.
if grep -q "^Disallow: /" dist/robots.txt 2>/dev/null; then
  echo "  ⚠ PREVIEW build: every page is noindex and robots.txt disallows all."
else
  echo "  ● PUBLIC build: pages are indexable and sitemap.xml is published."
fi
