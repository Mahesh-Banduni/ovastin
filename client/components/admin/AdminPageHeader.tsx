"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  countLabel = "total",
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {Icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)",
              color: "var(--background)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Icon size={22} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] truncate">
            {title}
          </h1>
          {(subtitle || count !== undefined) && (
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
              {subtitle}
              {count !== undefined && (
                <span className="ml-1 text-[var(--text-secondary)] font-medium">
                  ({count} {countLabel})
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  );
}
