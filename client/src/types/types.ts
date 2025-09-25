// types.ts
export type BugStatus = "open" | "working" | "closed";
export type Priority = "low" | "medium" | "high" | "top";

export interface Bug {
  id: number;
  title: string;
  description?: string;
  status: BugStatus;
  priority: Priority;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}
