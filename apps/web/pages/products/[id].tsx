import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import getApiBaseUrl from '../../config';
import type { ProductWithOffers } from '../../types/product';

const API = getApiBaseUrl();

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<ProductWithOffers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = useMemo(() => {
    if (!id) return null;
    if (Array.isArray(id)) return id[0] ?? null;
    return id;
  }, [id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!productId) {
      setError('Identifiant de produit invalide.');
      setProduct(null);
      return;
    }

    const numericId = Number(productId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError('Identifiant de produit invalide.');
      setProduct(null);
      return;
    }

    let aborted = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/products/${numericId}`, {
          headers: { Accept: 'application/json' },
        });

        if (res.status === 404) {
          if (!aborted) {
            setError('Produit introuvable.');
            setProduct(null);
          }
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = (await res.json()) as ProductWithOffers;
        if (!aborted) {
          setProduct(json);
        }
      } catch (e: unknown) {
        if (aborted) return;
        if (e instanceof TypeError || (e as { name?: string })?.name === 'TypeError') {
          setError('API indisponible : vérifiez que `pnpm --filter api dev` tourne sur http://localhost:3001');
        } else {
          setError((e as Error)?.message ?? 'Erreur inconnue');
        }
        setProduct(null);
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      aborted = true;
    };
  }, [productId, router.isReady]);

  const title = product ? `${product.name} - Atlas Taman` : 'Produit - Atlas Taman';

  const formatMad = (value: number) => value.toLocaleString('fr-MA');

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span aria-hidden>←</span>
          Retour aux produits
        </Link>

        {loading && <p>Chargement du produit...</p>}
        {error && (
          <p style={{ color: 'crimson', marginTop: 16 }} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && !product && <p>Aucun produit à afficher.</p>}

        {product && (
          <article style={{ border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
            <header style={{ marginBottom: 24 }}>
              <h1 style={{ margin: '0 0 12px' }}>{product.name}</h1>
              {product.description && (
                <p style={{ margin: 0, color: '#555', lineHeight: 1.5 }}>{product.description}</p>
              )}
            </header>

            <section>
              <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>
                Offres disponibles ({product.offers.length})
              </h2>

              {product.offers.length === 0 && <p>Aucune offre pour le moment.</p>}

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
                {product.offers.map((offer) => {
                  const total = offer.price + (offer.deliveryFee ?? 0);
                  return (
                    <li
                      key={offer.id}
                      style={{
                        border: '1px solid #f1f1f1',
                        borderRadius: 12,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem' }}>{formatMad(offer.price)} MAD</strong>
                          {typeof offer.deliveryFee === 'number' && (
                            <span style={{ marginLeft: 8, color: '#666' }}>
                              Livraison {formatMad(offer.deliveryFee)} MAD
                            </span>
                          )}
                        </div>
                        <a
                          href={offer.merchant?.url ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#1d4ed8', textDecoration: 'none' }}
                          title={offer.merchant?.name ?? 'Marchand'}
                        >
                          {offer.merchant?.name ?? 'Marchand'}
                        </a>
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        Moyens de paiement : {offer.paymentMethods.join(' · ')}
                      </div>
                      <div style={{ fontSize: 13, color: '#444' }}>
                        Total estimé : <strong>{formatMad(total)} MAD</strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </article>
        )}
      </main>
    </>
  );
}
