import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Soluciones web y móviles a tu medida
          </h1>
          <p className="mt-4 text-neutral-600">
            Desarrollamos productos rápidos, seguros y escalables para tu negocio.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/register" className="px-4 py-2 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">Crear cuenta</a>
            <a href="#servicios" className="px-4 py-2 rounded border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-neutral-50">Ver servicios</a>
          </div>
        </div>
        <div className="h-64 md:h-80 bg-gradient-to-br from-neutral-200 to-neutral-100 rounded-xl border" />
      </section>

      <section id="servicios" className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-6">
        {["Apps móviles", "Sitios web", "Integraciones & APIs"].map((t) => (
          <div key={t} className="p-6 rounded-2xl border bg-white shadow-sm">
            <h3 className="font-semibold mb-2">{t}</h3>
            <p className="text-sm text-neutral-600">Entrega ágil, calidad de código y soporte.</p>
          </div>
        ))}
      </section>

      <section id="contacto" className="max-w-3xl mx-auto px-4 py-14">
        {/* Formulario de solicitudes de clientes */}
        <ContactForm />
      </section>
    </>
  );
}
