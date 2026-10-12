#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(node -p "require('$PROJECT_DIR/src/manifest.json').version")"
ARCHIVE="$PROJECT_DIR/dist/paste-and-go-at-right-$VERSION.zip"

: "${CWS_ACCESS_TOKEN:?请设置 CWS_ACCESS_TOKEN}"
: "${CWS_PUBLISHER_ID:?请设置 CWS_PUBLISHER_ID}"
: "${CWS_EXTENSION_ID:?请设置 CWS_EXTENSION_ID}"

if [[ ! -f "$ARCHIVE" ]]; then
  "$PROJECT_DIR/scripts/package-extension.sh"
fi

ITEM="publishers/$CWS_PUBLISHER_ID/items/$CWS_EXTENSION_ID"

curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer $CWS_ACCESS_TOKEN" \
  -H "Content-Type: application/zip" \
  -X POST \
  --data-binary "@$ARCHIVE" \
  "https://chromewebstore.googleapis.com/upload/v2/$ITEM:upload"

echo
echo "Package uploaded as a draft. Review its status in the Developer Dashboard."

if [[ "${1:-}" == "--submit-staged" ]]; then
  curl --fail-with-body --silent --show-error \
    -H "Authorization: Bearer $CWS_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST \
    -d '{"publishType":"STAGED_PUBLISH"}' \
    "https://chromewebstore.googleapis.com/v2/$ITEM:publish"
  echo
  echo "Submitted for review with staged publishing."
fi
