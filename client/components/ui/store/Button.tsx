import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-primary-foreground
    border border-primary
    shadow-[0_2px_6px_rgba(0,0,0,0.12)]
    hover:brightness-110
    hover:-translate-y-[1px]
    hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)]
  `,

  secondary: `
    bg-secondary text-secondary-foreground
    border border-secondary
    shadow-sm
    hover:brightness-105
    hover:-translate-y-[1px]
    hover:shadow-md
  `,

  outline: `
    bg-transparent text-foreground
    border border-border
    shadow-sm
    hover:bg-muted
    hover:border-foreground/20
  `,

  danger: `
    bg-destructive text-white
    border border-destructive
    shadow-sm
    hover:brightness-110
    hover:-translate-y-[1px]
    hover:shadow-md
  `,

  ghost: `
    bg-transparent text-muted-foreground
    border border-transparent
    hover:bg-muted
    hover:text-foreground
  `,
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        h-9 px-4
        [&>svg]:block [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0
        rounded-lg
        text-sm font-semibold
        font-heading
        cursor-pointer
        whitespace-nowrap
        select-none

        transition-all duration-200 ease-out

        active:translate-y-0
        active:scale-[0.98]

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background

        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}