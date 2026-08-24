"use client";
import * as React from "react";
import { useState, useContext, createContext, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";
import { createPortal } from "react-dom";

// Helper function to concatenate classnames
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type SelectOption = {
  value: string;
  label: string;
  ref: HTMLElement | null;
  id: string;
};

const SelectContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  placeholder?: string;
  setPlaceholder?: (text: string) => void;
  options: SelectOption[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  registerOption: (value: string, label: string, ref: HTMLElement | null, id: string) => void;
  unregisterOption: (value: string) => void;
} | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select subcomponents must be used within a Select provider");
  }
  return context;
}

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  placeholder: initialPlaceholder,
  ...props
}: any) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [placeholder, setPlaceholder] = useState(initialPlaceholder || "");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const activeValue = value !== undefined ? value : internalValue;

  const handleValueChange = (val: string) => {
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
  };

  const registerOption = React.useCallback(
    (val: string, label: string, ref: HTMLElement | null, id: string) => {
      setOptions((prev) => {
        const existingIndex = prev.findIndex((option) => option.value === val);
        const next = [...prev];

        if (existingIndex !== -1) {
          next[existingIndex] = { value: val, label, ref, id };
        } else {
          next.push({ value: val, label, ref, id });
        }

        return next;
      });
    },
    []
  );

  const unregisterOption = React.useCallback((val: string) => {
    setOptions((prev) => prev.filter((option) => option.value !== val));
  }, []);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }

    const selectedIndex = options.findIndex((option) => option.value === activeValue);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, activeValue, options]);

  useEffect(() => {
    if (!open || activeIndex < 0 || activeIndex >= options.length) return;

    const activeOption = options[activeIndex];
    if (!activeOption?.ref) return;

    activeOption.ref.focus();
    activeOption.ref.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, options]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickInsideTrigger = triggerRef.current?.contains(target);
      const isClickInsideContent = target.closest('[data-slot="select-content"]');

      if (!isClickInsideTrigger && !isClickInsideContent) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, setOpen]);

  return (
    <SelectContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef,
        placeholder,
        setPlaceholder,
        options,
        activeIndex,
        setActiveIndex,
        registerOption,
        unregisterOption,
      }}
    >
      <div className="relative inline-block w-full text-left" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectGroup({ className, ...props }: any) {
  return (
    <div
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

export function SelectValue({ placeholder: propPlaceholder, ...props }: any) {
  const { value, options, placeholder: contextPlaceholder } = useSelect();
  const displayPlaceholder = propPlaceholder || contextPlaceholder || "Select...";
  const selectedOption = options.find((option) => option.value === value);

  return (
    <span data-slot="select-value" {...props}>
      {selectedOption?.label ?? displayPlaceholder}
    </span>
  );
}

export function SelectTrigger({ className, size = "default", children, ...props }: any) {
  const { open, setOpen, triggerRef, setActiveIndex, options } = useSelect();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(!open);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="select-trigger"
      data-size={size}
      onClick={() => setOpen(!open)}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 h-12 text-[14px] sm:text-[16px] transition-colors outline-none select-none focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50 data-[size=sm]:h-8 cursor-pointer text-left text-[var(--text-primary)]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-[var(--text-muted)]" />
    </button>
  );
}

export function SelectPortal({ children }: any) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}

