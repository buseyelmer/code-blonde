"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit & { disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(options?.disabled ?? false);

  useEffect(() => {
    if (options?.disabled) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.disabled]);

  return { ref, inView };
}
