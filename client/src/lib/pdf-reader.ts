/**
 * Shared PDF/DOCX text extraction utility.
 * Uses pdfjs-dist v5 with proper Vite worker URL resolution.
 */

let pdfjsInitialized = false;

async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsInitialized) {
    // Use Vite's ?url import to get the correct worker path at build time
    // This avoids CDN version mismatches and no-worker issues in pdfjs v5
    try {
      // @ts-ignore — Vite ?url suffix
      const workerUrl = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.href;
    } catch {
      // Fallback: use CDN with exact installed version
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }
    pdfjsInitialized = true;
  }
  return pdfjsLib;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await getPdfjs();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;

    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Group text items by Y position to preserve reading order
      const rows = new Map<number, { x: number; str: string }[]>();
      for (const item of content.items as any[]) {
        const str: string = item.str ?? "";
        if (!str.trim()) continue;
        const y = Math.round((item.transform?.[5] ?? 0) / 2) * 2;
        if (!rows.has(y)) rows.set(y, []);
        rows.get(y)!.push({ x: item.transform?.[4] ?? 0, str });
      }

      const pageText = Array.from(rows.entries())
        .sort((a, b) => b[0] - a[0]) // top to bottom
        .map(([, items]) =>
          items
            .sort((a, b) => a.x - b.x) // left to right
            .map(i => i.str)
            .join(" ")
        )
        .join("\n");

      pageTexts.push(pageText);
    }

    return pageTexts.join("\n").trim();
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return "";
  }
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value?.trim() ?? "";
  } catch (err) {
    console.error("DOCX extraction failed:", err);
    return "";
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return extractTextFromPDF(file);
  if (ext === "docx" || ext === "doc") return extractTextFromDOCX(file);
  try {
    return (await file.text()).trim();
  } catch {
    return "";
  }
}
