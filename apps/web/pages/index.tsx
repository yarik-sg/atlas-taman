import { useEffect, useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      const data = await res.json();

      // filtrage côté frontend
      const filtered = data.filter((p: any) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    } catch (err) {
      console.error('❌ Erreur API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Atlas Taman - Comparateur de prix</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          🔍 Rechercher
        </button>
      </form>

      {loading && <p>Chargement...</p>}

      {products.length > 0 ? (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> - {p.description}
              <ul>
                {p.offers.map((o: any) => (
                  <li key={o.id}>
                    {o.merchant.name} : {o.price} MAD (+{o.deliveryFee} MAD livraison)
                    <br />
                    Paiement: {o.paymentMethods.join(', ')}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>Aucun produit trouvé.</p>
      )}
    </div>
  );
}
