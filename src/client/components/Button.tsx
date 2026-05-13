import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 font-sans text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-800 text-stone-50 hover:bg-emerald-900 active:bg-emerald-900",
  secondary:
    "bg-stone-50 text-emerald-800 border border-emerald-800 hover:bg-stone-100",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
