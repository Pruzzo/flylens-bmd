# 🔥 Configurazione Firebase + Firestore

## 📋 Setup Completo (10 minuti)

### 1️⃣ Crea Progetto Firebase

1. Vai su **https://console.firebase.google.com/**
2. Clicca **"Aggiungi progetto"**
3. Nome progetto: `busalla-motor-day-flylens` (o quello che vuoi)
4. Abilita/Disabilita Google Analytics (opzionale)
5. Clicca **"Crea progetto"**

---

### 2️⃣ Registra l'App Web

1. Nel dashboard Firebase, clicca sull'icona **</> Web**
2. Nickname app: `BMD Flylens Web`
3. **NON** selezionare "Firebase Hosting"
4. Clicca **"Registra app"**
5. Copia il codice di configurazione che appare

---

### 3️⃣ Configura il Codice

Apri `src/firebase.js` e sostituisci con i tuoi dati:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← La tua API Key
  authDomain: "tuo-progetto.firebaseapp.com",
  projectId: "tuo-progetto",
  storageBucket: "tuo-progetto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

### 4️⃣ Abilita Firestore

1. Nel menu laterale Firebase, vai su **"Firestore Database"**
2. Clicca **"Crea database"**
3. Seleziona modalità: **"Produzione"** (con regole di sicurezza)
4. Scegli location: **europe-west1** (Belgio - più vicino all'Italia)
5. Clicca **"Abilita"**

---

### 5️⃣ Configura Regole di Sicurezza

1. In Firestore, vai su tab **"Regole"**
2. Sostituisci con queste regole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permetti a chiunque di SCRIVERE nella collection 'requests'
    match /requests/{document} {
      allow create: if true;  // Chiunque può creare nuove richieste
      allow read, update, delete: if false;  // Solo admin può leggere/modificare
    }
  }
}
```

3. Clicca **"Pubblica"**

**Nota**: Queste regole permettono a chiunque di inviare richieste, ma solo tu (tramite login admin) puoi leggerle.

---

### 6️⃣ Test Configurazione

1. Avvia il progetto:
   ```bash
   npm run dev
   ```

2. Vai su **http://localhost:5173**

3. Compila e invia il form

4. Torna su Firebase Console → Firestore Database

5. Dovresti vedere un nuovo documento nella collection `requests`! 🎉

---

### 7️⃣ Accedi alla Dashboard Admin

1. Vai su **http://localhost:5173/login**

2. Password di default: **`bmd2025admin`**

3. Vedrai tutte le richieste salvate!

---

## 🔒 Cambiare Password Admin

Apri `src/Login.jsx` e modifica la riga:

```javascript
const ADMIN_PASSWORD = 'bmd2025admin';  // ← Cambia qui
```

Usa una password sicura! Es: `BusallA!2025#Fly`

---

## 📊 Struttura Dati Firestore

Ogni richiesta viene salvata con questa struttura:

```javascript
{
  firstName: "Mario",
  lastName: "Rossi",
  carDescription: "Lancia Delta Integrale rossa",
  contact: "mario@email.com",
  timestamp: Timestamp(2025-11-02 12:30:00)
}
```

---

## 🌐 Deploy su Firebase Hosting (Opzionale)

### Setup Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

Configurazione:
- Public directory: `dist`
- Single-page app: **Yes**
- Rewrites: **Yes**

### Build e Deploy:

```bash
npm run build
firebase deploy
```

Il sito sarà online su: `https://tuo-progetto.web.app`

---

## 🔧 Troubleshooting

### Errore "Firebase not initialized"
→ Verifica di aver copiato correttamente la config in `src/firebase.js`

### Errore "Permission denied" su Firestore
→ Controlla le regole di sicurezza in Firebase Console

### Dati non compaiono in Admin
→ Verifica che il form invii correttamente (controlla console browser)

### Password admin non funziona
→ Controlla `src/Login.jsx` e verifica la password hardcoded

---

## 📱 Accesso Admin in Produzione

Dopo il deploy, accedi all'admin da:

```
https://tuo-sito.web.app/login
```

---

## ✅ Checklist Completa

- [ ] Progetto Firebase creato
- [ ] App Web registrata
- [ ] Config copiata in `src/firebase.js`
- [ ] Firestore abilitato
- [ ] Regole di sicurezza configurate
- [ ] Test form completato
- [ ] Dati visibili in Firestore Console
- [ ] Login admin testato (password: bmd2025admin)
- [ ] Password admin cambiata (consigliato)

---

**Setup completato! 🎉**

Le richieste verranno automaticamente salvate su Firestore e potrai visualizzarle dalla dashboard admin protetta.
