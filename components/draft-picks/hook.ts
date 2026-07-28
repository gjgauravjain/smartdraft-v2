"use client";

import { useEffect, useRef, useState } from "react";

const MIN_ROW_HEIGHT = 22;
const MAX_ROW_HEIGHT = 34;
const VISIBLE_ROWS = 22;

export function useRowHeight() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rowHeight, setRowHeight] = useState(MAX_ROW_HEIGHT);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const available = el.clientHeight;
      if (!available) return;
      const raw = available / VISIBLE_ROWS;
      const clamped = Math.min(MAX_ROW_HEIGHT, Math.max(MIN_ROW_HEIGHT, raw));
      setRowHeight(Math.floor(clamped));
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return { containerRef, rowHeight };
}
