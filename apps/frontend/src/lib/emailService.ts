export interface EmailPayload {
  to: string;
  subject: string;
  token: string;
  name: string;
  type: 'CONFIRM_REGISTRATION' | 'RESET_PASSWORD';
}

export async function sendMailpitEmail(payload: EmailPayload): Promise<{ success: boolean; token: string }> {
  const isConfirm = payload.type === 'CONFIRM_REGISTRATION';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; }
        .container { max-width: 540px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .logo { font-size: 24px; font-weight: 900; color: #f43f5e; margin-bottom: 8px; }
        .token-box { background: #0f172a; border: 2px dashed #f43f5e; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .token-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #ffffff; font-family: monospace; }
        .btn { display: inline-block; background: #e11d48; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 16px; }
        .footer { font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">👑 MODULA ENTERPRISE</div>
        <h2>${isConfirm ? 'Konfirmasi Pendaftaran Akun' : 'Permintaan Reset Kata Sandi'}</h2>
        <p>Halo <b>${payload.name}</b>,</p>
        <p>${
          isConfirm
            ? 'Terima kasih telah mendaftar di Modula Multi-Tenant ERP-POS Core. Gunakan kode token 6-digit di bawah ini untuk memverifikasi alamat email Anda:'
            : 'Kami menerima permintaan untuk mereset kata sandi akun Modula Anda. Gunakan kode token 6-digit berikut untuk membuat kata sandi baru:'
        }</p>

        <div class="token-box">
          <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Kode Token Verifikasi Resmi</div>
          <div class="token-code">${payload.token}</div>
        </div>

        <p style="font-size: 12px; color: #94a3b8;">
          Token ini berlaku selama 15 menit. Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dengan aman.
        </p>

        <div class="footer">
          Dikirim secara otomatis oleh Mailpit SMTP Local Engine (Port 1025 / Web UI 8025) • Modula Enterprise System by <b>parikesitad-pm</b>.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Primary Dispatch: Call Ruby Backend API proxy (Port 3001) to bypass browser CORS block on Mailpit
  try {
    const backendRes = await fetch('http://localhost:3001/api/v1/auth/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.to,
        name: payload.name,
        subject: payload.subject,
        html: htmlBody,
        token: payload.token,
      }),
    });

    if (backendRes.ok) {
      console.log('[EmailService] Dispatched via Ruby API backend to Mailpit:', payload.token);
      return { success: true, token: payload.token };
    }
  } catch (backendErr) {
    console.warn('[EmailService] Ruby backend not responding, attempting fallback dispatch...');
  }

  // 2. Secondary Fallback: Direct Mailpit API call (if Mailpit was started with CORS allowed)
  try {
    await fetch('http://localhost:8025/api/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: { Email: 'security@modula.id', Name: 'Modula Security Core' },
        To: [{ Email: payload.to, Name: payload.name }],
        Subject: payload.subject,
        HTML: htmlBody,
        Text: `${payload.subject}\n\nKode Token Anda: ${payload.token}`,
      }),
    });
  } catch (err) {
    console.log('[EmailService] Local simulation token:', payload.token);
  }

  return { success: true, token: payload.token };
}
