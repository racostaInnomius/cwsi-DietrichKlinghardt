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

# Make dist/ readable by Apache. Every build Plesk runs here, whether from the
# CLI, the runner's webhook or a CMS save, can inherit a 027 umask and write
# 640/750 files the web server cannot read: the whole site then answers 403
# until someone fixes it by hand. It went down for about 50 minutes on
# 2026-11-10 that way. Normalising here, as cwsi-beytrax already does, takes
# the manual step out of every deploy.
chmod -R u=rwX,go=rX dist
echo "  ▸ dist/ permissions normalised (dirs 755, files 644)"
# Loud, because serving a preview build from the real domain (or the reverse)
# is invisible until a search engine notices.
if grep -q "^Disallow: /" dist/robots.txt 2>/dev/null; then
  echo "  ⚠ PREVIEW build: every page is noindex and robots.txt disallows all."
else
  echo "  ● PUBLIC build: pages are indexable and sitemap.xml is published."
fi
