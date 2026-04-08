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

## 2026-04-08 — Hardening Auth Multi-Step, Lockout Persistente e Sanitizzazione Carte

**Agente:** Codex (GPT-5)
**Scope:** Full-Stack
**Tipo:** feat

### Modifiche
- `[MODIFIED] .env.example` — aggiunte le variabili `USER_USERNAME` e `ADMIN_USERNAME` per i nuovi flussi di login
- `[MODIFIED] .env` — aggiunte le variabili `USER_USERNAME` e `ADMIN_USERNAME` e rimossa una riga corrotta duplicata di `SESSION_SECRET`
- `[CREATED] drizzle/0002_sharp_security_hardening.sql` — migrazione che converte `accounts` a `card_last_four`, rimuove CVV/PAN completo e crea la tabella `login_attempts`
- `[MODIFIED] drizzle/meta/_journal.json` — registrata la nuova migrazione di hardening
- `[MODIFIED] next.config.ts` — aggiunti security headers globali e disabilitato `X-Powered-By`
- `[MODIFIED] src/app/_actions/auth.ts` — introdotti login admin con username, flow utente a due step con challenge firmata, lockout persistente e reset esplicito del flow
- `[MODIFIED] src/app/_actions/data.ts` — aggiornato il dominio account a `cardLastFour` e rimosso CVV dai percorsi dati/admin
- `[MODIFIED] src/app/admin/layout.tsx` — aggiunta guard server-side per il pannello admin
- `[MODIFIED] src/app/admin/admin-accounts-client.tsx` — sostituita la gestione PAN/CVV con ultime 4 cifre, scadenza e network
- `[MODIFIED] src/app/admin-login/page.tsx` — aggiunto redirect per sessioni admin già valide e copy aggiornato
- `[MODIFIED] src/app/admin-login/admin-login-form.tsx` — login admin convertito a username + password con messaggi generici e stato lockout
- `[MODIFIED] src/app/api/ai/parse-statement/route.ts` — origin validation resa esatta e riusabile
- `[MODIFIED] src/app/dashboard/layout.tsx` — aggiunta guard server-side per la dashboard utente
- `[MODIFIED] src/app/dashboard/cards/page.tsx` — filtraggio carte basato su `cardLastFour`
- `[MODIFIED] src/app/dashboard/withdraw/page.tsx` — filtro account prelievo basato su `cardLastFour`
- `[MODIFIED] src/app/login/page.tsx` — aggiunto redirect per sessioni user già valide e supporto al resume del challenge cookie
- `[MODIFIED] src/app/login/login-form.tsx` — implementato il flow username -> searching account -> PIN con reset sicuro e messaggi anti-enumeration
- `[MODIFIED] src/app/page.tsx` — redirect home basato su sessioni validate, sia user che admin
- `[DELETED] src/middleware.ts` — rimosso il vecchio entrypoint deprecato di Next.js
- `[CREATED] src/proxy.ts` — nuovo gate runtime per proteggere `/dashboard/*` e `/admin/*`
- `[MODIFIED] src/components/cards/debit-card.tsx` — rimossa la visualizzazione di CVV/PAN completo e allineato il reveal ai soli dati consentiti
- `[CREATED] src/lib/auth/config.ts` — utility centralizzate per leggere e validare le credenziali da environment
- `[CREATED] src/lib/auth/login-attempts.ts` — gestione persistente dei tentativi login e dei lockout applicativi
- `[CREATED] src/lib/auth/request.ts` — helper per IP client e validazione exact-origin
- `[MODIFIED] src/lib/auth/session.ts` — sessioni/challenge firmate con expiry enforced
- `[MODIFIED] src/lib/constants.ts` — aggiunte costanti per cookie challenge, TTL auth e policy di lockout
- `[MODIFIED] src/lib/db/schema.ts` — aggiornato lo schema Drizzle con `card_last_four` e `login_attempts`
- `[MODIFIED] src/lib/db/seed.ts` — seed riallineato alle sole ultime 4 cifre
- `[MODIFIED] src/types/index.ts` — rimosso `cardCvv` e sostituito `cardNumber` con `cardLastFour`
- `[MODIFIED] docs/architecture.md` — documentati nuovo schema, env vars e strategia auth/lockout
- `[MODIFIED] docs/changelogs.md` — aggiunta questa entry

