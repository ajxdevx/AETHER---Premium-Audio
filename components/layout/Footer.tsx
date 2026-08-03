import { BRAND } from "@/constants/brand";
import { FOOTER_COLUMNS } from "@/constants/navigation";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/layout/NavLink";
import { PaymentBadges } from "@/components/ui/PaymentBadges";
import { FooterAccordion } from "@/components/layout/FooterAccordion";
import { FooterLegalLinks } from "@/components/layout/FooterLegalLinks";
import { FooterSocialLinks } from "@/components/layout/FooterSocialLinks";
import { cn } from "@/lib/utils";

export function Footer() {
  const linkColumns = FOOTER_COLUMNS.slice(0, 3);
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="border-t border-brand-border bg-brand-soft text-ink"
    >
      <Container wide>
        <div className="py-10 lg:py-16">
          <div className="mb-6 space-y-4 lg:hidden">
            <Logo size="lg" />
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              {BRAND.description}
            </p>
            <FooterSocialLinks />
          </div>

          <div className="hidden grid-cols-6 gap-8 lg:grid">
            <div className="col-span-2 space-y-5">
              <Logo size="lg" />
              <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
                {BRAND.description}
              </p>
              <FooterSocialLinks />
            </div>

            {linkColumns.map(({ title, links }) => (
              <div key={title}>
                <h3 className="mb-4 text-sm font-bold tracking-wide text-ink">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <NavLink
                        href={link.href}
                        className={cn(
                          "text-sm text-ink-muted",
                          link.href !== "#" &&
                            "transition-colors duration-200 hover:text-ink"
                        )}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-4 text-sm font-bold tracking-wide text-ink">
                We Accept
              </h3>
              <PaymentBadges variant="light" />
            </div>
          </div>

          <div className="border-t border-brand-border lg:hidden">
            {linkColumns.map(({ title, links }) => (
              <FooterAccordion key={title} title={title} links={links} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 border-t border-brand-border py-6 text-[11px] text-ink-muted sm:items-center sm:text-xs md:flex-row md:justify-between md:py-7">
          <p>
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
          <FooterLegalLinks />
        </div>

        <div className="border-t border-brand-border pb-8 pt-5 lg:hidden">
          <h3 className="mb-3 text-[13px] font-bold tracking-wide text-ink">
            We Accept
          </h3>
          <div className="overflow-x-auto pb-1">
            <PaymentBadges variant="light" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
