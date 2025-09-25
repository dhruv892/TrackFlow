// api.ts
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
  getBugs: () => fetchJSON("/bugs"),
  getUsers: () => fetchJSON("/users"),
  createBug: (data: any) =>
    fetchJSON("/bugs", { method: "POST", body: JSON.stringify(data) }),
  updateBug: (id: number, data: any) =>
    fetchJSON(`/bugs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};
