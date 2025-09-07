type SendResult = { ok: true } | { ok: false; error: unknown };

export async function sendPasswordResetEmail(to: string, link: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "Vytronix <no-reply@vytronix.com>";

  if (!apiKey) {
    // Dev fallback: log the link instead of sending
    console.log(`[DEV] Email a ${to} — ${link}`);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Restablecer tu contraseña",
        html: emailHtml(link),
        text: `Usa este enlace para restablecer tu contraseña: ${link}`
      })
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Resend error ${res.status}: ${txt}`);
    }
    return { ok: true };
  } catch (error) {
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

