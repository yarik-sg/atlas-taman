import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        console.log("Réponse API /products:", data);
      } catch (err) {
        console.error("Erreur API /products:", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Produits disponibles</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
