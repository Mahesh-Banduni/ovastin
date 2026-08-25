"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Building2,
  Briefcase,
  Trophy,
  Sparkles,
  Users,
  Inbox,
  UserCheck,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../ui/store/Sidebar";
import Button from "@/components/ui/store/Button";
import Image from "next/image";

interface AdminSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navGroups = [
  {
    label: "Content",
    items: [
      { name: "Projects", href: "/admin/projects", icon: Building2 },
      { name: "Services", href: "/admin/services", icon: Briefcase },
      { name: "Awards", href: "/admin/awards", icon: Trophy },
      { name: "Amenities", href: "/admin/amenities", icon: Sparkles },
      { name: "Developers", href: "/admin/developers", icon: Users },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Contact Submissions", href: "/admin/contact", icon: Inbox },
      { name: "Profile Settings", href: "/admin/profile", icon: UserCheck },
    ],
  },
];

export default function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const isActive = (href: string) =>
    href !== "/admin"
      ? pathname === href || pathname.startsWith(href)
      : pathname === href;

  return (
    <Sidebar open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full flex-col">

        {/* ── Brand Header ──────────────────────────────────── */}
        <div className="px-6 py-6 border-b border-[var(--border)]">
            <div onClick={()=>router.push("/admin")} className="cursor-pointer relative h-10 w-full min-w-30 flex items-center justify-center">
                <Image src="/images/logo/ovastin-logo.svg" alt="Ovastin Logo" loading="eager" fill className="object-cover" />
            </div>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={`
                        group relative flex items-center justify-between
                        px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${active
                          ? "text-[var(--background)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                        }
                      `}
                      style={active ? {
                        background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 180%)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      } : {}}
                    >
                      {/* Left accent line */}
                      {!active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full bg-[var(--brand)] group-hover:h-5 transition-all duration-200 opacity-0 group-hover:opacity-100" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon
                          size={17}
                          className={active ? "" : "text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors"}
                          style={active ? { color: "var(--background)" } : {}}
                        />
                        <span>{item.name}</span>
                      </div>

                      <ChevronRight
                        size={14}
                        className={`transition-all duration-200 ${
                          active
                            ? "opacity-70"
                            : "opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
                        }`}
                        style={active ? { color: "var(--background)" } : {}}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Bottom Section ────────────────────────────────── */}
        <div className="border-t border-[var(--border)] p-3 space-y-1">
          {/* Live site link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-200 group"
          >
            <ExternalLink size={15} className="group-hover:text-[var(--brand)] transition-colors" />
            <span>View Live Website</span>
          </Link>

          {/* User profile card */}
          <div className="mx-1 mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)",
                color: "var(--background)",
              }}
            >
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {session?.user?.name || "Admin User"}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">
                {session?.user?.email || "admin@example.com"}
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
