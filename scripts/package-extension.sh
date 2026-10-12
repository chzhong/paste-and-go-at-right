#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$PROJECT_DIR/src"
OUTPUT_DIR="$PROJECT_DIR/dist"
VERSION="$(node -p "require('$SOURCE_DIR/manifest.json').version")"
ARCHIVE="$OUTPUT_DIR/paste-and-go-at-right-$VERSION.zip"

mkdir -p "$OUTPUT_DIR"
rm -f -- "$ARCHIVE"

(
  cd "$SOURCE_DIR"
  zip -q -r -X "$ARCHIVE" . -x '*.DS_Store' '*/.DS_Store'
)

unzip -tq "$ARCHIVE"
echo "Created: $ARCHIVE"
shasum -a 256 "$ARCHIVE"
