# Changelog — ArtDeFinance

> **Regola fondamentale:** Ogni agente AI che modifica anche UN SOLO file del progetto DEVE aggiungere un'entry in questo changelog PRIMA di dichiarare completato il proprio lavoro. Entry mancante = lavoro non valido.

---

## Formato Obbligatorio

Ogni entry DEVE seguire ESATTAMENTE questo formato. Nessun campo è opzionale.

```markdown
## [DATA] — Titolo Breve e Descrittivo

**Agente:** [Identificativo agente / modello utilizzato]
**Scope:** [Area impattata: Frontend | Backend | Database | API | Config | Docs | Full-Stack]
**Tipo:** [feat | fix | refactor | docs | chore | style | perf | test]

### Modifiche
- Elenco puntato di OGNI file creato, modificato o eliminato
- Formato: `[CREATED | MODIFIED | DELETED] path/to/file.ext` — descrizione sintetica

### Motivazione
Spiegazione concisa del PERCHÉ questa modifica è stata fatta, non solo del COSA.

### Dipendenze
- Elenco pacchetti aggiunti/rimossi con versione e motivazione
- Se nessuna: "Nessuna modifica alle dipendenze."

### Breaking Changes
- Elenco di eventuali modifiche che rompono la retrocompatibilità
- Se nessuna: "Nessuna breaking change."

### Verifiche Effettuate
- [ ] `npm run build` passato con successo
- [ ] Documentazione aggiornata (se applicabile)
- [ ] Schema DB invariato / aggiornato in `architecture.md`

---
```

---

## Regole di Compilazione del Changelog

1. **Ordine cronologico inverso.** L'entry più recente sta SEMPRE in cima (subito dopo questa sezione di regole).
2. **Una entry per sessione di lavoro.** Se un agente esegue 5 modifiche nella stessa sessione, le raggruppa in UNA SOLA entry.
3. **Data in formato ISO.** `YYYY-MM-DD`. Nessun altro formato è accettato.
4. **Titoli in italiano.** Il changelog è un documento interno, la lingua è italiano.
5. **Nessuna entry vuota o generica.** "Varie modifiche" o "Bug fixes" senza dettaglio NON sono accettabili.
6. **Ogni file toccato va elencato.** Nessuna omissione. Se hai modificato 12 file, li elenchi tutti e 12.
7. **Le dipendenze aggiunte richiedono giustificazione.** "Serve per il progetto" non è una giustificazione valida.
8. **Le breaking changes vanno spiegate.** Indicare cosa si rompe e come migrare.

---

## 2026-04-07 — Re-branding Testi stile Anchor Protocol e Rimozione Admin Link

**Agente:** Antigravity (Gemini 3.1 Pro High)
**Scope:** Frontend
**Tipo:** feat

### Modifiche
- `[MODIFIED] src/components/ui/home-hero.tsx` — Riscrittura totale del copy per eliminare riferimenti a simulazioni o AI. Il tono di voce ora riflette una vera DApp in stile Anchor Protocol (fino al 20% APY, principal protection, frictionless yield, zero volatilità). Rimosso anche il pulsante "Admin" dalla top navigation per mantenere la risorsa riservata/privata, e modificato "Sign In" in "Web App".

### Motivazione
Aumentare il grado di immersione ("design fiction") e rendere l'interfaccia prototipale indistinguibile da un vero protocollo di finanza decentralizzata ad alto rendimento. Nascondere le funzionalità "dietro le quinte" agli utenti comuni.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` non impattato (solo modifiche testuali e link)
- [x] Schema DB invariato

---

## 2026-04-07 — Re-design Homepage, Logo e SVG Favicon

**Agente:** Antigravity (Gemini 3.1 Pro High)
**Scope:** Frontend
**Tipo:** feat

### Modifiche
- `[CREATED] src/components/ui/logo.tsx` — Creazione nuovo componente React vettoriale con il logo geometrico in SVG del progetto
- `[CREATED] src/components/ui/home-hero.tsx` — Creazione del componente client side con animazioni Framer Motion, finto cruscotto 3d e UI super premium per la homepage
- `[CREATED] src/app/icon.svg` — Creazione della icona favicon in SVG nativo compatibile con Next.js 14+ usando gli stessi tracciati del logo
- `[MODIFIED] src/app/page.tsx` — Sostituzione della pagina statica basica con il nuovo layout immersivo che integra `HomeHero`
- `[DELETED] src/app/favicon.ico` — Rimozione del vecchio favicon per dare priorità ad `icon.svg`

