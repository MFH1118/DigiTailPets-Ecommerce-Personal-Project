// src/app/product/[id]/page.tsx

import ProductDetail from "@/components/ProductDetail";
import { getProducts } from "@/data/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  // Get product data based on ID
  const allProducts = [...getProducts('featured'), ...getProducts('new'), ...getProducts('essentials')];
  const product = allProducts.find(p => p.id === params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetail product={product} />;
}