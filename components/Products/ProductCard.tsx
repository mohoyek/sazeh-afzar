import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/data/products";
import Reveal from "@/components/ui/Reveal";

interface ProductCardProps {
  product: Product;
  index: number;
  onOpen: (product: Product) => void;
}

export default function ProductCard({ product, index, onOpen }: ProductCardProps) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article className="corner-marks group h-full flex flex-col bg-white border border-black/5 rounded-sm overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-bold text-primary">{product.name}</h3>
          <p className="mt-2 text-sm leading-7 text-secondary flex-1">
            {product.shortDescription}
          </p>
          <ul className="mt-4 flex flex-col gap-1.5">
            {product.specPreview.map((spec) => (
              <li
                key={spec}
                className="flex items-center gap-2 text-xs text-concrete"
              >
                <span className="h-1 w-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
                {spec}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            مشاهده مشخصات
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
        </div>
      </article>
    </Reveal>
  );
}
