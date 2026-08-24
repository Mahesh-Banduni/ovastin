"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function useServices(initialPage = 1, initialPageSize = 10) {
  const [data, setData] = useState<{ items: ServiceItem[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize: initialPageSize,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        pageSize: data.pageSize.toString(),
      });
      if (search) params.append("search", search);

      const res = await apiFetch(`/api/v1/services?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, [data.page, data.pageSize, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (serviceData: any) => {
    const res = await apiFetch("/api/v1/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
    await fetchServices();
    return res.data;
  };

  const updateService = async (id: string, serviceData: any) => {
    const res = await apiFetch(`/api/v1/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
    await fetchServices();
    return res.data;
  };

  const deleteService = async (id: string) => {
    await apiFetch(`/api/v1/services/${id}`, {
      method: "DELETE",
    });
    await fetchServices();
  };

  const setPage = (page: number) => setData((prev) => ({ ...prev, page }));

  return {
    services: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    search,
    setSearch,
    setPage,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
  };
}
