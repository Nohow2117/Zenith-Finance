# Agents Rules — Zenith Finance

> **Severità: MASSIMA.** Ogni agente AI che opera su questo progetto DEVE rispettare TUTTE le regole elencate. Nessuna eccezione è ammessa. La violazione di anche una sola regola invalida l'intero output dell'agente.

---

## 0. Prerequisiti Obbligatori

Prima di scrivere UNA SOLA RIGA DI CODICE, l'agente DEVE:

1. Leggere **integralmente** i file `docs/brief.md`, `docs/prd.md`, `docs/architecture.md`.
2. Leggere **integralmente** questo file (`docs/agents.md`).
3. Leggere **integralmente** il file `docs/changelogs.md`.
4. Verificare la struttura corrente del progetto esaminando l'albero delle cartelle.
5. Mai assumere — sempre verificare lo stato attuale del codice prima di modificarlo.

---

## 1. Stack Tecnologico — VINCOLI INVIOLABILI

| Layer        | Tecnologia Obbligatoria         | Divieti Assoluti                     |
| ------------ | ------------------------------- | ------------------------------------ |
| Framework    | Next.js 14+ (App Router)       | Pages Router, Remix, Nuxt, SvelteKit |
| Styling      | Tailwind CSS (tema custom)      | CSS Modules, Styled Components, SCSS |
| Database     | Turso (LibSQL)                  | SQLite locale, PostgreSQL, MySQL     |
| ORM          | Drizzle **oppure** Prisma       | TypeORM, Sequelize, raw SQL inline   |
| AI           | OpenRouter API                  | OpenAI diretto, Anthropic diretto    |
| Hosting      | Vercel (Serverless)             | Docker, VPS, AWS Lambda diretto      |
| Linguaggio   | TypeScript strict               | JavaScript puro (.js/.jsx)           |

**Regola critica:** Se un agente introduce una dipendenza NON presente in questo elenco, DEVE giustificarlo esplicitamente nel changelog specificando il motivo tecnico. Librerie UI (es. Recharts, Framer Motion) sono ammesse solo se coerenti con lo stack.

---

## 2. Regole di Codice

### 2.1 Principi Generali
- **Scrivi il minimo codice possibile** per raggiungere l'obiettivo. Nessun over-engineering.
- **DRY assoluto.** Se duplici logica, hai sbagliato.
- **Single Responsibility.** Ogni file, funzione, componente ha UN solo scopo.
- **No magic numbers/strings.** Costanti in `lib/constants.ts`.
- **No `any`** in TypeScript. Mai. Definisci i tipi in `types/`.
- **No `console.log` in produzione.** Usa un logger strutturato o rimuovili.

### 2.2 Naming Convention
| Entità           | Convenzione                    | Esempio                        |
| ---------------- | ------------------------------ | ------------------------------ |
| File componenti  | `kebab-case.tsx`               | `account-card.tsx`             |
| File utility     | `kebab-case.ts`                | `format-currency.ts`           |
| Componenti React | `PascalCase`                   | `AccountCard`                  |
| Funzioni/variabili | `camelCase`                  | `getAccountBalance`            |
| Costanti         | `UPPER_SNAKE_CASE`             | `MAX_WITHDRAWAL_AMOUNT`        |
| Tabelle DB       | `snake_case` plurale           | `atm_withdrawals`              |
| Colonne DB       | `snake_case`                   | `balance_eur`                  |
| Route API        | `kebab-case`                   | `/api/ai/parse-statement`      |

### 2.3 Struttura Componenti
```
/components
├── /ui          → Elementi atomici riutilizzabili (Button, Input, Modal)
├── /charts      → Componenti grafici
├── /cards       → Carte di debito animate
└── /layout      → Header, Navbar, Footer, Sidebar
```

- Ogni componente DEVE avere le sue props tipizzate con `interface`.
- Nessun componente oltre 150 righe. Se lo supera, va decomposto.
- I componenti NON accedono mai direttamente al database. I dati arrivano via Server Actions o props.

