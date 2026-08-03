import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function Container({ children, className, wide = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-5 lg:px-6",
        wide ? "max-w-[1720px]" : "max-w-[1600px]",
        className
      )}
    >
      {children}
    </div>
  );
}
