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
elif command -v npm >/dev/null 2>&1; then
  npm install --include=dev --no-audit --no-fund
else
  echo "ERROR: npm was not found next to node."
  exit 1
fi

# Build in a copy, never in the live dist/. The build empties its output
# folder first and takes over a minute to fill it again, and dist/ is the
# Document Root: building in place left the site answering 403 for that whole
# minute, and since every CMS save rebuilds, after every edit (client,
# 2026-11-10: "después de hacer un cambio cae mucho en 403"). The copy shares
# node_modules through a symlink; vite.config resolves everything from its own
# folder, so the copy writes its own dist/.
STAGE=.deploy-build
rm -rf "$STAGE"
mkdir "$STAGE"
tar --exclude=./node_modules --exclude=./dist --exclude=./dist.previous \
  --exclude=./.git --exclude=./media-source --exclude="./$STAGE" -cf - . | tar -xf - -C "$STAGE"
ln -s ../node_modules "$STAGE/node_modules"
(cd "$STAGE" && npm run build)

echo "✓ Build complete → $STAGE/dist/"

# Make the new build readable by Apache before it goes live. Every build Plesk
# runs here, whether from the CLI, the runner's webhook or a CMS save, can
# inherit a 027 umask and write 640/750 files the web server cannot read: the
# whole site then answers 403 until someone fixes it by hand. It went down for
# about 50 minutes on 2026-11-10 that way.
chmod -R u=rwX,go=rX "$STAGE/dist"
echo "  ▸ dist/ permissions normalised (dirs 755, files 644)"

# Swap: two renames, so visitors see the old site or the new one and nothing
# in between. A failed build stops above (set -e) and the live site stays.
rm -rf dist.previous
if [ -d dist ]; then mv dist dist.previous; fi
mv "$STAGE/dist" dist
rm -rf "$STAGE" dist.previous
echo "  ▸ new dist/ is live"
# Loud, because serving a preview build from the real domain (or the reverse)
# is invisible until a search engine notices.
if grep -q "^Disallow: /" dist/robots.txt 2>/dev/null; then
  echo "  ⚠ PREVIEW build: every page is noindex and robots.txt disallows all."
else
  echo "  ● PUBLIC build: pages are indexable and sitemap.xml is published."
fi
