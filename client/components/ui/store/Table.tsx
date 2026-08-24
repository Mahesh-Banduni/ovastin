import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({
  className = "",
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      className="
        relative
        w-full
        overflow-auto
        rounded-xl
        border
        border-[var(--border)]
      "
    >
      <table
        className={`
          w-full
          caption-bottom
          text-sm
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`
        bg-[var(--surface)]
        ${className}
      `}
      {...props}
    />
  );
}

export function TableBody({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={className}
      {...props}
    />
  );
}

export function TableFooter({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={`
        border-t
        border-[var(--border)]
        bg-[var(--surface)]
        font-medium
        ${className}
      `}
      {...props}
    />
  );
}

export function TableRow({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`
        border-b
        border-[var(--border)]
        transition-colors
        hover:bg-[var(--surface-hover)]
        ${className}
      `}
      {...props}
    />
  );
}

export function TableHead({
  className = "",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`
        h-12
        px-4
        text-left
        align-middle
        font-semibold
        text-[var(--text-primary)]
        whitespace-nowrap
        ${className}
      `}
      {...props}
    />
  );
}

export function TableCell({
  className = "",
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`
        p-4
        align-middle
        text-[var(--text-secondary)]
        ${className}
      `}
      {...props}
    />
  );
}

export function TableCaption({
  className = "",
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={`
        mt-4
        text-sm
        text-[var(--text-muted)]
        ${className}
      `}
      {...props}
    />
  );
}