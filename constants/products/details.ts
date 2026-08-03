export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetail {
  longDescription: string;
  highlights: string[];
  specs: ProductSpec[];
  shipping: string;
  returns: string;
}

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  4: {
    longDescription:
      "AETHER Max is our largest over-ear platform — bigger drivers, more headroom, and a premium aluminum yoke that feels as refined as it looks. Tuned for listeners who want scale and detail, Max handles classical dynamics and modern bass with equal confidence. Plush ear pads seal comfortably for long sessions at home or on the road.",
    highlights: [
      "Forty five millimeter extended bass drivers",
      "Fifty hour battery with spatial audio",
      "Premium aluminum frame replaceable pads",
      "Hi res wireless LDAC aptX Adaptive",
      "Smart wear detection auto pause feature",
    ],
    specs: [
      { label: "Weight", value: "312 g" },
      { label: "Dimensions", value: "21 × 19 × 9 cm (folded)" },
      { label: "Drivers", value: "45 mm dynamic" },
      { label: "Battery", value: "Up to 50 h (ANC on)" },
      { label: "Connectivity", value: "Bluetooth 5.3, LDAC, aptX Adaptive" },
      { label: "Frequency response", value: "20 Hz – 40 kHz" },
    ],
    shipping:
      "Complimentary express delivery. Max ships in a rigid gift-ready box with cable and adapter included.",
    returns:
      "Full 30-day satisfaction guarantee. Return Max in original packaging with all accessories for a complete refund — our team processes returns within 3 business days of delivery to our warehouse.",
  },
};

export const DEFAULT_PRODUCT_DETAIL: ProductDetail = {
  longDescription:
    "Engineered by AETHER for premium wireless audio — balanced tuning, thoughtful materials, and everyday reliability.",
  highlights: [
    "Premium AETHER build and tuning",
    "Free express shipping every order",
    "Thirty day hassle free returns",
  ],
  specs: [],
  shipping: "Free express shipping on all AETHER orders with full tracking.",
  returns:
    "30-day hassle-free returns. Send the product back in original condition with accessories for a full refund — prepaid return label included across Morocco.",
};
