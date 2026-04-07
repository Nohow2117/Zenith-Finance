#!/usr/bin/env bash
set -euo pipefail

RELEASE_ID="${1:?release id required}"
ARTIFACT_PATH="${2:?artifact path required}"
LINUX_BINDING_PACKAGE="${3:?linux binding package required}"

APP_NAME="artdefinance"
BASE_DIR="$HOME/deployments/$APP_NAME"
RELEASES_DIR="$BASE_DIR/releases"
SHARED_DIR="$BASE_DIR/shared"
CURRENT_LINK="$BASE_DIR/current"
LEGACY_APP_PATH="$HOME/app"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
HEALTHCHECK_URL="http://127.0.0.1:3000/login"
KEEP_RELEASES=5

mkdir -p "$RELEASES_DIR" "$SHARED_DIR"

if [ -d "$LEGACY_APP_PATH" ] && [ ! -L "$LEGACY_APP_PATH" ]; then
  if [ -f "$LEGACY_APP_PATH/.env" ] && [ ! -f "$SHARED_DIR/.env" ]; then
    cp "$LEGACY_APP_PATH/.env" "$SHARED_DIR/.env"
  fi

  if [ -f "$LEGACY_APP_PATH/local.db" ] && [ ! -f "$SHARED_DIR/local.db" ]; then
    cp "$LEGACY_APP_PATH/local.db" "$SHARED_DIR/local.db"
  fi
fi

if [ ! -f "$SHARED_DIR/.env" ]; then
  echo "Missing shared .env at $SHARED_DIR/.env" >&2
  exit 1
fi

if [ ! -f "$SHARED_DIR/local.db" ]; then
  : > "$SHARED_DIR/local.db"
fi

rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"
tar -xzf "$ARTIFACT_PATH" -C "$RELEASE_DIR"
rm -f "$ARTIFACT_PATH"

if [ ! -f "$RELEASE_DIR/ecosystem.config.cjs" ]; then
  echo "Missing ecosystem.config.cjs in release $RELEASE_ID" >&2
  exit 1
fi

mkdir -p "$RELEASE_DIR/node_modules/@libsql/linux-x64-gnu"
tar -xzf "$RELEASE_DIR/$LINUX_BINDING_PACKAGE" -C "$RELEASE_DIR/node_modules/@libsql/linux-x64-gnu" --strip-components=1
rm -f "$RELEASE_DIR/$LINUX_BINDING_PACKAGE"

ln -sfn "$SHARED_DIR/.env" "$RELEASE_DIR/.env"
ln -sfn "$SHARED_DIR/local.db" "$RELEASE_DIR/local.db"

if [ -d "$RELEASE_DIR/public" ]; then
  chmod -R 755 "$RELEASE_DIR/public"
fi
if [ -d "$RELEASE_DIR/.next/static" ]; then
  chmod -R 755 "$RELEASE_DIR/.next/static"
fi

ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

if [ -d "$LEGACY_APP_PATH" ] && [ ! -L "$LEGACY_APP_PATH" ]; then
  mv "$LEGACY_APP_PATH" "$BASE_DIR/legacy-app-$RELEASE_ID"
fi

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

if [ -d "$RELEASES_DIR" ]; then
  mapfile -t OLD_RELEASES < <(ls -1dt "$RELEASES_DIR"/* 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) || true)
  if [ "${#OLD_RELEASES[@]}" -gt 0 ]; then
    rm -rf "${OLD_RELEASES[@]}"
  fi
fi

pm2 status "$APP_NAME"
echo "Release $RELEASE_ID live at $LEGACY_APP_PATH"
