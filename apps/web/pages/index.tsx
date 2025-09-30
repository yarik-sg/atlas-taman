import { useEffect, useState } from 'react';
import Head from 'next/head';

type Merchant = { id: number; name: string; url: string | null };
type Offer = {
  id: number;
  price: number;
  deliveryFee: number | null;
  paymentMethods: string[];
  productId: number;
  merchantId: number;
  merchant: Merchant;
};
type Product = { id: number; name: string; description: string | null; offers: Offer[] };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = query?.trim().length
        ? `${API}/products?q=${encodeURIComponent(query)}`
        : `${API}/products`;

      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur inconnue');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(q);
  };

  return (
    <>
      <Head>
        <title>Atlas Taman - Comparateur de prix</title>
      </Head>
      <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
        <h1>Atlas Taman - Comparateur de prix</h1>

        <form onSubmit={onSubmit} style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un produit (ex: iPhone 15, Samsung S24...)"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 16px', borderRadius: 8 }}>Rechercher</button>
        </form>

        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'crimson' }}>Erreur: {error}</p>}
        {!loading && !error && data.length === 0 && <p>Aucun produit.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {data.map((p) => (
            <article key={p.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
              <h3 style={{ margin: '0 0 8px' }}>{p.name}</h3>
              {p.description && <p style={{ margin: '0 0 12px', color: '#666' }}>{p.description}</p>}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {p.offers.map((o) => (
                  <li key={o.id} style={{ padding: '6px 0', borderTop: '1px dashed #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <strong>{o.price.toLocaleString('fr-MA')} MAD</strong>
                        {typeof o.deliveryFee === 'number' && (
                          <span style={{ marginLeft: 8, color: '#666' }}>
                            + livraison {o.deliveryFee.toLocaleString('fr-MA')} MAD
                          </span>
                        )}
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {o.paymentMethods.join(' · ')}
                        </div>
                      </div>
                      <a
                        href={o.merchant?.url ?? '#'}
                        target="_blank"
                        rel="noreferrer"
                        style={{ alignSelf: 'center' }}
                        title={o.merchant?.name}
                      >
                        {o.merchant?.name ?? 'Marchand'}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
