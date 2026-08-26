import { getSession } from "next-auth/react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  const token = (session as any)?.accessToken;

  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined && options.body !== null && options.body !== "";

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const responseText = await res.text();
  const data = responseText ? JSON.parse(responseText) : null;

  if (!res.ok) {
    throw new ApiClientError(
      data?.message || "Request failed",
      res.status,
      data?.data
    );
  }

  return data;
}

export async function apiUpload(
  path: string,
  formData: FormData
): Promise<any> {
  const session = await getSession();
  const token = (session as any)?.accessToken;

  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiClientError(data?.message || "Upload failed", res.status);
  }

  return data;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}
