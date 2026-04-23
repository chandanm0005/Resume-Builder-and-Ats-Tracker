import { jsPDF } from "jspdf";
import type { ResumeData } from "./index";

function buls(text: string) {
  return text.split("\n").map(l => l.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
}
function skills(text: string) {
  return text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
}

// Colors per template
const THEME: Record<string, { accent: [number,number,number]; heading: [number,number,number]; sub: [number,number,number] }> = {
  modern:    { accent: [109, 40, 217], heading: [109, 40, 217], sub: [85, 85, 85] },
  classic:   { accent: [30,  30,  30], heading: [30,  30,  30], sub: [80, 80, 80] },
  minimal:   { accent: [150,150,150], heading: [30,  30,  30], sub: [120,120,120] },
  executive: { accent: [30,  41,  59], heading: [30,  41,  59], sub: [71, 85,105] },
  compact:   { accent: [15,  23,  42], heading: [15,  23,  42], sub: [71, 85,105] },
  academic:  { accent: [17,  17,  17], heading: [17,  17,  17], sub: [60, 60, 60] },
};

export async function downloadResumePDF(data: ResumeData): Promise<void> {
  const { personalInfo: p, experiences, projects, education, template } = data;
  const theme = THEME[template] ?? THEME.modern;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const marginL = 14;
  const marginR = 14;
  const contentW = W - marginL - marginR;
  let y = 14;

  // ── helpers ──────────────────────────────────────────────────────────────────
  const checkPage = (needed = 6) => {
    if (y + needed > 280) { doc.addPage(); y = 14; }
  };

  const setColor = (rgb: [number,number,number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  const text = (str: string, x: number, size: number, style: "normal"|"bold"|"italic" = "normal", color: [number,number,number] = [26,26,26]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    setColor(color);
    doc.text(str, x, y);
  };

  const wrappedText = (str: string, x: number, maxW: number, size: number, style: "normal"|"bold"|"italic" = "normal", color: [number,number,number] = [51,51,51]) => {
    const font = template === "academic" ? "times" : "helvetica";
    doc.setFontSize(size);
    doc.setFont(font, style);
    setColor(color);
    const lines = doc.splitTextToSize(str, maxW) as string[];
    for (const line of lines) {
      checkPage(5);
      doc.text(line, x, y);
      y += size * 0.45;
    }
    y += 1;
  };

  const sectionTitle = (title: string) => {
    checkPage(8);
    y += 3;
    const font = template === "academic" ? "times" : "helvetica";
    doc.setFontSize(template === "academic" ? 11 : 8);
    doc.setFont(font, "bold");
    setColor(theme.heading);
    // Academic: small-caps style — uppercase the title
    const display = template === "academic" ? title.toUpperCase() : title.toUpperCase();
    doc.text(display, marginL, y);
    doc.setDrawColor(theme.heading[0], theme.heading[1], theme.heading[2]);
    doc.setLineWidth(template === "academic" ? 0.4 : 0.3);
    doc.line(marginL, y + 0.8, W - marginR, y + 0.8);
    y += 5;
  };

  const bullet = (str: string) => {
    checkPage(5);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    setColor([51, 51, 51]);
    const lines = doc.splitTextToSize(str, contentW - 5) as string[];
    doc.text("•", marginL + 1, y);
    doc.text(lines[0], marginL + 5, y);
    y += 4;
    for (let i = 1; i < lines.length; i++) {
      checkPage(4);
      doc.text(lines[i], marginL + 5, y);
      y += 4;
    }
  };

  // ── HEADER ───────────────────────────────────────────────────────────────────
  if (template === "academic") {
    // Centered name, contact row below
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    setColor([17, 17, 17]);
    const nameW = doc.getTextWidth(p.name || "Your Name");
    doc.text(p.name || "Your Name", (W - nameW) / 2, y);
    y += 7;
    if (p.headline) {
      doc.setFontSize(9);
      doc.setFont("times", "italic");
      setColor([60, 60, 60]);
      const hw = doc.getTextWidth(p.headline);
      doc.text(p.headline, (W - hw) / 2, y);
      y += 5;
    }
    const contacts = [p.phone, p.email, p.linkedin, p.github, p.location].filter(Boolean);
    if (contacts.length) {
      doc.setFontSize(8.5);
      doc.setFont("times", "normal");
      setColor([51, 51, 51]);
      const contactStr = contacts.join("  |  ");
      const cw = doc.getTextWidth(contactStr);
      doc.text(contactStr, (W - cw) / 2, y);
      y += 6;
    }
  } else if (template === "executive") {
    // Dark header bar
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, W, 32, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(p.name || "Your Name", marginL, 13);
    if (p.headline) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(p.headline, marginL, 19);
    }
    const contacts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(contacts.join("   "), marginL, 27);
    y = 38;
  } else if (template === "compact") {
    // Two-column header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    setColor(theme.heading);
    doc.text(p.name || "Your Name", marginL, y);
    if (p.headline) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      setColor([100, 116, 139]);
      doc.text(p.headline, marginL, y + 5);
    }
    const contacts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
    doc.setFontSize(7.5);
    setColor([71, 85, 105]);
    let cx = W - marginR;
    for (const c of contacts.reverse()) {
      const cw = doc.getTextWidth(c);
      doc.text(c, cx - cw, y);
      y += 4;
    }
    y = 22;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(marginL, y, W - marginR, y);
    y += 5;
  } else {
    // Standard header
    doc.setFontSize(template === "minimal" ? 22 : 20);
    doc.setFont("helvetica", template === "minimal" ? "normal" : "bold");
    setColor(theme.heading);
    doc.text(p.name || "Your Name", marginL, y);
    y += 6;
    if (p.headline) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      setColor(theme.sub);
      doc.text(p.headline, marginL, y);
      y += 5;
    }
    const contacts = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
    if (contacts.length) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      setColor([68, 68, 68]);
      doc.text(contacts.join("   "), marginL, y);
      y += 4;
    }
    // Divider
    doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
    doc.setLineWidth(template === "modern" ? 0.5 : 0.2);
    doc.line(marginL, y, W - marginR, y);
    y += 5;
  }

  // ── SUMMARY ──────────────────────────────────────────────────────────────────
  if (p.summary?.trim()) {
    sectionTitle(template === "classic" ? "Objective" : template === "executive" ? "Executive Summary" : "Summary");
    wrappedText(p.summary, marginL, contentW, 8.5);
  }

  // ── SKILLS ───────────────────────────────────────────────────────────────────
  if (p.skills?.trim()) {
    sectionTitle(template === "executive" ? "Core Competencies" : "Skills");
    const sl = skills(p.skills);
    if (template === "minimal" || template === "compact") {
      wrappedText(sl.join("  ·  "), marginL, contentW, 8.5);
    } else {
      // Skill tags in rows
      let sx = marginL;
      const tagH = 5;
      const tagPad = 3;
      for (const s of sl) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const tw = doc.getTextWidth(s) + tagPad * 2;
        if (sx + tw > W - marginR) { sx = marginL; y += tagH + 2; checkPage(tagH + 2); }
        doc.setFillColor(237, 233, 254);
        doc.setDrawColor(237, 233, 254);
        doc.roundedRect(sx, y - 3.5, tw, tagH, 1, 1, "F");
        doc.setTextColor(91, 33, 182);
        doc.text(s, sx + tagPad, y);
        sx += tw + 2;
      }
      y += 7;
    }
  }

  // ── EXPERIENCE ───────────────────────────────────────────────────────────────
  const validExp = experiences.filter(e => e.title || e.company);
  if (validExp.length) {
    sectionTitle(template === "executive" ? "Professional Experience" : template === "classic" ? "Work Experience" : "Experience");
    for (const exp of validExp) {
      checkPage(10);
      // Title + date on same line
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setColor([26, 26, 26]);
      doc.text(exp.title || "", marginL, y);
      if (exp.duration) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        setColor([102, 102, 102]);
        const dw = doc.getTextWidth(exp.duration);
        doc.text(exp.duration, W - marginR - dw, y);
      }
      y += 4;
      if (exp.company) {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "italic");
        setColor(theme.sub);
        doc.text(exp.company, marginL, y);
        y += 4;
      }
      for (const b of buls(exp.description)) bullet(b);
      y += 2;
    }
  }

  // ── PROJECTS ─────────────────────────────────────────────────────────────────
  const validProj = projects.filter(p => p.title);
  if (validProj.length) {
    sectionTitle(template === "executive" ? "Key Projects" : "Projects");
    for (const proj of validProj) {
      checkPage(10);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setColor([26, 26, 26]);
      doc.text(proj.title, marginL, y);
      if (proj.technologies) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        setColor(theme.accent);
        const tw = doc.getTextWidth(proj.technologies);
        doc.text(proj.technologies, W - marginR - tw, y);
      }
      y += 4;
      for (const b of buls(proj.description)) bullet(b);
      y += 2;
    }
  }

  // ── EDUCATION ────────────────────────────────────────────────────────────────
  const validEdu = education.filter(e => e.school);
  if (validEdu.length) {
    sectionTitle("Education");
    for (const edu of validEdu) {
      checkPage(8);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setColor([26, 26, 26]);
      doc.text(edu.school, marginL, y);
      if (edu.year) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        setColor([102, 102, 102]);
        const yw = doc.getTextWidth(edu.year);
        doc.text(edu.year, W - marginR - yw, y);
      }
      y += 4;
      const degLine = [edu.degree, edu.score].filter(Boolean).join("  |  ");
      if (degLine) {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        setColor(theme.sub);
        doc.text(degLine, marginL, y);
        y += 4;
      }
      y += 1;
    }
  }

  // ── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
  if (p.achievements?.trim()) {
    sectionTitle("Achievements");
    for (const b of buls(p.achievements)) bullet(b);
  }

  // ── CERTIFICATIONS ───────────────────────────────────────────────────────────
  if (p.certifications?.trim()) {
    sectionTitle("Certifications");
    for (const b of buls(p.certifications)) bullet(b);
  }

  doc.save(`${p.name || "resume"}.pdf`);
}
