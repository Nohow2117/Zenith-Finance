# Changelog — Zenith Finance

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
