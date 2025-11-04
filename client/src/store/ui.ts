// src/store/ui.ts
import { create } from "zustand";
import type { Bug } from "../types/types";
import { useBugStore } from "./bugs";

export type GroupByOption = "none" | "status" | "priority" | "assignee";

type UIState = {
  groupBy: GroupByOption;
  setGroupBy: (option: GroupByOption) => void;

  // optional: compute grouped bugs
  getGroupedBugs: () => Record<string, Bug[]>;
};

export const useUIStore = create<UIState>((set, get) => ({
  groupBy: "none",
  setGroupBy: (option) => set({ groupBy: option }),

  getGroupedBugs: () => {
    const { allBugs } = useBugStore.getState();
    const groupBy = get().groupBy;

    if (groupBy === "none") {
      return { All: allBugs };
    }

    return allBugs.reduce((groups, bug) => {
      let key = "Unassigned";
      if (groupBy === "status") key = bug.status ?? "Unknown";
      else if (groupBy === "priority") key = bug.priority ?? "Unknown";
      else if (groupBy === "assignee")
        key = bug.assignedTo?.[0]?.name || "Unassigned";

      if (!groups[key]) groups[key] = [];
      groups[key].push(bug);
      return groups;
    }, {} as Record<string, Bug[]>);
  },
}));
