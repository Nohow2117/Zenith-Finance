# ArtDeFinance

Hybrid finance demo platform built with Next.js App Router, Tailwind CSS, Drizzle, LibSQL/Turso, and OpenRouter.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`.

3. Start the app:

```bash
npm run dev
```

4. Create a production build when needed:

```bash
npm run build
```

## Fixed Deploy Procedure

This project now uses a release-based VPS deploy flow.

### Remote Layout

```text
/home/artdefinance/deployments/artdefinance
├── bin/
│   ├── backup-db.sh
│   ├── restore-db.sh
│   └── rollback-release.sh
├── current -> /home/artdefinance/deployments/artdefinance/releases/<release-id>
├── releases/
├── shared/
│   ├── .env
│   ├── local.db
│   └── backups/
└── incoming/
```

`/home/artdefinance/app` is a symlink to the current live release, so PM2 and Nginx can keep the same application path.

### Deploy Command

From Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

The script will:
- build the app locally;
- package a complete Linux-ready standalone artifact;
- upload it to the VPS as a release artifact;
- unpack it into a timestamped release directory;
- symlink shared `.env` and `local.db`;
- reload PM2 only after the release is ready;
- keep only the latest releases on the server.

### Rollback

To rollback directly on the VPS to the previous release:

```bash
bash /home/artdefinance/deployments/artdefinance/bin/rollback-release.sh
```

To rollback to a specific release id:

```bash
bash /home/artdefinance/deployments/artdefinance/bin/rollback-release.sh 20260407-153000
```

### Database Backup

A cron job runs `bin/backup-db.sh` every 3 hours. Backups are stored in `shared/backups/` with naming `local_YYYY-MM-DD_HH-MM.db`. Files older than 48 hours are automatically pruned. Each deploy also creates a `local_pre-deploy_<release-id>.db` safety backup.

To restore interactively:

```bash
bash /home/artdefinance/deployments/artdefinance/bin/restore-db.sh
```

To restore a specific backup by partial timestamp match:

```bash
bash /home/artdefinance/deployments/artdefinance/bin/restore-db.sh 2026-04-08
```

### Operational Notes

- Never deploy by copying files manually into `/home/artdefinance/app`.
- Never store `.env` or `local.db` inside a release permanently.
- Never delete or overwrite `local.db` or `shared/backups/` directly.
- `shared/.env` and `shared/local.db` are the source of truth for runtime secrets and persisted demo data.
- If the server is memory-constrained, the Linux `libsql` native binding is already bundled in the artifact and does not need a remote `npm install`.

## Production SSL

- DNS for `artdefinance.com` and `www.artdefinance.com` should stay proxied through Cloudflare.
- The VPS origin is configured with a Cloudflare Origin CA certificate in `/etc/ssl/artdefinance/`.
- Nginx terminates TLS on port `443` and redirects `80` to `https`.
- After HTTPS is active, `COOKIE_SECURE` must stay set to `"true"` in `shared/.env`.
