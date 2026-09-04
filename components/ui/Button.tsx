import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "outline-light";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-primary hover:bg-accent/90 border border-accent",
  secondary: "bg-primary text-white hover:bg-secondary border border-primary",
  outline: "bg-transparent text-primary border border-primary/30 hover:border-primary",
  "outline-light": "bg-transparent text-white border border-white/40 hover:border-white",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

interface NativeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function LinkButton({ variant = "primary", className = "", children, ...rest }: LinkButtonProps) {
  return (
    <a className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

export default function Button({ variant = "primary", className = "", children, ...rest }: NativeButtonProps) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
