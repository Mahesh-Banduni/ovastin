import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    relative isolate overflow-hidden
    border border-[color-mix(in_srgb,var(--brand)_100%,black_20%)]
    text-[var(--background)]

    bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand)_100%,white_16%)_0%,var(--brand)_50%,color-mix(in_srgb,var(--brand)_100%,black_10%)_100%)]

    shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_1px_2px_rgba(0,0,0,0.14),0_3px_8px_rgba(0,0,0,0.10)]

    before:content-[''] before:absolute before:inset-0
    before:bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_60%)]
    before:opacity-0 before:transition-opacity before:duration-200
    hover:before:opacity-100

    hover:border-[color-mix(in_srgb,var(--brand)_100%,black_14%)]
    hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_2px_4px_rgba(0,0,0,0.16),0_8px_20px_-4px_color-mix(in_srgb,var(--brand)_60%,transparent)]

    active:before:opacity-0
    active:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand)_100%,black_8%)_0%,color-mix(in_srgb,var(--brand)_100%,black_14%)_100%)]
    active:shadow-[0_1px_3px_rgba(0,0,0,0.22)_inset]
  `,

  secondary: `
    relative isolate overflow-hidden
    border border-[var(--border)]
    text-[var(--secondary-foreground)]

    bg-[linear-gradient(180deg,color-mix(in_srgb,var(--secondary)_100%,white_20%)_0%,var(--secondary)_50%,color-mix(in_srgb,var(--secondary)_100%,black_6%)_100%)]

    shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_2px_rgba(0,0,0,0.05)]

    before:content-[''] before:absolute before:inset-0
    before:bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%)]
    before:opacity-0 before:transition-opacity before:duration-200
    hover:before:opacity-100

    hover:border-[color-mix(in_srgb,var(--border)_100%,black_12%)]
    hover:shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_2px_6px_rgba(0,0,0,0.08)]

    active:before:opacity-0
    active:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--secondary)_100%,black_4%)_0%,color-mix(in_srgb,var(--secondary)_100%,black_10%)_100%)]
    active:shadow-[0_1px_2px_rgba(0,0,0,0.08)_inset]
  `,

  outline: `
    relative isolate overflow-hidden
    border border-[var(--border)]
    bg-transparent
    text-[var(--text-primary)]

    shadow-none

    before:content-[''] before:absolute before:inset-0
    before:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--brand)_8%,transparent)_0%,transparent_70%)]
    before:opacity-0 before:transition-opacity before:duration-200
    hover:before:opacity-100

    hover:bg-[var(--surface-hover)]
    hover:border-[var(--brand)]
    hover:text-[var(--brand)]
    hover:shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--brand)_35%,transparent)]

    active:before:opacity-0
    active:bg-[color-mix(in_srgb,var(--surface-hover)_100%,black_4%)]
  `,

  danger: `
    relative isolate overflow-hidden
    border border-[color-mix(in_srgb,var(--destructive)_100%,black_20%)]
    text-white

    bg-[linear-gradient(180deg,color-mix(in_srgb,var(--destructive)_100%,white_16%)_0%,var(--destructive)_50%,color-mix(in_srgb,var(--destructive)_100%,black_10%)_100%)]

    shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_1px_2px_rgba(0,0,0,0.14),0_3px_8px_rgba(0,0,0,0.10)]

    before:content-[''] before:absolute before:inset-0
    before:bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_60%)]
    before:opacity-0 before:transition-opacity before:duration-200
    hover:before:opacity-100

    hover:border-[color-mix(in_srgb,var(--destructive)_100%,black_14%)]
    hover:shadow-[0_1px_0_rgba(255,255,255,0.26)_inset,0_2px_4px_rgba(0,0,0,0.16),0_8px_20px_-4px_color-mix(in_srgb,var(--destructive)_60%,transparent)]

    active:before:opacity-0
    active:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--destructive)_100%,black_8%)_0%,color-mix(in_srgb,var(--destructive)_100%,black_14%)_100%)]
    active:shadow-[0_1px_3px_rgba(0,0,0,0.22)_inset]
  `,

  ghost: `
    border border-transparent
    bg-transparent
    text-[var(--text-secondary)]

    shadow-none

    hover:bg-[var(--surface-hover)]
    hover:text-[var(--text-primary)]

    active:bg-[color-mix(in_srgb,var(--surface-hover)_100%,black_4%)]
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

        h-9 px-3 text-sm
        sm:h-9 sm:px-4
        md:h-10 md:px-4
        lg:h-10 lg:px-5

        [&>svg]:block
        [&>svg]:h-4 [&>svg]:w-4
        [&>svg]:shrink-0

        rounded-lg
        font-heading
        font-medium
        tracking-[-0.01em]

        cursor-pointer
        whitespace-nowrap
        select-none
        outline-none

        [&>*]:relative [&>*]:z-10
        [&::before]:pointer-events-none

        transition-[background-color,border-color,box-shadow,color]
        duration-200
        ease-out

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]

        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}