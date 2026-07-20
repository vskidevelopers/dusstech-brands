import { create } from "zustand";

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
}));
