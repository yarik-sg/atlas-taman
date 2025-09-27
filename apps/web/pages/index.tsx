import { type FormEvent, useEffect, useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import getApiBaseUrl from '../config';
import type { ProductWithOffers } from '../types/product';

type HomePageProps = {
  products: ProductWithOffers[];
  query: string;
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const rawQuery = context.query?.q;
  const query = typeof rawQuery === 'string' ? rawQuery : '';
  const trimmedQuery = query.trim();
  const effectiveQuery = trimmedQuery.length > 0 ? trimmedQuery : '';

  const apiBaseUrl = getApiBaseUrl(context.req);
  const endpoint = effectiveQuery
    ? `${apiBaseUrl}/products?q=${encodeURIComponent(effectiveQuery)}`
    : `${apiBaseUrl}/products`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const products = (await response.json()) as ProductWithOffers[];
    return {
      props: {
        products,
        query: effectiveQuery,
        error: null,
      },
    };
  } catch (error) {
    const isNetworkError =
      error instanceof TypeError || (error as { name?: string })?.name === 'TypeError';

    return {
      props: {
        products: [],
        query: effectiveQuery,
        error: isNetworkError
          ? 'API indisponible : vérifiez que `pnpm --filter api dev` tourne sur http://localhost:3001'
          : (error as Error)?.message ?? 'Erreur inconnue',
      },
    };
  }
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { products, query, error } = props;
  const router = useRouter();
  const [search, setSearch] = useState(query);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url.startsWith('/')) {
        setIsNavigating(true);
      }
    };
    const handleComplete = () => setIsNavigating(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = search.trim();
    const queryParams = nextQuery.length > 0 ? { q: nextQuery } : {};
    router.push({ pathname: '/', query: queryParams });
  };

  const hasProducts = products.length > 0;
  const showError = Boolean(error);
  const showEmptyState = !isNavigating && !showError && !hasProducts;

  return (
    <>
      <Head>
        <title>Atlas Taman - Comparateur de prix</title>
        <meta
          name="description"
          content="Comparez instantanément les offres des marchands marocains pour l'électronique et l'électroménager."
        />
      </Head>
      <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
        <h1>Atlas Taman - Comparateur de prix</h1>

        <form onSubmit={onSubmit} style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un produit (ex: iPhone 15, Samsung S24...)"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
            name="q"
            aria-label="Rechercher un produit"
          />
          <button type="submit" style={{ padding: '10px 16px', borderRadius: 8 }}>Rechercher</button>
        </form>

        {isNavigating && <p>Chargement...</p>}
        {showError && (
          <p style={{ color: 'crimson' }} role="alert">
            {error}
          </p>
        )}

        {showEmptyState && <p>Aucun produit.</p>}

        {!isNavigating && !showError && hasProducts && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {products.map((product) => (
              <article key={product.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
                <h3 style={{ margin: '0 0 8px' }}>
                  <Link href={`/products/${product.id}`} style={{ color: '#1d4ed8', textDecoration: 'none' }}>
                    {product.name}
                  </Link>
                </h3>
                {product.description && (
                  <p style={{ margin: '0 0 12px', color: '#666' }}>{product.description}</p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {product.offers.map((offer) => (
                    <li key={offer.id} style={{ padding: '6px 0', borderTop: '1px dashed #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <div>
                          <strong>{offer.price.toLocaleString('fr-MA')} MAD</strong>
                          {typeof offer.deliveryFee === 'number' && (
                            <span style={{ marginLeft: 8, color: '#666' }}>
                              + livraison {offer.deliveryFee.toLocaleString('fr-MA')} MAD
                            </span>
                          )}
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {offer.paymentMethods.join(' · ')}
                          </div>
                        </div>
                        <a
                          href={offer.merchant?.url ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          style={{ alignSelf: 'center' }}
                          title={offer.merchant?.name}
                        >
                          {offer.merchant?.name ?? 'Marchand'}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
