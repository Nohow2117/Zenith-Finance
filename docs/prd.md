# Product Requirements Document (PRD): Zenith Finance

## 1. Introduzione e Scopo
Questo documento delinea i requisiti funzionali per la creazione di **Zenith Finance**, un prototipo web fittizio che simula un cruscotto ibrido di finanza tradizionale e decentralizzata. Il prodotto è diviso in due aree principali: la **Dashboard Utente** (Front-office) per la visualizzazione passiva e la prenotazione di operazioni fittizie, e il **Pannello Admin** (Back-office) per l'impostazione dei dati, la manipolazione dei saldi e l'importazione assistita dall'IA delle transazioni.

## 2. Ruoli di Sistema
* **User (Utente):** Accede alla dashboard in modalità "read-only" (o limitatamente interattiva) per visualizzare i propri fondi, le carte e richiedere finti prelievi.
* **Admin (Amministratore):** Accede al back-office per manipolare i dati di sistema, gestire i saldi, creare transazioni ed eseguire il parsing di documenti tramite AI.

---

## 3. User Stories (Requisiti Funzionali)

### 3.1 Epica: Dashboard e Visualizzazione Saldi
* **US-01:** Come *Utente*, voglio vedere il mio "Saldo Totale Aggregato" in alto nella dashboard, in modo da avere una visione immediata del mio capitale complessivo.
* **US-02:** Come *Utente*, voglio vedere il mio saldo totale suddiviso in schede specifiche per ogni conto o investimento (es. Fineco, WeBank, Staking), in modo da capire come sono distribuiti i miei fondi.
* **US-03:** Come *Utente*, voglio visualizzare un grafico a linee statico (stile trend positivo) associato al mio portafoglio, in modo da percepire una finta crescita del mio capitale in stile DeFi.

### 3.2 Epica: Carte di Debito
* **US-04:** Come *Utente*, voglio visualizzare una rappresentazione grafica di una carta di debito per ogni mio singolo conto associato.
* **US-05:** Come *Utente*, voglio cliccare su un pulsante "Show Data" (Mostra Dati) sulla mia carta e inserire un PIN fittizio, in modo da attivare un'animazione di sblocco.
* **US-06:** Come *Utente*, una volta inserito il PIN, voglio vedere in chiaro la data di scadenza e il PAN (parzialmente oscurato, es. `**** 1234`), escludendo volutamente il CVV.

### 3.3 Epica: Transazioni e Prelievi ATM
* **US-07:** Come *Utente*, voglio vedere una cronologia delle mie transazioni con i relativi importi mostrati sia in valuta Fiat (EUR) che convertiti in Crypto (USDT), per simulare l'ambiente Web3.
* **US-08:** Come *Utente*, voglio poter avviare la procedura "ATM Withdrawal" (Prelievo ATM) selezionando un conto e una data specifica.
* **US-09:** Come *Utente*, durante la procedura di prelievo, voglio poter selezionare solo tre importi preimpostati (2000€, 2500€, 3000€).
* **US-10:** Come *Utente*, dopo aver confermato la richiesta di prelievo, voglio che lo stato dell'operazione appaia a schermo come "Pending Approval" (In attesa di approvazione).

### 3.4 Epica: Gestione Admin e AI (Back-office)
* **US-11:** Come *Admin*, voglio poter aggiornare manualmente il saldo in Euro di ogni singolo sottoconto, in modo che il Saldo Totale Aggregato lato utente si ricalcoli automaticamente.
* **US-12:** Come *Admin*, voglio poter assegnare o modificare i dati visibili delle carte di debito (ultime 4 cifre, scadenza, circuito) per ogni sottoconto.
* **US-13:** Come *Admin*, voglio disporre di un modulo "AI Importer" dove posso incollare il testo o caricare un PDF di un estratto conto reale.
* **US-14:** Come *Admin*, voglio che il sistema invii il testo all'API di OpenRouter in modo che l'intelligenza artificiale generi una tabella JSON formattata con le transazioni estratte.
* **US-15:** Come *Admin*, voglio poter rivedere la tabella generata dall'AI, assegnarla a uno specifico sottoconto e salvarla nel database in un solo clic.

---

## 4. Diagrammi di Flusso (Text-based)

### Flusso 1: Sblocco Dati Carta di Debito (Dashboard)
```text
[Utente sulla Dashboard] 
   └── Clicca "Show Data" su una Carta 
         └── Compare Modale/Popup "Enter PIN" 
               ├── [Inserisce PIN errato/vuoto] -> Errore visivo 
               └── [Inserisce PIN qualsiasi di 4 cifre] 
                     └── Animazione di caricamento (1-2 secondi) 
                           └── I dati sulla carta (Scadenza, Numeri parziali) diventano visibili
Flusso 2: Prenotazione Prelievo ATM (Dashboard)
Plaintext
[Utente clicca su "ATM Withdrawal"]
   └── Si apre un form guidato
         ├── Seleziona Account (es. Fineco)
         ├── Seleziona Data del prelievo desiderato
         └── Seleziona Importo tramite bottoni fissi [2000] [2500] [3000]
               └── Clicca "Confirm Request"
                     └── Scrittura nel DB tabella 'atm_withdrawals'
                           └── Reindirizzamento alla Cronologia Prelievi
                                 └── La nuova voce mostra lo stato fisso in giallo: "Pending Approval"
Flusso 3: Importazione Transazioni via AI (Admin Panel)
Plaintext
[Admin naviga su "AI Transaction Importer"]
   └── Carica File PDF / Incolla testo estratto conto
         └── Clicca "Process with OpenRouter"
               └── [System Action] Chiamata API all'LLM con System Prompt
                     └── [Risposta API] L'LLM restituisce un array JSON
                           └── Il Frontend renderizza una Tabella di Anteprima
                                 ├── L'Admin seleziona il Conto di destinazione nel dropdown
                                 └── Clicca "Save to Database"
                                       └── [System Action] Esecuzione INSERT INTO transactions
                                             └── Messaggio di Successo (Toast: "Transactions Imported")
5. Requisiti Non Funzionali (NFR)
Design System: L'interfaccia deve replicare fedelmente lo stile di Anchor Protocol (Sfondo Dark Navy/Black, testi bianchi/grigi, bottoni e accenti verde acido).

Lingua UI: L'intera interfaccia visibile (frontend user e admin) dovrà essere rigorosamente in lingua Inglese.

Accessibilità e Demo: Nessun recupero password. Le credenziali per le route /login e /admin-login devono essere cablate nel codice (hardcoded) tramite variabili d'ambiente.

Responsività: Il layout, pur ottimizzato principalmente per la visualizzazione su computer desktop, deve mantenere la corretta formattazione dei blocchi su schermi tablet e mobile.