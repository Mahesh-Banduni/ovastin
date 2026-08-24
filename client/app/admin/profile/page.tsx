"use client";

import { useState, useEffect } from "react";
import { UserCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";
import Input from "../../../components/ui/store/Input";
import Label from "../../../components/ui/store/Label";
import { useProfile } from "../../../hooks/useProfile";

export default function AdminProfilePage() {
  const { profile, loading, error, updateProfile, changePassword } = useProfile();

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    setProfileLoading(true);

    try {
      await updateProfile({ name, email });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(err?.message || "Failed to update profile details");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to change password. Ensure current password is correct.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        onOpenSidebar={() => {}}
        title="Profile Settings"
        subtitle="Manage your administrative credentials and security settings"
      />

      <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
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

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label required>Full Name</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Admin Name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label required>Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm shadow-[var(--brand)]/20"
                  >
                    {profileLoading && <Loader2 size={16} className="animate-spin" />}
                    Save Profile Changes
                  </button>
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

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label required>Current Password</Label>
                  <Input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label required>New Password</Label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label required>Confirm New Password</Label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="h-11 px-5 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-sm shadow-[var(--brand)]/20"
                  >
                    {passwordLoading && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
