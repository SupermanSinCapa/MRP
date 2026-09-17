"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import { type Product, formatPrice } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const photos = product.photos;
  const hasMultiple = photos.length > 1;

  function showPrev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function showNext() {
    setIndex((i) => (i + 1) % photos.length);
  }

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-sage-100">
        {photos.length > 0 ? (
          <>
            <Image
              key={photos[index]}
              src={photos[index]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="animate-in fade-in object-cover duration-300 transition-transform group-hover:scale-105"
            />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous photo"
                  className="absolute left-1.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-colors hover:bg-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photo"
                  className="absolute right-1.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow-sm transition-colors hover:bg-white"
                >
                  <ChevronRight className="size-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {photos.map((url, i) => (
                    <span
                      key={url}
                      className={`size-1.5 rounded-full transition-colors ${
                        i === index ? "bg-sage-700" : "bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sage-400">
            <Store className="size-12" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-heading text-lg font-semibold">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}
        <p className="font-heading text-xl font-semibold text-terracota-600">
          {formatPrice(Number(product.price))}
        </p>
      </div>
    </article>
  );
}
