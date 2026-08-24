"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface AwardItem {
  id: string;
  name: string;
  description?: string | null;
  year?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function useAwards(initialPage = 1, initialPageSize = 10) {
  const [data, setData] = useState<{ items: AwardItem[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        pageSize: data.pageSize.toString(),
      });
      if (search) params.append("search", search);

      const res = await apiFetch(`/api/v1/awards?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch awards");
    } finally {
      setLoading(false);
    }
  }, [data.page, data.pageSize, search]);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  const createAward = async (awardData: any) => {
    const res = await apiFetch("/api/v1/awards", {
      method: "POST",
      body: JSON.stringify(awardData),
    });
    await fetchAwards();
    return res.data;
  };

  const updateAward = async (id: string, awardData: any) => {
    const res = await apiFetch(`/api/v1/awards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(awardData),
    });
    await fetchAwards();
    return res.data;
  };

  const deleteAward = async (id: string) => {
    await apiFetch(`/api/v1/awards/${id}`, {
      method: "DELETE",
    });
    await fetchAwards();
  };

  const setPage = (page: number) => setData((prev) => ({ ...prev, page }));

  return {
    awards: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    refetch: fetchAwards,
    createAward,
    updateAward,
    deleteAward,
  };
}
