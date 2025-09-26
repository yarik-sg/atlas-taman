import React, { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('❌ Erreur API /products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📦 Tous les produits</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: '2rem' }}>
            <strong>{p.name}</strong> - {p.description}
            <ul>
              {Array.isArray(p.offers) && p.offers.length > 0 ? (
                p.offers.map((o: any) => (
                  <li key={o.id}>
                    {o.merchant.name} : {o.price} MAD (+{o.deliveryFee} MAD livraison)
                    <br />
                    Paiement: {o.paymentMethods.join(', ')}
                  </li>
                ))
              ) : (
                <li>Aucune offre</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
