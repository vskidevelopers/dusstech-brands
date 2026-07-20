"use client";

import { create } from "zustand";

interface WebsiteUIState {
  // Overlays
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  isAnnouncementDismissed: boolean;
  isCookieBannerDismissed: boolean;

  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  dismissAnnouncement: () => void;
  dismissCookieBanner: () => void;
}

export const useWebsiteUIStore = create<WebsiteUIState>((set) => ({
  isSearchOpen: false,
  isMobileNavOpen: false,
  isAnnouncementDismissed: false,
  isCookieBannerDismissed: false,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  dismissAnnouncement: () => {
    set({ isAnnouncementDismissed: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("dusstech-announcement-dismissed", "true");
    }
  },
  dismissCookieBanner: () => {
    set({ isCookieBannerDismissed: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("dusstech-cookies-accepted", "true");
    }
  },
}));
