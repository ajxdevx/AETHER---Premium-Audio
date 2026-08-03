import { cn } from "@/lib/utils";

export const PAGE_SHELL_SURFACE = "relative z-10 bg-white";

export const PAGE_SHELL_PADDING =
  "pb-14 pt-4 md:pb-16 md:pt-6 lg:pb-20 lg:pt-8";

/** @deprecated use PAGE_SHELL_SURFACE — kept for older imports */
export const PAGE_FOOTER_CURVE = PAGE_SHELL_SURFACE;

export function PageShell({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section
        className={cn(
          PAGE_SHELL_SURFACE,
          "flex w-full flex-1 flex-col",
          className
        )}
        {...props}
      >
        {children}
      </section>
    </div>
  );
}
