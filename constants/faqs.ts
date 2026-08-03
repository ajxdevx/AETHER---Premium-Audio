/** Shared help-center FAQs — shop page, product tabs, and site search. */
export const SITE_FAQS = [
  {
    id: "whats-included",
    question: "What’s included with Aether Pods?",
    answer:
      "Every pair ships with the Soft Smart Case, a Lightning to USB-C cable, and a quick-start guide. Finish colors match the cups, cushions, and case accents.",
  },
  {
    id: "battery",
    question: "How long does the battery last?",
    answer:
      "Aether Pods deliver up to 40 hours of listening with Active Noise Cancellation on. A quick charge gives several hours of playback when you’re short on time.",
  },
  {
    id: "shipping",
    question: "Do you deliver across Morocco?",
    answer:
      "Yes. We ship nationwide with free delivery on every Aether Pods order. Most cities receive tracking updates within 24–48 hours of dispatch.",
  },
  {
    id: "returns",
    question: "What’s your return policy?",
    answer:
      "You have 30 days for a full refund if the product is unused and in original packaging. Warranty coverage also includes 2 years of protection against manufacturing defects.",
  },
  {
    id: "trade-in",
    question: "Can I trade in my old headphones?",
    answer:
      "Yes. Eligible headphones can be traded in toward Aether Pods. Start from the Trade in. Upgrade. panel on the shop page, or contact support for a personalized estimate.",
  },
] as const;

export type SiteFaq = (typeof SITE_FAQS)[number];
