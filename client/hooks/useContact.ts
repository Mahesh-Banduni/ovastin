"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useContact(initialPage = 1, initialPageSize = 10) {
  const [data, setData] = useState<{ items: ContactSubmission[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        pageSize: data.pageSize.toString(),
      });
      if (isReadFilter !== undefined) params.append("isRead", isReadFilter.toString());

      const res = await apiFetch(`/api/v1/contact?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contact submissions");
    } finally {
      setLoading(false);
    }
  }, [data.page, data.pageSize, isReadFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const markRead = async (id: string) => {
    await apiFetch(`/api/v1/contact/${id}/read`, {
      method: "PATCH",
    });
    await fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    await apiFetch(`/api/v1/contact/${id}`, {
      method: "DELETE",
    });
    await fetchSubmissions();
  };

  const setPage = (page: number) => setData((prev) => ({ ...prev, page }));

  return {
    submissions: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    isReadFilter,
    setIsReadFilter,
    setPage,
    refetch: fetchSubmissions,
    markRead,
    deleteSubmission,
  };
}
