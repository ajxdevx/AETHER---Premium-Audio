import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageShell, PAGE_SHELL_PADDING } from "@/components/layout/PageShell";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";
import { buttonBlackWipeClass } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <PageShell className={cn(PAGE_SHELL_PADDING, "bg-white text-ink")}>
      <Container wide>
        <div className="mx-auto flex min-h-[52vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/55">
            Error 404
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-announce)] text-[clamp(2.25rem,6vw+0.5rem,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
            Page not found
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 sm:text-[16px]">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/"
              className={cn(
                buttonBlackWipeClass,
                "group/btn relative inline-flex h-12 items-center justify-center px-7 text-[14px] font-semibold"
              )}
            >
              <ButtonWipeFill />
              <span className="relative z-[1]">Back to Home</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/20 bg-white px-7 text-[14px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              Shop Pro Pods
            </Link>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
