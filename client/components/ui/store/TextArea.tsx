export default function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="
      min-h-[140px]
      w-full
      text-sm
      rounded-lg
      border
      border-[var(--border)]
      bg-[var(--background)]
      p-4
      resize-y
      focus:border-[var(--brand)]
      outline-none
    "
    />
  );
}