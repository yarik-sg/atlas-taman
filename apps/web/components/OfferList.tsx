import type { CSSProperties } from 'react';

import type { Offer } from '../types/product';

type OfferListProps = {
  offers: Offer[];
  variant?: 'compact' | 'detailed';
  ariaLabel?: string;
};

const formatMad = (value: number) => value.toLocaleString('fr-MA');

const compactListStyles: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const detailedListStyles: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: 16,
};

export function OfferList({
  offers,
  variant = 'compact',
  ariaLabel,
}: OfferListProps): JSX.Element {
  if (offers.length === 0) {
    return <p style={{ margin: '12px 0', color: '#666' }}>Aucune offre disponible.</p>;
  }

  if (variant === 'detailed') {
    return (
      <ul aria-label={ariaLabel ?? undefined} style={detailedListStyles}>
        {offers.map((offer) => {
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
    );
  }

  return (
    <ul aria-label={ariaLabel ?? undefined} style={compactListStyles}>
      {offers.map((offer, index) => (
        <li
          key={offer.id}
          style={{
            padding: '6px 0',
            borderTop: index === 0 ? 'none' : '1px dashed #eee',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <strong>{formatMad(offer.price)} MAD</strong>
              {typeof offer.deliveryFee === 'number' && (
                <span style={{ marginLeft: 8, color: '#666' }}>
                  + livraison {formatMad(offer.deliveryFee)} MAD
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
  );
}
