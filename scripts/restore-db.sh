#!/usr/bin/env bash
set -euo pipefail

APP_NAME="artdefinance"
BASE_DIR="$HOME/deployments/$APP_NAME"
SHARED_DIR="$BASE_DIR/shared"
DB_PATH="$SHARED_DIR/local.db"
BACKUP_DIR="$SHARED_DIR/backups"

BACKUPS=($(find "$BACKUP_DIR" -name "local_*.db" -type f | sort -r 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
  echo "[restore-db] No backups found in $BACKUP_DIR" >&2
  exit 1
fi

if [ -n "${1:-}" ]; then
  SELECTED=""
  for b in "${BACKUPS[@]}"; do
    if [[ "$b" == *"$1"* ]]; then
      SELECTED="$b"
      break
    fi
  done
  if [ -z "$SELECTED" ]; then
    echo "[restore-db] No backup matching '$1' found" >&2
    exit 1
  fi
else
  echo "[restore-db] Available backups:"
  for i in "${!BACKUPS[@]}"; do
    SIZE=$(du -h "${BACKUPS[$i]}" | cut -f1)
    echo "  [$i] $(basename "${BACKUPS[$i]}") ($SIZE)"
  done
  echo ""
  read -rp "Select backup number (0 = most recent): " CHOICE
  SELECTED="${BACKUPS[$CHOICE]}"
fi

echo "[restore-db] Restoring from: $(basename "$SELECTED")"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
if [ -f "$DB_PATH" ]; then
  cp "$DB_PATH" "$BACKUP_DIR/local_pre-restore_${TIMESTAMP}.db"
  echo "[restore-db] Current DB saved as pre-restore backup"
fi

cp "$SELECTED" "$DB_PATH"
echo "[restore-db] Database restored successfully"

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME"
  echo "[restore-db] PM2 process reloaded"
fi
