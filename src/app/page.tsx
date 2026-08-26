// src/app/page.tsx
import Link from 'next/link';
import { getAllComuni } from '@/lib/data';

export default function HomePage() {
  const comuni = getAllComuni();
  const regioni = [...new Set(comuni.map(c => c.regione))].sort();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Confronta le tariffe luce e gas nel tuo <span className="text-blue-600">comune</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dati ARERA aggiornati mensilmente. 7.900 comuni italiani. Zero pubblicità, solo numeri.
            Trova l'offerta più conveniente e risparmia fino a <strong>€200/anno</strong>.
          </p>
        </header>

        {/* SEARCH */}
        <form className="mb-12 max-w-md mx-auto" role="search">
          <label htmlFor="comune-search" className="sr-only">Cerca il tuo comune</label>
          <div className="relative">
            <input
              type="search"
              id="comune-search"
              list="comuni-list"
              placeholder="Scrivi il tuo comune (es. San Giovanni al Natisone, Milano, Roma...)"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
            />
            <datalist id="comuni-list">
              {comuni.slice(0, 1000).map(c => (
                <option key={c.codice_istat} value={c.nome} />
              ))}
            </datalist>
          </div>
          <script dangerouslySetInnerHTML={{
            __html: `
              document.getElementById('comune-search').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const slug = this.value.toLowerCase().replace(/\\s+/g, '-');
                  window.location.href = '/' + slug;
                }
              });
            `
          }} />
        </form>

        {/* REGIONI */}
        <div className="space-y-8">
          {regioni.map(regione => {
            const comuniRegione = comuni.filter(c => c.regione === regione).sort((a,b) => a.nome.localeCompare(b.nome));
            return (
              <section key={regione} className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{regione} ({comuniRegione.length} comuni)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {comuniRegione.map(comune => (
                    <Link
                      key={comune.codice_istat}
                      href={`/${comune.nome.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      {comune.nome}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </main>
  );
}