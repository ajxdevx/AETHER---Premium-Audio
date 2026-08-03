import Image from "next/image";
import { Star } from "@/lib/icons";
import type { Testimonial } from "./data";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 text-star" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-current" : "fill-none text-[#D9D3C8]"}
        />
      ))}
    </div>
  );
}

export function ReviewCard({
  name,
  avatar,
  text,
  rating,
  product,
  image,
}: Testimonial) {
  return (
    <article className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[20px] border border-brand-border bg-white p-4 sm:min-h-[280px] sm:rounded-[22px] sm:p-5 md:min-h-[300px] md:p-6">
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F3F1EC]">
          <Image src={avatar} alt="" fill className="object-cover" sizes="44px" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight text-ink">{name}</p>
          <p className="mt-0.5 text-[12px] text-ink-soft">Verified Buyer</p>
        </div>
      </div>
      <div className="mt-4"><Stars rating={rating} /></div>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#4A4740]">{text}</p>
      <div className="relative mt-5 flex min-h-[76px] items-end justify-between gap-3 pr-[92px]">
        <p className="pb-1 text-[12px] font-bold text-ink">{product}</p>
        <div className="pointer-events-none absolute -bottom-1 -right-1 h-[100px] w-[100px] sm:h-[108px] sm:w-[108px]">
          <Image src={image} alt={product} fill className="object-contain object-bottom drop-shadow-[0_10px_18px_rgba(40,35,20,0.12)]" sizes="108px" />
        </div>
      </div>
    </article>
  );
}
