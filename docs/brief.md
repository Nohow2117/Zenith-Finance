# Project Brief: Zenith Finance

## 1. Panoramica del Progetto
**Zenith Finance** è un prototipo ad alta fedeltà di una piattaforma finanziaria ibrida (DeFi / TradFi) progettata a scopo dimostrativo, educativo e di design fiction. L'obiettivo è simulare un ecosistema in cui l'utente può visualizzare e gestire un portafoglio aggregato di molteplici conti bancari e investimenti crypto, unendo l'interfaccia tipica dei protocolli decentralizzati (es. Anchor Protocol) con le funzionalità di banking tradizionale (carte di debito, prelievi ATM).

Il progetto è suddiviso in due interfacce protette da password (hardcoded per facilitare la demo):
1. **Dashboard Utente**: Un'interfaccia "read-only" ad alto impatto visivo dove l'utente visualizza saldi, carte, grafici e interagisce con finte funzionalità di prelievo.
2. **Pannello Admin**: Il "dietro le quinte" del prototipo, dove l'amministratore può manipolare i dati visualizzati, aggiornare i saldi dei singoli conti e caricare le transazioni (manualmente o tramite parsing LLM).

## 2. Obiettivi Principali
* Costruire un'interfaccia utente credibile, immersiva e visivamente appagante.
* Garantire la persistenza dei dati fittizi tramite un database leggero (SQLite), in modo che le sessioni di demo non si resettino al refresh della pagina.
* Dimostrare l'integrazione di Intelligenze Artificiali (OpenRouter LLM) nel flusso di lavoro admin per l'automazione dell'inserimento dati (da estratti conto reali a json).
* Fornire un'esperienza fluida ospitata via web (hosting Vercel).

## 3. Funzionalità Chiave

### 3.1 Esperienza Utente (Front-end)
* **Visualizzazione Aggregata:** L'utente visualizza un Saldo Totale calcolato matematicamente come la somma esatta dei saldi di 5-6 sottoconti distinti (es. Fineco, WeBank, Findomestic, Staking, Liquidity Pool, ecc.).
* **Gestione Carte di Debito:** Ogni sottoconto ha una propria carta virtuale associata. L'utente può cliccare su "Mostra Dati" (con autenticazione PIN fittizia) per rivelare PAN (parzialmente oscurato), scadenza e circuito, senza mostrare il CVV.
* **Cronologia Transazioni Interattiva:** Lista movimenti che simula la spesa quotidiana e i rendimenti, con una conversione visiva istantanea (mockup) tra USDT ed Euro.
* **Simulazione Prelievo ATM:** Un flusso guidato che permette all'utente di prenotare un prelievo fisico. Seleziona il conto, la data e un importo fisso preimpostato (es. 2000€, 2500€, 3000€). Al termine, l'azione genera uno stato visivo di "In attesa di approvazione".
* **Visualizzazione Dati:** Grafici a linea statici che offrono l'illusione ottica del trend di crescita del portafoglio.

### 3.2 Gestione Amministrativa (Back-office)
* **Manipolazione Saldi:** L'admin può modificare unicamente il saldo dei singoli sottoconti; il sistema aggiorna in automatico il Saldo Totale dell'utente.
* **Generazione Storico Transazioni:**
    * *Manuale:* Inserimento puntuale di singole transazioni fittizie.
    * *AI-Assisted (OpenRouter):* Un modulo testuale dove l'admin incolla l'estratto di testo generato da un LLM esterno (a cui in precedenza l'admin ha fornito PDF/CSV reali).
* **Gestione Dati Carte:** L'admin imposta i parametri base (Scadenza, Numerazione parziale) per le carte visibili all'utente.

## 4. Linee Guida UI/UX e Design System
* **Ispirazione:** Anchor Protocol.
* **Tema:** Deep Dark Mode (sfondi blu notte/grigio scuro scuro).
* **Accenti:** Colori al neon (principalmente verde acido/smeraldo) per pulsanti primari, indicatori positivi e linee di grafico.
* **Layout:**
    * Navigazione tramite **Navbar superiore** classica.
    * Strutturazione dei contenuti a blocchi/schede (Cards) con bordi smussati.
    * UI pulita, minimale, che trasmette sicurezza istituzionale.
* **Lingua:** L'intera interfaccia utente sarà localizzata in **Inglese**.

## 5. Stack Tecnologico (Overview)
* **Frontend/Backend:** Framework reattivo full-stack (da dettagliare in `architettura.md`) ottimizzato per il deployment su **Vercel**.
* **Database:** **SQLite** per una gestione leggera e persistente dei dati senza necessità di configurare server database esterni.
* **AI Provider:** **OpenRouter** (per l'elaborazione degli estratti conto nel flusso Admin).

## 6. Vincoli e Disclaimer
* Il progetto è strettamente a uso dimostrativo. Non elabora pagamenti reali, non si collega ad API bancarie reali e non gestisce asset crittografici reali in chain.
* Le credenziali di accesso sono fisse (hardcoded) nel codice per garantire un rapido accesso durante le dimostrazioni.