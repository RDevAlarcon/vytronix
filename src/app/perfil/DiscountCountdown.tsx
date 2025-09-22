"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vytronix-landing-discount-expires";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getTimeParts(target: number) {
  const delta = target - Date.now();
  if (delta <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const totalSeconds = Math.floor(delta / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { expired: false, days, hours, minutes, seconds };
}

function normaliseInitialExpiresAt(value?: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

type DiscountCountdownProps = {
  initialExpiresAt?: string;
};

export default function DiscountCountdown({ initialExpiresAt }: DiscountCountdownProps) {
  const initialFromProp = useMemo(() => normaliseInitialExpiresAt(initialExpiresAt), [initialExpiresAt]);
  const [expiresAt, setExpiresAt] = useState<number | null>(initialFromProp ?? null);
  const [timeLeft, setTimeLeft] = useState(() => (initialFromProp ? getTimeParts(initialFromProp) : null));

  useEffect(() => {
    let stored: number | null = null;
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = normaliseInitialExpiresAt(raw);
        if (parsed) {
          stored = parsed;
        }
      }
    }

    let target: number | null = null;
    if (initialFromProp) {
      target = initialFromProp;
    }
    if (stored) {
      target = target ? Math.min(target, stored) : stored;
    }
    if (!target) {
      target = Date.now() + THIRTY_DAYS_MS;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, new Date(target).toISOString());
    }

    setExpiresAt(target);
    setTimeLeft(getTimeParts(target));
  }, [initialFromProp]);

  useEffect(() => {
    if (!expiresAt) return;
    if (expiresAt <= Date.now()) {
      setTimeLeft(getTimeParts(expiresAt));
      return;
    }
    const tick = () => setTimeLeft(getTimeParts(expiresAt));
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft || !expiresAt) {
    return null;
  }

  if (timeLeft.expired) {
    return <span className="text-sm text-red-600">Oferta expirada</span>;
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const pad = (value: number) => value.toString().padStart(2, "0");
  const timeLabel = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return (
    <span className="inline-flex items-center gap-2 text-sm text-neutral-700">
      <span className="font-medium">Tiempo restante:</span>
      <span
        className="rounded-md bg-neutral-900/80 px-2 py-1 text-white font-mono text-xs"
        suppressHydrationWarning
      >
        {timeLabel}
      </span>
    </span>
  );
}
