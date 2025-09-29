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
