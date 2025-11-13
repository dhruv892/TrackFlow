import { create } from "zustand";
import type { Project } from "../types/types";
import { axiosInstance } from "../api/api";

type ProjectStoreState = {
  allProjects: Project[];
  createdByMe: Project[];
  memberOf: Project[];
  isLoading: boolean;
  fetchAllProjects: (userId: number) => Promise<void>;
};

export const useProjectStore = create<ProjectStoreState>((set) => ({
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
      const memberOf = all.filter(
        (p) => p.users.some((u) => u.id === userId) && p.authorId !== userId
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
}));
