// api.ts

import type { Bug } from "../types/types";

const API_BASE = "http://localhost:8000/api";

export async function fetchJSON<T>(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${input}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const api = {
  getBugs: () => fetchJSON<Bug[]>("/bugs"),
  getUsers: () => fetchJSON("/users"),
  createBug: (data: Partial<Bug>) =>
    fetchJSON<Bug>("/bugs", { method: "POST", body: JSON.stringify(data) }),
  updateBug: (id: number, data: Partial<Bug>) =>
    fetchJSON<Bug>(`/bugs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
