import { create } from "zustand";

export type FilterStatus = "all" | "completed" | "incomplete";

interface UIState {
  searchQuery: string;
  filterStatus: FilterStatus;
  selectedTaskIds: Set<string>;
  activeTaskId: string | null;
  isInteracting: boolean;
  showColumnSelect: boolean;

  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  toggleTaskSelection: (taskId: string) => void;
  selectAllInColumn: (taskIds: string[]) => void;
  deselectAllInColumn: (taskIds: string[]) => void;
  selectAllTasks: (taskIds: string[]) => void;
  clearSelection: () => void;
  setActiveTask: (taskId: string | null) => void;
  setIsInteracting: (v: boolean) => void;
  toggleColumnSelect: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  searchQuery: "",
  filterStatus: "all",
  selectedTaskIds: new Set(),
  activeTaskId: null,
  isInteracting: false,
  showColumnSelect: true,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  toggleTaskSelection: (taskId) =>
    set((state) => {
      const next = new Set(state.selectedTaskIds);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return { selectedTaskIds: next };
    }),

  selectAllInColumn: (taskIds) =>
    set((state) => {
      const next = new Set(state.selectedTaskIds);
      for (const id of taskIds) next.add(id);
      return { selectedTaskIds: next };
    }),

  deselectAllInColumn: (taskIds) =>
    set((state) => {
      const next = new Set(state.selectedTaskIds);
      for (const id of taskIds) next.delete(id);
      return { selectedTaskIds: next };
    }),

  selectAllTasks: (taskIds) =>
    set(() => ({
      selectedTaskIds: new Set(taskIds),
    })),

  clearSelection: () => set({ selectedTaskIds: new Set() }),

  setActiveTask: (taskId) => set({ activeTaskId: taskId }),

  setIsInteracting: (v) => set({ isInteracting: v }),

  toggleColumnSelect: () =>
    set((state) => ({ showColumnSelect: !state.showColumnSelect })),
}));
