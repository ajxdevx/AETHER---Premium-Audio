"use client";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  Youtube,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "X", href: "#", Icon: TwitterIcon },
  { label: "YouTube", href: "#", Icon: Youtube },
] as const;

export function FooterSocialLinks() {
  return (
    <div className="flex flex-wrap gap-2 pt-0.5 lg:gap-2.5 lg:pt-1">
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          aria-disabled="true"
          onClick={(event) => event.preventDefault()}
          className={cn(
            "group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
            "bg-white text-brand",
            "transition-[background-color,color,box-shadow] duration-300 ease-out",
            "brand-icon-hover"
          )}
        >
          <Icon className="h-[16px] w-[16px]" aria-hidden />
        </a>
      ))}
    </div>
  );
}
