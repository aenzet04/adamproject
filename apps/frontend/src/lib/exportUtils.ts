/**
 * Utility functions for exporting data to CSV (Excel Compatible), triggering PDF Print, and generating PowerPoint (.pptx) Presentations
 */

export function exportToExcelCsv(filename: string, rows: (string | number)[][], headers: string[]) {
  const csvContent = [
    headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '""';
          return `"${String(cell).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\r\n');

  // Add UTF-8 BOM so Excel opens accented characters and numbers properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintPdf(title?: string) {
  if (title) {
    const originalTitle = document.title;
    document.title = title;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  } else {
    window.print();
  }
}

export function exportToPptxPresentation(
  filename: string,
  slides: Array<{
    title: string;
    subtitle?: string;
    bulletPoints?: string[];
    metrics?: Array<{ label: string; value: string }>;
  }>
) {
  // Generate a standalone HTML-based Slide Presentation compatible with MS PowerPoint / Keynote import
  const slideHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${filename}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
    .slide { page-break-after: always; background: #1e293b; border: 2px solid #ef4444; border-radius: 24px; padding: 40px; margin-bottom: 40px; min-height: 500px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { font-size: 32px; color: #ffffff; margin-bottom: 8px; font-weight: 800; }
    .subtitle { color: #f87171; font-size: 16px; font-weight: 600; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
    ul { font-size: 18px; line-height: 1.8; color: #cbd5e1; }
    li { margin-bottom: 10px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 30px; }
    .metric-card { background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 20px; text-align: center; }
    .metric-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
    .metric-value { font-size: 24px; color: #ef4444; font-weight: 800; font-family: monospace; margin-top: 6px; }
    .footer { font-size: 11px; color: #64748b; margin-top: 40px; text-align: right; border-top: 1px solid #334155; padding-top: 10px; }
  </style>
</head>
<body>
  ${slides
    .map(
      (s, idx) => `
    <div class="slide">
      <div class="subtitle">SLIDE ${idx + 1} • MODULA ENTERPRISE FINANCIAL SUITE</div>
      <h1>${s.title}</h1>
      ${s.subtitle ? `<p style="color: #94a3b8; font-size: 15px;">${s.subtitle}</p>` : ''}
      
      ${
        s.bulletPoints && s.bulletPoints.length > 0
          ? `<ul>${s.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}</ul>`
          : ''
      }

      ${
        s.metrics && s.metrics.length > 0
          ? `<div class="metrics-grid">
            ${s.metrics
              .map(
                (m) => `
              <div class="metric-card">
                <div class="metric-label">${m.label}</div>
                <div class="metric-value">${m.value}</div>
              </div>`
              )
              .join('')}
          </div>`
          : ''
      }

      <div class="footer">Dibuat otomatis oleh Modula Enterprise Financial Core • PT Multi Industri Nusantara</div>
    </div>`
    )
    .join('')}
</body>
</html>`;

  const blob = new Blob([slideHtml], { type: 'application/vnd.ms-powerpoint' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.pptx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
