import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | Vytronix",
  description: "Conoce cómo Vytronix trata tus datos personales, finalidades, bases legales, retención y derechos en Chile.",
  alternates: { canonical: "/privacidad" },
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid gap-10">
      <header className="grid gap-3">
        <p className="text-sm text-neutral-500">Última actualización: 4 de octubre de 2025</p>
        <h1 className="text-3xl font-extrabold">Política de Privacidad</h1>
        <p className="text-neutral-700">
          Este documento describe cómo VYTRONIX SpA (&ldquo;Vytronix&rdquo;, &ldquo;nosotros&rdquo;) recolecta, usa y protege los datos personales de clientes, usuarios y visitantes en Chile.
        </p>
      </header>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">1. Responsable</h2>
        <p className="text-neutral-700">
          VYTRONIX SpA, RUT 78.254.391-1. Domicilio: Lo Errázuriz 1701, Cerrillos, Región Metropolitana, Chile. Correo de contacto: <a href="mailto:vytronixspa@gmail.com" className="underline">vytronixspa@gmail.com</a>.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">2. Bases legales</h2>
        <ul className="grid gap-2 text-neutral-700 list-disc pl-6">
          <li>Ejecución de contrato o adopción de medidas precontractuales.</li>
          <li>Cumplimiento de obligaciones legales y tributarias.</li>
          <li>
            Interés legítimo en seguridad, prevención de fraude y mejora del servicio, evaluado con pruebas de balance para proteger los derechos de los titulares.
          </li>
          <li>Consentimiento para marketing y cookies no esenciales.</li>
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">3. Retención</h2>
        <p className="text-neutral-700">
          Conservamos los datos mientras exista relación contractual y durante dos años tras la baja del servicio, o el mayor plazo que exija la ley para defensa de derechos y obligaciones contables. Luego aplicamos eliminación segura o anonimización.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">4. Derechos de los titulares</h2>
        <p className="text-neutral-700">
          Puedes ejercer acceso, rectificación, cancelación/eliminación, oposición y revocación del consentimiento escribiendo a <a href="mailto:vytronixspa@gmail.com" className="underline">vytronixspa@gmail.com</a>. Respondemos en un máximo de 15 días hábiles y podremos solicitar verificación de identidad.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">5. Encargados de tratamiento</h2>
        <p className="text-neutral-700">
          Utilizamos proveedores para hosting, analítica y pagos bajo contrato y con medidas equivalentes de protección. Proveedores principales: Railway (infraestructura/hosting), Mercado Pago (pagos) y herramientas de analítica cuando corresponda.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">6. Transferencias internacionales</h2>
        <p className="text-neutral-700">
          Railway y otros subencargados pueden operar fuera de Chile. Sustentamos estas transferencias en la ejecución de contrato y en medidas contractuales y técnicas adecuadas (TLS en tránsito, cifrado en reposo cuando aplica, controles de acceso y registros de actividad).
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">7. Seguridad</h2>
        <p className="text-neutral-700">
          Implementamos contraseñas con bcrypt, tokens JWT firmados y con expiración, control de acceso por roles, backups cifrados, monitoreo, registros y autenticación multifactor en paneles internos cuando corresponda, además de gestión de vulnerabilidades.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">8. Notificación de brechas</h2>
        <p className="text-neutral-700">
          Ante incidentes evaluamos el impacto en un máximo de 72 horas desde la detección. Si existe alto riesgo, notificaremos la naturaleza del incidente, datos comprometidos y medidas recomendadas.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">9. Cookies</h2>
        <p className="text-neutral-700">
          Utilizamos cookies estrictamente necesarias y, con consentimiento, cookies analíticas y de terceros. Podrás configurar tus preferencias en el banner correspondiente.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left p-2 border">Cookie</th>
                <th className="text-left p-2 border">Finalidad</th>
                <th className="text-left p-2 border">Duración</th>
                <th className="text-left p-2 border">Proveedor</th>
                <th className="text-left p-2 border">Propia / tercero</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">session</td>
                <td className="p-2 border">Autenticación</td>
                <td className="p-2 border">Sesión</td>
                <td className="p-2 border">Vytronix</td>
                <td className="p-2 border">Propia</td>
              </tr>
              <tr>
                <td className="p-2 border">mp_session</td>
                <td className="p-2 border">Pago</td>
                <td className="p-2 border">30 días</td>
                <td className="p-2 border">Mercado Pago</td>
                <td className="p-2 border">Tercero</td>
              </tr>
              <tr>
                <td className="p-2 border">_ga</td>
                <td className="p-2 border">Analítica</td>
                <td className="p-2 border">24 meses</td>
                <td className="p-2 border">Google</td>
                <td className="p-2 border">Tercero</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-neutral-700">No instalaremos cookies no esenciales sin tu consentimiento.</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">10. Marketing</h2>
        <p className="text-neutral-700">Enviamos comunicaciones comerciales solo con tu consentimiento y podrás desuscribirte en cada mensaje.</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">11. Cambios</h2>
        <p className="text-neutral-700">
          Anunciaremos cambios con al menos 15 días de antelación mediante banner y/o correo. Si las modificaciones afectan finalidades o derechos, solicitaremos una nueva aceptación.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">12. Contacto</h2>
        <p className="text-neutral-700">
          Para temas de privacidad y ejercicio de derechos escríbenos a <a href="mailto:vytronixspa@gmail.com" className="underline">vytronixspa@gmail.com</a>.
        </p>
      </section>

      <footer className="text-sm text-neutral-600">
        ¿Buscas los términos de servicio? <Link href="/terminos" className="underline">Revísalos aquí</Link>.
      </footer>
    </div>
  );
}
