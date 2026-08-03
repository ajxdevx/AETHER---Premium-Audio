import type { Metadata } from "next";
import type { Viewport } from "next";
import { LOCALE } from "@/constants/locale";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LazyCartDrawer } from "@/components/layout/LazyCartDrawer";
import { QueryProvider } from "@/providers/QueryProvider";
import { CartProvider } from "@/providers/CartProvider";
import { WishlistProvider } from "@/providers/WishlistProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { SignatureThemeProvider } from "@/providers/SignatureThemeProvider";
import { ThemeFavicon } from "@/components/theme/ThemeFavicon";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { RestoreImagesOnResume } from "@/components/layout/RestoreImagesOnResume";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { LazySignatureIntro } from "@/components/intro/LazySignatureIntro";
import { IntroProvider } from "@/components/intro/IntroContext";
import { SiteAfterIntro } from "@/components/intro/SiteAfterIntro";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { WebVitals } from "@/components/observability/WebVitals";
import { createRootMetadata } from "@/lib/seo";
import { getThemeBootScript } from "@/lib/themeFavicon";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-announce",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B9B45" },
    { media: "(prefers-color-scheme: dark)", color: "#6B9B45" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={`${LOCALE.language}-${LOCALE.region}`}
      className={`${jakarta.variable} ${spaceGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <SiteJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeBootScript(),
          }}
        />
      </head>
      <body
        className="flex min-h-full flex-col overflow-x-hidden font-sans antialiased"
        suppressHydrationWarning
      >
        <QueryProvider>
          <WebVitals />
          <ToastProvider>
          <SignatureThemeProvider>
          <ThemeFavicon />
          <CartProvider>
          <WishlistProvider>
          <IntroProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-dark focus:shadow-lg"
            >
              Skip to main content
            </a>
            <ScrollToTop />
            <RestoreImagesOnResume />
            <LazySignatureIntro />
            <SiteAfterIntro>
              <SmoothScroll>
                <Navbar />
                <main id="main-content" className="flex flex-1 flex-col">
                  {children}
                </main>
                <Footer />
                <LazyCartDrawer />
              </SmoothScroll>
            </SiteAfterIntro>
          </IntroProvider>
          </WishlistProvider>
          </CartProvider>
          </SignatureThemeProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
