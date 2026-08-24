"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-8 shadow-2xl"
      style={{ boxShadow: "0 25px 80px -10px rgba(0,0,0,0.12), 0 0 0 1px var(--border)" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        {/* Icon badge */}
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
          style={{
            background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 100%)",
          }}
        >
          <ShieldCheck size={22} className="text-[var(--brand-foreground)]"
            style={{ color: "var(--background)" }}
          />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Sign in to your admin dashboard
        </p>
      </div>

      {/* ── Error Alert ─────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 p-3.5 text-sm text-[var(--destructive)]"
          style={{ animation: "fadeIn 0.2s ease both" }}
        >
          <AlertCircle size={17} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Sign In Form ─────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label required>Email Address</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
              <Mail size={17} />
            </span>
            <Input
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label required>Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[var(--brand)] hover:underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
              <Lock size={17} />
            </span>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-11"
              disabled={loading}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 140%)",
            color: "var(--background)",
          }}
        >
          {/* shimmer overlay */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmerSlide 1.4s ease-in-out infinite",
            }}
          />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </>
            )}
          </span>
        </button>
      </form>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
        <ShieldCheck size={13} className="shrink-0" />
        Protected system · Authorized personnel only
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSlide {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
