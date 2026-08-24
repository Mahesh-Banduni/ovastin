interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      bg-black/40
      flex
      items-center
      justify-center
      p-4
    "
      onClick={onClose}
    >
      <div
        className="
        w-full
        max-w-xl
        rounded-xl
        bg-[var(--background)]
        p-6
      "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}