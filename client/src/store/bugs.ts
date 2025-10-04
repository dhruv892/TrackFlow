import { create } from "zustand";
import { axiosInstance } from "../api/api";
import type { Bug } from "../types/types";

type BugStoreState = {
  isBugsLoading: boolean;
  allBugs: Bug[];
  getAllBugs: () => Promise<void>;
  addBug: (bug: Partial<Bug>) => Promise<Bug | null>;
  updateBug: (id: number, data: Partial<Bug>) => Promise<Bug | null>;
  deleteBug: (id: number) => Promise<void>;
};

export const useBugStore = create<BugStoreState>((set, get) => ({
  allBugs: [],
  isBugsLoading: false,
  getAllBugs: async () => {
    set({ isBugsLoading: true });
    try {
      const response = await axiosInstance.get<Bug[]>("/bugs");
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

    try {
      const response = await axiosInstance.post<Bug>("/bugs", bug);

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
}));
