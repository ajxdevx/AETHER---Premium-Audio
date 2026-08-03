export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", badge: "New" },
  { label: "Experience", href: "/#spotlights" },
  { label: "Reviews", href: "/#reviews" },
] as const;

export const FOOTER_SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "AETHER Max", href: "/product/4" },
  { label: "Matcha Green", href: "/product/4?color=green" },
  { label: "Space Dark", href: "/product/4?color=black" },
  { label: "Blush Pink", href: "/product/4?color=pink" },
  { label: "Sky Blue", href: "/product/4?color=blue" },
] as const;

/** Explore — real homepage sections */
export const FOOTER_SECTION_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Experience", href: "/#spotlights" },
  { label: "Features", href: "/#features" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Get Yours", href: "/#get-yours" },
  { label: "Newsletter", href: "/#discover" },
] as const;

export const FOOTER_COMPANY_LINKS = [
  { label: "About Us", href: "/#spotlights" },
  { label: "Our Story", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Press", href: "#" },
] as const;

/** Keep placeholder support links (no dedicated pages yet) */
export const FOOTER_SUPPORT_LINKS = [
  { label: "Help Center", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Warranty", href: "#" },
] as const;

export const FOOTER_COLUMNS = [
  { title: "Shop", links: FOOTER_SHOP_LINKS },
  { title: "Explore", links: FOOTER_SECTION_LINKS },
  { title: "Company", links: FOOTER_COMPANY_LINKS },
  { title: "Support", links: FOOTER_SUPPORT_LINKS },
] as const;
