#!/usr/bin/env bash
set -euo pipefail

APP_NAME="artdefinance"
BASE_DIR="$HOME/deployments/$APP_NAME"
SHARED_DIR="$BASE_DIR/shared"
DB_PATH="$SHARED_DIR/local.db"
BACKUP_DIR="$SHARED_DIR/backups"
RETENTION_HOURS=48

if [ ! -f "$DB_PATH" ]; then
  echo "[backup-db] Database not found at $DB_PATH — skipping" >&2
  exit 0
fi

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_FILE="$BACKUP_DIR/local_${TIMESTAMP}.db"

cp "$DB_PATH" "$BACKUP_FILE"
echo "[backup-db] Created backup: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

find "$BACKUP_DIR" -name "local_*.db" -type f -mmin +$((RETENTION_HOURS * 60)) -delete 2>/dev/null || true

REMAINING=$(find "$BACKUP_DIR" -name "local_*.db" -type f | wc -l)
echo "[backup-db] Pruning complete — $REMAINING backup(s) retained"
