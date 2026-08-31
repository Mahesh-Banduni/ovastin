"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "UPCOMING" | "ACTIVE" | "SOLD_OUT" | "COMPLETED" | "ARCHIVED";
  propertyType: "APARTMENT" | "VILLA" | "PLOT" | "TOWNSHIP" | "COMMERCIAL" | "OFFICE" | "RETAIL" | "INDUSTRIAL" | "OTHER";
  possessionDate?: string | null;
  developerId?: string | null;
  developer?: { id: string; name: string } | null;
  currency: string;
  priceMin?: number | null;
  priceMax?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  coverImage?: string | null;
  gallery?: { id: string; imageUrl: string; altText?: string; sortOrder: number }[];
  amenities?: { amenityId: string; amenity: { id: string; name: string; icon?: string } }[];
  _count?: { gallery: number; amenities: number };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters {
  status?: string;
  propertyType?: string;
  city?: string;
  developerId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useProjects(initialFilters: ProjectFilters = {}) {
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);
  const [data, setData] = useState<{ items: Project[]; total: number; page: number; pageSize: number }>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.propertyType) params.append("propertyType", filters.propertyType);
      if (filters.city) params.append("city", filters.city);
      if (filters.developerId) params.append("developerId", filters.developerId);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

      const res = await apiFetch(`/api/v1/projects?${params.toString()}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData: any) => {
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === "amenityIds" && Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, val instanceof File ? val : String(val));
        }
      }
    });

    const res = await apiFetch("/api/v1/projects", {
      method: "POST",
      body: formData,
    });
    await fetchProjects();
    return res.data;
  };

  const updateProject = async (id: string, projectData: any) => {
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (key === "amenityIds" && Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, val instanceof File ? val : String(val));
        }
      }
    });

    const res = await apiFetch(`/api/v1/projects/${id}`, {
      method: "PATCH",
      body: formData,
    });
    await fetchProjects();
    return res.data;
  };

  const deleteProject = async (id: string) => {
    await apiFetch(`/api/v1/projects/${id}`, {
      method: "DELETE",
    });
    await fetchProjects();
  };

  const addImageUrl = async (id: string, imagePayload: { imageUrl: string; altText?: string; sortOrder?: number }) => {
    const res = await apiFetch(`/api/v1/projects/${id}/images/url`, {
      method: "POST",
      body: JSON.stringify(imagePayload),
    });
    await fetchProjects();
    return res.data;
  };

  const uploadGalleryImage = async (id: string, file: File, altText?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (altText) {
      formData.append("altText", altText);
    }
    const res = await apiFetch(`/api/v1/projects/${id}/images`, {
      method: "POST",
      body: formData,
    });
    await fetchProjects();
    return res.data;
  };

  const removeImage = async (projectId: string, imageId: string) => {
    await apiFetch(`/api/v1/projects/${projectId}/images/${imageId}`, {
      method: "DELETE",
    });
    await fetchProjects();
  };

  return {
    projects: data.items,
    total: data.total,
    page: data.page,
    pageSize: data.pageSize,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addImageUrl,
    uploadGalleryImage,
    removeImage,
  };
}
