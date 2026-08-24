interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className = "",
  ...props
}: InputProps) {
  const baseInput =
    `
    w-full
    h-12
    px-4
    rounded-xl
    border
    bg-[var(--background)]
    border-[var(--border)]
    text-[var(--text-primary)]
    placeholder:text-[var(--text-muted)]
    text-sm
    font-medium
    focus:outline-none
    focus:border-[var(--brand)]
    focus:ring-2
    focus:ring-[var(--brand)]/20
    transition-all
    duration-200
    hover:border-[var(--brand)]/40
  `;
  return (
    <input
      {...props}
      className={`
        ${baseInput}
        ${className}
      `}
    />
  );
}