### 2.4 Server Actions & API Routes
- Le Server Actions vanno in file dedicati dentro `/app/_actions/`.
- Ogni Server Action DEVE validare gli input con `zod`.
- Le API Routes sono riservate SOLO per integrazioni esterne (OpenRouter).
- Nessuna logica di business nelle API Routes — solo orchestrazione.

---

## 3. Database — Regole di Ferro

- Lo schema DEVE corrispondere a quello definito in `docs/architecture.md`. Modifiche allo schema richiedono aggiornamento SINCRONO della documentazione.
- Ogni query DEVE usare l'ORM scelto. **Zero raw SQL inline** nei componenti o nelle actions.
- Le migrazioni sono obbligatorie. Nessuna modifica manuale al DB.
- **I dati sensibili (PAN completo, CVV) NON DEVONO MAI esistere nel database.** Solo ultime 4 cifre e scadenza.
- I valori monetari sono `REAL` con 2 decimali. Nessun arrotondamento arbitrario.

---

## 4. UI/UX — Standard Inderogabili

- **Tema:** Dark Mode OBBLIGATORIO. Background `#0B0E11`, accenti `#00D395`.
- **Lingua:** TUTTA l'interfaccia utente in **Inglese**. Zero testo italiano nel frontend.
- **Ispirazione:** Anchor Protocol. L'estetica deve comunicare finanza decentralizzata premium.
- **Responsività:** Desktop-first, ma DEVE funzionare su tablet (768px) e mobile (375px).
- **Accessibilità minima:** Ogni elemento interattivo DEVE avere un `aria-label` o testo accessibile.
- **Animazioni:** Sottili e performanti (preferire `transform`/`opacity`). No animazioni bloccanti il thread principale.
- **Font:** Utilizzare Google Fonts (Inter o equivalente). Mai font di sistema di default.
- **Loading states:** Ogni operazione asincrona DEVE mostrare uno stato di caricamento.
- **Error states:** Ogni errore DEVE essere gestito visivamente con toast o messaggi inline.

---

## 5. Sicurezza — Regole Non Negoziabili

- Le credenziali (`USER_PIN`, `ADMIN_PASSWORD`) vivono ESCLUSIVAMENTE in variabili d'ambiente (`.env`).
- Le environment variables SENSIBILI non sono MAI esposte al client. Usare solo `server-only`.
- Il middleware di autenticazione DEVE proteggere `/dashboard` e `/admin` controllando il cookie di sessione.
- Le API Routes DEVONO validare l'autenticazione prima di qualsiasi operazione.
- Nessun dato utente/admin viene MAI loggato in chiaro.
- **CORS**: Le API Routes devono accettare richieste SOLO dall'origine del proprio dominio.

---

## 6. Workflow Obbligatorio per Ogni Task

Ogni agente, per QUALUNQUE modifica (anche di una sola riga), DEVE seguire questo flusso:

```
1. LEGGERE docs/ (brief, prd, architecture, agents, changelogs)
2. ANALIZZARE il codice esistente prima di modificarlo
3. PIANIFICARE le modifiche e descriverle prima di implementarle
4. IMPLEMENTARE seguendo tutte le regole di questo documento
5. VERIFICARE che il codice compili (`npm run build` DEVE passare)
6. AGGIORNARE changelogs.md con una entry conforme al formato
7. AGGIORNARE la documentazione se lo schema DB o l'architettura cambiano
```

**Se un agente salta anche un solo step, l'intero output è da considerarsi invalido.**

---

## 7. Gestione Errori e Edge Cases

- Ogni `fetch` e ogni chiamata esterna DEVE avere un `try/catch` con gestione esplicita.
- Le Server Actions DEVONO restituire un oggetto `{ success: boolean, data?, error? }`.
- Timeout obbligatorio su chiamate esterne (OpenRouter): massimo 30 secondi.
- Mai swalloware errori silenziosamente. Se catturi un errore, loggalo E comunica all'utente.

