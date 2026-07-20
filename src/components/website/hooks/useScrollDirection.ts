"use client";

import { useEffect, useState } from "react";

interface ScrollDirectionState {
  direction: "up" | "down" | "idle";
  scrollY: number;
  isAtTop: boolean;
}

export function useScrollDirection(threshold = 10): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: "idle",
    scrollY: 0,
    isAtTop: true,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      setState({
        direction:
          Math.abs(delta) < threshold ? "idle" : delta > 0 ? "down" : "up",
        scrollY: currentScrollY,
        isAtTop: currentScrollY < 50,
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}
