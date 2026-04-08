# Technical Architecture: ArtDeFinance

## 1. Stack Tecnologico Obbligatorio

Per garantire persistenza dei dati e un'interfaccia ad alte prestazioni, il progetto DEVE utilizzare il seguente stack:

* **Framework:** **Next.js 14+ (App Router)**. Utilizzo di Server Actions per la logica di backend e comunicazione DB.
* **Styling:** **Tailwind CSS**. Tema custom "ArtDeFi Dark" (Black/Deep Navy #0B0E11 con accenti Neon Green #00D395).
* **Database (Persistence):** **Turso (LibSQL/SQLite)**. Può operare sia in remoto (Turso cloud) sia con file SQLite locale su VPS.
* **ORM:** **Drizzle**. Per la gestione dello schema e le migrazioni del database.
* **AI Integration:** **OpenRouter API**. Gateway per l'invio dei testi degli estratti conto a modelli LLM (Gemini 1.5 Flash o Claude 3.5 Sonnet).
* **Hosting:** **VPS Linux** (185.165.169.119) — Next.js in modalità `standalone` con Node.js + reverse proxy Nginx/Caddy.
* **Deploy Strategy:** release atomiche su VPS con symlink `current`, cartella `shared` per `.env` e `local.db`, rollback rapido senza deploy in-place.
* **TLS Termination:** Cloudflare proxy + certificato Cloudflare Origin CA installato su Nginx in VPS per modalità SSL `Full (strict)`.

---

## 2. Schema del Database (SQL/LibSQL)

Il database deve riflettere la gerarchia dei sottoconti e la gestione delle carte.

```sql
-- Tabella Account (Sottoconti: Fineco, WeBank, Staking, etc.)
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,                   -- UUID
    name TEXT NOT NULL,                    -- Nome del conto
    balance_eur REAL DEFAULT 0.0,          -- Saldo in Euro
    card_last_four TEXT,                   -- Ultime 4 cifre (es. "1234")
    card_expiry TEXT,                      -- Scadenza (es. "09/27")
    card_network TEXT,                     -- "Visa" o "Mastercard"
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Transazioni (Storico)
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    description TEXT NOT NULL,
    amount_eur REAL NOT NULL,
    amount_usdt REAL NOT NULL,             -- Calcolato su cambio fisso 1.08 o da AI
    type TEXT CHECK(type IN ('income', 'expense', 'yield')),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabella Prelievi ATM
CREATE TABLE atm_withdrawals (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    amount REAL NOT NULL,                  -- Valori ammessi: 2000, 2500, 3000
    pickup_date DATETIME NOT NULL,
    status TEXT DEFAULT 'Pending Approval',
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabella Login Attempts (lockout applicativo)
CREATE TABLE login_attempts (
    id TEXT PRIMARY KEY,
    actor_type TEXT NOT NULL,              -- 'user' | 'admin'
    username TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 0,
    window_started_at DATETIME NOT NULL,
    last_attempt_at DATETIME NOT NULL,
    locked_until DATETIME,
    lock_level INTEGER DEFAULT 0,
    last_locked_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Variabili d'Ambiente (.env)
Il file .env è il cuore della configurazione. Il developer deve impostare queste chiavi su Vercel:

```bash
# Database (Turso)
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"

# AI (OpenRouter)
OPENROUTER_API_KEY="your-openrouter-key"

# Auth (Hardcoded)
USER_USERNAME="fede171092"
USER_PIN="1234"         # PIN per sbloccare i dati carta
ADMIN_USERNAME="admin@2026"
ADMIN_PASSWORD="admin_artdefi_2024"
SESSION_SECRET="replace-with-a-long-random-secret"
COOKIE_SECURE="false"   # true in produzione quando il dominio serve HTTPS
```

## 4. Logica di Integrazione AI (OpenRouter)
Il Pannello Admin include un endpoint /api/ai/parse-statement che opera come segue:

Riceve il testo grezzo dell'estratto conto.

Invia un prompt strutturato a OpenRouter chiedendo un output solo in formato JSON.

Prompt di Sistema: "Sei un parser finanziario. Estrai transazioni (data, descrizione, importo_eur, tipo) da questo testo. Restituisci solo un array JSON. Non aggiungere commenti."

L'output viene validato dal frontend e salvato nella tabella transactions.

## 5. Struttura delle Cartelle (Folder Structure)
```text
/artdefinance
├── /app
│   ├── /api              # API Routes (AI, DB)
│   ├── /admin            # Pannello di controllo (Protetta da password)
│   ├── /dashboard        # Interfaccia utente (Protetta da PIN)
│   └── layout.tsx        # Layout principale con font e stili globali
├── /components
│   ├── /ui               # Bottoni, input, card (stile Anchor)
│   ├── /charts           # Grafici statici (Recharts o simili)
│   └── /cards            # Componenti carte di debito animate
├── /lib
│   ├── prisma.ts         # Client Database
│   └── openrouter.ts     # Client API AI
├── /prisma
│   └── schema.prisma     # Definizione modelli DB
└── tailwind.config.js    # Configurazione colori Neon e Dark Mode
```

## 6. Sicurezza Demo
Auth:
- `src/proxy.ts` controlla le sessioni firmate prima di consentire accesso a `/dashboard` e `/admin`
- `dashboard/layout.tsx` e `admin/layout.tsx` applicano guard server-side aggiuntive
- Login admin con `ADMIN_USERNAME` + `ADMIN_PASSWORD`
- Login user a due step: username -> challenge firmata a breve scadenza -> PIN
- Lockout persistente su tabella `login_attempts`: 5 errori in 15 minuti bloccano temporaneamente l'accesso, con escalation a 60 minuti in caso di ricaduta immediata

Dati Sensibili:
- PAN completo e CVV non devono esistere nel database né nei payload client
- Solo ultime 4 cifre, scadenza e circuito possono essere memorizzati/renderizzati

Headers e API:
- L'app imposta security headers base (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS)
- Le route API verificano l'origine attesa in modo esatto, non tramite matching parziale

## 7. Layout Deploy VPS
```text
/home/artdefinance/deployments/artdefinance
├── bin/
│   ├── backup-db.sh
│   ├── restore-db.sh
│   └── rollback-release.sh
├── current -> releases/<release-id>
├── releases/
├── shared/
│   ├── .env
│   ├── local.db
│   └── backups/       ← backup automatici ogni 3h, retention 48h
└── incoming/
```

Il path `/home/artdefinance/app` punta via symlink a `current` per mantenere stabile il `cwd` di PM2 e del reverse proxy.

### Backup Database
Un cron job esegue `bin/backup-db.sh` ogni 3 ore. I backup risiedono in `shared/backups/` con naming `local_YYYY-MM-DD_HH-MM.db`. I file più vecchi di 48 ore vengono eliminati automaticamente. Il deploy crea un backup aggiuntivo `local_pre-deploy_<release-id>.db` prima di ogni release. Per ripristinare: `bin/restore-db.sh [timestamp-parziale]`.

## 8. HTTPS Produzione
```text
Cloudflare (proxied DNS) -> Nginx su VPS (443 con Origin CA) -> Next.js standalone su 127.0.0.1:3000
```

Il reverse proxy deve:
- reindirizzare tutte le richieste `http` a `https`;
- servire `artdefinance.com` e `www.artdefinance.com` su `443`;
- inoltrare `X-Forwarded-Proto https` verso Next.js;
- mantenere `COOKIE_SECURE="true"` in produzione per i cookie di sessione.
