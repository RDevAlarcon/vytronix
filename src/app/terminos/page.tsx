import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Vytronix",
  description: "Conoce las reglas de uso, limitaciones de responsabilidad, pagos y garantías al contratar servicios con Vytronix.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosCondicionesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid gap-10">
      <header className="grid gap-3">
        <p className="text-sm text-neutral-500">Última actualización: 4 de octubre de 2025</p>
        <h1 className="text-3xl font-extrabold">Términos y Condiciones</h1>
        <p className="text-neutral-700">
          Estos términos regulan el uso del sitio y los servicios prestados por VYTRONIX SpA (&ldquo;Vytronix&rdquo;, &ldquo;nosotros&rdquo;). Si utilizas nuestra plataforma o contratas nuestros servicios, aceptas estas condiciones y la Política de Privacidad.
        </p>
      </header>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">1. Aceptación</h2>
        <p className="text-neutral-700">
          El uso del sitio o contratación de servicios implica la aceptación de estos Términos y la Política de Privacidad. Los servicios están dirigidos a mayores de 18 años con capacidad legal para contratar.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">2. Cuenta y uso</h2>
        <p className="text-neutral-700">
          Debes entregar información veraz, mantenerla actualizada y custodiar tus credenciales. Está prohibido el uso ilícito, la ingeniería inversa y el scraping no autorizado. Podemos suspender o cerrar cuentas por incumplimiento.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">3. Servicios</h2>
        <p className="text-neutral-700">
          Ofrecemos consultoría, desarrollo de software, soluciones web y móviles, soporte y otros servicios descritos en nuestras propuestas. Las propuestas o contratos específicos prevalecen sobre estos Términos.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">4. Propiedad intelectual y entregables</h2>
        <p className="text-neutral-700">
          Salvo pacto en contrario, Vytronix conserva su know-how, librerías y herramientas preexistentes. El cliente recibe una licencia perpetua, no exclusiva y transferible para usar el entregable final en su giro. Si se acuerda la cesión total de derechos sobre obras por encargo, se hará por escrito y contra pago íntegro. Software de terceros u open source se rige por sus propias licencias.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">5. Pagos y reembolsos</h2>
        <p className="text-neutral-700">
          Las condiciones económicas, hitos y medios de pago se detallan en cada propuesta. Los impuestos y comisiones no están incluidos salvo indicación expresa. Mercado Pago procesa las transacciones y nosotros no almacenamos datos de tarjeta.
        </p>
        <p className="text-neutral-700">
          <span className="font-medium">Derecho de retracto y reembolsos:</span> si dentro de 10 días corridos desde la fecha de pago el cliente decide no continuar con el servicio, Vytronix reembolsará el 80% de lo pagado en un máximo de 30 días corridos. No aplica a trabajos ya ejecutados y entregables realizados durante ese período, costos de terceros no reembolsables (licencias, dominios, infraestructura) ni a comisiones de la pasarela de pago cuando el proveedor no las reembolse. El reembolso se realizará por el mismo medio de pago u otro acordado por escrito.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">6. Soporte y mantenimiento</h2>
        <p className="text-neutral-700">
          Horario de atención: lunes a jueves 09:00–18:00, viernes 09:00–14:00 (hora Chile). Sábados, domingos y festivos no hay soporte regular. Los SLA y prioridades dependen del plan contratado. Avisaremos mantenimientos programados con al menos 24 horas de antelación.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">7. Garantía</h2>
        <p className="text-neutral-700">
          Corregimos errores atribuibles al desarrollo por 45 días desde la puesta en producción. No incluye cambios de alcance, fallas de terceros, datos incorrectos del cliente ni usos fuera de las especificaciones acordadas.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">8. Limitación de responsabilidad</h2>
        <p className="text-neutral-700">
          La responsabilidad total agregada de Vytronix frente al cliente se limita al monto efectivamente pagado en los 12 meses previos al hecho que originó la reclamación. Solo se indemnizarán daños directos y comprobados hasta dicho tope. No respondemos por lucro cesante, pérdida de datos, pérdida de chance, daño moral ni otros daños indirectos o consecuenciales. Esta limitación no aplica en caso de dolo o culpa grave ni afecta derechos irrenunciables del consumidor.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">9. Confidencialidad</h2>
        <p className="text-neutral-700">
          Ambas partes se comprometen a resguardar la información confidencial durante dos años, salvo obligación legal de divulgación.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">10. Datos personales</h2>
        <p className="text-neutral-700">
          El tratamiento de datos se rige por nuestra <Link href="/privacidad" className="underline">Política de Privacidad</Link> y por los acuerdos de encargado que correspondan.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">11. Terminación</h2>
        <p className="text-neutral-700">
          Cualquiera de las partes puede terminar el contrato por incumplimiento grave no subsanado en 10 días desde la notificación. El cliente puede terminar por conveniencia con 15 días de aviso, pagando el trabajo ejecutado y los gastos incurridos.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">12. Ley aplicable y jurisdicción</h2>
        <p className="text-neutral-700">
          Este acuerdo se rige por la ley chilena. Las controversias se resolverán ante los tribunales de Santiago o mediante arbitraje CAM Santiago, según lo señalado en la propuesta respectiva, sin perjuicio de los derechos irrenunciables del consumidor.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">13. Notificaciones</h2>
        <p className="text-neutral-700">
          Utilizaremos el correo registrado del usuario para notificaciones y podremos informar cambios generales mediante avisos en el sitio.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">14. Vigencia</h2>
        <p className="text-neutral-700">Estos términos aplican desde la fecha indicada y reemplazan versiones previas.</p>
      </section>

      <footer className="text-sm text-neutral-600">
        ¿Buscas la política de privacidad? <Link href="/privacidad" className="underline">Encuéntrala aquí</Link>.
      </footer>
    </div>
  );
}
