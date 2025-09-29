#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf '\n%s\n' "▶️ Generating shared types"
mkdir -p "$ROOT_DIR/apps/web/types"
cat <<'PRODUCT_TYPES' > "$ROOT_DIR/apps/web/types/product.ts"
export type Merchant = {
  id: number;
  name: string;
  url: string | null;
};

export type Offer = {
  id: number;
  price: number;
  deliveryFee: number | null;
  paymentMethods: string[];
  productId: number;
  merchantId: number;
  merchant: Merchant;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
};

export type ProductWithOffers = Product & { offers: Offer[] };
PRODUCT_TYPES

printf '\n%s\n' "▶️ Generating frontend components"
mkdir -p "$ROOT_DIR/apps/web/components"
cat <<'OFFER_LIST' > "$ROOT_DIR/apps/web/components/OfferList.tsx"
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
OFFER_LIST

cat <<'PRODUCT_CARD' > "$ROOT_DIR/apps/web/components/ProductCard.tsx"
import Link from 'next/link';

import type { ProductWithOffers } from '../types/product';
import { OfferList } from './OfferList';

type ProductCardProps = {
  product: ProductWithOffers;
};

export default function ProductCard({ product }: ProductCardProps): JSX.Element {
  return (
    <article
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <h3 style={{ margin: 0 }}>
        <Link href={`/products/${product.id}`} style={{ color: '#1d4ed8', textDecoration: 'none' }}>
          {product.name}
        </Link>
      </h3>
      {product.description && <p style={{ margin: 0, color: '#666' }}>{product.description}</p>}
      <OfferList
        offers={product.offers}
        ariaLabel={`Offres pour ${product.name}`}
      />
    </article>
  );
}
PRODUCT_CARD

printf '\n%s\n' "▶️ Generating mock backend data"
mkdir -p "$ROOT_DIR/apps/mock-backend/data"
cat <<'PRODUCT_FIXTURES' > "$ROOT_DIR/apps/mock-backend/data/products.js"
const merchants = [
  { id: 1, name: 'Electroplanet', url: 'https://www.electroplanet.ma/' },
  { id: 2, name: 'Marjane', url: 'https://www.marjane.ma/' },
  { id: 3, name: 'Jumia', url: 'https://www.jumia.ma/' },
  { id: 4, name: 'Hmall', url: 'https://www.hmall.ma/' },
];

const products = [
  {
    id: 1,
    name: 'Samsung Galaxy S24 256 Go',
    description: "Smartphone AMOLED 6,2\" 120 Hz, triple capteur photo, compatible 5G.",
    offers: [
      {
        id: 101,
        price: 10499,
        deliveryFee: 59,
        paymentMethods: ['Carte bancaire', 'Paiement à la livraison'],
        productId: 1,
        merchantId: 1,
        merchant: merchants[0],
      },
      {
        id: 102,
        price: 10249,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire'],
        productId: 1,
        merchantId: 2,
        merchant: merchants[1],
      },
      {
        id: 103,
        price: 10899,
        deliveryFee: 79,
        paymentMethods: ['Carte bancaire', 'Cash on delivery'],
        productId: 1,
        merchantId: 3,
        merchant: merchants[2],
      },
    ],
  },
  {
    id: 2,
    name: 'LG InstaView Door-in-Door 601L',
    description:
      "Réfrigérateur américain avec panneau InstaView, compresseur linéaire garanti 10 ans, Wi-Fi ThinQ.",
    offers: [
      {
        id: 201,
        price: 28990,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 2,
        merchantId: 1,
        merchant: merchants[0],
      },
      {
        id: 202,
        price: 28490,
        deliveryFee: 199,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 2,
        merchantId: 4,
        merchant: merchants[3],
      },
    ],
  },
  {
    id: 3,
    name: 'Dyson V15 Detect Absolute',
    description:
      'Aspirateur balai sans fil avec détection de poussières laser et filtration HEPA jusqu\'à 99,97%.',
    offers: [
      {
        id: 301,
        price: 9499,
        deliveryFee: 49,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 3,
        merchantId: 3,
        merchant: merchants[2],
      },
      {
        id: 302,
        price: 9690,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire', 'Paiement à la livraison'],
        productId: 3,
        merchantId: 4,
        merchant: merchants[3],
      },
    ],
  },
];

module.exports = { merchants, products };
PRODUCT_FIXTURES

printf '\n%s\n' "▶️ Generating Express mock backend server"
cat <<'BACKEND_SERVER' > "$ROOT_DIR/apps/mock-backend/server.js"
const express = require('express');

const { products } = require('./data/products');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products', (req, res) => {
  const query = `${req.query.q ?? ''}`.trim().toLowerCase();

  if (!query) {
    return res.json(products);
  }

  const filtered = products.filter((product) => {
    const haystack = [
      product.name,
      product.description ?? '',
      ...product.offers.map((offer) => offer.merchant?.name ?? ''),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return res.json(filtered);
});

app.get('/products/:id', (req, res) => {
  const parsedId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }

  const product = products.find((item) => item.id === parsedId);

  if (!product) {
    return res.status(404).json({ message: 'Produit introuvable' });
  }

  return res.json(product);
});

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`Mock backend disponible sur http://localhost:${PORT}`);
});

module.exports = app;
BACKEND_SERVER

printf '\n%s\n' "✅ Generation completed"
