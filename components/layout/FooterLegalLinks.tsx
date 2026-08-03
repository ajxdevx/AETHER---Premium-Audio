"use client";

export function FooterLegalLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
      {(
        [
          ["Privacy Policy", "#"],
          ["Terms & Conditions", "#"],
          ["Cookie Policy", "#"],
        ] as const
      ).map(([label, href]) => (
        <a
          key={label}
          href={href}
          className="cursor-pointer transition-colors duration-200 hover:text-ink"
          onClick={(event) => event.preventDefault()}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
