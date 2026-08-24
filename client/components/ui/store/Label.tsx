interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export default function Label({
  children,
  required,
}: LabelProps) {
  return (
    <label
      className="
      text-sm
      font-semibold
      text-[var(--text-primary)]
    "
    >
      {children}

      {required && (
        <span className="text-[var(--danger)] ml-1">
          *
        </span>
      )}
    </label>
  );
}