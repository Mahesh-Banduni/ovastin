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
    rounded-lg
    border
    bg-[var(--background)]
    border-[var(--border)]
    text-[var(--text-primary)]
    placeholder:text-[var(--text-muted)]
    focus:outline-none
    focus:border-[var(--brand)]
    transition-all
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