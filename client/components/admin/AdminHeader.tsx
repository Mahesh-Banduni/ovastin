"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, Bell, PanelLeft } from "lucide-react";
import Button from "@/components/ui/store/Button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/store/Breadcrumb";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

const routeNameMap: Record<string, string> = {
  admin: "Dashboard",
  projects: "Projects",
  services: "Services",
  awards: "Awards & Recognitions",
  amenities: "Amenities",
  developers: "Developers",
  contact: "Contact Inquiries",
  profile: "Profile Settings",
};

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border)]"
      style={{
        background: "var(--background)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "color-mix(in srgb, var(--background) 85%, transparent)",
      }}
    >
      {/* ── Left: Sidebar Toggle + Breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden flex-shrink-0 rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu size={18} />
        </Button>

        {/* Panel / Sidebar Icon for desktop (as in reference image) */}
        <div className="hidden lg:flex items-center text-[var(--text-muted)]">
          <PanelLeft size={16} />
        </div>

        {/* Breadcrumb links */}
        <Breadcrumb className="text-xs sm:text-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/admin">Dashboard</Link></BreadcrumbLink>
            </BreadcrumbItem>

          {segments.length > 1 && (
            <>
              <BreadcrumbSeparator />
              {segments.slice(1).map((seg, idx, arr) => {
                const isLast = idx === arr.length - 1;
                const path = "/" + segments.slice(0, idx + 2).join("/");
                const label = routeNameMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

                return isLast ? (
                  <BreadcrumbItem key={path}>
                    <BreadcrumbPage
                      className="font-semibold capitalize truncate max-w-[200px]"
                    >
                      {label}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem key={path}>
                    <BreadcrumbLink asChild>
                      <Link href={path} className="capitalize font-medium">{label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                );
              })}
            </>
          )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Right: User + Notifications ──────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <Button
          variant="ghost"
          type="button"
          className="relative flex-shrink-0 rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Dot indicator */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-[var(--background)]"
            style={{ background: "var(--brand)" }}
          />
        </Button>

        {/* User profile avatar */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-[var(--border)] ml-0.5">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
              {session?.user?.name || "Admin"}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
              {session?.user?.email || "admin@example.com"}
            </div>
          </div>
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
