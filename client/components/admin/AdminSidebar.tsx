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
import { useCallback } from "react";
import Image from "next/image";

import Sidebar from "../ui/store/Sidebar";
import Button from "@/components/ui/store/Button";

interface AdminSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        name: "Projects",
        href: "/admin/projects",
        icon: Building2,
      },
      {
        name: "Services",
        href: "/admin/services",
        icon: Briefcase,
      },
      {
        name: "Awards",
        href: "/admin/awards",
        icon: Trophy,
      },
      {
        name: "Amenities",
        href: "/admin/amenities",
        icon: Sparkles,
      },
      {
        name: "Developers",
        href: "/admin/developers",
        icon: Users,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        name: "Contact Submissions",
        href: "/admin/contact",
        icon: Inbox,
      },
      {
        name: "Profile Settings",
        href: "/admin/profile",
        icon: UserCheck,
      },
    ],
  },
];

export default function AdminSidebar({
  open,
  onOpenChange,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = useCallback(
    (href: string) => {
      if (href === "/admin") {
        return pathname === "/admin";
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "admin@example.com";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <Sidebar open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full flex-col bg-[var(--background)]">
        {/* Header */}
        <div className="px-scale-sm-4 py-scale-sm-3.5">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            aria-label="Go to admin dashboard"
            className="group flex w-full cursor-pointer items-center justify-center rounded-xl px-scale-sm-2 py-scale-sm-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            <div className="relative h-9 sm:h-10 md:h-11 lg:h-13 w-fit min-w-35 md:min-w-38 lg:min-w-40">
              <Image
                src="/images/logo/ovastin-logo.svg"
                alt="Ovastin"
                fill
                priority
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto px-scale-sm-3 py-scale-sm-5 scrollbar-hide"
        >
          <div className="space-y-7">
            {navGroups.map((group) => (
              <section key={group.label}>
                <div className="mb-scale-sm-2 flex items-center gap-2 px-scale-sm-3">
                  <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {group.label}
                  </p>
                  <span className="h-px flex-1 bg-[var(--border)]" />
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
                        aria-current={active ? "page" : undefined}
                        className={[
                          "group relative flex min-h-11 items-center gap-3 rounded-xl px-scale-sm-3.5 text-sm font-medium",
                          "outline-none transition-all duration-200",
                          "focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                          active
                            ? "bg-[var(--surface-hover)] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_var(--border)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
                        ].join(" ")}
                      >
                        {/* Active indicator */}
                        <span
                          className={[
                            "absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full bg-[var(--brand)] transition-all duration-200",
                            active ? "w-[3px] opacity-100" : "w-[3px] opacity-0",
                          ].join(" ")}
                        />

                        {/* Icon */}
                        <span
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                            active
                              ? "bg-[color-mix(in_srgb,var(--brand)_14%,transparent)] text-[var(--brand)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--brand)_20%,transparent)]"
                              : "text-[var(--text-muted)] group-hover:bg-[var(--background)] group-hover:text-[var(--brand)]",
                          ].join(" ")}
                        >
                          <Icon size={16} strokeWidth={active ? 2.25 : 2} />
                        </span>

                        {/* Label */}
                        <span className="min-w-0 flex-1 truncate tracking-[-0.01em]">
                          {item.name}
                        </span>

                        {/* Arrow */}
                        <ChevronRight
                          size={14}
                          strokeWidth={2.25}
                          className={[
                            "shrink-0 transition-all duration-200",
                            active
                              ? "translate-x-0 text-[var(--brand)] opacity-100"
                              : "-translate-x-1 text-[var(--text-muted)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                          ].join(" ")}
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-scale-sm-3">
          {/* Live website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenChange(false)}
            className="group mb-scale-sm-3 flex min-h-10 items-center gap-scale-sm-3 rounded-xl px-scale-sm-3.5 text-xs font-medium text-[var(--text-secondary)] outline-none transition-all duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-hover)] shadow-[inset_0_0_0_1px_var(--border)] transition-colors group-hover:bg-[var(--background)]">
              <ExternalLink
                size={13}
                className="text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand)]"
              />
            </span>

            <span className="flex-1">View Live Website</span>

            <span className="text-[10px] text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100">
              ↗
            </span>
          </Link>

          {/* User card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[var(--surface-hover)]">
            <div className="flex items-center gap-3 rounded-xl p-2">
              {/* Avatar */}
              <div
                className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold ring-1 ring-inset ring-[color-mix(in_srgb,var(--brand)_25%,transparent)]"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--brand) 100%, white 14%) 0%, var(--brand) 45%, color-mix(in srgb, var(--brand) 100%, black 10%) 100%)",
                  color: "var(--background)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={userName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>

              {/* User information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                  {userName}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                  {userEmail}
                </p>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                onClick={() =>
                  signOut({
                    callbackUrl: "/signin",
                  })
                }
                aria-label="Sign out"
                title="Sign out"
                className="group flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg p-0 text-[var(--text-muted)] transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)]"
              >
                <LogOut
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}