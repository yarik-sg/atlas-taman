import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import getApiBaseUrl from '../../config';
import type { ProductWithOffers } from '../../types/product';

type ProductDetailProps = {
  product: ProductWithOffers | null;
  error?: string | null;
};

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async (context) => {
  const rawId = context.params?.id;
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId;

  const parsedId = Number(idParam);
  if (!idParam || Number.isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
    context.res.statusCode = 400;
    return {
      props: {
        product: null,
        error: 'Identifiant de produit invalide.',
      },
    };
  }

  const apiBaseUrl = getApiBaseUrl(context.req);
  const endpoint = `${apiBaseUrl}/products/${parsedId}`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (response.status === 404) {
      context.res.statusCode = 404;
      return {
        props: {
          product: null,
          error: 'Produit introuvable.',
        },
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const product = (await response.json()) as ProductWithOffers;
    return {
      props: {
        product,
        error: null,
      },
    };
  } catch (error) {
    context.res.statusCode = 502;
    const isNetworkError =
      error instanceof TypeError || (error as { name?: string })?.name === 'TypeError';

    return {
      props: {
        product: null,
        error: isNetworkError
          ? 'API indisponible : vérifiez que `pnpm --filter api dev` tourne sur http://localhost:3001'
          : (error as Error)?.message ?? 'Erreur inconnue',
      },
    };
  }
};

export default function ProductDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { product, error } = props;
  const title = product ? `${product.name} - Atlas Taman` : 'Produit - Atlas Taman';

  const formatMad = (value: number) => value.toLocaleString('fr-MA');
  const offersCount = product?.offers.length ?? 0;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={
            product
              ? `Comparez les offres pour ${product.name} chez les marchands marocains avec Atlas Taman.`
              : "Détails d'un produit sur le comparateur de prix Atlas Taman."
          }
        />
      </Head>
      <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span aria-hidden>←</span>
          Retour aux produits
        </Link>

        {error && (
          <p style={{ color: 'crimson', marginTop: 16 }} role="alert">
            {error}
          </p>
        )}

        {!error && !product && <p>Aucun produit à afficher.</p>}

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
                Offres disponibles ({offersCount})
              </h2>

              {offersCount === 0 && <p>Aucune offre pour le moment.</p>}

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
