import { ASSETS } from "@/constants/assets";

const { primary: maxColors } = ASSETS.products.max;
const listenerAvatars = ASSETS.avatars.listeners;

export const AUTO_MS = 3000;
export const PER_PAGE_DESKTOP = 3;

export const TESTIMONIALS = [
  { name: "Jessica M.", avatar: listenerAvatars[0], text: "The sound quality is unreal — rich bass, clear vocals, and no harshness at high volume. Worth every penny. I use them every day for work and workouts.", rating: 5, product: "Aether Pods (Pink)", image: maxColors.pink },
  { name: "Daniel K.", avatar: listenerAvatars[1], text: "Super comfortable for long sessions and the noise cancellation is next level. Flights, cafés, open offices — everything just disappears when I put them on.", rating: 5, product: "Aether Pods (Space Dark)", image: maxColors.black },
  { name: "Sophia L.", avatar: listenerAvatars[2], text: "Battery life is amazing and they look incredible. Love the green finish — I get compliments constantly. Charging once or twice a week is more than enough.", rating: 5, product: "Aether Pods (Green)", image: maxColors.green },
  { name: "Omar H.", avatar: listenerAvatars[3], text: "Spatial audio feels cinematic. Movies and playlists finally have real width and depth. Easily the best headphones I’ve owned, and pairing was instant.", rating: 5, product: "Aether Pods (Sky Blue)", image: maxColors.blue },
  { name: "Layla R.", avatar: listenerAvatars[0], text: "The cushions are so soft I forget I’m wearing them at work. All-day comfort without clamping my head, and the mic sounds crisp on client calls too.", rating: 5, product: "Aether Pods (Pink)", image: maxColors.pink },
  { name: "Noah P.", avatar: listenerAvatars[1], text: "Build quality feels premium and the case is a total flex. Everything about the unboxing and the finish feels expensive — and the sound backs it up.", rating: 5, product: "Aether Pods (Space Dark)", image: maxColors.black },
  { name: "Maya S.", avatar: listenerAvatars[2], text: "Transparency mode is perfect for commuting. I can hear announcements clearly without taking them off, then flip back to silence in a second.", rating: 5, product: "Aether Pods (Green)", image: maxColors.green },
  { name: "Adam T.", avatar: listenerAvatars[3], text: "Pairing was instant across my phone and laptop, and the battery easily lasts all day. Controls are simple — volume, skip, calls — no learning curve.", rating: 5, product: "Aether Pods (Sky Blue)", image: maxColors.blue },
  { name: "Iris V.", avatar: listenerAvatars[0], text: "They look stunning and sound even better. Getting compliments daily on the color, and the detail in vocals and instruments keeps surprising me.", rating: 5, product: "Aether Pods (Pink)", image: maxColors.pink },
  { name: "Karim B.", avatar: listenerAvatars[1], text: "Noise cancel is unreal on flights. Worth every dirham. I finally arrive rested instead of drained, and the fit stays locked in for hours.", rating: 5, product: "Aether Pods (Space Dark)", image: maxColors.black },
] as const;

export type Testimonial = (typeof TESTIMONIALS)[number];