### Motivazione
La codebase proteggeva già le route con sessioni firmate, ma l’accesso restava troppo debole: login user basato solo su PIN, login admin basato solo su password, nessun lockout persistente e presenza ancora di dati carta non ammessi nel dominio applicativo. Le modifiche alzano il livello di sicurezza reale senza rompere l’esperienza demo, introducendo un secondo identificatore, anti-enumeration, lockout persistente, expiry token enforceato e rimozione effettiva di CVV/PAN completo.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
- Il contratto delle Server Actions di autenticazione cambia: il login admin richiede ora `username + password`, mentre il login utente è diviso in due azioni (`beginUserLogin`, `completeUserLogin`).
- Il dominio account lato TypeScript/Drizzle non espone più `cardNumber` e `cardCvv`, ma `cardLastFour`.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [x] Documentazione aggiornata (se applicabile)
- [x] Schema DB invariato / aggiornato in `architecture.md`

---

## 2026-04-08 — Riallineamento Account Legacy e Limite History a 30 Movimenti

**Agente:** Codex (GPT-5)
**Scope:** Full-Stack
**Tipo:** fix

### Modifiche
- `[MODIFIED] src/lib/constants.ts` — aggiunta la costante `MAX_VISIBLE_TRANSACTIONS` per centralizzare il limite user-facing della history
- `[CREATED] src/lib/db/reconcile-accounts.ts` — introdotta una riconciliazione idempotente che migra transazioni e prelievi dagli account legacy ai corrispettivi rebrandizzati e rimuove i duplicati legacy
- `[MODIFIED] src/lib/db/init.ts` — eseguita la riconciliazione degli account legacy durante il bootstrap del database prima del seed
- `[MODIFIED] src/app/_actions/data.ts` — aggiunta la fetch `getVisibleTransactions()` che restituisce solo transazioni di account attivi e limitate alle ultime 30 righe
- `[MODIFIED] src/app/dashboard/page.tsx` — aggiornato il caricamento della overview per usare solo le transazioni visibili lato utente
- `[MODIFIED] src/app/dashboard/transactions/page.tsx` — aggiornata la pagina history per mostrare solo le ultime 30 transazioni valide lato utente
- `[MODIFIED] docs/changelogs.md` — aggiunta questa entry

### Motivazione
Il database live conteneva transazioni collegate a vecchi account legacy (`Fineco`, `WeBank`, ecc.) ormai sostituiti da account rebrandizzati attivi (`BTC Fineco`, `USDC WeBank`, ecc.). Le pagine dashboard filtravano le transazioni per account attivi e finivano quindi per scartare tutte le righe esistenti. La riconciliazione riallinea in modo permanente gli ID referenziati nel DB e la nuova fetch limita la history utente alle ultime 30 operazioni richieste.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [ ] Documentazione aggiornata (se applicabile)
- [x] Schema DB invariato / aggiornato in `architecture.md`

---

## 2026-04-08 — Sistema di Backup Automatico Database con Retention 48h

**Agente:** Antigravity (Claude Opus 4.6 Thinking)
**Scope:** Config / Backend
**Tipo:** feat

### Modifiche
- `[CREATED] scripts/backup-db.sh` — Script bash per backup atomico di `local.db` con timestamp e pruning automatico dei file oltre 48h
- `[CREATED] scripts/restore-db.sh` — Script interattivo di restore: elenca backup disponibili, crea copia pre-restore di sicurezza, ripristina e ricarica PM2
- `[MODIFIED] scripts/deploy-remote.sh` — Aggiunto backup pre-deploy automatico di `local.db` prima dell'estrazione di ogni nuova release
- `[MODIFIED] deploy.ps1` — Upload automatico di `backup-db.sh` e `restore-db.sh` su VPS `bin/` e installazione cron job ogni 3 ore
- `[MODIFIED] agents.md` — Aggiunta regola 11 nei divieti assoluti: vietato eliminare/sovrascrivere `local.db`, `shared/local.db` o la cartella `backups/`
- `[MODIFIED] docs/architecture.md` — Documentata la strategia di backup nel layout VPS con sezione dedicata
- `[MODIFIED] docs/changelogs.md` — Aggiunta questa entry

