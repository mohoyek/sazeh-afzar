"use client";

import { useState } from "react";
import { products, type Product } from "@/data/products";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function Products() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <section id="products" className="py-20 lg:py-28 bg-bg scroll-mt-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="محصولات"
          title="محصولات ما"
          subtitle="تولید انواع تیرهای بتنی متناسب با نیاز شبکه‌های برق و پروژه‌های عمرانی"
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onOpen={setActiveProduct}
            />
          ))}
        </div>
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}
