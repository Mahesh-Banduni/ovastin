import { X } from "lucide-react";

interface CloseButtonProps {
  onCancel: () => void;
  title?: string;
  size?: number;
}

export function CloseButton({
  onCancel,
  title = "Close form",
  size = 18,
}: CloseButtonProps) {
  return (
    <button
      type="button"
      className="absolute right-1 top-1 cursor-pointer rounded-lg p-1.5 text-text-primary transition-colors hover:bg-[var(--surface-hover)]"
      title={title}
      onClick={onCancel}
    >
      <X size={size} />
    </button>
  );
}