---

## 8. Divieti Assoluti

> **La violazione di uno di questi punti è motivo di rigetto totale dell'output.**

1. ❌ Non creare file senza scopo chiaro e documentato.
2. ❌ Non installare pacchetti senza giustificazione tecnica nel changelog.
3. ❌ Non modificare lo schema DB senza aggiornare `architecture.md`.
4. ❌ Non scrivere commenti ovvi (`// increment counter` sopra `counter++`).
5. ❌ Non lasciare `TODO`, `FIXME`, `HACK` senza issue associata.
6. ❌ Non usare `!important` in CSS/Tailwind salvo casi documentati.
7. ❌ Non hardcodare URL, chiavi API, credenziali nel codice sorgente.
8. ❌ Non creare file `.js` o `.jsx`. Solo `.ts` e `.tsx`.
9. ❌ Non pushare codice che non compila (`npm run build` fallisce).
10. ❌ Non ignorare le regole di questo documento "perché è più veloce".

---

## 9. Skills Installate — Riferimento Obbligatorio

Il progetto include 5 skills in `.agents/skills/`. Ogni agente DEVE consultare la skill pertinente PRIMA di implementare codice nel relativo dominio.

### 9.1 `frontend-design`
- **Quando:** Ogni volta che si crea o modifica un componente UI, si definiscono colori, font, spacing, hover states.
- **Come:** Leggere `.agents/skills/frontend-design/SKILL.md` e applicare i principi dark-first, neon accents, glassmorphism, glow effects. Questa skill definisce l'**identità visiva Anchor Protocol** del progetto.
- **Obbligatoria per:** Qualsiasi lavoro su layout, temi, palette colori, tipografia.

### 9.2 `frontend-ui-ux-engineer`
- **Quando:** Serve trasformare componenti funzionali in UI visivamente premium, garantire accessibilità, spacing consistente, loading/error states.
- **Come:** Leggere `.agents/skills/frontend-ui-ux-engineer/SKILL.md` e seguire le checklist di qualità (color contrast WCAG AA, keyboard navigation, skeleton loaders).
- **Obbligatoria per:** Review di qualità visiva, refactoring UI, aggiunta micro-interactions.

### 9.3 `animation-designer`
- **Quando:** Si implementano animazioni, transizioni, loading states, contatori animati (es. saldi), card flip, modali.
- **Come:** Leggere `.agents/skills/animation-designer/SKILL.md` e usare Framer Motion con i pattern documentati (fade-in, staggered lists, scroll-triggered, spring physics).
- **Obbligatoria per:** Qualsiasi componente che include `motion.*`, `useScroll`, `AnimatePresence`, o animazioni CSS custom.

### 9.4 `nextjs-app-router-patterns`
- **Quando:** Si creano nuove route, layout, pagine, Server Actions, API Routes, o si configura caching/revalidation.
- **Come:** Leggere `.agents/skills/nextjs-app-router-patterns/SKILL.md` e seguire i pattern per Server Components, streaming con Suspense, parallel routes, metadata SEO.
- **Obbligatoria per:** Qualsiasi file dentro `/app`, creazione di nuove pagine, Server Actions in `/_actions/`.

### 9.5 `tailwindcss-advanced-layouts`
- **Quando:** Si costruiscono layout complessi (dashboard grid, sidebar + main, card grid responsive, sticky header).
- **Come:** Leggere `.agents/skills/tailwindcss-advanced-layouts/SKILL.md` e applicare i pattern CSS Grid, Flexbox, container queries, z-index layering system.
- **Obbligatoria per:** Layout di pagina, grid responsive, posizionamento sticky/fixed, gestione z-index.

> **Regola:** Se un agente implementa codice in un dominio coperto da una skill senza averla consultata, l'output è da considerarsi non conforme.
