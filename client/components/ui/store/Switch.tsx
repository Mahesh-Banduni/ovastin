interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Switch({
  checked,
  onChange,
}: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative
        h-7
        w-12
        rounded-full
        transition

        ${
          checked
            ? "bg-[var(--brand)]"
            : "bg-[var(--border)]"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-5
          w-5
          rounded-full
          bg-white
          transition-all

          ${
            checked
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}