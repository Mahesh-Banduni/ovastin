"use client";

import { Search, X } from "lucide-react";
import Input from "./Input";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export default function SearchInput({
  className = "",
  value,
  onClear,
  disabled,
  ...props
}: SearchInputProps) {
  const searchValue = value?.toString() ?? "";
  const showClear = searchValue.length > 0 && !disabled;

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
        <Search size={16} />
      </span>

      <Input
        {...props}
        type="text"
        role="searchbox"
        value={value}
        disabled={disabled}
        className={`pl-10 ${showClear ? "pr-10" : "pr-4"} ${className}`}
      />

      {showClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex w-8 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