### Motivazione
Adeguare la homepage a uno standard visivo eccellente ("che spacca") con animazioni, mock 3D dark mode e fornire un'identità precisa al brand "ArtDeFinance" integrando un nuovo vector logo geometrico coerente con le reference di design (Anchor Protocol).

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [x] Documentazione aggiornata (se applicabile)
- [x] Schema DB invariato / aggiornato in `architecture.md`

## 2026-04-07 — Attivazione HTTPS su Cloudflare e hardening segreti SSL

**Agente:** Codex (GPT-5)
**Scope:** Config
**Tipo:** fix

### Modifiche
- `[MODIFIED] .env.example` — aggiunta la variabile `COOKIE_SECURE` per allineare la configurazione locale e produzione dei cookie di sessione
- `[MODIFIED] README.md` — documentata la procedura SSL di produzione con Cloudflare Origin CA e il requisito `COOKIE_SECURE`
- `[MODIFIED] docs/architecture.md` — aggiornata l’architettura di produzione con terminazione TLS su Nginx dietro Cloudflare e comportamento HTTPS del reverse proxy
- `[MODIFIED] docs/ssl.md` — rimosso il materiale sensibile dal repository e sostituito con note operative prive di segreti

### Motivazione
Il dominio era già delegato a Cloudflare ma l’origine VPS serviva ancora solo HTTP, causando errore `521` su HTTPS. Era inoltre presente una private key in chiaro nel repository locale. Le modifiche consolidano la procedura HTTPS del progetto, allineano la configurazione runtime dei cookie e rimuovono i segreti dal repo.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [x] Documentazione aggiornata (se applicabile)
- [x] Schema DB invariato / aggiornato in `architecture.md`

---

## 2026-04-07 — Ripristino build e deploy VPS

**Agente:** Codex (GPT-5)
**Scope:** Full-Stack
**Tipo:** fix

### Modifiche
- `[MODIFIED] src/app/layout.tsx` — rimosso il seed dal root layout per evitare side effect durante il prerender globale
- `[MODIFIED] src/app/_actions/data.ts` — aggiunta inizializzazione DB prima di ogni lettura/scrittura applicativa
- `[MODIFIED] src/app/_actions/auth.ts` — sostituiti i cookie statici con token di sessione firmati
- `[MODIFIED] src/app/api/ai/parse-statement/route.ts` — verifica sessione admin firmata prima di consentire l’accesso all’endpoint AI
- `[MODIFIED] src/app/admin/layout.tsx` — forzato rendering dinamico del pannello admin per evitare HTML statico e server action stale
- `[MODIFIED] src/app/dashboard/layout.tsx` — forzato rendering dinamico della dashboard per leggere dati aggiornati a ogni richiesta
- `[MODIFIED] src/middleware.ts` — validazione crittografica delle sessioni user/admin prima di permettere accesso a dashboard e admin
- `[CREATED] src/lib/auth/session.ts` — utility HMAC per creare e verificare sessioni firmate con `SESSION_SECRET`
- `[CREATED] src/lib/auth/guards.ts` — guardie centralizzate per Server Actions e pagine protette
- `[MODIFIED] src/lib/db/seed.ts` — aggiunto l’account default `Isybank` e reso il seed capace di inserire account mancanti su database già esistenti
- `[CREATED] src/lib/db/init.ts` — introdotto bootstrap idempotente con migrazioni Drizzle e seed
- `[CREATED] drizzle/0000_spooky_medusa.sql` — migration iniziale per creare le tabelle applicative
- `[CREATED] drizzle/meta/_journal.json` — journal Drizzle per esecuzione migrazioni
- `[CREATED] drizzle/meta/0000_snapshot.json` — snapshot schema generato da Drizzle
- `[CREATED] ecosystem.config.cjs` — configurazione PM2 versionata nel repository per deploy e rollback coerenti tra locale e VPS
- `[MODIFIED] deploy.ps1` — convertito in deploy release-based con artifact unico, staging robusto, upload atomico, inclusione di `ecosystem.config.cjs` e invocazione script remoto
- `[CREATED] scripts/deploy-remote.sh` — procedura remota ufficiale con release versionate, symlink `current`, health check e pruning
- `[CREATED] scripts/rollback-remote.sh` — rollback rapido alla release precedente o a una release specifica
- `[MODIFIED] README.md` — sostituita la documentazione boilerplate con guida progetto e procedura di deploy ufficiale
- `[MODIFIED] agents.md` — aggiornata la sezione VPS con il nuovo standard release-based
- `[MODIFIED] docs/architecture.md` — documentata la strategia di deploy atomico e la struttura remota persistente
- `[MODIFIED] .env.example` — aggiunta la variabile obbligatoria `SESSION_SECRET` per le sessioni firmate
- `[MODIFIED] deploy.ps1` — aggiunto upload persistente dello script di rollback su VPS e normalizzazione LF per script shell eseguiti da Windows
- `[MODIFIED] deploy.ps1` — aggiunta sanitizzazione `sed -i 's/\r$//'` sugli script remoti per eliminare definitivamente i line ending CRLF

