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

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.MAIL_FROM || (user ? `Vytronix <${user}>` : "Vytronix <no-reply@vytronix.cl>");

  if (!host || !user || !pass) {
    console.warn("[MAIL] Contact notification skipped: SMTP credentials missing");
    console.log(`[DEV] Contact lead -> ${input.name} (${input.email})`);
    console.log(input.message);
    return { ok: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: port ?? (secure ? 465 : 587),
      secure,
      auth: { user, pass },
    });

    const recipients = to.split(",").map((recipient) => recipient.trim()).filter(Boolean);
    const subject = `Nueva solicitud de contacto de ${input.name}`;
    const text = `Nueva solicitud en el sitio Vytronix:\n\nNombre: ${input.name}\nEmail: ${input.email}\nTeléfono: ${input.phone}\n\nMensaje:\n${input.message}`;
    const html = contactHtml(input);

    await transporter.sendMail({ from, to: recipients, subject, text, html });
    if (process.env.NODE_ENV !== "production") {
      console.log(`[MAIL] Contact notification sent -> ${recipients.join(",")}`);
    }
    return { ok: true };
  } catch (error) {
    console.error("[MAIL] Contact notification failed:", error);
    return { ok: false, error };
  }
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