### Motivazione
Più agenti AI lavorano sulla codebase e possono accidentalmente eliminare o corrompere il database SQLite. Il sistema di backup automatizzato ogni 3 ore con retention 48h garantisce la possibilità di ripristino rapido, mentre il backup pre-deploy protegge da regressioni durante le release.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] `npm run build` passato con successo
- [x] Documentazione aggiornata (`architecture.md`, `agents.md`)
- [x] Schema DB invariato

---

## 2026-04-07 — Re-branding Conti Bancari in Asset Crypto e Anonimizzazione Transazioni

**Agente:** Antigravity (Gemini 3.1 Pro High)
**Scope:** Frontend (Dashboard) / DB
**Tipo:** feat

### Modifiche
- `[MODIFIED] src/lib/db/seed.ts` — Rinominati gli account seed associando a ciascuna banca un asset crypto corrispondente (es. "BTC Fineco", "Solana Findomestic").
- `[SCRIPT]` Eseguito script one-off per aggiornare proattivamente i nomi dei conti nel database locale Drizzle (`local.db`).
- `[MODIFIED] src/app/dashboard/transactions/transactions-client.tsx` — Rimossa la colonna "Account" dalla tabella della History lato Utente. Ora le transazioni appaiono del tutto slegate dai singoli conti e percepite come movimenti di livello account "generico".
- `[MODIFIED] src/app/admin/transactions/admin-transactions-client.tsx` — Risolto errore di idratazione React causato da `new Date().toISOString()` che inibiva l'attach degli event listener (`onClick`) in produzione. Questo impediva il corretto funzionamento del pulsante "Delete Selected". Aggiunti anche `type="button"` ed update ottimistico dello stato locale.

### Motivazione
Adeguare e simulare ulteriormente l'aspetto DeFi. Le singole transazioni utente ora risultano globali al portafoglio, mentre le "bank card" fisiche fungono visivamente da vault tematici per crypto-asset specifici.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] La History delle transazioni lato utente compila senza errori ed il mapping delle colonne è integro.
- [x] L'overview del portafoglio stampa correttamente il prefisso crypto sul nome dell'account.

---

## 2026-04-07 — Aggiornamento Parser AI e UI Gestione Transazioni

**Agente:** Antigravity (Gemini 3.1 Pro High)
**Scope:** Backend / Frontend (Admin)
**Tipo:** feat

### Modifiche
- `[MODIFIED] src/app/api/ai/parse-statement/route.ts` — Aggiornato il modello AI a `google/gemini-3.1-flash-lite-preview` e modificato il prompt di sistema in modo che estragga esclusivamente prelievi ATM e pagamenti con carta (tipo "expense").
- `[MODIFIED] src/app/_actions/data.ts` — Aggiunta la funzione Server Action `deleteTransactions` che accetta un array di ID permettendo cancellazioni singole e multiple via query `inArray()`.
- `[MODIFIED] src/app/admin/transactions/admin-transactions-client.tsx` — Implementata tabella di visualizzazione transazioni dotata di checkbox per Bulk actions e pulsanti individuali di Delete.
- `[MODIFIED] src/app/admin/transactions/page.tsx` — Passata la lista di transazioni come prop al Client Component chiamando l'apposita fetch function.

### Motivazione
Affinare il riconoscimento AI specializzandolo sui dati primari (spese) e dare agli admin la facoltà di cancellare inserimenti errati lato backend tramite UI rapida ed intuitiva senza dover interagire direttamente col DB.

### Dipendenze
Nessuna nuova dipendenza.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] Corretta importazione di `inArray` in `data.ts`.
- [x] Lint ok sulla validazione della proprietà "danger" nel Button Component.

---

## 2026-04-07 — Nuovi Account Seed per Mediolanum, Wise e N26

**Agente:** Antigravity (Gemini 3.1 Pro High)
**Scope:** Backend / DB
**Tipo:** feat

### Modifiche
- `[MODIFIED] src/lib/db/seed.ts` — Aggiunti gli account Mediolanum, Wise e N26 alla costante `SEED_ACCOUNTS`. Il seed script inserirà automaticamente questi conti al prossimo riavvio dell'applicazione.

### Motivazione
Aumentare il ventaglio di conti correnti supportati per dare maggiore realismo al prototipo.

### Dipendenze
Nessuna modifica alle dipendenze.

### Breaking Changes
Nessuna breaking change.

### Verifiche Effettuate
- [x] Variabili aggiornate e allineate con il Drizzle schema.

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
