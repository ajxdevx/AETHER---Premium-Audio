import { MAX_COLOR_PRODUCTS } from "@/lib/products";
import { MaxColorProductCard } from "@/components/product/MaxColorProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface RelatedFinishesProps {
  product: Product;
  activeColorId: string;
}

export function RelatedFinishes({
  product,
  activeColorId,
}: RelatedFinishesProps) {
  return (
    <section className="mt-16 lg:mt-20" aria-labelledby="related-heading">
      <div className="mb-6">
        <h2
          id="related-heading"
          className="font-[family-name:var(--font-announce)] text-[1.5rem] font-bold tracking-tight text-ink sm:text-[1.75rem]"
        >
          You May Also Like
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {MAX_COLOR_PRODUCTS.map((item) => (
          <div
            key={item.colorId}
            className={cn(item.colorId === activeColorId && "hidden")}
            aria-hidden={item.colorId === activeColorId || undefined}
          >
            <MaxColorProductCard
              product={product}
              name={item.name}
              colorLabel={item.colorLabel}
              colorId={item.colorId}
              rating={item.rating}
              reviewCount={item.reviewCount}
              price={item.price}
              compareAt={item.compareAt}
              image={item.image}
              pastel={item.pastel}
              isNew={item.isNew}
              promo={item.promo}
              quietMotion
            />
          </div>
        ))}
      </div>
    </section>
  );
}
