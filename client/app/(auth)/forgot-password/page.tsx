"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail, KeyRound, Lock, ArrowLeft, ArrowRight,
  CheckCircle2, AlertCircle, Loader2, KeySquare,
} from "lucide-react";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";
import FieldError from "../../../components/ui/store/FieldError";
import { apiFetch } from "../../../lib/api";
import {
  forgotPasswordFormSchema,
  resetPasswordWithConfirmSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";

const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Done" },
];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /** Clears a single field's inline error once the user edits it again. */
  const clearFieldError = (field: string) =>
    setFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema before requesting.
    const result = validateForm(forgotPasswordFormSchema, { email });
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: result.data.email }),
      });
      setStep(2);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate against the backend-mirrored Zod schema (+ confirm password).
    const result = validateForm(resetPasswordWithConfirmSchema, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: result.data.email,
          otp: result.data.otp,
          newPassword: result.data.newPassword,
        }),
      });
      setStep(3);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-8 shadow-2xl"
      style={{ boxShadow: "0 25px 80px -10px rgba(0,0,0,0.12), 0 0 0 1px var(--border)" }}
    >

      {/* ── Step Progress Indicator ──────────────────────────── */}
      {step !== 3 && (
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-300
                    ${step > s.id
                      ? "bg-[var(--brand)] text-[var(--background)]"
                      : step === s.id
                      ? "bg-[var(--brand)] text-[var(--background)] ring-4 ring-[var(--brand)]/20"
                      : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                    }
                  `}
                >
                  {step > s.id ? <CheckCircle2 size={15} /> : s.id}
                </div>
                <span className={`mt-1 text-[10px] font-medium ${step >= s.id ? "text-[var(--brand)]" : "text-[var(--text-muted)]"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2 rounded-full transition-all duration-500"
                  style={{
                    background: step > s.id
                      ? "var(--brand)"
                      : "var(--border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
          style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 140%)" }}
        >
          <KeySquare size={22} style={{ color: "var(--background)" }} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          {step === 1 && "Reset Password"}
          {step === 2 && "Verify & Reset"}
          {step === 3 && "All Done!"}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          {step === 1 && "Enter your email and we'll send a one-time code"}
          {step === 2 && `We sent a code to ${email}`}
          {step === 3 && "Your password has been successfully updated"}
        </p>
      </div>

      {/* ── Error Alert ─────────────────────────────────────── */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 p-3.5 text-sm text-[var(--destructive)]"
          style={{ animation: "fadeIn 0.2s ease both" }}
        >
          <AlertCircle size={17} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Step 1: Request OTP ─────────────────────────────── */}
      {step === 1 && (
        <form
          onSubmit={handleRequestOtp}
          noValidate
          className="space-y-5"
          style={{ animation: "slideStepIn 0.3s ease both" }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="account-email">Account Email<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
                <Mail size={17} />
              </span>
              <Input
                id="account-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                aria-invalid={!!fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <FieldError message={fieldErrors.email} />
          </div>

          <SubmitButton loading={loading} loadingText="Sending code...">
            Send Verification Code <ArrowRight size={17} />
          </SubmitButton>
        </form>
      )}

      {/* ── Step 2: OTP + New Password ──────────────────────── */}
      {step === 2 && (
        <form
          onSubmit={handleResetPassword}
          noValidate
          className="space-y-5"
          style={{ animation: "slideStepIn 0.3s ease both" }}
        >
          {/* OTP */}
          <div className="space-y-1.5">
            <Label htmlFor="otp-code">OTP Code<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
                <KeyRound size={17} />
              </span>
              <Input
                id="otp-code"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                aria-invalid={!!fieldErrors.otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  clearFieldError("otp");
                }}
                className="pl-10 tracking-[0.3em] font-mono text-base text-center"
                disabled={loading}
              />
            </div>
            <FieldError message={fieldErrors.otp} />
            <p className="text-xs text-[var(--text-muted)]">
              Didn't receive it?{" "}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[var(--brand)] hover:underline font-medium cursor-pointer"
              >
                Resend code
              </button>
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New Password<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
                <Lock size={17} />
              </span>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                aria-invalid={!!fieldErrors.newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearFieldError("newPassword");
                }}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <FieldError message={fieldErrors.newPassword} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-new-password">Confirm New Password<span className="text-red-500 ml-scale-sm-0.75">*</span></Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--text-muted)]">
                <Lock size={17} />
              </span>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                aria-invalid={!!fieldErrors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <FieldError message={fieldErrors.confirmPassword} />
          </div>

          <SubmitButton loading={loading} loadingText="Resetting password...">
            Update Password <ArrowRight size={17} />
          </SubmitButton>
        </form>
      )}

      {/* ── Step 3: Success ─────────────────────────────────── */}
      {step === 3 && (
        <div
          className="py-6 text-center space-y-6"
          style={{ animation: "slideStepIn 0.4s ease both" }}
        >
          {/* Animated check circle */}
          <div className="relative mx-auto w-20 h-20">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: "var(--brand)" }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 140%)" }}
            >
              <CheckCircle2 size={36} style={{ color: "var(--background)" }} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Your password has been changed. You can now sign in with your new credentials.
            </p>
          </div>

          <Link
            href="/signin"
            className="group relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 140%)",
              color: "var(--background)",
            }}
          >
            Go to Sign In
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      )}

      {/* ── Back Link ───────────────────────────────────────── */}
      {step !== 3 && (
        <div className="mt-7 text-center">
          <Link
            href="/signin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideStepIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Shared Submit Button ─────────────────────────────────── */
function SubmitButton({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full h-12 rounded-xl font-semibold text-sm overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]"
      style={{
        background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-foreground) 140%)",
        color: "var(--background)",
      }}
    >
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
