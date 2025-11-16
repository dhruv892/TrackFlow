import { create } from "zustand";
import { axiosInstance } from "../api/api";
import type { Bug, User } from "../types/types";
import { useProjectStoreState } from "./ui";

export type BugStoreState = {
  isBugsLoading: boolean;
  isSearchingUsers: boolean;
  searchedUsers: User[];
  allBugs: Bug[];
  getAllBugs: () => Promise<void>;
  addBug: (bug: Partial<Bug>) => Promise<Bug | null>;
  updateBug: (id: number, data: Partial<Bug>) => Promise<Bug | null>;
  deleteBug: (id: number) => Promise<void>;
  assignUsersToBug: (bugId: number, userIds: number[]) => Promise<void>;
  removeAssignedUsers: (bugId: number, userIds: number[]) => Promise<void>;
  searchUsersInProject: (
    bugId: number,
    query: string
  ) => Promise<User[] | null>;
  clearSearchedUsers: () => void;
};

export const useBugStore = create<BugStoreState>((set, get) => ({
  allBugs: [],
  isBugsLoading: false,
  isSearchingUsers: false,
  searchedUsers: [],
  getAllBugs: async () => {
    const projectId = useProjectStoreState.getState().currentProjectId;
    if (!projectId) throw new Error("No project selected");
    set({ isBugsLoading: true });
    try {
      const response = await axiosInstance.get<Bug[]>(
        `/projects/${projectId}/bugs`
      );
      set({ allBugs: response.data });
    } catch (error) {
      console.error("Failed to fetch bugs:", error);
    } finally {
      set({ isBugsLoading: false });
    }
  },
  addBug: async (bug: Partial<Bug>) => {
    // Use negative number for temp IDs (real IDs are always positive)
    const tempBug = { ...bug, id: -Date.now() } as Bug;
    // Add temp bug immediately
    set((state) => ({ allBugs: [tempBug, ...state.allBugs] }));
    const projectId = useProjectStoreState.getState().currentProjectId;
    if (!projectId) throw new Error("No project selected");

    try {
      const response = await axiosInstance.post<Bug>(`/bugs/${projectId}`, bug);

      // Replace the temp bug (negative ID) with real bug
      set((state) => ({
        allBugs: state.allBugs.map((b) =>
          b.id === tempBug.id ? response.data : b
        ),
      }));

      return response.data;

      // set((state) => ({ allBugs: [response.data, ...state.allBugs] }));
      // return response.data;
    } catch (error) {
      set({ allBugs: get().allBugs.filter((b) => b.id !== tempBug.id) });
      console.error("Failed to add bug:", error);
      return null;
    }
  },
  updateBug: async (id: number, data: Partial<Bug>) => {
    // Store original bug for rollback
    const originalBug = get().allBugs.find((b) => b.id === id);
    if (!originalBug) return null;

    // ⚡ Immediately update UI
    set((state) => ({
      allBugs: state.allBugs.map((bug) =>
        bug.id === id ? { ...bug, ...data } : bug
      ),
    }));
    try {
      // Make actual API call
      const response = await axiosInstance.put<Bug>(`/bugs/${id}`, data);

      // Replace with server response (in case server modified data)
      set((state) => ({
        allBugs: state.allBugs.map((bug) =>
          bug.id === id ? response.data : bug
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Failed to update bug:", error);
      // Rollback: Restore original bug
      set((state) => ({
        allBugs: state.allBugs.map((bug) =>
          bug.id === id ? originalBug : bug
        ),
      }));
      return null;
    }
  },
  deleteBug: async (id: number) => {
    // Store original bug for rollback
    const originalBug = get().allBugs.find((b) => b.id === id);
    if (!originalBug) return;

    const originalIndex = get().allBugs.findIndex((b) => b.id === id);

    // ⚡ Immediately remove from UI
    set((state) => ({
      allBugs: state.allBugs.filter((bug) => bug.id !== id),
    }));

    try {
      await axiosInstance.delete(`/bugs/${id}`);
      // set((state) => ({
      //   allBugs: state.allBugs.filter((bug) => bug.id !== id),
      // }));
    } catch (error) {
      console.error("Failed to delete bug:", error);
      // ❌ Rollback: Restore bug at original position
      set((state) => {
        const newBugs = [...state.allBugs];
        newBugs.splice(originalIndex, 0, originalBug);
        return { allBugs: newBugs };
      });
    }
  },

  assignUsersToBug: async (bugId: number, userIds: number[]) => {
    const originalBug = get().allBugs.find((b) => b.id === bugId);
    if (!originalBug) return;

    // Optimistic UI update
    set((state) => ({
      allBugs: state.allBugs.map((b) =>
        b.id === bugId
          ? {
              ...b,
              assignedTo: [
                ...(b.assignedTo || []),
                ...userIds.map((id) => ({ id, name: "", email: "" })),
              ],
            }
          : b
      ),
    }));

    try {
      const response = await axiosInstance.post(`/bugs/${bugId}/assignees`, {
        userIds,
      });
      // Replace with actual server data (if server returns full assignee objects)
      set((state) => ({
        allBugs: state.allBugs.map((b) =>
          b.id === bugId
            ? { ...b, assignedTo: response.data.bug.assignedTo }
            : b
        ),
      }));
    } catch (error) {
      console.error("Failed to assign users:", error);
      // Rollback
      set((state) => ({
        allBugs: state.allBugs.map((b) => (b.id === bugId ? originalBug : b)),
      }));
    }
  },

  removeAssignedUsers: async (bugId: number, userIds: number[]) => {
    const originalBug = get().allBugs.find((b) => b.id === bugId);
    if (!originalBug) return;

    // Optimistic UI update
    set((state) => ({
      allBugs: state.allBugs.map((b) =>
        b.id === bugId
          ? {
              ...b,
              assignedTo: (b.assignedTo || []).filter(
                (u) => !userIds.includes(u.id)
              ),
            }
          : b
      ),
    }));

    try {
      const response = await axiosInstance.post(
        `/bugs/${bugId}/remove-assignees`,
        {
          userIds,
        }
      );
      set((state) => ({
        allBugs: state.allBugs.map((b) =>
          b.id === bugId ? { ...b, assignedTo: response.data.assignedTo } : b
        ),
      }));
    } catch (error) {
      console.error("Failed to remove assigned users:", error);
      // Rollback
      set((state) => ({
        allBugs: state.allBugs.map((b) => (b.id === bugId ? originalBug : b)),
      }));
    }
  },
  searchUsersInProject: async (bugId: number, query: string) => {
    const projectId = useProjectStoreState.getState().currentProjectId;
    if (!projectId) {
      console.error("No project selected");
      return null;
    }

    if (!query || query.trim() === "") {
      set({ searchedUsers: [] });
      return [];
    }

    set({ isSearchingUsers: true });
    try {
      const response = await axiosInstance.get<User[]>(
        `/bugs/${bugId}/users?query=${encodeURIComponent(
          query.trim()
        )}&projectId=${projectId}`,
        {
          params: {
            query: query.trim(),
            projectId,
          },
        }
      );

      set({ searchedUsers: response.data });
      return response.data;
    } catch (error) {
      console.error("Failed to search users:", error);
      set({ searchedUsers: [] });
      return null;
    } finally {
      set({ isSearchingUsers: false });
    }
  },

  clearSearchedUsers: () => {
    set({ searchedUsers: [] });
  },
}));
