"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  delayMs?: number;
};

export default function Reveal({ as: Tag = "div", className = "", children, delayMs = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
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

  // @ts-expect-error dynamic tag
  return <Tag ref={ref as any} className={`${base} ${visible ? shown : hidden} ${className}`}>{children}</Tag>;
}

