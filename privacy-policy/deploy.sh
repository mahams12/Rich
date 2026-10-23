#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/.deploy"
rm -rf "$DIST"
mkdir -p "$DIST/privacy-policy"
rsync -a \
  --exclude='.DS_Store' \
  "$ROOT/privacy-policy/" "$DIST/privacy-policy/"
# Brand asset path used by the page
mkdir -p "$DIST/privacy-policy/brand"
cp "$ROOT/brand/icon.svg" "$DIST/privacy-policy/brand/icon.svg"
npx --yes wrangler@4 deploy
