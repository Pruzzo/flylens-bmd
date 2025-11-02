# 📝 ISTRUZIONI PER COMPLETARE LA CONFIGURAZIONE

## ✅ Cosa è stato creato

Il sito è pronto con:
- ✅ Video YouTube in autoplay nella hero section
- ✅ Form di contatto completo con validazione
- ✅ Design responsive con colori Busalla Motor Day (rosso/nero)
- ✅ Server backend per invio email tramite Gmail
- ✅ Grafica con riferimenti a Busalla Motor Day e Flylens

## 🔧 CONFIGURAZIONE NECESSARIA

### 1. Configura le Credenziali Gmail

Apri il file `.env` e modifica con i tuoi dati reali:

```env
GMAIL_USER=tua-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
RECIPIENT_EMAIL=email-destinatario@email.com
PORT=3001
```

### 2. Crea una App Password Gmail

**IMPORTANTE:** Non usare la password normale di Gmail!

1. Vai su: https://myaccount.google.com/apppasswords
2. Devi avere la 2FA (autenticazione a due fattori) attiva
3. Seleziona "App: Mail" e "Dispositivo: Windows Computer"
4. Clicca "Genera"
5. Copia la password di 16 caratteri generata
6. Incollala nel file `.env` sotto `GMAIL_APP_PASSWORD`

### 3. Avvia il Progetto

Esegui nel terminale:

```bash
npm run dev:full
```

Questo avvierà:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### 4. Testa il Sito

1. Apri il browser su http://localhost:5173
2. Guarda il video in autoplay
3. Compila il form con dati di test
4. Invia e controlla che arrivi l'email a `RECIPIENT_EMAIL`

## 🎨 Personalizzazioni Suggerite

### Aggiungere Loghi Reali

Attualmente i loghi sono testo. Per aggiungere loghi immagine:

1. Scarica i loghi di:
   - Busalla Motor Day
   - Flylens

2. Metti le immagini in `public/`

3. Modifica `src/App.jsx` nella sezione `.logos`:
   ```jsx
   <div className="logos">
     <img src="/logo-bmd.png" alt="Busalla Motor Day" height="80" />
     <span>×</span>
     <img src="/logo-flylens.png" alt="Flylens" height="80" />
   </div>
   ```

### Modificare il Video

Nel file `src/App.jsx`, cerca:
```jsx
src="https://www.youtube.com/embed/K0GxZo4k2UQ?autoplay=1..."
```

Sostituisci `K0GxZo4k2UQ` con l'ID del video che preferisci.

## 🚀 Deploy in Produzione

### Frontend (Vercel/Netlify)
1. Fai build: `npm run build`
2. Carica la cartella `dist/` su Vercel o Netlify

### Backend (Render.com - Gratuito)
1. Crea account su render.com
2. Collega il repository GitHub
3. Configura come "Web Service"
4. Aggiungi le variabili d'ambiente (GMAIL_USER, GMAIL_APP_PASSWORD, ecc.)
5. Deploy!

### Aggiorna l'URL del Backend nel Frontend

In produzione, modifica `src/App.jsx`:
```jsx
const response = await fetch('https://tuo-backend.onrender.com/api/send-email', {
```

## ❓ Problemi Comuni

**"Invalid login credentials" da Gmail:**
→ Usa App Password, non la password normale

**CORS Error:**
→ Assicurati che il backend sia in esecuzione

**Video non parte automaticamente:**
→ È normale, alcuni browser bloccano autoplay. Il video è mutato per aggirare questo.

## 📞 Supporto

Per problemi o domande, consulta il README.md completo.

---

**Buon lavoro! 🎉**
