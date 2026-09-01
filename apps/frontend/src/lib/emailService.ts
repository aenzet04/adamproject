export interface EmailPayload {
  to: string;
  subject: string;
  token: string;
  name: string;
  type: 'CONFIRM_REGISTRATION' | 'RESET_PASSWORD';
}

export async function sendMailpitEmail(payload: EmailPayload): Promise<{ success: boolean; token: string }> {
  const isConfirm = payload.type === 'CONFIRM_REGISTRATION';
  const timestamp = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const enterpriseHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 36px 12px;
    }
    .main-card {
      max-width: 580px;
      margin: 0 auto;
      background: linear-gradient(180deg, #131b2e 0%, #0f172a 100%);
      border: 1px solid #1e293b;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header-bar {
      background: linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%);
      padding: 28px 32px;
      text-align: center;
    }
    .header-logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .header-tagline {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #ffe4e6;
      margin-top: 4px;
    }
    .content-body {
      padding: 36px 32px;
    }
    .badge-pill {
      display: inline-block;
      background: rgba(225, 29, 72, 0.15);
      border: 1px solid rgba(225, 29, 72, 0.35);
      color: #fb7185;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 5px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .greeting-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
    }
    .paragraph {
      font-size: 13px;
      line-height: 1.65;
      color: #94a3b8;
      margin: 0 0 20px 0;
    }
    .otp-container {
      background: #090d16;
      border: 2px dashed #e11d48;
      border-radius: 20px;
      padding: 24px 16px;
      text-align: center;
      margin: 28px 0;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace, 'Ubuntu Mono';
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(225, 29, 72, 0.6);
      margin-left: 12px;
    }
    .otp-hint {
      font-size: 11px;
      color: #f43f5e;
      font-weight: 600;
      margin-top: 8px;
    }
    .security-notice {
      background: rgba(30, 41, 59, 0.6);
      border-left: 3px solid #e11d48;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.5;
      margin: 24px 0 0 0;
    }
    .footer-section {
      background: #090d16;
      border-top: 1px solid #1e293b;
      padding: 24px 32px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer-company {
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .footer-links {
      margin-top: 8px;
    }
    .footer-links a {
      color: #f43f5e;
      text-decoration: none;
      font-weight: 600;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Top Brand Header -->
      <div class="header-bar">
        <h1 class="header-logo">👑 MODULA ENTERPRISE</h1>
        <div class="header-tagline">Multi-Tenant ERP-POS & Financial Core</div>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <div class="badge-pill">
          ${isConfirm ? '🛡️ Verifikasi Pendaftaran Tenant' : '🔐 Permintaan Reset Kredensial'}
        </div>

        <h2 class="greeting-title">Halo, ${payload.name}</h2>
        
        <p class="paragraph">
          ${
            isConfirm
              ? 'Terima kasih telah bergabung di <b>Modula Enterprise</b>. Untuk memastikan integritas akun dan mengaktifkan akses holding bisnis Anda, silakan masukkan kode verifikasi 6-digit berikut:'
              : 'Kami mendeteksi adanya permintaan untuk mereset kata sandi akun Modula Anda. Gunakan kode otentikasi di bawah ini untuk melanjutkan pembuatan kata sandi baru:'
          }
        </p>

        <!-- OTP Highlight Container -->
        <div class="otp-container">
          <div class="otp-label">Kode Token Otentikasi Resmi</div>
          <div class="otp-code">${payload.token}</div>
          <div class="otp-hint">⏱️ Berlaku selama 15 Menit</div>
        </div>

        <!-- Security Advisory Notice -->
        <div class="security-notice">
          <b>⚠️ Catatan Keamanan:</b> Jangan pernah membagikan kode token ini kepada siapa pun, termasuk staf dukungan Modula. Kode ini dibuat pada <b>${timestamp} WIB</b> untuk tujuan otentikasi aman.
        </div>
      </div>

      <!-- Legal & System Footer -->
      <div class="footer-section">
        <div class="footer-company">PT Multi Industri Nusantara • Modula Cloud Holding Core</div>
        <div>Sistem Pengiriman Otomatis Server-to-Server via <b>noreply@modula.id</b></div>
        <div class="footer-links">
          <a href="http://localhost:3000/faq">FAQ Bantuan</a> •
          <a href="http://localhost:3000/terms">Syarat & Ketentuan</a> •
          <a href="http://localhost:3000/about">Tentang Kami</a>
        </div>
        <div style="margin-top: 8px; font-size: 10px; color: #475569;">
          © 2026 Modula Enterprise. Designed & Engineered by <b>parikesitad-pm</b>.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // 1. Primary Dispatch: Call Ruby Backend API Proxy (Port 3001) to bypass browser CORS block on Mailpit
  try {
    const backendRes = await fetch('http://localhost:3001/api/v1/auth/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payload.to,
        name: payload.name,
        subject: payload.subject,
        html: enterpriseHtml,
        token: payload.token,
      }),
    });

    if (backendRes.ok) {
      console.log('[EmailService] Enterprise email dispatched via Ruby API to Mailpit:', payload.token);
      return { success: true, token: payload.token };
    }
  } catch (backendErr) {
    console.warn('[EmailService] Ruby backend proxy unavailable, executing fallback dispatch...');
  }

  // 2. Secondary Fallback: Direct Mailpit API call
  try {
    await fetch('http://localhost:8025/api/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        From: { Email: 'noreply@modula.id', Name: 'Modula Enterprise Security Core' },
        To: [{ Email: payload.to, Name: payload.name }],
        Subject: payload.subject,
        HTML: enterpriseHtml,
        Text: `${payload.subject}\n\nHalo ${payload.name},\nKode Token Verifikasi Resmi Anda adalah: ${payload.token}\n\nBerlaku selama 15 menit.\nModula Enterprise - PT Multi Industri Nusantara`,
      }),
    });
  } catch (err) {
    console.log('[EmailService] Local simulation token:', payload.token);
  }

  return { success: true, token: payload.token };
}