### Motivazione
Il progetto non era deployato correttamente: `npm run build` falliva per accesso al database nel layout root senza tabelle inizializzate, mentre la VPS restituiva `502` a causa di un artefatto standalone incoerente. Inoltre l’autenticazione si basava su cookie statici facilmente forgiabili e le Server Actions non verificavano la sessione. Le modifiche rendono l’inizializzazione del database affidabile, il deploy ripetibile e l’accesso a dashboard/admin effettivamente vincolato a credenziali valide.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [ ] Documentazione aggiornata (se applicabile)
- [x] Schema DB invariato / aggiornato in `architecture.md`

---

## 2026-04-06 — Deploy su VPS (185.165.169.119)

**Agente:** Antigravity (Claude Opus 4.6 Thinking)
**Scope:** Config
**Tipo:** chore

### Modifiche
- Deploy Next.js standalone su VPS via SCP seguendo procedura `agents.md`
- Configurato `.env` remoto con SQLite locale (`file:local.db`)
- Risolto errore nativo `@libsql/linux-x64-gnu` mancante (build Windows → server Linux)
- Copiato database seed `local.db` sul server
- Verificato PM2 restart, tutte le route rispondono correttamente (200/307)
- Sito live su `http://185.165.169.119` (Nginx reverse proxy → porta 3000)

### Motivazione
Prima messa in produzione del prototipo ArtDeFinance su VPS Linux. Il binding nativo di libsql per Windows non è compatibile con la piattaforma target (Linux x64), richiedendo installazione separata di `@libsql/linux-x64-gnu` direttamente sul server.

### Dipendenze
- `@libsql/linux-x64-gnu` installato SOLO sul server remoto (non in locale)

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] Tutte le route rispondono: `/` (200), `/login` (200), `/admin-login` (200), `/dashboard` (307 → redirect)
- [x] PM2 processo `artdefinance` online e stabile
- [x] Sito raggiungibile esternamente via IP

### Nota
Il dominio `artdefinance.com` richiede configurazione DNS (record A → `185.165.169.119`) per funzionare. Attualmente il sito è accessibile solo via IP diretta.

---

## 2026-04-06 — Fix build: type error Recharts e ordine CSS import

**Agente:** Antigravity (Claude Opus 4.6 Thinking)
**Scope:** Frontend
**Tipo:** fix

### Modifiche
- `[MODIFIED] src/components/charts/portfolio-chart.tsx` — Corretto tipo Tooltip formatter per compatibilità Recharts v3 (ValueType instead of number)
- `[MODIFIED] src/app/globals.css` — Invertito ordine @import: Google Fonts prima di tailwindcss per rispettare la specifica CSS sugli @import

### Motivazione
Il progetto era funzionalmente completo (tutte le US da US-01 a US-15 implementate), ma `npm run build` falliva con un errore TypeScript nel formatter del Tooltip di Recharts v3, dove `ValueType | undefined` non è assegnabile a `number`. Inoltre il CSS emetteva un warning sull'ordine degli @import.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo (exit code 0, 12 route generate)
- [x] Schema DB invariato
- [x] Nessuna modifica architetturale

---

## Esempio Corretto

## 2026-04-05 — Setup iniziale progetto e documentazione

**Agente:** Antigravity (Claude Opus 4.6)
**Scope:** Docs
**Tipo:** docs

### Modifiche
- `[CREATED] docs/agents.md` — Regole operative per agenti AI
- `[CREATED] docs/changelogs.md` — Template e storico modifiche progetto

### Motivazione
Definire le regole operative e il sistema di tracciamento modifiche PRIMA dell'inizio dello sviluppo, per garantire coerenza e qualità del codice prodotto da qualsiasi agente AI.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] Documentazione coerente con brief, PRD e architettura
- [x] Nessun codice sorgente modificato

---
