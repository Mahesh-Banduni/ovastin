interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}

export default function Label({
  children,
  required,
  htmlFor,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
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