"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { LinkButton } from "@/components/ui/Button";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-sm sm:rounded-sm"
          >
            <div className="relative aspect-[16/9] w-full bg-bg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="بستن پنجره"
                className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-sm bg-white/90 text-primary hover:bg-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h3
                id="product-modal-title"
                className="text-2xl font-bold text-primary"
              >
                {product.name}
              </h3>
              <p className="mt-2 text-sm leading-7 text-secondary">
                {product.shortDescription}
              </p>

              <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-black/5 pt-6">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <dt className="text-xs font-medium text-concrete">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium text-primary">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <LinkButton
                href="#contact"
                variant="primary"
                onClick={onClose}
                className="mt-8 w-full sm:w-auto"
              >
                درخواست استعلام قیمت
              </LinkButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
