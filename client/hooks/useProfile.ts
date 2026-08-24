"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/v1/profile/me");
      setProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: { name?: string; email?: string }) => {
    const res = await apiFetch("/api/v1/profile/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    setProfile(res.data);
    return res.data;
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    await apiFetch("/api/v1/profile/me/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    changePassword,
  };
}
