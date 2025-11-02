# 🎨 Come Sostituire i Loghi con Quelli Reali

I loghi attuali sono placeholders SVG. Per usare i loghi ufficiali:

## 📥 Scarica i Loghi

### Busalla Motor Day
1. Vai su https://busallamotorday.com/
2. Cerca il logo ufficiale (di solito nell'header o footer)
3. Scarica il logo in formato PNG o SVG trasparente

### Flylens
1. Vai su https://www.instagram.com/flylens.it/
2. Salva l'immagine del profilo o cerca il logo sul sito web
3. Scarica in formato PNG o SVG

## 📁 Sostituisci i File

Dopo aver scaricato i loghi:

1. **Rinomina i file scaricati:**
   - Logo BMD → `logo-bmd.png` (o `.svg`)
   - Logo Flylens → `logo-flylens.png` (o `.svg`)

2. **Posiziona i file:**
   - Metti i loghi nella cartella `public/`
   - Sostituisci i file esistenti:
     - `public/logo-bmd.svg` → `public/logo-bmd.png`
     - `public/logo-flylens.svg` → `public/logo-flylens.png`

3. **Aggiorna il codice (se necessario):**
   
   Se usi PNG invece di SVG, apri `src/App.jsx` e modifica le estensioni:
   
   ```jsx
   <img src="/logo-bmd.png" alt="Busalla Motor Day" className="logo-image" />
   ```
   
   ```jsx
   <img src="/logo-flylens.png" alt="Flylens" className="logo-image" />
   ```

## 🎨 Dimensioni Raccomandate

Per risultati ottimali, i loghi dovrebbero essere:
- **Larghezza**: 300-400px
- **Altezza**: 80-120px
- **Formato**: PNG con trasparenza o SVG
- **Risoluzione**: @2x per display retina (600-800px larghezza)

## ✂️ Rimuovere Sfondo (se necessario)

Se il logo ha uno sfondo bianco/colorato:

### Online (Gratuito)
1. Vai su https://www.remove.bg/
2. Carica l'immagine
3. Scarica con sfondo trasparente

### Photoshop/GIMP
1. Apri l'immagine
2. Usa lo strumento "Bacchetta magica"
3. Seleziona lo sfondo
4. Premi Canc
5. Salva come PNG con trasparenza

## 🔄 Come Apparirà

I loghi appariranno:
- **Mobile**: 60px altezza
- **Tablet**: 70-80px altezza
- **Desktop**: 90px altezza

Con effetto hover che li ingrandisce leggermente.

## 💡 Note

- I loghi attuali sono **placeholders temporanei**
- Preferisci formati vettoriali (SVG) per qualità perfetta
- Assicurati di avere i diritti per usare i loghi ufficiali
- I loghi vengono automaticamente ottimizzati per tutti i dispositivi

---

**Una volta sostituiti, ricarica semplicemente la pagina per vedere i nuovi loghi!** 🎉
