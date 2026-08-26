// src/lib/data.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'papaparse';

export interface Comune {
  codice_istat: string;
  nome: string;
  provincia: string;
  regione: string;
  cap: string;
  lat?: number;
  lon?: number;
}

export interface OffertaEnergia {
  fornitore: string;
  nome_offerta: string;
  tipo: 'luce' | 'gas' | 'dual';
  prezzo_kwh: number;
  prezzo_fisso_mese: number;
  costo_annuale_stimato: number;
  link_affiliato: string;
  comuni_disponibili: string[];
  scadenza?: string;
}

export interface PaginaComune {
  comune: Comune;
  offerte_luce: OffertaEnergia[];
  offerte_gas: OffertaEnergia[];
  offerte_dual: OffertaEnergia[];
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), 'public/data');

function loadCSV<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = parse(content, { header: true, skipEmptyLines: true });
  return data as T[];
}

export function getAllComuni(): Comune[] {
  return loadCSV<Comune>('comuni.csv');
}

export function getAllOfferte(): OffertaEnergia[] {
  const raw = loadCSV<any>('offerte.csv');
  return raw.map(r => ({
    ...r,
    prezzo_kwh: Number(r.prezzo_kwh),
    prezzo_fisso_mese: Number(r.prezzo_fisso_mese),
    costo_annuale_stimato: Number(r.costo_annuale_stimato),
    comuni_disponibili: r.comuni_disponibili.split('|').map((c: string) => c.trim()),
  }));
}

export function getComuneBySlug(slug: string): Comune | undefined {
  const comuni = getAllComuni();
  return comuni.find(c => c.nome.toLowerCase().replace(/\s+/g, '-') === slug);
}

export function getPaginaComune(slug: string): PaginaComune | null {
  const comune = getComuneBySlug(slug);
  if (!comune) return null;

  const offerte = getAllOfferte();
  const codice = comune.codice_istat;

  const filter = (tipo: 'luce' | 'gas' | 'dual') =>
    offerte.filter(o => 
      o.tipo === tipo && 
      (o.comuni_disponibili.includes('TUTTI') || o.comuni_disponibili.includes(codice))
    ).sort((a, b) => a.costo_annuale_stimato - b.costo_annuale_stimato);

  return {
    comune,
    offerte_luce: filter('luce'),
    offerte_gas: filter('gas'),
    offerte_dual: filter('dual'),
    updated_at: new Date().toISOString().split('T')[0],
  };
}

export function getAllComuniSlugs(): string[] {
  return getAllComuni().map(c => c.nome.toLowerCase().replace(/\s+/g, '-'));
}