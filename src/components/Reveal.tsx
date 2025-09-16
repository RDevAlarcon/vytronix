"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  delayMs?: number;
};

export default function Reveal({ className = "", children, delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current as Element | null;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (delayMs) {
              const t = setTimeout(() => setVisible(true), delayMs);
              return () => clearTimeout(t);
            }
            setVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);

  const base = "transition-all duration-700 ease-out will-change-transform will-change-opacity";
  const hidden = "opacity-0 translate-y-4";
  const shown = "opacity-100 translate-y-0";

  return <div ref={ref} className={`${base} ${visible ? shown : hidden} ${className}`}>{children}</div>;
}
