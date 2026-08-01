"use client";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToExcel(data: Record<string, unknown>[], columns: { key: string; label: string }[], filename: string, sheetName = "Data") {
  const rows = data.map((row) => { const m: Record<string, unknown> = {}; columns.forEach((c) => { m[c.label] = row[c.key] ?? ""; }); return m; });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = columns.map((c) => ({ wch: Math.max(c.label.length + 2, 15) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToPDF(data: Record<string, unknown>[], columns: { key: string; label: string }[], filename: string, title: string, subtitle?: string) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text(title, 14, 15);
  if (subtitle) { doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(subtitle, 14, 22); }
  doc.setFontSize(8); doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, subtitle ? 28 : 22);
  const head = [columns.map((c) => c.label)];
  const body = data.map((row) => columns.map((c) => { const v = row[c.key]; if (v === null || v === undefined) return ""; if (typeof v === "boolean") return v ? "Yes" : "No"; return String(v); }));
  autoTable(doc, { head, body, startY: subtitle ? 32 : 26, styles: { fontSize: 7, cellPadding: 2 }, headStyles: { fillColor: [252, 113, 102], textColor: 255, fontStyle: "bold" }, alternateRowStyles: { fillColor: [250, 237, 233] }, margin: { left: 14, right: 14 } });
  doc.save(`${filename}.pdf`);
}

export function exportSummaryPDF(stats: { label: string; value: string }[], tableData: Record<string, unknown>[], tableColumns: { key: string; label: string }[], filename: string, title: string) {
  const doc = new jsPDF();
  doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text(title, 14, 20);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 27);
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("SUMMARY", 14, 38);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  let yPos = 45;
  stats.forEach((s) => { doc.text(`${s.label}:`, 14, yPos); doc.setFont("helvetica", "bold"); doc.text(s.value, 80, yPos); doc.setFont("helvetica", "normal"); yPos += 7; });
  yPos += 5; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("DETAIL PER KOTA", 14, yPos);
  autoTable(doc, { head: [tableColumns.map((c) => c.label)], body: tableData.map((r) => tableColumns.map((c) => String(r[c.key] ?? ""))), startY: yPos + 5, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [252, 113, 102], textColor: 255 }, alternateRowStyles: { fillColor: [250, 237, 233] }, margin: { left: 14, right: 14 } });
  doc.save(`${filename}.pdf`);
}
