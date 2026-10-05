#!/usr/bin/env bash
# Salin aplikasi web (app/) ke dalam assets proyek Android.
# Jalankan sebelum build APK:  bash copy-assets.sh
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$DIR/../app"
DEST="$DIR/app/src/main/assets"

rm -rf "$DEST"
mkdir -p "$DEST"
cp -r "$SRC/." "$DEST/"
echo "✅ Aplikasi web disalin ke app/src/main/assets"
ls -la "$DEST"
