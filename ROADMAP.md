# ROADMAP TARIFFECOMUNI.IT — Cosa ho fatto io, cosa devi fare TU

---

## ✅ GIÀ FATTO (tutto da me, zero azioni tue)

| File/Cartella | Cosa contiene | Stato |
|---------------|---------------|-------|
| `src/lib/data.ts` | Logica caricamento CSV, filtri per comune, generazione pagine | ✅ Completo |
| `public/data/comuni.csv` | 5 comuni esempio (San Giovanni al Natisone, Milano, Roma, Torino, Napoli) | ✅ Completo |
| `public/data/offerte.csv` | 10 offerte esempio (Eni, Edison, Sorgenia, A2A, Hera) con link placeholder | ✅ Completo |
| `src/app/[slug]/page.tsx` | Pagina dinamica per ogni comune (tabelle Luce/Gas/Dual, SEO meta tags) | ✅ Completo |
| `src/app/page.tsx` | Homepage con ricerca + elenco per regione | ✅ Completo |
| `src/app/layout.tsx` | Layout base, metadata SEO, Open Graph, Twitter Cards, verifica Google | ✅ Completo |
| `src/app/sitemap.ts` | Sitemap.xml automatico (homepage + 7.900 pagine comuni) | ✅ Completo |
| `src/app/robots.ts` | Robots.txt con sitemap | ✅ Completo |
| `next.config.ts` | Export statico (output: 'export') per hosting gratis Vercel/Netlify | ✅ Completo |
| `scripts/validate-data.js` | Script validazione CSV prima del build | ✅ Completo |
| `public/og-image.svg` | Immagine social 1200x630 (SVG, leggera) | ✅ Completo |
| `package.json` | Scripts: `build:production`, `data:validate` | ✅ Completo |
| Git repo | Commit iniziale fatto | ✅ Completo |
| Build test | `npm run build` → **SUCCESS** (11 pagine generate) | ✅ Completo |
| Data validation | `npm run data:validate` → **PASS** | ✅ Completo |

---

## 🎯 COSA DEVI FARE TU (solo 4 step obbligatori)

### STEP 1 — Crea repo GitHub e deploy Vercel (10 min)

```bash
# 1. Vai su github.com/new → repo name: tariffe-comuni → Create repository
# 2. Torna nel terminale:
cd /home/user/tariffe-comuni
git remote add origin https://github.com/TUO_USERNAME/tariffe-comuni.git
git branch -M main
git push -u origin main
```

**Poi su Vercel:**
1. `vercel.com` → "Add New Project" → Importa repo GitHub
2. Framework: Next.js (auto) → Deploy
3. Settings → Domains → Aggiungi `tariffecomuni.it` (o tuo dominio)
4. DNS: A record `@` → `76.76.21.21` + CNAME `www` → `cname.vercel-dns.com`

---

### STEP 2 — Sostituisci dati finti con dati REALI (30-60 min)

**A. Comuni completi (7.900 righe)**
```bash
# Opzione 1: Scarica da ISTAT
# https://www.istat.it/it/archivio/6789 → "Elenco comuni italiani" → CSV
# Rinomina in comuni.csv → sovrascrivi public/data/comuni.csv

# Opzione 2: Se trovi link diretto stabile
curl -L "URL_ISTAT_CSV" -o public/data/comuni.csv
```
> Colonne obbligatorie: `codice_istat,nome,provincia,regione,cap` (lat,lon opzionali)

**B. Offerte REALI con link affiliati veri**
1. Iscriviti a **Awin** (awin.com) → approvazione 1-3 giorni
2. Cerca programmi: `Eni Plenitude`, `Edison`, `Sorgenia`, `A2A`, `Hera`, `Enel`, `Acea`, `Iren`
3. Per ogni programma → "Get tracking link" → incolla in `offerte.csv`
4. Aggiorna prezzi veri dai siti fornitori (controlla mensilmente)

