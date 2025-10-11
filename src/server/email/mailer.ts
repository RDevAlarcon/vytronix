import nodemailer from "nodemailer";

type SendResult = { ok: true } | { ok: false; error: unknown };

export async function sendPasswordResetEmail(to: string, link: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  // Fallback seguro para pruebas si no se define MAIL_FROM
  const from = process.env.MAIL_FROM || "Vytronix <onboarding@resend.dev>";

  if (!apiKey) {
    // Dev fallback: log the link instead of sending
    console.log(`[DEV] Email a ${to} — ${link}`);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Restablecer tu contraseña",
        html: emailHtml(link),
        text: `Usa este enlace para restablecer tu contraseña: ${link}`,
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Resend error ${res.status}: ${txt}`);
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MAIL] Resend OK -> to=${to}, from=${from}`);
      console.log(`[MAIL] Reset link -> ${link}`);
    }
    return { ok: true };
  } catch (error) {
    console.error('[MAIL] Resend send failed:', error);
    return { ok: false, error };
  }
}

function emailHtml(link: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Restablecer contraseña</h2>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
    <p><a href="${link}">${link}</a></p>
    <p style="color:#555;font-size:12px">El enlace expira en 1 hora. Si no fuiste tú, ignora este mensaje.</p>
  </div>`;
}

export async function sendContactNotificationEmail(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<SendResult> {
  const to = process.env.CONTACT_NOTIFICATION_TO || process.env.ADMIN_EMAIL;
  if (!to) {
    console.warn("[MAIL] Contact notification skipped: CONTACT_NOTIFICATION_TO/ADMIN_EMAIL not set");
    return { ok: true };
  }

  const subject = `Nueva solicitud de contacto de ${input.name}`;
  const text = `Nueva solicitud en el sitio Vytronix:\n\nNombre: ${input.name}\nEmail: ${input.email}\nTeléfono: ${input.phone}\n\nMensaje:\n${input.message}`;
  const html = contactHtml(input);

  return sendSmtpEmail({
    to,
    subject,
    text,
    html,
    context: "Contact notification",
    fallbackLog: () => {
      console.log(`[DEV] Contact lead -> ${input.name} (${input.email})`);
      console.log(input.message);
    },
  });
}

function contactHtml({ name, email, phone, message }: { name: string; email: string; phone: string; message: string }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Nueva solicitud de contacto</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="border-left:4px solid #ddd;padding-left:12px;color:#444">${message.replace(/\n/g, '<br/>')}</blockquote>
  </div>`;
}

export async function sendPaymentNotificationEmail(input: {
  userEmail: string;
  amount: number;
  currency: string;
  paymentId: string;
  status: string;
}): Promise<SendResult> {
  const to = process.env.PAYMENT_NOTIFICATION_TO || process.env.ADMIN_EMAIL;
  if (!to) {
    console.warn("[MAIL] Payment notification skipped: PAYMENT_NOTIFICATION_TO/ADMIN_EMAIL not set");
    return { ok: true };
  }

  const subject = `Pago aprobado (${input.paymentId})`;
  const text = `Se registró un pago aprobado en Vytronix:\n\nID Pago: ${input.paymentId}\nEstado: ${input.status}\nMonto: ${input.amount} ${input.currency}\nEmail usuario: ${input.userEmail}`;
  const html = paymentHtml(input);

  return sendSmtpEmail({
    to,
    subject,
    text,
    html,
    context: "Payment notification",
  });
}

function paymentHtml({ userEmail, amount, currency, paymentId, status }: { userEmail: string; amount: number; currency: string; paymentId: string; status: string }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
    <h2>Pago aprobado</h2>
    <p><strong>ID pago:</strong> ${paymentId}</p>
    <p><strong>Estado:</strong> ${status}</p>
    <p><strong>Monto:</strong> ${amount} ${currency}</p>
    <p><strong>Email usuario:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
  </div>`;
}

async function sendSmtpEmail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
  context: string;
  fallbackLog?: () => void;
}): Promise<SendResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.MAIL_FROM || (user ? `Vytronix <${user}>` : "Vytronix <no-reply@vytronix.cl>");

  if (!host || !user || !pass) {
    console.warn(`[MAIL] ${params.context} skipped: SMTP credentials missing`);
    if (params.fallbackLog) params.fallbackLog();
    return { ok: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: port ?? (secure ? 465 : 587),
      secure,
      auth: { user, pass },
    });

    const recipients = params.to.split(",").map((recipient) => recipient.trim()).filter(Boolean);
    await transporter.sendMail({ from, to: recipients, subject: params.subject, text: params.text, html: params.html });
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MAIL] ${params.context} sent -> ${recipients.join(",")}`);
    }
    return { ok: true };
  } catch (error) {
    console.error(`[MAIL] ${params.context} failed:`, error);
    return { ok: false, error };
  }
}
