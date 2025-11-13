// types.ts
export type BugStatus = "todo" | "in_progress" | "in_review" | "done";

export type Priority = "low" | "medium" | "high" | "top";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  name: string;
  authorId: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  users: User[];
}

export interface Bug {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  assignedTo?: User[];
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    email: string;
  };
  bugId: number;
  createdAt?: string;
  updatedAt?: string;
}