> Formato `offerte.csv`:
> ```csv
> fornitore,nome_offerta,tipo,prezzo_kwh,prezzo_fisso_mese,costo_annuale_stimato,link_affiliato,comuni_disponibili,scadenza
> Eni Plenitude,Trend Casa Luce,luce,0.152,0,547,https://awin.it/click/12345,TUTTI,2025-12-31
> ```

**C. Valida e rebuild**
```bash
cd /home/user/tariffe-comuni
npm run data:validate  # deve dare ✅
npm run build:production
git add . && git commit -m "Dati reali: comuni ISTAT + offerte affiliate" && git push
# Vercel rebuild automatico
```

---

### STEP 3 — Google Search Console (5 min)

1. `search.google.com/search-console` → "Add property" → Domain: `tariffecomuni.it`
2. Verifica DNS (copia TXT record nel pannello DNS del dominio)
3. Dopo verifica: "Sitemaps" → Inserisci `https://tariffecomuni.it/sitemap.xml` → Submit

---

### STEP 4 — Aggiornamento mensile (15 min/mese)

```bash
# 1. Aggiorna prezzi in public/data/offerte.csv (controlla siti fornitori)
# 2. Valida + build + push
npm run data:validate && npm run build:production
git add public/data/offerte.csv && git commit -m "Aggiornamento tariffe $(date +%Y-%m)" && git push
# Vercel ri-deploya da solo in ~2 min
```

---

## 📅 TIMELINE REALISTICA

| Quando | Azione | Risultato atteso |
|--------|--------|------------------|
| **Oggi** | Step 1-3 | Sito live, indicizzato, link affiliati attivi |
| **Settimana 1** | Controlla GSC: copertura, errori 404 | 0 errori, prime pagine indicizzate |
| **Mese 1** | Primi click affiliati (traffico organico basso) | €0-30 |
| **Mese 3** | 500-2.000 visite/mese | €50-300 |
| **Mese 6** | 3.000-10.000 visite/mese | €250-1.500 |
| **Anno 1** | 10.000-30.000 visite/mese | €800-4.500 |

---

## 🔧 COMANDI UTILI (copia-incolla)

```bash
# Validazione dati
cd /home/user/tariffe-comuni && npm run data:validate

# Build produzione
cd /home/user/tariffe-comuni && npm run build:production

# Deploy (dopo push su GitHub → Vercel auto)
git add . && git commit -m "messaggio" && git push

# Dev locale (se serve testare)
cd /home/user/tariffe-comuni && npm run dev
# Apri http://localhost:3000
```

---

## ⚠️ NOTE IMPORTANTI

1. **P.IVA** — Per incassare commissioni affiliate serve P.IVA (regime forfettario 5% primi 5 anni). Apri prima di primi pagamenti.
2. **Cookie banner** — Se usi AdSense/analytics, serve banner GDPR. Per ora solo link affiliati → non serve.
3. **Privacy/Chi siamo/Metodologia** — Crea pagine statiche in `src/app/privacy/page.tsx`, `src/app/chi-siamo/page.tsx`, `src/app/metodologia/page.tsx` (SEO + trust).
4. **Schema.org** — Aggiungi `Product` + `AggregateOffer` JSON-LD in `page.tsx` per rich snippet (dopo lancio).
5. **Blog pilastri** — Scrivi 3 articoli in `src/app/blog/` (es. "Come leggere bolletta", "Mercato libero 2024", "Bonus energia") → link interni alle pagine comuni.

---

## 📞 SUPPORTO

Se qualcosa si rompe:
- `npm run data:validate` → dice cosa non va nei CSV
- `npm run build` → errori TypeScript/Next.js
- Vercel dashboard → log deploy
- GSC → errori indicizzazione

**Tutto il codice è tuo, modificabile, vendibile.** Nessun lock-in.

---

**Prossimo passo tuo:** Esegui **STEP 1** ora. Quando il sito è live su `https://tariffecomuni.it`, mandami il link e controlliamo insieme GSC.