// src/app/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPaginaComune, getAllComuniSlugs } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllComuniSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pagina = getPaginaComune(slug);
  if (!pagina) return { title: 'Non trovato' };

  const { comune } = pagina;
  return {
    title: `Migliori offerte luce e gas a ${comune.nome} (${comune.provincia}) | TariffeComuni.it`,
    description: `Confronta le tariffe luce e gas più convenienti per ${comune.nome}. Dati ARERA aggiornati al ${pagina.updated_at}. Risparmia fino a €200/anno.`,
    openGraph: {
      title: `Offerte energia ${comune.nome} - TariffeComuni.it`,
      description: `Trova la tariffa luce/gas più conveniente a ${comune.nome}. Confronta Eni, Edison, Sorgenia, A2A, Hera.`,
      type: 'website',
    },
  };
}

export default async function ComunePage({ params }: PageProps) {
  const { slug } = await params;
  const pagina = getPaginaComune(slug);
  
  if (!pagina) notFound();

  const { comune, offerte_luce, offerte_gas, offerte_dual, updated_at } = pagina;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Offerte luce e gas a <span className="text-blue-600">{comune.nome}</span> ({comune.provincia})
          </h1>
          <p className="mt-2 text-gray-600">
            {offerte_luce.length + offerte_gas.length + offerte_dual.length} offerte confrontate • Dati ARERA aggiornati al {updated_at}
          </p>
        </header>

        {/* TAB OFFERTE DUAL */}
        {offerte_dual.length > 0 && (
          <section className="mb-8" aria-labelledby="dual-heading">
            <h2 id="dual-heading" className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Dual (Luce + Gas)</span>
            </h2>
            <OfferteTable offerte={offerte_dual} />
          </section>
        )}

        {/* TAB LUCE */}
        {offerte_luce.length > 0 && (
          <section className="mb-8" aria-labelledby="luce-heading">
            <h2 id="luce-heading" className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">Solo Luce</span>
            </h2>
            <OfferteTable offerte={offerte_luce} />
          </section>
        )}

        {/* TAB GAS */}
        {offerte_gas.length > 0 && (
          <section className="mb-8" aria-labelledby="gas-heading">
            <h2 id="gas-heading" className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Solo Gas</span>
            </h2>
            <OfferteTable offerte={offerte_gas} />
          </section>
        )}

        {/* FOOTER INFO */}
        <footer className="border-t pt-8 text-sm text-gray-500 space-y-2">
          <p><strong>Metodologia:</strong> Costo annuo stimato per famiglia tipo (2.700 kWh luce / 1.400 Smc gas). Prezzi IVA inclusa.</p>
          <p><strong>Fonte:</strong> Dati offerte da portali fornitori e ARERA. Comuni da ISTAT.</p>
          <p><strong>Disclaimer:</strong> I link sono affiliati. Se attivi un'offerta, riceviamo una commissione senza costi extra per te.</p>
          <p className="pt-4">© {new Date().getFullYear()} TariffeComuni.it — Confronto indipendente tariffe energia</p>
        </footer>

      </div>
    </main>
  );
}

interface OfferteTableProps {
  offerte: Array<{
    fornitore: string;
    nome_offerta: string;
    prezzo_kwh: number;
    prezzo_fisso_mese: number;
    costo_annuale_stimato: number;
    link_affiliato: string;
  }>;
}

function OfferteTable({ offerte }: OfferteTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full" role="table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornitore</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offerta</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">€/kWh</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Fisso/mese</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stima anno</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Azione</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {offerte.map((offerta, i) => (
            <tr key={i} className={i === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
              <td className="px-4 py-3 font-medium text-gray-900">{offerta.fornitore}</td>
              <td className="px-4 py-3 text-gray-700">{offerta.nome_offerta}</td>
              <td className="px-4 py-3 text-right text-gray-700 font-mono">{offerta.prezzo_kwh.toFixed(3)}</td>
              <td className="px-4 py-3 text-right text-gray-700 font-mono">{offerta.prezzo_fisso_mese > 0 ? `€${offerta.prezzo_fisso_mese}/mese` : '—'}</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">€{offerta.costo_annuale_stimato.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <a
                  href={offerta.link_affiliato}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Vai all'offerta
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}