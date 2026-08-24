import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-[var(--background)] relative overflow-hidden">

      {/* ── Animated Background ─────────────────────────────── */}
      {/* Large gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
            animation: "authOrb1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
            animation: "authOrb2 15s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--brand) 0%, transparent 60%)",
            animation: "authOrb3 18s ease-in-out infinite alternate",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Left Branding Panel — hidden on mobile ──────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] flex-col justify-between p-12 xl:p-16 relative z-10">
        {/* Top brand mark */}
        <div>
          <span className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Ovastin<span className="text-[var(--brand)]">.</span>
          </span>
          <p className="mt-1 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
            Admin Portal
          </p>
        </div>

        {/* Center tagline */}
        <div className="space-y-5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-xs font-semibold text-[var(--brand)] uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
            Real Estate Management
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] text-[var(--text-primary)]">
            Manage your<br />
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, var(--text-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              properties
            </span>
            <br />with confidence.
          </h1>
          <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-sm">
            A powerful command center to oversee projects, developers, amenities, and everything in between.
          </p>
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Projects", value: "100+" },
            { label: "Developers", value: "50+" },
            { label: "Cities", value: "20+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 relative z-10">
        <div
          className="w-full max-w-md"
          style={{ animation: "authFormFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {/* Mobile brand mark */}
          <div className="lg:hidden text-center mb-8">
            <span className="font-serif text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Ovastin<span className="text-[var(--brand)]">.</span>
            </span>
          </div>

          {children}
        </div>
      </div>

      {/* ── Keyframes (injected via style tag) ──────────────── */}
      <style>{`
        @keyframes authOrb1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes authOrb2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, -30px) scale(1.1); }
        }
        @keyframes authOrb3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -60px) scale(1.2); }
        }
        @keyframes authFormFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
