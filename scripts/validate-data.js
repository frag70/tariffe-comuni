// scripts/validate-data.js
const fs = require('fs');
const path = require('path');
const { parse } = require('papaparse');

const DATA_DIR = path.join(__dirname, '../public/data');

function checkFile(name, requiredColumns) {
  const filePath = path.join(DATA_DIR, name);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ MANCANTE: ${name}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, errors } = parse(content, { header: true, skipEmptyLines: true });
  
  if (errors.length) {
    console.error(`⚠️ Errori parsing ${name}:`, errors);
  }
  
  const missing = requiredColumns.filter(col => !data[0]?.[col]);
  if (missing.length) {
    console.error(`❌ Colonne mancanti in ${name}:`, missing);
    return false;
  }
  
  console.log(`✅ ${name}: ${data.length} righe, colonne OK`);
  return true;
}

console.log('🔍 Validazione dati...\n');
const okComuni = checkFile('comuni.csv', ['codice_istat', 'nome', 'provincia', 'regione']);
const okOfferte = checkFile('offerte.csv', ['fornitore', 'nome_offerta', 'tipo', 'prezzo_kwh', 'costo_annuale_stimato', 'link_affiliato', 'comuni_disponibili']);

if (okComuni && okOfferte) {
  console.log('\n✅ Tutti i dati validi. Puoi fare build.');
  process.exit(0);
} else {
  console.log('\n❌ Fix dati prima del build.');
  process.exit(1);
}