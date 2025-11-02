# Busalla Motor Day - Flylens Video Promo

Sito web per la raccolta contatti per la vendita di video drone dell'evento Busalla Motor Day.

## 🚁 Caratteristiche

- Video YouTube in autoplay nella sezione hero
- Form di contatto per richiedere anteprima gratuita del video
- Design responsive mobile-first con colori del Busalla Motor Day
- **Salvataggio dati su Firebase Firestore** (database cloud)
- **Dashboard Admin protetta da password** per visualizzare le richieste
- Sistema di routing con React Router
- Grafica professionale con loghi Busalla Motor Day e Flylens

## 📋 Prerequisiti

- Node.js (versione 16 o superiore)
- Account Firebase (gratuito)

## 🛠️ Installazione

1. **Clona o scarica il progetto**

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Configura Firebase:**
   
   Segui la guida completa in **`CONFIGURAZIONE_FIREBASE.md`**
   
   In breve:
   - Crea progetto su https://console.firebase.google.com/
   - Abilita Firestore Database
   - Copia le credenziali in `src/firebase.js`
   - Configura le regole di sicurezza

## 🚀 Avvio del Progetto

```bash
npm run dev
```

Il sito sarà disponibile su:
- **Homepage**: http://localhost:5173
- **Login Admin**: http://localhost:5173/login
- **Dashboard Admin**: http://localhost:5173/admin (dopo login)

## � Accesso Admin

**Password di default**: `bmd2025admin`

⚠️ **IMPORTANTE**: Cambia la password prima del deploy! 
Apri `src/Login.jsx` e modifica:
```javascript
const ADMIN_PASSWORD = 'tua_password_sicura_qui';
```

## 📊 Come Funziona

### 1. Utente Invia Richiesta
- Compila il form sulla homepage
- I dati vengono salvati su Firestore
- Riceve conferma immediata

### 2. Admin Visualizza Richieste
- Vai su `/login` e inserisci la password
- Accedi alla dashboard `/admin`
- Vedi tutte le richieste in tempo reale
- Cerca e filtra per nome/auto/contatto
- Elimina richieste se necessario

### 3. Struttura Dati Firestore
```javascript
Collection: requests
Document: {
  firstName: "Mario",
  lastName: "Rossi",
  carDescription: "Lancia Delta Integrale rossa",
  contact: "mario@email.com",
  timestamp: Timestamp
}
```

## 📦 Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno nella cartella `dist/`.

## 🌐 Deploy su Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Configurazione hosting:
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub Actions: No (opzionale)

## 📝 Struttura del Progetto

```
bmd_promo_flylens/
├── src/
│   ├── App.jsx              # Homepage con form
│   ├── App.css              # Stili homepage
│   ├── Login.jsx            # Pagina login admin
│   ├── Login.css            # Stili login
│   ├── Admin.jsx            # Dashboard admin
│   ├── Admin.css            # Stili dashboard
│   ├── firebase.js          # Configurazione Firebase
│   ├── index.css            # Stili globali
│   └── main.jsx             # Entry point + Router
├── public/
│   ├── logo-bmd.svg         # Logo Busalla Motor Day
│   └── logo-flylens.svg     # Logo Flylens
├── CONFIGURAZIONE_FIREBASE.md  # Guida setup Firebase
├── COME_SOSTITUIRE_LOGHI.md    # Guida loghi reali
└── README.md                # Questo file
```

## 🎨 Personalizzazione

### Configurare Firebase
Segui `CONFIGURAZIONE_FIREBASE.md` per il setup completo.

### Cambiare Password Admin
Modifica in `src/Login.jsx`:
```javascript
const ADMIN_PASSWORD = 'nuova_password';
```

### Sostituire i Loghi
Vedi `COME_SOSTITUIRE_LOGHI.md` per sostituire i placeholder.

### Modificare il Video
In `src/App.jsx`:
```jsx
src="https://www.youtube.com/embed/TUO_VIDEO_ID?autoplay=1..."
```

## 🔐 Sicurezza

### Regole Firestore
Le regole di sicurezza permettono:
- ✅ Chiunque può **creare** nuove richieste (form pubblico)
- ❌ Solo admin può **leggere/modificare/eliminare** (via dashboard)

### Protezione Admin
- Password hardcoded in `src/Login.jsx`
- Stato salvato in localStorage
- Redirect automatico se non loggato

**Per produzione avanzata**, considera Firebase Authentication.

## 📱 Pagine del Sito

| URL | Descrizione | Accesso |
|-----|-------------|---------|
| `/` | Homepage con form | Pubblico |
| `/login` | Login admin | Pubblico |
| `/admin` | Dashboard richieste | Solo dopo login |

## ⚠️ Troubleshooting

**Errore "Firebase not configured":**
→ Configura `src/firebase.js` con le tue credenziali

**"Permission denied" su Firestore:**
→ Verifica le regole di sicurezza in Firebase Console

**Dashboard vuota:**
→ Invia prima una richiesta dal form per testare

**Password non accettata:**
→ Controlla `ADMIN_PASSWORD` in `src/Login.jsx`

## 📱 Contatti

- **Busalla Motor Day**: [busallamotorday.com](https://busallamotorday.com/)
- **Flylens Instagram**: [@flylens.it](https://www.instagram.com/flylens.it/)

## 📄 Licenza

Progetto privato per Busalla Motor Day × Flylens

