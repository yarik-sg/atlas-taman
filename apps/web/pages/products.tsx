// apps/web/pages/products.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Products() {
  const r = useRouter();
  useEffect(() => { r.replace('/'); }, [r]);
  return <div>Redirection...</div>;
}
