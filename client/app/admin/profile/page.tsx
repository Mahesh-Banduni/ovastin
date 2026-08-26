"use client";

import { useState, useEffect } from "react";
import { UserCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";
import FieldError from "../../../components/ui/store/FieldError";
import { useProfile } from "../../../hooks/useProfile";
import Button from "@/components/ui/store/Button";
import {
  updateProfileFormSchema,
  changePasswordFormSchema,
  validateForm,
  type FieldErrors,
} from "@/lib/validation";

export default function AdminProfilePage() {
  const { profile, loading, error, updateProfile, changePassword } = useProfile();

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<FieldErrors>({});

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<FieldErrors>({});

  /** Clears a single field's inline error once the user edits it again. */
  const clearProfileFieldError = (field: string) =>
    setProfileFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  /** Clears a single field's inline error once the user edits it again. */
  const clearPasswordFieldError = (field: string) =>
    setPasswordFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileFieldErrors({});

    // Validate against the backend-mirrored Zod schema before submitting.
    const result = validateForm(updateProfileFormSchema, { name, email });
    if (!result.success) {
      setProfileFieldErrors(result.errors);
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile({ name: result.data.name, email: result.data.email });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: unknown) {
      setProfileError(
        err instanceof Error
          ? err.message
          : "Failed to update profile details"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordFieldErrors({});

    // Validate against the backend-mirrored Zod schema (+ confirm match).
    const result = validateForm(changePasswordFormSchema, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      setPasswordFieldErrors(result.errors);
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : "Failed to change password. Ensure current password is correct."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* ── Top Page Header Banner ─────────────────────────── */}
      <AdminPageHeader
        icon={UserCheck}
        title="Profile Settings"
        subtitle="Manage your administrative credentials and security settings."
      />
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <Loader2 className="animate-spin text-[var(--brand)]" size={32} />
            <p className="text-sm text-[var(--text-muted)]">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Info Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <div className="h-10 w-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Admin Information
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Update your account name and email address
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-2 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-xs text-[var(--destructive)]">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-full-name">Full Name</Label>
                  <Input
                    id="profile-full-name"
                    value={name}
                    aria-invalid={!!profileFieldErrors.name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearProfileFieldError("name");
                    }}
                    placeholder="Admin Name"
                  />
                  <FieldError message={profileFieldErrors.name} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-email">Email Address</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    aria-invalid={!!profileFieldErrors.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearProfileFieldError("email");
                    }}
                    placeholder="admin@example.com"
                  />
                  <FieldError message={profileFieldErrors.email} />
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={profileLoading}
                    className="h-11 px-5"
                  >
                    {profileLoading && <Loader2 size={16} className="animate-spin" />}
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>

            {/* Security / Change Password Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <div className="h-10 w-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    Security & Password
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Change your current administrative password
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-xs text-[var(--destructive)]">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    aria-invalid={!!passwordFieldErrors.currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      clearPasswordFieldError("currentPassword");
                    }}
                    placeholder="••••••••"
                  />
                  <FieldError message={passwordFieldErrors.currentPassword} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-new-password">New Password</Label>
                  <Input
                    id="profile-new-password"
                    type="password"
                    value={newPassword}
                    aria-invalid={!!passwordFieldErrors.newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearPasswordFieldError("newPassword");
                    }}
                    placeholder="Minimum 8 characters"
                  />
                  <FieldError message={passwordFieldErrors.newPassword} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="profile-confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    aria-invalid={!!passwordFieldErrors.confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearPasswordFieldError("confirmPassword");
                    }}
                    placeholder="Re-type new password"
                  />
                  <FieldError message={passwordFieldErrors.confirmPassword} />
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={passwordLoading}
                    className="h-11 px-5"
                  >
                    {passwordLoading && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}
