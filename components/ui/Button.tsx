import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  buttonBaseClass,
  buttonBlackWipeClass,
  buttonOutlineBrandClass,
  buttonOutlineSoftClass,
  BUTTON_BORDER,
  BUTTON_BORDER_HOVER,
  BUTTON_SOFT_HOVER,
  BRAND_SOFT_HOVER,
} from "@/lib/buttonStyles";
import { ButtonWipeFill } from "@/components/ui/ButtonWipeFill";

const buttonVariants = cva(buttonBaseClass, {
  variants: {
    variant: {
      primary: buttonBlackWipeClass,
      secondary: buttonOutlineBrandClass,
      soft: buttonOutlineSoftClass,
      ghost: cn(
        "border border-transparent bg-transparent text-ink",
        BRAND_SOFT_HOVER
      ),
      outline: buttonOutlineSoftClass,
      quiet: cn(
        BUTTON_BORDER,
        "bg-surface text-text-body hover:text-ink",
        BUTTON_BORDER_HOVER,
        BUTTON_SOFT_HOVER
      ),
      accent: cn(
        "border border-accent bg-accent text-surface hover:bg-accent/90"
      ),
    },
    size: {
      sm: "h-9 px-4 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-6 text-sm",
      xl: "h-14 px-8 text-[15px]",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size, children, ...props }, ref) => {
    const useWipe = variant === "primary" || variant == null;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {useWipe ? <ButtonWipeFill /> : null}
        {useWipe ? (
          <span className="relative z-[1] inline-flex items-center justify-center gap-2">
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export {
  buttonVariants,
  buttonBlackWipeClass,
  buttonOutlineBrandClass,
  buttonOutlineSoftClass,
};