export function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  sideOffset = 4,
  ...props
}: any) {
  const { open, triggerRef, options, activeIndex, setActiveIndex, setOpen } = useSelect();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;
  
    const updatePosition = () => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
  
      if (!trigger || !content) return;
  
      const rect = trigger.getBoundingClientRect();
      const rootContainer = trigger.closest(".relative");
      const isInPortal = !rootContainer || !rootContainer.contains(content);
  
      if (isInPortal) {
        let left = rect.left + window.pageXOffset;
        let top = rect.bottom + window.pageYOffset + sideOffset;
  
        if (align === "center") {
          left =
            rect.left +
            window.pageXOffset +
            (rect.width - content.offsetWidth) / 2;
        } else if (align === "end") {
          left = rect.right + window.pageXOffset - content.offsetWidth;
        }
  
        if (position === "popper") {
          content.style.width = `${rect.width}px`;
        }
  
        const screenWidth = window.innerWidth;
  
        if (left + content.offsetWidth > screenWidth) {
          left = screenWidth - content.offsetWidth - 10;
        }
  
        if (left < 10) left = 10;
  
        content.style.position = "absolute";
        content.style.top = `${top}px`;
        content.style.left = `${left}px`;
      } else {
        content.style.position = "absolute";
        content.style.top = "100%";
        content.style.marginTop = `${sideOffset}px`;
  
        if (position === "popper") {
          content.style.width = "100%";
        }
  
        if (align === "end") {
          content.style.right = "0";
          content.style.left = "auto";
        } else if (align === "center") {
          content.style.left = "50%";
          content.style.transform = "translateX(-50%)";
        } else {
          content.style.left = "0";
          content.style.right = "auto";
        }
      }
  
      const isOverflowing =
        content.scrollHeight > content.clientHeight;
  
      setHasScroll(isOverflowing);
    };
  
    updatePosition();
  
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
  
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, align, sideOffset, position]);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    const checkScroll = () => {
      const content = contentRef.current;
      if (!content) return;
      const isOverflowing = content.scrollHeight > content.clientHeight;
      setHasScroll(isOverflowing);
    };

    const observer = new ResizeObserver(checkScroll);
    observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [open]);

  const activeOption = options[activeIndex];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!options.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current: number) => (current + 1) % options.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current: number) => (current - 1 + options.length) % options.length);
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (activeOption?.ref) {
        activeOption.ref.click();
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-slot="select-content"
      role="listbox"
      tabIndex={0}
      aria-activedescendant={activeOption?.id}
      className={cn(
        "z-50 min-w-36 max-h-[250px] overflow-y-auto rounded-lg border bg-[var(--background)] border-[var(--border)] p-1 text-[var(--text-primary)] shadow-md duration-100 animate-in fade-in-0 zoom-in-95",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {hasScroll && <SelectScrollUpButton />}
      <div>{children}</div>
      {hasScroll && <SelectScrollDownButton />}    </div>
  );
}

export function SelectItem({
  className,
  children,
  value: itemValue,
  ...props
}: any) {
  const {
    value,
    onValueChange,
    setOpen,
    registerOption,
    unregisterOption,
    options,
    setActiveIndex,
  } = useSelect();
  const itemRef = useRef<HTMLDivElement | null>(null);
  const idRef = useRef<string>(`select-item-${itemValue}-${Math.random().toString(36).slice(2)}`);
  const isSelected = value === itemValue;
  const index = options.findIndex((option) => option.value === itemValue);
  const labelText = typeof children === "string" ? children : children?.toString?.() || "";

  useEffect(() => {
    registerOption(
      itemValue,
      labelText || itemValue,
      itemRef.current,
      idRef.current
    );
  }, [itemValue, labelText]);

  const handleSelect = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    if (onValueChange) onValueChange(itemValue);
    setOpen(false);
  };

  const handlePointerMove = () => {
    if (index >= 0) {
      setActiveIndex(index);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(event);
    }
  };

  return (
    <div
      ref={itemRef}
      id={idRef.current}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      onClick={handleSelect}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[var(--text-primary)] outline-hidden select-none hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-hover)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        {isSelected && <CheckIcon size={14} className="text-[var(--brand)] pointer-events-none" />}
      </span>
    </div>
  );
}

export function SelectLabel({ className, ...props }: any) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]", className)}
      {...props}
    />
  );
}

export function SelectSeparator({ className, ...props }: any) {
  return (
    <div
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-[var(--border)]", className)}
      {...props}
    />
  );
}

export function SelectScrollUpButton({ className, ...props }: any) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-[var(--background)] py-1 text-[var(--text-muted)]",
        className
      )}
      {...props}
    >
      <ChevronUpIcon size={14} />
    </div>
  );
}

export function SelectScrollDownButton({ className, ...props }: any) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-[var(--background)] py-1 text-[var(--text-muted)]",
        className
      )}
      {...props}
    >
      <ChevronDownIcon size={14} />
    </div>
  );
}

interface Option {
  label: string;
  value: string;
}

interface DefaultSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function DefaultSelect({ options, value, onChange }: DefaultSelectProps) {
  const selectedOption = options.find((item) => item.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={selectedOption?.label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
