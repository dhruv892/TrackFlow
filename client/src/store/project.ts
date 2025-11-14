import { create } from "zustand";
import type { Project } from "../types/types";
import { axiosInstance } from "../api/api";

type ProjectStoreState = {
  allProjects: Project[];
  createdByMe: Project[];
  memberOf: Project[];
  isLoading: boolean;
  fetchAllProjects: (userId: number) => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
  updateProject: (
    projectId: number,
    data: { name?: string; description?: string }
  ) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  addUserToProject: (
    projectId: number,
    email: string,
    role?: "ADMIN" | "MEMBER"
  ) => Promise<boolean>;
  removeUserFromProject: (projectId: number, userId: number) => Promise<void>;
};

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  allProjects: [],
  createdByMe: [],
  memberOf: [],
  isLoading: false,
  fetchAllProjects: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<Project[]>("/projects");
      const all = response.data;
      // Group immediately in store
      const createdByMe = all.filter((p) => p.authorId === userId);
      const memberOf = all.filter((p) =>
        p.memberships.some((m) => m.userId === userId && p.authorId !== userId)
      );
      set({
        allProjects: all,
        createdByMe,
        memberOf,
      });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (name: string, description: string) => {
    try {
      const response = await axiosInstance.post<Project>("/projects", {
        name,
        description,
      });
      const newProject = response.data;
      const { allProjects, createdByMe } = get();
      set({
        allProjects: [...allProjects, newProject],
        createdByMe: [...createdByMe, newProject],
      });
    } catch (e) {
      console.error("Error creating project:", e);
    }
  },

  updateProject: async (projectId, data) => {
    try {
      const response = await axiosInstance.patch<Project>(
        `/projects/${projectId}`,
        data
      );
      const updatedProject = response.data;
      const { allProjects, createdByMe, memberOf } = get();
      set({
        allProjects: allProjects.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
        createdByMe: createdByMe.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
        memberOf: memberOf.map((p) =>
          p.id === projectId ? updatedProject : p
        ),
      });
    } catch (e) {
      console.error("Error updating project:", e);
    }
  },

  deleteProject: async (projectId) => {
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      const { allProjects, createdByMe, memberOf } = get();
      set({
        allProjects: allProjects.filter((p) => p.id !== projectId),
        createdByMe: createdByMe.filter((p) => p.id !== projectId),
        memberOf: memberOf.filter((p) => p.id !== projectId),
      });
    } catch (e) {
      console.error("Error deleting project:", e);
    }
  },

  addUserToProject: async (projectId, email, role = "MEMBER") => {
    try {
      await axiosInstance.post(`/project-membership/add/${projectId}`, {
        email,
        role,
      });
      return true;
    } catch (e) {
      console.error("Error adding user to project:", e);
      return false;
    }
  },

  removeUserFromProject: async (projectId, email) => {
    try {
      await axiosInstance.delete(`/project-membership/remove/${projectId}`, {
        data: { email },
      });
    } catch (e) {
      console.error("Error removing user from project:", e);
    }
  },
}));
