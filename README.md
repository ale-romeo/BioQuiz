# 🧠 Bioinformatics Quiz WebApp

Una webapp interattiva per esercitarsi con quiz a scelta multipla su tematiche di bioinformatica, costruita con **React**, **TypeScript** e **TailwindCSS**.

## 🚀 Caratteristiche

- 📋 Quiz con domande randomiche da una pool predefinita  
- 🎯 Possibilità di scegliere il numero di domande  
- 💡 Una domanda alla volta con navigazione tramite barra numerata  
- ✅ Verifica delle risposte solo alla fine del test  
- 🔄 Possibilità di iniziare un nuovo test in un click  
- 📱 Interfaccia responsiva e moderna con TailwindCSS  

## 📦 Struttura del progetto

```
quiz-webapp/
├── public/
├── src/
│   ├── App.tsx              # Componente principale
│   ├── main.tsx             # Entry point React
│   ├── data/
│   │   └── quizData.ts      # Dati quiz formattati
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 🛠️ Installazione locale

1. Clona il repository:

```bash
git clone https://github.com/tuo-utente/quiz-webapp.git
cd quiz-webapp
```

2. Installa le dipendenze:

```bash
npm install
```

3. Avvia il server di sviluppo:

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

## 🌐 Deploy su Vercel

1. Fai push su GitHub.
2. Vai su [https://vercel.com](https://vercel.com), collega il tuo repo e deploya.
3. Configurazioni automatiche:
   - **Framework:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`

## 📊 Formato dei dati (`quizData.ts`)

Ogni domanda ha la seguente struttura:

```ts
{
  question: "Domanda qui...",
  options: ["Opzione 1", "Opzione 2", "Opzione 3", "Opzione 4"],
  correct: "Opzione corretta"
}
```

I dati possono essere generati da un CSV usando uno script Python dedicato.

## 📖 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori dettagli.
