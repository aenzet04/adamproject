/**
 * Utility functions for exporting data to CSV (Excel Compatible) and triggering PDF Print
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
