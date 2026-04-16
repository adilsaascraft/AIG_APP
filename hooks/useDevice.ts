"use client";

import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                            1. useWindowSize()                               */
/* -------------------------------------------------------------------------- */

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

/* -------------------------------------------------------------------------- */
/*                              2. useBreakpoint()                             */
/* -------------------------------------------------------------------------- */

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xl2: 1366, // custom 1366px breakpoint
  "2xl": 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
  const [bp, setBp] = useState<BreakpointKey | "base">("base");

  const calculate = () => {
    const width = window.innerWidth;
    let active: BreakpointKey | "base" = "base";

    for (const key in BREAKPOINTS) {
      if (width >= BREAKPOINTS[key as BreakpointKey]) {
        active = key as BreakpointKey;
      }
    }

    setBp(active);
  };

  useEffect(() => {
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  return bp;
}

/* -------------------------------------------------------------------------- */
/*                               3. useIsMobile()                              */
/* -------------------------------------------------------------------------- */

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", update);
    update();

    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

/* -------------------------------------------------------------------------- */
/*                             4. useIsDesktop()                               */
/* -------------------------------------------------------------------------- */

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1366px)");
    const update = () => setIsDesktop(window.innerWidth >= 1366);

    mql.addEventListener("change", update);
    update();
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/* -------------------------------------------------------------------------- */
/*                     5. useResponsiveValue({ mobile, ... })                 */
/* -------------------------------------------------------------------------- */

interface ResponsiveOptions<T> {
  mobile: T;
  tablet: T;
  laptop: T;
  desktop?: T;
  ultrawide?: T;
}

export function useResponsiveValue<T>(options: ResponsiveOptions<T>) {
  const bp = useBreakpoint();

  if (bp === "base" || bp === "sm") return options.mobile;
  if (bp === "md") return options.tablet;
  if (bp === "lg") return options.laptop;
  if (bp === "xl2" || bp === "xl") return options.desktop ?? options.laptop;
  if (bp === "2xl") return options.ultrawide ?? options.desktop ?? options.laptop;

  return options.mobile;
}

/* -------------------------------------------------------------------------- */
/*                           6. useOrientation()                               */
/* -------------------------------------------------------------------------- */

export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    const update = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return orientation;
}

/* -------------------------------------------------------------------------- */
/*                           7. useIsLandscape()                               */
/* -------------------------------------------------------------------------- */

export function useIsLandscape() {
  const orientation = useOrientation();
  return orientation === "landscape";
}

/* -------------------------------------------------------------------------- */
/*                     8. useViewportType() (phone/tablet/...)                */
/* -------------------------------------------------------------------------- */

export function useViewportType():
  | "phone"
  | "tablet"
  | "laptop"
  | "desktop"
  | "ultrawide" 
{
  const width = useWindowSize().width;

  if (width < 640) return "phone";
  if (width < 1024) return "tablet";
  if (width < 1366) return "laptop";
  if (width < 2560) return "desktop";
  return "ultrawide";
}
