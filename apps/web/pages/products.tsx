import React, { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>Erreur : {error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>Liste des produits</h1>
      <pre style={{background:'#f8f8f8',padding:10}}>{JSON.stringify(products, null, 2)}</pre>
      {products.length === 0 ? (
        <div>Aucun produit trouvé.</div>
      ) : (
        products.map((product: any) => (
          <div key={product.id} style={{ marginBottom: 32, border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>Offres (triées par prix)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Marchand</th>
                  <th>Prix</th>
                  <th>Livraison</th>
                  <th>Paiement</th>
                </tr>
              </thead>
              <tbody>
                {product.offers && Array.isArray(product.offers) ?
                  product.offers
                    .sort((a: any, b: any) => a.price - b.price)
                    .map((offer: any) => (
                      <tr key={offer.id}>
                        <td><a href={offer.merchant.url} target="_blank" rel="noopener noreferrer">{offer.merchant.name}</a></td>
                        <td>{offer.price} DH</td>
                        <td>{offer.deliveryFee ?? '-'} DH</td>
                        <td>{offer.paymentMethods.join(', ')}</td>
                      </tr>
                    ))
                  : <tr><td colSpan={4}>Aucune offre</td></tr>
                }
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
