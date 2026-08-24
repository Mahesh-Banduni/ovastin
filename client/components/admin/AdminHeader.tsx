"use client";

import { useSession } from "next-auth/react";
import { Menu, Bell } from "lucide-react";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({
  onOpenSidebar,
  title,
  subtitle,
  action,
}: AdminHeaderProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--border)]"
      style={{
        background: "var(--background)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "color-mix(in srgb, var(--background) 85%, transparent)",
      }}
    >
      {/* ── Left: Hamburger + Page Title ────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden flex-shrink-0 rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Title block */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] truncate">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Actions + User ────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Page-level action (e.g. "Add Project") */}
        {action && <div>{action}</div>}

        {/* Notification bell */}
        <button
          type="button"
          className="relative flex-shrink-0 rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {/* Dot indicator */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[var(--background)]"
            style={{ background: "var(--brand)" }}
          />
        </button>

        {/* User avatar */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-[var(--border)] ml-0.5">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
              {session?.user?.name || "Admin"}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
              {session?.user?.email || "admin@example.com"}
            </div>
          </div>
          {/* Avatar circle */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)",
              color: "var(--background)",
              boxShadow: "0 0 0 2px var(--border), 0 2px 8px rgba(0,0,0,0.1)",
            }}
            title={session?.user?.email || ""}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
