import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1kCHU8USPaQORDWxqXw5_DTtEiVxPQf1lfeJ_4CId0d8/gviz/tq?tqx=out:csv&sheet=items';
const WHATSAPP_PHONE = '5213111798614';

type RawItem = {
  id?: string;
  category?: string;
  name?: string;
  price?: string;
  description?: string;
  image_url?: string;
  available?: string;
  order_text?: string;
};

type CatalogItem = {
  id: string;
  category: string;
  name: string;
  price: number | null;
  description: string;
  imageUrl: string;
  available: boolean;
  orderText: string;
};

const parsePrice = (value?: string): number | null => {
  if (!value) return null;
  const normalized = value.replace(/[^\d.,-]/g, '').replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
};

const toItem = (raw: RawItem, index: number): CatalogItem => ({
  id: raw.id?.trim() || String(index + 1),
  category: raw.category?.trim() || 'General',
  name: raw.name?.trim() || 'Producto sin nombre',
  price: parsePrice(raw.price),
  description: raw.description?.trim() || 'Sin descripción disponible.',
  imageUrl: raw.image_url?.trim() || 'https://placehold.co/600x400/303030/F0D050?text=Concreto',
  available: String(raw.available).trim().toUpperCase() === 'TRUE',
  orderText: raw.order_text?.trim() || '',
});

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

export default function Catalog() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (SHEET_CSV_URL === 'REEMPLAZA_AQUI') {
          throw new Error('Configura la constante SHEET_CSV_URL en src/components/Catalog/Catalog.tsx');
        }

        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error('No se pudo cargar el catálogo desde Google Sheets.');

        const csv = await response.text();
        const parsed = Papa.parse<RawItem>(csv, {
          header: true,
          skipEmptyLines: true,
        });

        const normalized = parsed.data.map(toItem);
        setItems(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar el catálogo.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    return ['all', ...new Set(items.map((item) => item.category))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || item.category === category;
      const matchesAvailability = !onlyAvailable || item.available;
      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [items, query, category, onlyAvailable]);

  const createWhatsappLink = (item: CatalogItem) => {
    const fallback = `Hola, me interesa: ${item.name} (${item.category}) - ${item.price === null ? 'precio por confirmar' : currency.format(item.price)}`;
    const message = item.orderText || fallback;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      <div className="panel grid gap-4 p-4 md:grid-cols-4 md:items-end">
        <label className="md:col-span-2">
          <span className="mb-1 block text-sm text-white/75">Buscar</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o descripción..."
            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm text-white/75">Categoría</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Todas' : cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          Solo disponibles
        </label>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="panel animate-pulse p-4">
              <div className="mb-3 aspect-[4/3] rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
              <div className="mt-2 h-3 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="panel overflow-hidden">
              <img src={item.imageUrl} alt={item.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-2xl leading-tight">{item.name}</h3>
                  <span className="badge">{item.category}</span>
                </div>

                <p className="text-sm text-white/80">{item.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <strong className="text-brand-yellow">
                    {item.price === null ? 'Precio a cotizar' : currency.format(item.price)}
                  </strong>
                  <span className={item.available ? 'text-emerald-300' : 'text-red-300'}>
                    {item.available ? 'Disponible' : 'Agotado'}
                  </span>
                </div>

                <a
                  className="btn-primary w-full justify-center"
                  href={createWhatsappLink(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="panel p-6 text-center text-white/70">No hay productos que coincidan con tus filtros.</p>
      )}
    </div>
  );
}
