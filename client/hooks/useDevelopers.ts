"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface DeveloperItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  _count?: { projects: number };
  createdAt: string;
  updatedAt: string;
}

export function useDevelopers(initialPage = 1, initialPageSize = 10) {
  const [data, setData] = useState<{ items: DeveloperItem[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        pageSize: data.pageSize.toString(),
      });
      if (search) params.append("search", search);

      const res = await apiFetch(`/api/v1/developers?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch developers");
    } finally {
      setLoading(false);
    }
  }, [data.page, data.pageSize, search]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const createDeveloper = async (devData: any) => {
    const formData = new FormData();
    Object.entries(devData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val instanceof File ? val : String(val));
      }
    });

    const res = await apiFetch("/api/v1/developers", {
      method: "POST",
      body: formData,
    });
    await fetchDevelopers();
    return res.data;
  };

  const updateDeveloper = async (id: string, devData: any) => {
    const formData = new FormData();
    Object.entries(devData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val instanceof File ? val : String(val));
      }
    });

    const res = await apiFetch(`/api/v1/developers/${id}`, {
      method: "PATCH",
      body: formData,
    });
    await fetchDevelopers();
    return res.data;
  };

  const deleteDeveloper = async (id: string) => {
    await apiFetch(`/api/v1/developers/${id}`, {
      method: "DELETE",
    });
    await fetchDevelopers();
  };

  const setPage = (page: number) => setData((prev) => ({ ...prev, page }));

  return {
    developers: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    refetch: fetchDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
  };
}
