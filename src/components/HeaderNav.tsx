"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type UserInfo = { role?: string | null } | null;

type HeaderNavProps = {
  user: UserInfo;
};

const baseLinks = [
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

export default function HeaderNav({ user }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open]);

  const close = () => setOpen(false);

  const authLinks = (variant: "desktop" | "mobile") => {
    const isDesktop = variant === "desktop";
    const linkClass = isDesktop
      ? "inline-flex items-center rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
      : "rounded-2xl px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50";

    if (!user) return null;

    if (user.role === "admin") {
      return (
        <>
          <Link href="/dashboard" className={linkClass} onClick={close}>Dashboard</Link>
          <Link href="/admin" className={linkClass} onClick={close}>Admin</Link>
          {logoutForm(variant, close)}
        </>
      );
    }

    return (
      <>
        <Link href="/perfil" className={linkClass} onClick={close}>Mi perfil</Link>
        {logoutForm(variant, close)}
      </>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 bg-white/74 text-slate-900 shadow-sm backdrop-blur-xl md:hidden"
        ref={buttonRef}
        aria-expanded="false"
        aria-controls="mobile-menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="sr-only">Abrir menú</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/58 p-1.5 shadow-[0_12px_32px_rgba(9,26,52,0.08)] backdrop-blur-2xl md:flex">
        {baseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-950 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        {user ? <div className="ml-1 flex items-center gap-1 border-l border-slate-200/70 pl-2">{authLinks("desktop")}</div> : null}
      </nav>

      <div
        id="mobile-menu"
        className={`absolute right-0 z-40 mt-3 w-64 overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200 md:hidden ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col">
          {baseLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50" onClick={close}>
              {link.label}
            </Link>
          ))}
          {user ? <div className="mt-1 grid gap-1 border-t border-slate-100 pt-2">{authLinks("mobile")}</div> : null}
        </div>
      </div>
    </div>
  );
}

function logoutForm(variant: "desktop" | "mobile", close: () => void) {
  const buttonClass =
    variant === "desktop"
      ? "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-white"
      : "w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-black text-slate-700";

  return (
    <form action="/api/auth/logout" method="post" className={variant === "mobile" ? "px-3 py-2" : ""}>
      <button type="submit" className={buttonClass} onClick={close}>
        Cerrar sesión
      </button>
    </form>
  );
}
