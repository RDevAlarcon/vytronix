"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type UserInfo = { role?: string | null } | null;

type HeaderNavProps = {
  user: UserInfo;
};

const baseLinks = [
  { href: "/quienes-somos", label: "Qui\u00e9nes somos" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/marketing-digital", label: "Marketing digital" },
  { href: "/#contacto", label: "Contacto" },
];

export default function HeaderNav({ user }: HeaderNavProps) {
  const [open, setOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open]);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  const renderAuthLinks = (variant: "desktop" | "mobile") => {
    if (!user) {
      return (
        <Link
          href="/login"
          className={
            variant === "desktop"
              ? "px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50"
              : "block px-4 py-2 text-sm text-[var(--color-primary)]"
          }
          onClick={close}
        >
          Ingresar
        </Link>
      );
    }

    const adminLinks = user.role === "admin";

    return (
      <>
        {adminLinks ? (
          <>
            <Link
              href="/dashboard"
              className={
                variant === "desktop"
                  ? "px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50"
                  : "block px-4 py-2 text-sm"
              }
              onClick={close}
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className={
                variant === "desktop"
                  ? "px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50"
                  : "block px-4 py-2 text-sm"
              }
              onClick={close}
            >
              Admin
            </Link>
          </>
        ) : (
          <Link
            href="/perfil"
            className={
              variant === "desktop"
                ? "px-3 py-1 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50"
                : "block px-4 py-2 text-sm"
            }
            onClick={close}
          >
            Mi perfil
          </Link>
        )}
        <form action="/api/auth/logout" method="post" className={variant === "desktop" ? "" : "px-4 py-2"}>
          <button
            type="submit"
            className={
              variant === "desktop"
                ? "px-3 py-1 border rounded"
                : "w-full rounded border border-neutral-300 px-3 py-2 text-left text-sm"
            }
            onClick={close}
          >
            Cerrar sesión
          </button>
        </form>
      </>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-md border border-neutral-300 px-3 py-2 text-sm"
        ref={buttonRef}
        aria-expanded="false"
        aria-controls="mobile-menu"
        onClick={toggle}
      >
        <span className="sr-only">Abrir men\u00fa</span>
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <nav className="hidden md:flex gap-3 text-sm items-center">
        {baseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center justify-center px-3 py-2 rounded-full border-2 border-neutral-300 text-neutral-700 transition-transform duration-200 hover:scale-105 hover:border-neutral-400 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {link.label}
          </Link>
        ))}
        {renderAuthLinks("desktop")}
      </nav>

      <div
        id="mobile-menu"
        className={`absolute right-0 z-40 mt-3 w-48 rounded-xl border bg-white shadow-lg transition-all duration-200 md:hidden ${
          open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        }`}
      >
        <div className="flex flex-col py-2">
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none"
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          {renderAuthLinks("mobile")}
        </div>
      </div>
    </div>
  );
}
