"use client";

import Image from "next/image";
import { useRef } from "react";

const services = [
  {
    title: "Apps móviles",
    src: "/apps.png",
    alt: "Apps móviles",
    desc: "Aplicaciones nativas o multiplataforma con arquitectura escalable, QA y despliegue listo para crecer.",
    meta: "Mobile · UX · APIs",
    output: "iOS / Android",
  },
  {
    title: "Sitios web",
    src: "/sitiosweb.jpg",
    alt: "Sitios web",
    desc: "Landing pages, sitios corporativos y e-commerce rápidos, accesibles y pensados para convertir.",
    meta: "SEO · Performance · CMS",
    output: "Core Web Vitals",
  },
  {
    title: "Integraciones & APIs",
    src: "/integracionesapi.jpg",
    alt: "Integraciones y APIs",
    desc: "Conectamos pagos, CRM, automatizaciones y plataformas externas con seguridad y trazabilidad.",
    meta: "Pagos · CRM · Automatización",
    output: "Operación conectada",
  },
  {
    title: "VyAudit",
    src: "/plan_medio.jpg",
    alt: "VyAudit",
    desc: "Informe técnico-comercial para detectar brechas de performance, SEO, UX, accesibilidad y seguridad.",
    meta: "Auditoría · Score · PDF",
    output: "Informe accionable",
  },
  {
    title: "Chatbots inteligentes",
    alt: "Chatbots inteligentes",
    desc: "Chatbots para atención, captación de leads y automatización de respuestas conectados a WhatsApp, CRM o sistemas internos.",
    meta: "IA · WhatsApp · CRM",
    output: "Atención automatizada",
    customVisual: "chatbot",
  },
];

export default function ServicesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-service-card]");
    const step = card ? card.offsetWidth + 20 : 320;
    scroller.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#f5f8fc] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#f5f8fc] to-transparent" />
        <button
          type="button"
          aria-label="Servicio anterior"
          onClick={() => scroll("prev")}
          className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/70 bg-white/70 text-slate-900 shadow-[0_18px_42px_rgba(9,26,52,0.16)] backdrop-blur-xl transition hover:-translate-y-[54%] hover:border-cyan-200 hover:bg-white md:grid"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/70 to-cyan-100/60" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Servicio siguiente"
          onClick={() => scroll("next")}
          className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/70 bg-white/70 text-slate-900 shadow-[0_18px_42px_rgba(9,26,52,0.16)] backdrop-blur-xl transition hover:-translate-y-[54%] hover:border-cyan-200 hover:bg-white md:grid"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/70 to-cyan-100/60" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((card, index) => (
            <article
              key={card.title}
              data-service-card
              className="surface-card section-dashboard group flex min-h-[24rem] w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(9,26,52,0.14)] sm:w-[48%] lg:w-[31.6%] xl:w-[23.8%]"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {card.customVisual === "chatbot" ? (
                  <ChatbotVisual />
                ) : (
                  <Image
                    src={card.src ?? ""}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 82vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/10 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/86 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                  {card.meta}
                </div>
                <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-2xl border border-white/18 bg-white/14 text-sm font-black text-white shadow-xl backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 inline-flex w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.1em] text-blue-700">
                  {card.output}
                </div>
                <h3 className="text-xl font-black text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatbotVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.42),transparent_12rem),linear-gradient(135deg,#07111f,#0a2b54)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-5 top-8 w-36 rounded-2xl border border-white/14 bg-white/12 p-3 text-white shadow-2xl backdrop-blur">
        <div className="h-2 w-20 rounded-full bg-cyan-200" />
        <div className="mt-3 h-2 w-28 rounded-full bg-white/42" />
        <div className="mt-2 h-2 w-16 rounded-full bg-white/30" />
      </div>
      <div className="absolute bottom-8 right-5 w-32 rounded-2xl border border-cyan-200/22 bg-cyan-300/18 p-3 text-white shadow-2xl backdrop-blur">
        <div className="h-2 w-16 rounded-full bg-white" />
        <div className="mt-3 h-2 w-24 rounded-full bg-white/44" />
      </div>
      <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl bg-cyan-300 text-lg font-black text-slate-950 shadow-[0_0_48px_rgba(34,211,238,0.42)]">
        AI
      </div>
    </div>
  );
}
