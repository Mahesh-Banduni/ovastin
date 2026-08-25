"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          {/* Branded spinner */}
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-full opacity-20 animate-ping"
              style={{ background: "var(--brand)" }}
            />
            <div
              className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 160%)",
              }}
            >
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--background)" }} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Loading workspace
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Verifying your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Common Admin Breadcrumb Header */}
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
