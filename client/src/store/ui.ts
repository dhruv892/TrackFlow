import { create } from "zustand";

export type GroupByOption = "none" | "status" | "priority" | "assignee";

type UIState = {
  groupBy: GroupByOption;
  setGroupBy: (option: GroupByOption) => void;
};

export const useUIStore = create<UIState>((set) => ({
  groupBy: "none",
  setGroupBy: (option) => set({ groupBy: option }),
}));
