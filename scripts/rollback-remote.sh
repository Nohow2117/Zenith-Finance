#!/usr/bin/env bash
set -euo pipefail

TARGET_RELEASE="${1:-}"
APP_NAME="artdefinance"
BASE_DIR="$HOME/deployments/$APP_NAME"
RELEASES_DIR="$BASE_DIR/releases"
CURRENT_LINK="$BASE_DIR/current"
LEGACY_APP_PATH="$HOME/app"
HEALTHCHECK_URL="http://127.0.0.1:3000/login"

if [ ! -d "$RELEASES_DIR" ]; then
  echo "No releases directory found at $RELEASES_DIR" >&2
  exit 1
fi

if [ -z "$TARGET_RELEASE" ]; then
  TARGET_RELEASE="$(ls -1dt "$RELEASES_DIR"/* 2>/dev/null | sed -n '2p')"
else
  TARGET_RELEASE="$RELEASES_DIR/$TARGET_RELEASE"
fi

if [ -z "$TARGET_RELEASE" ] || [ ! -d "$TARGET_RELEASE" ]; then
  echo "Rollback target not found" >&2
  exit 1
fi

ln -sfn "$TARGET_RELEASE" "$CURRENT_LINK"
ln -sfn "$CURRENT_LINK" "$LEGACY_APP_PATH"

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$LEGACY_APP_PATH/ecosystem.config.cjs" --update-env
else
  pm2 start "$LEGACY_APP_PATH/ecosystem.config.cjs"
fi

for _ in $(seq 1 30); do
  if curl --silent --fail --max-time 5 "$HEALTHCHECK_URL" >/dev/null; then
    break
  fi
  sleep 2
done

curl --silent --fail --max-time 10 "$HEALTHCHECK_URL" >/dev/null

pm2 status "$APP_NAME"
echo "Rolled back to $(basename "$TARGET_RELEASE")"
