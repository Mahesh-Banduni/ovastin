"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface AmenityItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  _count?: { projects: number };
  createdAt: string;
  updatedAt: string;
}

export function useAmenities(initialPage = 1, initialPageSize = 10) {
  const [data, setData] = useState<{ items: AmenityItem[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [allAmenities, setAllAmenities] = useState<AmenityItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        pageSize: data.pageSize.toString(),
      });
      if (search) params.append("search", search);

      const res = await apiFetch(`/api/v1/amenities?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch amenities");
    } finally {
      setLoading(false);
    }
  }, [data.page, data.pageSize, search]);

  const fetchAllAmenities = useCallback(async () => {
    try {
      const res = await apiFetch("/api/v1/amenities/all");
      setAllAmenities(res.data);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  useEffect(() => {
    fetchAllAmenities();
  }, [fetchAllAmenities]);

  const createAmenity = async (amenityData: any) => {
    const formData = new FormData();
    Object.entries(amenityData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val instanceof File ? val : String(val));
      }
    });

    const res = await apiFetch("/api/v1/amenities", {
      method: "POST",
      body: formData,
    });
    await fetchAmenities();
    await fetchAllAmenities();
    return res.data;
  };

  const updateAmenity = async (id: string, amenityData: any) => {
    const formData = new FormData();
    Object.entries(amenityData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, val instanceof File ? val : String(val));
      }
    });

    const res = await apiFetch(`/api/v1/amenities/${id}`, {
      method: "PATCH",
      body: formData,
    });
    await fetchAmenities();
    await fetchAllAmenities();
    return res.data;
  };

  const deleteAmenity = async (id: string) => {
    await apiFetch(`/api/v1/amenities/${id}`, {
      method: "DELETE",
    });
    await fetchAmenities();
    await fetchAllAmenities();
  };

  const setPage = (page: number) => setData((prev) => ({ ...prev, page }));

  return {
    amenities: data.items,
    allAmenities,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    refetch: fetchAmenities,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  };
}
