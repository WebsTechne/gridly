import * as React from "react";

const MOBILE_BREAKPOINT = 640;

export function useIsMobile(breakP: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(`(max-width: ${breakP - 1}px)`).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakP - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, [breakP]);

  return isMobile;
}
